"""
Products API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Product, Category, User
from app.schemas import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    db: Session = Depends(get_db),
    category_id: Optional[UUID] = None,
    category_slug: Optional[str] = None,
    featured_only: bool = False,
    active_only: bool = True,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Get all products (public)"""
    query = db.query(Product)
    
    if active_only:
        query = query.filter(Product.is_active == True)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if category_slug:
        category = db.query(Category).filter(Category.slug == category_slug).first()
        if category:
            query = query.filter(Product.category_id == category.id)
    
    if featured_only:
        query = query.filter(Product.is_featured == True)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) |
            (Product.brand.ilike(search_term)) |
            (Product.description.ilike(search_term))
        )
    
    products = query.offset(skip).limit(limit).all()
    
    # Add category name to response
    result = []
    for product in products:
        product_dict = ProductResponse.model_validate(product).model_dump()
        if product.category:
            product_dict['category_name'] = product.category.name
        result.append(product_dict)
    
    return result

@router.get("/featured", response_model=List[ProductResponse])
async def get_featured_products(db: Session = Depends(get_db), limit: int = 8):
    """Get featured products (public)"""
    products = db.query(Product).filter(
        Product.is_featured == True,
        Product.is_active == True
    ).limit(limit).all()
    
    result = []
    for product in products:
        product_dict = ProductResponse.model_validate(product).model_dump()
        if product.category:
            product_dict['category_name'] = product.category.name
        result.append(product_dict)
    
    return result

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID, db: Session = Depends(get_db)):
    """Get product by ID (public)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_dict = ProductResponse.model_validate(product).model_dump()
    if product.category:
        product_dict['category_name'] = product.category.name
    
    return product_dict

@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get product by slug (public)"""
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_dict = ProductResponse.model_validate(product).model_dump()
    if product.category:
        product_dict['category_name'] = product.category.name
    
    return product_dict

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new product (admin only)"""
    existing = db.query(Product).filter(Product.slug == product_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    
    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    
    product_dict = ProductResponse.model_validate(product).model_dump()
    if product.category:
        product_dict['category_name'] = product.category.name
    
    return product_dict

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    product_dict = ProductResponse.model_validate(product).model_dump()
    if product.category:
        product_dict['category_name'] = product.category.name
    
    return product_dict

@router.delete("/{product_id}")
async def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a product (admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
