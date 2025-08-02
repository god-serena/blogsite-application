# https://docs.sqlalchemy.org/en/20/core/reflection.html#sqlalchemy.engine.reflection.Inspector
# https://www.datacamp.com/tutorial/python-subprocess
import os
import subprocess
import sys
from datetime import datetime, timezone
from faker import Faker
from sqlalchemy import delete, inspect
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash
import traceback

sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from models.user import UserProfile, Author, Reader
from models.blog import Blog
from src.db import db
from app import create_app

faker = Faker()

def createTables():
    subprocess.run(["flask", "db", "migrate", "-m", "\"Create db\""])
    subprocess.run(["flask", "db", "upgrade"])


def populate_with_fake_data():
    try:
        for table in [Blog, Author,Reader, UserProfile]:
            if (inspect(db.engine).has_table(table.__tablename__)):
                db.session.execute(
                    delete(table)
                )

        createTables()

        users = []
        for i in range(15):
            first_name = faker.first_name()
            last_name = faker.last_name() 
            user = UserProfile(
                first_name=first_name,
                last_name=last_name,
                email=f"blogger{i+1}@test.com",
                user_name=f"{first_name}.{last_name}",
                password=generate_password_hash("blogger"),
                avatar_data={"url": faker.image_url()},
            )
            users.append(user)
        
        db.session.add_all(users)
        db.session.flush()

        authors = []
        for user in users[:10]:
            author = Author(user_profile_id=user.id)
            authors.append(author)

        db.session.add_all(authors)
        db.session.flush()

        readers = []
        for user in users[10:]:
            reader = Reader(user_profile_id=user.id)

        db.session.add_all(readers)
        db.session.flush()

        blogs = []
        for i in range(100):
            quill_body = {
                "ops": [{"insert": faker.paragraph(50) + "\n"}]
            }
            blog = Blog(
                title=(" ").join(faker.words(nb=2)).title(),
                author_id=faker.random_element(authors).id,
                banner={"url": faker.image_url()},
                body=quill_body,
                published_at=datetime.now(tz=timezone.utc)
            )
            blogs.append(blog)
            
        db.session.add_all(blogs)

        db.session.commit()
    except Exception:
        traceback.print_exc()
        db.session.rollback()
if __name__ == "__main__":
    app = create_app() 
    with app.app_context():
        populate_with_fake_data()
