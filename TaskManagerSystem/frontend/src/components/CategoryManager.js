import React, { useState } from 'react';
import axios from 'axios';
import './CategoryManager.css';

const API_BASE_URL = 'http://localhost:8000/api';

const CategoryManager = ({ categories, onCategoryChange, selectedCategory, onCategorySelect }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/categories.php`, {
        name: newCategoryName.trim()
      });
      setNewCategoryName('');
      setShowAddForm(false);
      onCategoryChange();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      await axios.put(`${API_BASE_URL}/categories.php`, {
        id: editingCategory.id,
        name: editName.trim()
      });
      setEditingCategory(null);
      setEditName('');
      onCategoryChange();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/categories.php`, {
        data: { id }
      });
      if (selectedCategory === id) {
        onCategorySelect(null);
      }
      onCategoryChange();
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response?.status === 400) {
        alert('Cannot delete category with existing tasks.');
      } else {
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
  };

  return (
    <div className="category-manager">
      <h2>Categories</h2>
      
      <div className="category-list">
        <button
          className="category-item all-tasks"
          onClick={() => onCategorySelect(null)}
          style={{
            backgroundColor: selectedCategory === null ? '#667eea' : '#f0f0f0',
            color: selectedCategory === null ? 'white' : '#333'
          }}
        >
          All Tasks
        </button>
        
        {categories.map(category => (
          <div key={category.id} className="category-item-wrapper">
            {editingCategory?.id === category.id ? (
              <form onSubmit={handleUpdateCategory} className="category-edit-form">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="category-edit-input"
                  autoFocus
                />
                <div className="category-edit-actions">
                  <button type="submit" className="btn-save">Save</button>
                  <button type="button" onClick={cancelEdit} className="btn-cancel">Cancel</button>
                </div>
              </form>
            ) : (
              <div
                className="category-item"
                onClick={() => onCategorySelect(category.id)}
                style={{
                  backgroundColor: selectedCategory === category.id ? '#667eea' : '#f0f0f0',
                  color: selectedCategory === category.id ? 'white' : '#333'
                }}
              >
                <span>{category.name}</span>
                <div className="category-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(category);
                    }}
                    className="btn-edit"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="btn-delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddCategory} className="category-add-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="category-input"
            autoFocus
          />
          <div className="category-form-actions">
            <button type="submit" className="btn-add">Add</button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName('');
              }}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-add-category"
        >
          + Add Category
        </button>
      )}
    </div>
  );
};

export default CategoryManager;

