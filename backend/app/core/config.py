"""
Application Configuration
"""

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/nellusoru_db"
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Business
    BUSINESS_NAME: str = "Nellusoru Manufacturers and Services"
    BUSINESS_PHONE: str = "+91 98765 43210"
    BUSINESS_WHATSAPP: str = "919876543210"
    BUSINESS_EMAIL: str = "info@nellusoru.com"
    BUSINESS_ADDRESS: str = "Near Karur Road, Kadavur, Karur, Tamil Nadu - 621313"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
