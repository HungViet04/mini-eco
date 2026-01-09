Backend setup and DB import

1. Create the database and import the provided SQL dump (assumes `mysql` client is available):

```bash
# create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# import dump (adjust path if needed)
mysql -u root -p ecommerce_db < "./ecommerce_db.sql"
```

2. Ensure `.env` has correct DB credentials. By default it uses `DB_NAME=ecommerce_db`.

3. Install and run backend:

```bash
cd backend
npm install
npm run dev
```

4. Create an admin user for testing:
- Option A: Register via `POST /api/auth/register` then update role in DB:
  ```sql
  UPDATE users SET role='admin' WHERE email='you@example.com';
  ```
- Option B: Insert directly with a bcrypt-hashed password (use Node REPL or create a small script).
