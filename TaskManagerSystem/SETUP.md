# Setup Guide for Team Members

This guide will help you get the Task Management System running on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **PHP 7.4 or higher** - [Download PHP](https://www.php.net/downloads.php)
- **MySQL 5.7 or higher** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Node.js 14+ and npm** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Verify Installation

Open your terminal/command prompt and verify everything is installed:

```bash
php -v          # Should show PHP version 7.4 or higher
mysql --version # Should show MySQL version
node -v         # Should show Node.js version 14 or higher
npm -v          # Should show npm version
```

---

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

If you haven't already, clone the repository:

```bash
git clone <repository-url>
cd TaskManagementSystem
```

### Step 2: Set Up the Database

1. **Start MySQL service:**
   - **Windows**: Open Services and start MySQL, or use XAMPP/WAMP control panel
   - **Mac**: `brew services start mysql` (if installed via Homebrew) or use MAMP
   - **Linux**: `sudo systemctl start mysql`

2. **Create the database:**
   
   Option A - Using command line:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   (Enter your MySQL root password when prompted)
   
   Option B - Using phpMyAdmin:
   - Open phpMyAdmin in your browser (usually `http://localhost/phpmyadmin`)
   - Click "Import" tab
   - Choose the file `database/schema.sql`
   - Click "Go"

3. **Verify the database was created:**
   ```bash
   mysql -u root -p -e "SHOW DATABASES;" | grep task_management
   ```
   You should see `task_management` in the list.

### Step 3: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your text editor:
   ```bash
   # On Mac/Linux:
   nano .env
   # or
   code .env
   
   # On Windows:
   notepad .env
   ```

3. **Update the database credentials** in `.env`:
   ```
   DB_HOST=localhost
   DB_NAME=task_management
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password_here
   ```
   
   Replace `your_mysql_password_here` with your actual MySQL root password (or your MySQL username/password if different).

   ⚠️ **Important**: 
   - Don't use spaces around the `=` sign
   - Don't use quotes around the values (unless your password contains special characters that require it)
   - The `.env` file is already gitignored, so your password won't be shared

### Step 4: Set Up the Backend (PHP)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Start the PHP development server:**
   ```bash
   php -S localhost:8000
   ```

3. **Keep this terminal window open** - the server needs to keep running.

4. **Test the backend** (in a new terminal or browser):
   - Open `http://localhost:8000/api/categories.php` in your browser
   - You should see a JSON response (likely `[]` if no categories exist yet)

### Step 5: Set Up the Frontend (React)

1. **Open a NEW terminal window** (keep the backend server running in the first terminal)

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   This may take a few minutes the first time.

4. **Start the React development server:**
   ```bash
   npm start
   ```

5. **The app should automatically open** in your browser at `http://localhost:3000`

   If it doesn't open automatically, manually navigate to `http://localhost:3000`

---

## ✅ Verify Everything is Working

You should now have:
- ✅ Backend server running on `http://localhost:8000`
- ✅ Frontend app running on `http://localhost:3000`
- ✅ Database `task_management` created with tables

**Test the application:**
1. In the browser at `http://localhost:3000`, try creating a category
2. Try creating a task
3. If these work, everything is set up correctly! 🎉

---

## 🛠️ Running the Project (After Initial Setup)

Once everything is set up, you only need to:

1. **Start MySQL** (if not already running)

2. **Start the backend** (in one terminal):
   ```bash
   cd backend
   php -S localhost:8000
   ```

3. **Start the frontend** (in another terminal):
   ```bash
   cd frontend
   npm start
   ```

---

## ❗ Common Issues & Solutions

### "Connection error" when starting the app

**Problem**: Database connection failed

**Solutions**:
- Make sure MySQL is running
- Check your `.env` file has the correct credentials
- Verify the database exists: `mysql -u root -p -e "SHOW DATABASES;" | grep task_management`
- Make sure there are no spaces around `=` in your `.env` file

### Port 8000 already in use

**Problem**: Another application is using port 8000

**Solutions**:
- Find and close the other application using port 8000
- Or use a different port: `php -S localhost:8001` (then update frontend if needed)

### Port 3000 already in use

**Problem**: Another React app is running on port 3000

**Solutions**:
- React will automatically ask if you want to use port 3001 - say yes
- Or close the other React app

### "npm install" fails

**Problem**: Network or permission issues

**Solutions**:
- Make sure you have internet connection
- Try: `npm install --legacy-peer-deps`
- On Mac/Linux, if you get permission errors, try: `sudo npm install` (not recommended, but works)

### CORS errors in browser console

**Problem**: Frontend can't connect to backend

**Solutions**:
- Make sure backend is running on port 8000
- Make sure frontend is running on port 3000
- Check that both servers are actually running (look at terminal windows)

### "Module not found" errors

**Problem**: Dependencies not installed

**Solutions**:
- Make sure you ran `npm install` in the `frontend` directory
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

---

## 📞 Need Help?

If you're stuck:
1. Check the main [README.md](README.md) for more details
2. Check the Troubleshooting section above
3. Ask your team members or check the project's issue tracker

---

## 🎯 Quick Reference

**Start Backend:**
```bash
cd backend
php -S localhost:8000
```

**Start Frontend:**
```bash
cd frontend
npm start
```

**Access App:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/categories.php

**Database:**
- Name: `task_management`
- Config: `.env` file in project root
