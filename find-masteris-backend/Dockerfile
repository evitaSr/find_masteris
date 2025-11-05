FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies for mysqlclient + mysql client
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    python3-dev \
    default-mysql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy wait script
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Copy project files
COPY . /app/
COPY ca-certificate.crt /app/ca-certificate.crt

EXPOSE 8000

CMD ["/wait-for-db.sh", "gunicorn", "findMasteris.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1"]