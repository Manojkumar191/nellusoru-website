"""
Invoice Schemas
"""

from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal

class InvoiceItemBase(BaseModel):
    product_id: Optional[UUID] = None
    description: str
    quantity: Decimal = Decimal("1")
    unit: Optional[str] = None
    unit_price: Decimal
    discount_percent: Decimal = Decimal("0")
    amount: Decimal

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: UUID
    invoice_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    customer_id: Optional[UUID] = None
    invoice_date: date
    due_date: Optional[date] = None
    subtotal: Decimal = Decimal("0")
    tax_rate: Decimal = Decimal("0")
    tax_amount: Decimal = Decimal("0")
    discount_amount: Decimal = Decimal("0")
    total_amount: Decimal = Decimal("0")
    status: str = "draft"
    notes: Optional[str] = None
    terms: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceUpdate(BaseModel):
    customer_id: Optional[UUID] = None
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    subtotal: Optional[Decimal] = None
    tax_rate: Optional[Decimal] = None
    tax_amount: Optional[Decimal] = None
    discount_amount: Optional[Decimal] = None
    total_amount: Optional[Decimal] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    terms: Optional[str] = None
    items: Optional[List[InvoiceItemCreate]] = None

class InvoiceResponse(InvoiceBase):
    id: UUID
    invoice_number: str
    created_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemResponse] = []
    customer_name: Optional[str] = None

    class Config:
        from_attributes = True

class InvoiceWithCustomer(InvoiceResponse):
    customer: Optional[dict] = None
