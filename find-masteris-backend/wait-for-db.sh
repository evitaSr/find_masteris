#!/bin/sh
set -e

host="${DATABASE_HOST}"
port="${DATABASE_PORT}"
shift
cmd="$@"

echo "Waiting for MySQL at $host:$port..."
echo "DATABASE_USER=$DATABASE_USER"
echo "DATABASE_PASSWORD=$DATABASE_PASSWORD"
echo "DATABASE_NAME=$DATABASE_NAME"
echo "Files in app:"
ls -l /app

retry=0
max_retries=30

echo "Waiting for MySQL at $host:$port..."
while ! mysql --host="$host" \
    --user="$DATABASE_USER" \
    --port="$port" \
    --password="$DATABASE_PASSWORD" \
    --database="$DATABASE_NAME" \
    --ssl \
    --ssl-ca=/app/ca-certificate.crt \
    -e 'SELECT 1;' 2>mysql_error.log; do

  echo "MySQL connection failed (attempt $retry/$max_retries)"
  echo "---- Error output ----"
  cat mysql_error.log
  echo "----------------------"

  retry=$((retry+1))
  if [ $retry -ge $max_retries ]; then
    echo "❗ ERROR: Could not connect to MySQL after $max_retries attempts."
    exit 1
  fi

  sleep 2
done

echo "MySQL is up - running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "MySQL is up - executing command"
exec "$@"