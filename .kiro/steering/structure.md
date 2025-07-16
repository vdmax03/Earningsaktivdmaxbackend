# Project Structure

## Repository Organization

```
earning-sakti/
├── earning-sakti-frontend/     # React frontend application
├── earning-sakti-backend/      # Flask backend API
├── deployment_documentation.md # Deployment guide and usage instructions
├── earning_sakti_analysis.md   # Original desktop app analysis
├── website_architecture.md     # Technical architecture documentation
└── testing_results.md         # Testing and validation results
```

## Frontend Structure (`earning-sakti-frontend/`)

```
src/
├── components/          # Reusable UI components (shadcn/ui based)
├── context/            # React Context providers for state management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── assets/             # Static assets (images, icons)
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
├── config.js           # Frontend configuration
└── debug.jsx           # Development debugging utilities
```

### Key Frontend Conventions
- Use `@/` alias for imports from `src/` directory
- Components follow shadcn/ui patterns with Radix UI primitives
- Tailwind CSS for styling with custom animations
- React Hook Form for form management with Zod validation

## Backend Structure (`earning-sakti-backend/`)

```
src/
├── routes/             # API route handlers organized by feature
├── models/             # SQLAlchemy database models
├── services/           # Business logic and external integrations
├── database/           # Database initialization and migrations
├── static/             # Static file serving (uploads, assets)
├── main.py             # Flask application entry point
└── config.py           # Backend configuration and environment variables
```

### Key Backend Conventions
- RESTful API design with `/api/` prefix
- JWT-based authentication for all protected routes
- SQLAlchemy models with proper relationships and constraints
- Service layer pattern for business logic separation
- Cookie-based TikTok account authentication storage

## Database Schema Patterns

### Core Entities
- **Users**: Authentication and user management
- **TikTok Accounts**: Multiple account management per user
- **Effects**: TikTok Effect House content management
- **Campaigns**: Automation campaign configuration and tracking
- **Campaign Logs**: Detailed activity logging for analytics

### Naming Conventions
- Table names: lowercase with underscores (`tiktok_accounts`)
- Foreign keys: `{table}_id` format (`user_id`)
- Timestamps: `created_at`, `updated_at`, `last_used`
- Status fields: Use VARCHAR with predefined values (`active`, `inactive`, `pending`)

## API Design Patterns

### Endpoint Structure
- Authentication: `/api/auth/*`
- Resource management: `/api/{resource}` (CRUD operations)
- Actions: `/api/{resource}/{id}/{action}` (e.g., `/api/campaigns/1/start`)
- Nested resources: `/api/{parent}/{id}/{child}` when appropriate

### Response Format
- Consistent JSON responses with `success`, `data`, `message` fields
- Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Error responses include detailed error messages for debugging

## File Upload Conventions
- Effect files: `.zip` format stored in `static/effects/`
- Icons: Image files stored in `static/icons/`
- User uploads: Organized by user ID in subdirectories
- File validation: Size limits and format checking before storage