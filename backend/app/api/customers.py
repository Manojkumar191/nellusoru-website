"""
Customers API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Customer, User
from app.schemas import CustomerCreate, CustomerUpdate, CustomerResponse

router = APIRouter()

@router.get("/", response_model=List[CustomerResponse])
async def get_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    active_only: bool = False,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all customers (admin only)"""
    query = db.query(Customer)
    
    if active_only:
        query = query.filter(Customer.is_active == True)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Customer.contact_person.ilike(search_term)) |
            (Customer.company_name.ilike(search_term)) |
            (Customer.phone.ilike(search_term)) |
            (Customer.email.ilike(search_term))
        )
    
    customers = query.order_by(Customer.created_at.desc()).offset(skip).limit(limit).all()
    return customers

@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get customer by ID (admin only)"""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_data: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new customer (admin only)"""
    customer = Customer(**customer_data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: UUID,
    customer_data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a customer (admin only)"""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    update_data = customer_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(customer, field, value)
    
    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a customer (admin only)"""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}
