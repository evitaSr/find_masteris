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

# Use full mysql client command with quotes for password
until mysql --host="$host" --user="$DATABASE_USER" --port=$port --password="$DATABASE_PASSWORD" --database="$DATABASE_NAME" --ssl-mode=VERIFY_CA --ssl-ca=/app/ca-certificate.crt -e 'SELECT 1;' >/dev/null 2>&1; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "MySQL is up - executing command"
exec "$@"