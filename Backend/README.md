# Portfolio Contact Form - Backend Setup Guide

## What Was Created

Your contact form is now connected to a backend database! Here's what was set up:

### Files Created:
1. **Backend/contact_table.sql** - Database schema
2. **Backend/server.js** - Express API server
3. **Backend/package.json** - Node.js dependencies
4. **Backend/.env.example** - Environment variables template
5. **Frontend/HTML files/Contact.html** - Updated with API connection

---

## Setup Instructions

### Step 1: Install Database (MySQL or MariaDB)

**Option A: MySQL**
- Download from: https://dev.mysql.com/downloads/mysql/
- Install and remember your root password

**Option B: XAMPP (Easier for beginners)**
- Download from: https://www.apachefriends.org/
- Includes MySQL and phpMyAdmin

### Step 2: Create the Database

1. Open MySQL command line or phpMyAdmin
2. Create database:
   ```sql
   CREATE DATABASE portfolio_db;
   USE portfolio_db;
   ```
3. Run the SQL script:
   ```sql
   source Backend/contact_table.sql
   ```
   Or copy/paste the contents from contact_table.sql

### Step 3: Install Node.js

1. Download Node.js from: https://nodejs.org/
2. Install LTS version
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 4: Configure Backend

1. In the Backend folder, copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=portfolio_db
   PORT=3000
   ```

### Step 5: Install Dependencies

Open terminal in the Backend folder and run:
```bash
npm install
```

### Step 6: Start the Server

```bash
npm start
```

You should see:
```
✓ Database connected successfully
✓ Server is running on http://localhost:3000
✓ API endpoint: http://localhost:3000/api/contact
```

### Step 7: Test the Contact Form

1. Open your Contact.html in a browser
2. Fill out the form
3. Submit - data will be saved to the database!

---

## API Endpoints

- **POST /api/contact** - Submit contact form
- **GET /api/contacts** - Get all submissions (admin)
- **GET /api/contacts/:id** - Get specific submission
- **GET /api/health** - Check server status

---

## Troubleshooting

**"Database connection failed"**
- Check your .env credentials
- Make sure MySQL is running
- Verify database "portfolio_db" exists

**"Cannot find module 'express'"**
- Run `npm install` in Backend folder

**"CORS error" in browser**
- Make sure server is running on port 3000
- Check the fetch URL in Contact.html matches your server

**Form submits but doesn't save**
- Check browser console for errors
- Verify server terminal for error messages
- Make sure all table columns exist

---

## Next Steps (Optional)

- Add email notifications when form is submitted
- Create admin dashboard to view submissions
- Add spam protection (reCAPTCHA)
- Deploy to production server

---

## Development Mode

For auto-restart on code changes:
```bash
npm run dev
```
(Requires nodemon to be installed)
