# site-insaerospace



# Développement


## Comment lancer le site en local ?

### Prérequis
- Avoir installé Python3
- Avoir installé python3.12-venv sur linux uniquement (`pip install python3.12-venv`)
- Avoir installé pip

### Première étape: Lancer le backend
-> Lien du repo du backend: [https://github.com/insa-sh/insaerospace-backend/](https://github.com/insa-sh/insaerospace-backend/)
- Suivre les instructions du README du repo du backend pour lancer le serveur


### Deuxième étape: Lancer le frontend
- Avoir créé un environnement virtuel python : `python3 -m venv env`
- Activer l'environnement virtuel : `source env/bin/activate` (sur **linux**) ou `env\Scripts\activate` (sur **windows**)
- Installer les dépendances : `pip install -r requirements.txt`
- Se déplacer dans le dossier `insaerospace`
- Lancer le serveur : `python manage.py runserver`

### Troisième étape: Accéder au site
- Ouvrir un navigateur et aller à l'adresse [http://localhost:8000/](http://localhost:8000/)

### Autres commandes utiles
- Pour désactiver l'environnement virtuel: `deactivate`
- Pour couper le site local : `Ctrl + C`

### Le fichier .env
- Le fichier `.env` est à créer à la racine du projet. il doit contenir les variables d'environnement suivantes:
```bash
API_TOKEN= # Token de l'API du backend (généré via l'interface du backend - token read-only)
API_URL= # URL de l'API du backend par défaut http://localhost:1337
