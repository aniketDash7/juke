from main import app, datastore
from application.models import db, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="Administrator", description="User is the administrator")
    datastore.find_or_create_role(name='Creator',description='User is a creator')
    datastore.find_or_create_role(name='User',description='Regular User')

    db.session.commit()
    if not datastore.find_user(email='admin@email.com'):
        datastore.create_user(email='admin@email.com', password=generate_password_hash("adminSukuna"), roles=["Administrator"])
    if not datastore.find_user(email="ctor@email.com"):
        datastore.create_user(email="ctor@email.com", password=generate_password_hash("ctor"),roles=["Creator"],active=False)
    if not datastore.find_user(email='user@email.com'):
        datastore.create_user(email='user@email.com',password=generate_password_hash('userYI'),roles=["User"])
    db.session.commit()