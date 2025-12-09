import React, { useState } from 'react';
import axios from 'axios';
import './TaskManager.css';

const API_BASE_URL = 'http://localhost:8000/api';

const TaskManager = ({ tasks, categories, selectedCategory, onTaskChange, loading }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: selectedCategory || ''
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      // Convert category_id: empty string or falsy becomes null, otherwise convert to integer
      const categoryId = formData.category_id && formData.category_id !== '' 
        ? parseInt(formData.category_id, 10) 
        : null;

      await axios.post(`${API_BASE_URL}/tasks.php`, {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category_id: categoryId
      });
      
      setFormData({ title: '', description: '', category_id: selectedCategory || '' });
      setShowAddForm(false);
      onTaskChange();
    } catch (error) {
      console.error('Error adding task:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      console.error('Error details:', error.response?.data);
      alert(`Error adding task: ${errorMessage}`);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      // Convert category_id: empty string or falsy becomes null, otherwise convert to integer
      const categoryId = formData.category_id && formData.category_id !== '' 
        ? parseInt(formData.category_id, 10) 
        : null;

      await axios.put(`${API_BASE_URL}/tasks.php`, {
        id: editingTask.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category_id: categoryId
      });
      setEditingTask(null);
      setFormData({ title: '', description: '', category_id: selectedCategory || '' });
      onTaskChange();
    } catch (error) {
      console.error('Error updating task:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      console.error('Error details:', error.response?.data);
      alert(`Error updating task: ${errorMessage}`);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/tasks.php`, {
        data: { id }
      });
      onTaskChange();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. Please try again.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks.php`, {
        id: task.id,
        is_completed: !task.is_completed
      });
      onTaskChange();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task. Please try again.');
    }
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      category_id: task.category_id || ''
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', category_id: selectedCategory || '' });
    setShowAddForm(false);
  };

  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.category_id === parseInt(selectedCategory, 10))
    : tasks;

  return (
    <div className="task-manager">
      <div className="task-header">
        <h2>
          {selectedCategory
            ? `Tasks - ${categories.find(c => c.id === parseInt(selectedCategory, 10))?.name || 'Unknown'}`
            : 'All Tasks'}
        </h2>
        {!showAddForm && !editingTask && (
          <button onClick={() => setShowAddForm(true)} className="btn-add-task">
            + Add Task
          </button>
        )}
      </div>

      {(showAddForm || editingTask) && (
        <form
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          className="task-form"
        >
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Task title *"
            className="task-input"
            required
            autoFocus
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description (optional)"
            className="task-textarea"
            rows="3"
          />
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="task-select"
          >
            <option value="">No Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="task-form-actions">
            <button type="submit" className="btn-save">
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            <button type="button" onClick={cancelEdit} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className={`task-item ${task.is_completed ? 'completed' : ''}`}
            >
              <div className="task-content">
                <div className="task-checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() => handleToggleComplete(task)}
                    className="task-checkbox"
                  />
                  <div className="task-info">
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    <div className="task-meta">
                      {task.category_name && (
                        <span className="task-category">{task.category_name}</span>
                      )}
                      <span className="task-date">
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => startEdit(task)}
                    className="btn-edit-task"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-delete-task"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManager;

