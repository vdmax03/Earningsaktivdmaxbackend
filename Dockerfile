FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Create database directory
RUN mkdir -p database

EXPOSE $PORT

# Use gunicorn with better error handling
CMD ["python", "-m", "gunicorn", "--workers", "1", "--bind", "0.0.0.0:$PORT", "--timeout", "120", "--keep-alive", "5", "--preload", "src.main:app"] 