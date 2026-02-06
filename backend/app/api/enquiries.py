"""
Enquiries API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Enquiry, User
from app.schemas import EnquiryCreate, EnquiryUpdate, EnquiryResponse

router = APIRouter()

@router.get("/", response_model=List[EnquiryResponse])
async def get_enquiries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all enquiries (admin only)"""
    query = db.query(Enquiry)
    
    if status_filter:
        query = query.filter(Enquiry.status == status_filter)
    
    enquiries = query.order_by(Enquiry.created_at.desc()).offset(skip).limit(limit).all()
    return enquiries

@router.get("/{enquiry_id}", response_model=EnquiryResponse)
async def get_enquiry(
    enquiry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get enquiry by ID (admin only)"""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry

@router.post("/", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
async def create_enquiry(
    enquiry_data: EnquiryCreate,
    db: Session = Depends(get_db)
):
    """Create a new enquiry (public - from contact form)"""
    enquiry = Enquiry(**enquiry_data.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry

@router.put("/{enquiry_id}", response_model=EnquiryResponse)
async def update_enquiry(
    enquiry_id: UUID,
    enquiry_data: EnquiryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an enquiry (admin only)"""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    update_data = enquiry_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(enquiry, field, value)
    
    db.commit()
    db.refresh(enquiry)
    return enquiry

@router.delete("/{enquiry_id}")
async def delete_enquiry(
    enquiry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an enquiry (admin only)"""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    db.delete(enquiry)
    db.commit()
    return {"message": "Enquiry deleted successfully"}

@router.patch("/{enquiry_id}/status", response_model=EnquiryResponse)
async def update_enquiry_status(
    enquiry_id: UUID,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update enquiry status (admin only)"""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    enquiry.status = new_status
    db.commit()
    db.refresh(enquiry)
    return enquiry
