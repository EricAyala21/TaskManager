import React, { useState, useEffect } from 'react';
import './App.css';
import CategoryManager from './components/CategoryManager';
import TaskManager from './components/TaskManager';
import Login from './components/Login';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setCategories([]);
    setTasks([]);
    setSelectedCategory(null);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories.php`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch tasks
  const fetchTasks = async (categoryId = null) => {
    try {
      setLoading(true);
      const url = categoryId 
        ? `${API_BASE_URL}/tasks.php?category_id=${categoryId}`
        : `${API_BASE_URL}/tasks.php`;
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCategories();
      fetchTasks();
    }
  }, [isLoggedIn]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchTasks(categoryId);
  };

  const handleCategoryChange = () => {
    fetchCategories();
    if (selectedCategory) {
      fetchTasks(selectedCategory);
    } else {
      fetchTasks();
    }
  };

  const handleTaskChange = () => {
    if (selectedCategory) {
      fetchTasks(selectedCategory);
    } else {
      fetchTasks();
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          <div>
            <h1>Task Management System</h1>
            <p>Organize your tasks efficiently</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '16px', opacity: 0.9 }}>
              Welcome, <strong>{username}</strong>
            </span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid white',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="App-container">
        <div className="sidebar">
          <CategoryManager
            categories={categories}
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
        
        <div className="main-content">
          <TaskManager
            tasks={tasks}
            categories={categories}
            selectedCategory={selectedCategory}
            onTaskChange={handleTaskChange}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
