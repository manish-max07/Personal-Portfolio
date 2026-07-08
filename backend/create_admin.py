from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.auth.security import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

username = input("Enter admin username: ")
password = input("Enter admin password: ")

existing = db.query(User).filter(User.username == username).first()
if existing:
    print("User already exists.")
else:
    new_user = User(username=username, hashed_password=hash_password(password))
    db.add(new_user)
    db.commit()
    print(f"Admin user '{username}' created successfully.")

db.close()