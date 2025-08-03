# Deployment Guide

## Health Check Issues Fixed

The main issues that were causing the health check failures have been resolved:

### 1. Incorrect Health Check Endpoint
- **Problem**: Railway was using `/api/auth/login` as health check endpoint
- **Solution**: Changed to `/health` endpoint which is designed for health checks

### 2. Database Connection Issues
- **Problem**: No proper database connectivity testing
- **Solution**: Added database connectivity test to health check endpoint

### 3. Deployment Configuration Issues
- **Problem**: Incorrect start commands in deployment configs
- **Solution**: Fixed start commands in `railway.json` and `render.yaml`

## Health Check Endpoints

### `/health`
- **Method**: GET
- **Purpose**: Health check endpoint
- **Response**: 
  ```json
  {
    "status": "healthy",
    "message": "Earning Sakti Backend is running",
    "database": "connected"
  }
  ```

### `/api/test`
- **Method**: GET
- **Purpose**: Simple API test endpoint
- **Response**:
  ```json
  {
    "message": "API is working correctly"
  }
  ```

## Environment Variables

Make sure these environment variables are set in your deployment:

- `DATABASE_URL`: Your database connection string
- `SECRET_KEY`: A secure secret key for JWT tokens
- `PORT`: Port number (usually set automatically by platform)

## Troubleshooting

### If health checks still fail:

1. **Check database connectivity**:
   ```bash
   curl https://your-app-url/health
   ```

2. **Test API endpoint**:
   ```bash
   curl https://your-app-url/api/test
   ```

3. **Check logs** for database connection errors

4. **Verify environment variables** are set correctly

### Common Issues:

1. **Database not accessible**: Check if DATABASE_URL is correct
2. **Port conflicts**: Ensure PORT environment variable is set
3. **Missing dependencies**: Verify all requirements are installed

## Deployment Platforms

### Railway
- Uses `railway.json` configuration
- Health check: `/health`
- Start command: `gunicorn --workers 4 --bind 0.0.0.0:$PORT src.main:app`

### Render
- Uses `render.yaml` configuration
- Health check: `/health`
- Start command: `gunicorn --workers 4 --bind 0.0.0.0:$PORT src.main:app` 