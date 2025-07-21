<img width="400" height="100" alt="logo" src="https://github.com/user-attachments/assets/cbfd7737-bfed-4169-a05e-0ba044668246" />

# BLOGSITE APPLICATION

### This is an incomplete blogsite application developed with the following tools:

- `Next.js`
- `TailwindCSS`
- `Flask`
- `Flask-Migrate`
- `Flask-SQLAlchemy`
- `SQLAlchemy`
- `Flask-CORS`
- `PyJWT`
- `Flassger`

### Things to improve:

1. Finalize setup of user authentication in the frontend, to ensure authenticated\
   creation, deletion, and update of a blog record.
2. Cached frequently accessed records.
3. Maximizing SSR capability of `Next.js`.
4. Proper documentation for endpoint resources with `Flassger`.
5. Reduce docker-images sizes.
6. Unit tests.

##

### Development setup

**Prerequisite**

- `Docker 🐳`

Clone the repo

```
git clone https://github.com/god-serena/blogsite-application.git
```

Build the images and run all containers

```
docker compose up --build
```

In a new shell session

```
docker compose exec blogger_api bash
```

Execute the python script for creating the tables and dummy records

```
python fake_data.py
```

Done!

**Frontend** \
http://localhost:4000

**Backend** \
Runs at port `8000`
