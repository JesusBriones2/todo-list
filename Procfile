web: python manage.py makemigrations
web: python manage.py migrate
web: python manage.py collectstatic --clear
web: gunicorn main.wsgi