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
# Use full mysql client command with quotes for password
until mysql --host="$host" --user="$DATABASE_USER" --port="$port" --password="$DATABASE_PASSWORD" --database="$DATABASE_NAME" --ssl-mode=VERIFY_CA --ssl-ca=/app/ca-certificate.crt -e 'SELECT 1;' >/dev/null 2>&1; do
  OUTPUT=$(mysql --host="$host" --user="$DATABASE_USER" --port="$port" --password="$DATABASE_PASSWORD" --database="$DATABASE_NAME" --ssl-mode=VERIFY_CA --ssl-ca=/app/ca-certificate.crt -e 'SELECT 1;' 2>&1)
  if [ $? -ne 0 ]; then
      echo "MySQL connection attempt failed with error: $OUTPUT"
      retry=$((retry+1))
      echo "MySQL is unavailable - sleeping (attempt $retry/$max_retries)..."
      sleep 2
  fi
  if [ $retry -ge $max_retries ]; then
    echo "ERROR: Could not connect to MySQL at $host:$port after $max_retries attempts."
    exit 1
  fi
done

echo "MySQL is up - running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "MySQL is up - executing command"
exec "$@"