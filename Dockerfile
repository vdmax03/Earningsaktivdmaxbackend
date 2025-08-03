FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE $PORT

CMD ["python", "-m", "gunicorn", "--workers", "4", "--bind", "0.0.0.0:$PORT", "src.main:app"] 