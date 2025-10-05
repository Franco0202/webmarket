#!/usr/bin/env bash
set -o errexit  # Stop if any command fails

echo "🚀 Installing Python dependencies..."
pip install -r requirements.txt

echo "🧱 Building frontend..."
npm install --prefix frontend
npm run build --prefix frontend

echo "📦 Collecting static files..."
python manage.py collectstatic --no-input

echo "📜 Applying migrations..."
python manage.py migrate

echo "✅ Build complete!"
