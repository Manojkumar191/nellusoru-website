# Nellusoru Manufacturers and Services

A modern, production-ready full-stack web application for Nellusoru Manufacturers and Services - a B2B manufacturing and services company located in Kadavur, Karur, Tamil Nadu, India.

## 🏭 About the Business

- **Name:** Nellusoru Manufacturers and Services
- **Location:** Kadavur, Karur, Tamil Nadu, India
- **Established:** 2023
- **Type:** Manufacturing & Services (B2B focused)

## 🛠️ Tech Stack

### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- React Hot Toast

### Backend
- FastAPI (Python)
- SQLAlchemy
- Pydantic
- JWT Authentication
- bcrypt
- ReportLab (PDF Generation)

### Database
- Supabase (PostgreSQL)

### Deployment
- Frontend → Vercel
- Backend → Render

## 📁 Project Structure

```
nellusoru-website/
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   │   ├── public/     # Public pages
│   │   │   └── admin/      # Admin pages
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── ...
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configurations
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── ...
└── database/               # Database schema
    └── schema.sql
```

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- Supabase account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

5. Run the server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
VITE_WHATSAPP_NUMBER=919876543210
```

4. Run development server:
```bash
npm run dev
```

## 🌐 Deployment

### Backend (Render)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `nellusoru-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add **Environment Variables:**
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Supabase connection string |
   | `SECRET_KEY` | A strong random secret key |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app` |
6. Click **Create Web Service**

### Frontend (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New → Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add **Environment Variables:**
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` |
   | `VITE_COMPANY_PHONE` | `+919080059430` |
   | `VITE_WHATSAPP_NUMBER` | `919080059430` |
6. Click **Deploy**

### Post-Deployment

After both are deployed:
1. Copy your Vercel frontend URL (e.g., `https://nellusoru.vercel.app`)
2. Update Render's `CORS_ORIGINS` env var to include that URL
3. Copy your Render backend URL (e.g., `https://nellusoru-backend.onrender.com`)
4. Update Vercel's `VITE_API_URL` env var to `https://nellusoru-backend.onrender.com/api`
5. Redeploy both services

## 👤 Admin Login

- **Email:** `admin@nellusoru.com`
- **Password:** `admin123`

## 📄 License

© 2023 Nellusoru Manufacturers and Services. All rights reserved.
