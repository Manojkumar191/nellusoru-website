"""
Invoices API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import datetime
import io

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models import Invoice, InvoiceItem, Customer, User
from app.schemas import InvoiceCreate, InvoiceUpdate, InvoiceResponse
from app.services.pdf_generator import generate_invoice_pdf

router = APIRouter()

def generate_invoice_number(db: Session) -> str:
    """Generate unique invoice number"""
    current_year = datetime.now().year
    current_month = datetime.now().month
    
    # Get count of invoices this month
    count = db.query(Invoice).filter(
        Invoice.invoice_number.like(f"NMS-{current_year}{current_month:02d}%")
    ).count()
    
    return f"NMS-{current_year}{current_month:02d}-{count + 1:04d}"

@router.get("/", response_model=List[InvoiceResponse])
async def get_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    customer_id: Optional[UUID] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all invoices (admin only)"""
    query = db.query(Invoice)
    
    if customer_id:
        query = query.filter(Invoice.customer_id == customer_id)
    
    if status_filter:
        query = query.filter(Invoice.status == status_filter)
    
    invoices = query.order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for invoice in invoices:
        invoice_dict = InvoiceResponse.model_validate(invoice).model_dump()
        if invoice.customer:
            invoice_dict['customer_name'] = invoice.customer.contact_person
        result.append(invoice_dict)
    
    return result

@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get invoice by ID (admin only)"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice_dict = InvoiceResponse.model_validate(invoice).model_dump()
    if invoice.customer:
        invoice_dict['customer_name'] = invoice.customer.contact_person
    
    return invoice_dict

@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new invoice (admin only)"""
    # Generate invoice number
    invoice_number = generate_invoice_number(db)
    
    # Create invoice
    invoice_dict = invoice_data.model_dump(exclude={'items'})
    invoice = Invoice(
        **invoice_dict,
        invoice_number=invoice_number,
        created_by=current_user.id
    )
    
    db.add(invoice)
    db.flush()  # Get the invoice ID
    
    # Add invoice items
    for item_data in invoice_data.items:
        item = InvoiceItem(
            **item_data.model_dump(),
            invoice_id=invoice.id
        )
        db.add(item)
    
    db.commit()
    db.refresh(invoice)
    
    invoice_dict = InvoiceResponse.model_validate(invoice).model_dump()
    if invoice.customer:
        invoice_dict['customer_name'] = invoice.customer.contact_person
    
    return invoice_dict

@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: UUID,
    invoice_data: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an invoice (admin only)"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    update_data = invoice_data.model_dump(exclude_unset=True, exclude={'items'})
    for field, value in update_data.items():
        setattr(invoice, field, value)
    
    # Update items if provided
    if invoice_data.items is not None:
        # Delete existing items
        db.query(InvoiceItem).filter(InvoiceItem.invoice_id == invoice_id).delete()
        
        # Add new items
        for item_data in invoice_data.items:
            item = InvoiceItem(
                **item_data.model_dump(),
                invoice_id=invoice.id
            )
            db.add(item)
    
    db.commit()
    db.refresh(invoice)
    
    invoice_dict = InvoiceResponse.model_validate(invoice).model_dump()
    if invoice.customer:
        invoice_dict['customer_name'] = invoice.customer.contact_person
    
    return invoice_dict

@router.delete("/{invoice_id}")
async def delete_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an invoice (admin only)"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    db.delete(invoice)
    db.commit()
    return {"message": "Invoice deleted successfully"}

@router.get("/{invoice_id}/pdf")
async def get_invoice_pdf(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate and download invoice PDF (admin only)"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    customer = None
    if invoice.customer:
        customer = invoice.customer
    
    # Generate PDF
    pdf_buffer = generate_invoice_pdf(invoice, customer)
    
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=invoice_{invoice.invoice_number}.pdf"
        }
    )

@router.post("/{invoice_id}/send-whatsapp")
async def send_invoice_whatsapp(
    invoice_id: UUID,
    phone_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mock WhatsApp invoice sending (admin only)"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # This is a mock implementation
    # In production, you would integrate with WhatsApp Business API
    return {
        "success": True,
        "message": f"Invoice {invoice.invoice_number} would be sent to {phone_number}",
        "whatsapp_link": f"https://wa.me/{phone_number}?text=Your%20invoice%20{invoice.invoice_number}%20for%20Rs.%20{invoice.total_amount}%20is%20ready.%20Contact%20us%20for%20details."
    }
