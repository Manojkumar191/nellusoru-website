"""
Product Schemas
"""

from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    slug: str
    category_id: Optional[UUID] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[Decimal] = None
    unit: Optional[str] = None
    min_order_quantity: int = 1
    is_featured: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[UUID] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    specifications: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[Decimal] = None
    unit: Optional[str] = None
    min_order_quantity: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    category_name: Optional[str] = None

    class Config:
        from_attributes = True

class ProductWithCategory(ProductResponse):
    category: Optional[dict] = None
