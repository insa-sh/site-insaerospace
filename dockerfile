# Utiliser une image Python comme base
FROM python:3.12-slim

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /frontend

# Copier les fichiers du projet dans le conteneur
COPY ./insaerospace-frontend/ .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r /frontend/requirements.txt

# Collecter les fichiers statiques
RUN python manage.py collectstatic --noinput

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Gunicorn et Nginx
CMD ["sh", "-c", "gunicorn insaerospace.wsgi:application --bind unix:/tmp/gunicorn.sock & nginx -g 'daemon off;'"]