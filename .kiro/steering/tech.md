# Technology Stack

## Frontend
- **Framework**: React 19.1.0 with Vite 6.3.5 build tool
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS 3.4.1 with custom animations
- **State Management**: React Context API and React Hook Form
- **Routing**: React Router DOM 7.6.1
- **Charts**: Recharts 2.15.3 for analytics dashboards
- **Package Manager**: pnpm 10.12.4

## Backend
- **Framework**: Flask 3.1.1 (Python)
- **Database**: SQLite with SQLAlchemy 2.0.41 ORM
- **Authentication**: JWT tokens (PyJWT 2.10.1)
- **CORS**: Flask-CORS 6.0.0 for cross-origin requests
- **HTTP Client**: requests 2.32.4 for external API calls

## Development & Build

### Frontend Commands
```bash
# Development server
pnpm dev

# Production build
pnpm build

# Linting
pnpm lint

# Preview production build
pnpm preview
```

### Backend Commands
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python src/main.py

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

## Deployment
- **Frontend**: Netlify with Node.js 20.14.0
- **Backend**: Manus Cloud platform
- **Database**: SQLite for development, PostgreSQL recommended for production
- **Environment**: Production URLs use HTTPS with SSL certificates

## Key Configuration
- **Proxy Setup**: Vite dev server proxies `/api` requests to Flask backend (localhost:5000)
- **Path Aliases**: `@` alias points to `src/` directory in frontend
- **CORS**: Configurable allowed origins via environment variables
- **Database**: Auto-creates database directory and tables on startup