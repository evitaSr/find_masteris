#!/bin/sh
set -e

host="${1:-$DATABASE_HOST}"
port="${DATABASE_PORT:-3306}"
shift
cmd="$@"

echo "Waiting for MySQL at $host..."
echo "DATABASE_USER=$DATABASE_USER"
echo "DATABASE_PASSWORD=$DATABASE_PASSWORD"
echo "DATABASE_NAME=$DATABASE_NAME"

# Use full mysql client command with quotes for password
until mysql -h "$host" -u"$DATABASE_USER" --password="$DATABASE_PASSWORD" "$DATABASE_NAME" --ssl=0 -e 'SELECT 1;' >/dev/null 2>&1; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "MySQL is up - executing command"
exec $cmd
