# Task Management System

A full-stack task management application built with React, PHP, and MySQL. This system allows you to create, update, delete, and organize tasks with categories.

## Features

- ✅ Create, update, and delete tasks
- ✅ Mark tasks as completed
- ✅ Create and manage categories
- ✅ Filter tasks by category
- ✅ Modern and responsive UI
- ✅ RESTful API architecture

## Tech Stack

- **Frontend**: React 18
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **HTTP Client**: Axios

## Project Structure

```
TaskManagementSystem/
├── backend/
│   ├── api/
│   │   ├── categories.php
│   │   └── tasks.php
│   ├── config/
│   │   ├── database.php
│   │   └── cors.php
│   └── .htaccess
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryManager.js
│   │   │   ├── CategoryManager.css
│   │   │   ├── TaskManager.js
│   │   │   └── TaskManager.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## Quick Start

For detailed setup instructions, see [SETUP.md](SETUP.md) - a beginner-friendly guide for team members.

## Setup Instructions

### Prerequisites

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Node.js 14+ and npm
- Apache server (or PHP built-in server)

### Database Setup

1. **Create the database:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   
   Or manually:
   - Open MySQL command line or phpMyAdmin
   - Run the SQL commands from `database/schema.sql`

2. **Update database credentials:**
   - Edit `backend/config/database.php`
   - Update the following variables if needed:
     - `$host` (default: "localhost")
     - `$db_name` (default: "task_management")
     - `$username` (default: "root")
     - `$password` (default: "")

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd TaskManagementSystem/backend
   ```

2. **Start PHP server:**
   
   Using PHP built-in server:
   ```bash
   php -S localhost:8000
   ```
   
   Or configure Apache to point to the `backend` directory.

3. **Test the API:**
   - Open `http://localhost:8000/api/categories.php` in your browser
   - You should see a JSON response (empty array if no categories exist)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd TaskManagementSystem/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open `http://localhost:3000` in your browser
   - The app should automatically connect to the backend API

## API Endpoints

### Categories

- `GET /api/categories.php` - Get all categories
- `GET /api/categories.php?id={id}` - Get single category
- `POST /api/categories.php` - Create category
  ```json
  {
    "name": "Category Name"
  }
  ```
- `PUT /api/categories.php` - Update category
  ```json
  {
    "id": 1,
    "name": "Updated Name"
  }
  ```
- `DELETE /api/categories.php` - Delete category
  ```json
  {
    "id": 1
  }
  ```

### Tasks

- `GET /api/tasks.php` - Get all tasks
- `GET /api/tasks.php?category_id={id}` - Get tasks by category
- `GET /api/tasks.php?id={id}` - Get single task
- `POST /api/tasks.php` - Create task
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "category_id": 1
  }
  ```
- `PUT /api/tasks.php` - Update task
  ```json
  {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated Description",
    "category_id": 2,
    "is_completed": true
  }
  ```
- `DELETE /api/tasks.php` - Delete task
  ```json
  {
    "id": 1
  }
  ```

## Usage

1. **Create Categories:**
   - Click "+ Add Category" in the sidebar
   - Enter a category name and click "Add"

2. **Create Tasks:**
   - Click "+ Add Task" in the main content area
   - Enter task title (required)
   - Optionally add description and select a category
   - Click "Add Task"

3. **Manage Tasks:**
   - Click the checkbox to mark a task as completed
   - Click the edit icon (✏️) to update a task
   - Click the delete icon (🗑️) to remove a task

4. **Filter Tasks:**
   - Click on a category in the sidebar to filter tasks
   - Click "All Tasks" to show all tasks

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
- The backend server is running on port 8000
- The frontend is running on port 3000
- The CORS headers in `backend/config/cors.php` are correctly configured

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `backend/config/database.php`
- Ensure the database `task_management` exists

### API Not Responding
- Verify PHP server is running on port 8000
- Check PHP error logs
- Ensure all PHP files are in the correct directories

## License

This project is open source and available for personal and educational use.

