# Signalement des problèmes urbains

Cette application full stack permet aux citoyens de signaler des problèmes urbains, et aux administrateurs et constateurs de gérer ces signalements.

---

## Technologies utilisées

- Backend : Django (Python)
- Frontend : React.js (JavaScript)
- Base de données : MySQL (en développement) / autre en production
- Authentification : JWT

---

## Installation et lancement

### Backend

```bash
cd django
python -m venv env
source env/bin/activate       # Sur Windows : env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
### Backend
cd react
npm install
npm start
### link overleaf
https://www.overleaf.com/read/qvhchgdjnkdw#4587fc