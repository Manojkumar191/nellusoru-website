"""
Offer Schemas
"""

from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal

class OfferBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    discount_percent: Optional[Decimal] = None
    is_active: bool = True
    display_order: int = 0

class OfferCreate(OfferBase):
    pass

class OfferUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    discount_percent: Optional[Decimal] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

class OfferResponse(OfferBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
