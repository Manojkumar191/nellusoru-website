"""
Dashboard API Routes
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User, Product, Customer, Invoice, Enquiry, Offer

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics"""
    total_products = db.query(func.count(Product.id)).scalar()
    active_products = db.query(func.count(Product.id)).filter(Product.is_active == True).scalar()
    
    total_customers = db.query(func.count(Customer.id)).scalar()
    active_customers = db.query(func.count(Customer.id)).filter(Customer.is_active == True).scalar()
    
    total_invoices = db.query(func.count(Invoice.id)).scalar()
    pending_invoices = db.query(func.count(Invoice.id)).filter(Invoice.status == "pending").scalar()
    paid_invoices = db.query(func.count(Invoice.id)).filter(Invoice.status == "paid").scalar()
    
    total_revenue = db.query(func.sum(Invoice.total_amount)).filter(Invoice.status == "paid").scalar() or 0
    
    new_enquiries = db.query(func.count(Enquiry.id)).filter(Enquiry.status == "new").scalar()
    total_enquiries = db.query(func.count(Enquiry.id)).scalar()
    
    active_offers = db.query(func.count(Offer.id)).filter(Offer.is_active == True).scalar()
    
    return {
        "products": {
            "total": total_products,
            "active": active_products
        },
        "customers": {
            "total": total_customers,
            "active": active_customers
        },
        "invoices": {
            "total": total_invoices,
            "pending": pending_invoices,
            "paid": paid_invoices,
            "total_revenue": float(total_revenue)
        },
        "enquiries": {
            "total": total_enquiries,
            "new": new_enquiries
        },
        "offers": {
            "active": active_offers
        }
    }

@router.get("/recent-invoices")
async def get_recent_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 5
):
    """Get recent invoices"""
    invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).limit(limit).all()
    
    result = []
    for invoice in invoices:
        customer_name = None
        if invoice.customer:
            customer_name = invoice.customer.contact_person
        result.append({
            "id": str(invoice.id),
            "invoice_number": invoice.invoice_number,
            "customer_name": customer_name,
            "total_amount": float(invoice.total_amount),
            "status": invoice.status,
            "invoice_date": invoice.invoice_date.isoformat()
        })
    
    return result

@router.get("/recent-enquiries")
async def get_recent_enquiries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 5
):
    """Get recent enquiries"""
    enquiries = db.query(Enquiry).order_by(Enquiry.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": str(e.id),
            "name": e.name,
            "phone": e.phone,
            "subject": e.subject,
            "status": e.status,
            "created_at": e.created_at.isoformat()
        }
        for e in enquiries
    ]
