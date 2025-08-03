# Earning Sakti Backend

Backend API untuk aplikasi Earning Sakti yang sudah di-deploy ke Neon.

## Fitur

- ✅ Authentication (Register/Login)
- ✅ User Management
- ✅ TikTok Account Management
- ✅ Campaign Management
- ✅ Effect House Integration
- ✅ PostgreSQL Database Support

## Deployment Status

- **Frontend**: ✅ Deployed to Vercel
- **Backend**: 🔄 Ready for Neon deployment
- **Database**: 🔄 PostgreSQL on Neon

## Environment Variables

Setelah deploy ke Neon, pastikan environment variables berikut sudah diset:

```bash
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://username:password@host:port/database
DEBUG=False
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/<id>` - Get user by ID
- `PUT /api/users/<id>` - Update user
- `DELETE /api/users/<id>` - Delete user

### TikTok Accounts
- `GET /api/tiktok-accounts` - Get user's TikTok accounts
- `POST /api/tiktok-accounts` - Add TikTok account
- `PUT /api/tiktok-accounts/<id>` - Update TikTok account
- `DELETE /api/tiktok-accounts/<id>` - Delete TikTok account
- `POST /api/tiktok-accounts/<id>/test-login` - Test account login

### Campaigns
- `GET /api/campaigns` - Get user's campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/<id>` - Update campaign
- `DELETE /api/campaigns/<id>` - Delete campaign
- `POST /api/campaigns/<id>/start` - Start campaign
- `POST /api/campaigns/<id>/stop` - Stop campaign
- `GET /api/campaigns/<id>/stats` - Get campaign stats

### Effects
- `GET /api/effects` - Get user's effects
- `POST /api/effects` - Create effect
- `PUT /api/effects/<id>` - Update effect
- `DELETE /api/effects/<id>` - Delete effect
- `POST /api/effects/<id>/publish` - Publish effect
- `GET /api/effects/<id>/status` - Get effect status
- `GET /api/effects/<id>/analytics` - Get effect analytics
- `POST /api/effects/<id>/resubmit` - Resubmit rejected effect

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python src/main.py
```

## Deployment to Neon

1. Push code ke GitHub
2. Connect repository ke Neon
3. Set environment variables
4. Deploy!

## Database Schema

- Users
- TikTok Accounts
- Effects
- Campaigns
- Campaign Logs 