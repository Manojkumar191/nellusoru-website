"""
Offers API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Offer, User
from app.schemas import OfferCreate, OfferUpdate, OfferResponse

router = APIRouter()

@router.get("/", response_model=List[OfferResponse])
async def get_offers(
    db: Session = Depends(get_db),
    active_only: bool = False
):
    """Get all offers (public)"""
    query = db.query(Offer)
    if active_only:
        query = query.filter(Offer.is_active == True)
    offers = query.order_by(Offer.display_order).all()
    return offers

@router.get("/active", response_model=List[OfferResponse])
async def get_active_offers(db: Session = Depends(get_db)):
    """Get active offers (public)"""
    offers = db.query(Offer).filter(Offer.is_active == True).order_by(Offer.display_order).all()
    return offers

@router.get("/{offer_id}", response_model=OfferResponse)
async def get_offer(offer_id: UUID, db: Session = Depends(get_db)):
    """Get offer by ID (public)"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer

@router.post("/", response_model=OfferResponse, status_code=status.HTTP_201_CREATED)
async def create_offer(
    offer_data: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new offer (admin only)"""
    offer = Offer(**offer_data.model_dump())
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer

@router.put("/{offer_id}", response_model=OfferResponse)
async def update_offer(
    offer_id: UUID,
    offer_data: OfferUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an offer (admin only)"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    update_data = offer_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(offer, field, value)
    
    db.commit()
    db.refresh(offer)
    return offer

@router.delete("/{offer_id}")
async def delete_offer(
    offer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an offer (admin only)"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    db.delete(offer)
    db.commit()
    return {"message": "Offer deleted successfully"}

@router.patch("/{offer_id}/toggle", response_model=OfferResponse)
async def toggle_offer_status(
    offer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle offer active status (admin only)"""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    offer.is_active = not offer.is_active
    db.commit()
    db.refresh(offer)
    return offer
