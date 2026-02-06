"""
Offer Model
"""

import uuid
from sqlalchemy import Column, String, Boolean, Integer, Text, DateTime, Date, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base

class Offer(Base):
    __tablename__ = "offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    start_date = Column(Date)
    end_date = Column(Date)
    discount_percent = Column(Numeric(5, 2))
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
