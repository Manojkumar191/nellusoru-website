"""
Enquiry Schemas
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class EnquiryBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: str
    company: Optional[str] = None
    subject: Optional[str] = None
    message: str
    product_id: Optional[UUID] = None

class EnquiryCreate(EnquiryBase):
    pass

class EnquiryUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class EnquiryResponse(EnquiryBase):
    id: UUID
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
