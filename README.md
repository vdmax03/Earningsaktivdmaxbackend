# Earning Sakti - Digital Revenue Automation Platform

Platform otomatisasi pendapatan digital yang mengintegrasikan semua fungsionalitas dari aplikasi desktop "earning sakti.exe" ke dalam bentuk website modern.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.14.0+
- Python 3.8+
- pnpm (recommended) atau npm

### Development Setup

1. **Clone repository**
```bash
git clone <repository-url>
cd earning-sakti
```

2. **Setup Backend**
```bash
cd earning-sakti-backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python src/main.py
```

3. **Setup Frontend**
```bash
cd earning-sakti-frontend
pnpm install
pnpm dev
```

## 📁 Project Structure

```
earning-sakti/
├── earning-sakti-frontend/    # React frontend
├── earning-sakti-backend/     # Flask backend
├── .kiro/                     # Kiro AI steering documents
├── docs/                      # Documentation
└── README.md
```

## 🌐 Live URLs

- **Frontend**: https://0vhlizcp939y.manus.space
- **Backend**: https://mzhyi8cqzng8.manus.space

## 📚 Documentation

- [Deployment Guide](deployment_documentation.md)
- [Architecture Overview](website_architecture.md)
- [Original App Analysis](earning_sakti_analysis.md)

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Flask, SQLAlchemy, JWT Authentication
- **Database**: SQLite (dev), PostgreSQL (prod)
- **Deployment**: Netlify + Manus Cloud