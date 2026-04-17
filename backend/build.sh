#!/bin/bash

# Exit on error
set -o errexit

# Print commands for debugging
set -x

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Apply database migrations
python manage.py migrate