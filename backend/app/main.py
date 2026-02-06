"""
Nellusoru Manufacturers and Services - Backend Application
FastAPI Main Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, categories, products, customers, invoices, offers, enquiries, dashboard

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Nellusoru Manufacturers and Services API",
    description="Backend API for Nellusoru Manufacturers and Services - Manufacturing & B2B Services",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(",") if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(customers.router, prefix="/api/customers", tags=["Customers"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(offers.router, prefix="/api/offers", tags=["Offers"])
app.include_router(enquiries.router, prefix="/api/enquiries", tags=["Enquiries"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Nellusoru Manufacturers and Services API",
        "business": "Nellusoru Manufacturers and Services",
        "location": "Kadavur, Karur, Tamil Nadu, India",
        "established": 2023,
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Nellusoru API"}
