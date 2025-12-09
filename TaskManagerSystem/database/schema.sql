-- Create database
CREATE DATABASE IF NOT EXISTS task_management;
USE task_management;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Insert sample data (optional)
INSERT INTO categories (name) VALUES 
    ('Work'),
    ('Personal'),
    ('Shopping');

INSERT INTO tasks (title, description, category_id, is_completed) VALUES
    ('Complete project proposal', 'Finish the project proposal document', 1, FALSE),
    ('Buy groceries', 'Milk, eggs, bread, vegetables', 3, FALSE),
    ('Call dentist', 'Schedule annual checkup', 2, FALSE);

