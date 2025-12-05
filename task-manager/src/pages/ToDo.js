import './ToDo.css';
import { useState } from 'react';

export const ToDo = () => {
  // State for the text in the input box
  const [taskInput, setTaskInput] = useState('');

  const [tasks, setTasks] = useState([]);


  const [editingIndex, setEditingIndex] = useState(null);

  const [editingText, setEditingText] = useState('');

  const [showCompleted, setShowCompleted] = useState(false);

  // List of category names; start with "Uncategorized"
  const [categories, setCategories] = useState(['Uncategorized']);
  // Which category is currently being filtered
  const [selectedCategory, setSelectedCategory] = useState('All');


  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // For editing categories
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(null);
  const [categoryEditingName, setCategoryEditingName] = useState('');

  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const [sortMode, setSortMode] = useState('recent');

  const handleAddTask = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return; 
    const newTask = {
      text: trimmed,
      completed: false,
      category: 'Uncategorized',
      createdAt: Date.now(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleDeleteTask = (indexToRemove) => {
    setTasks((prevTasks) =>
      prevTasks.filter((_, index) => index !== indexToRemove)
    );

    // If we delete task that's being edited exit edit
    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const handleSaveEdit = () => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === editingIndex ? { ...task, text: trimmed } : task
      )
    );

    setEditingIndex(null);
    setEditingText('');
  };

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveEdit();
    } else if (event.key === 'Escape') {
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  // Toggle task between active and completed
  const handleToggleComplete = (indexToToggle) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === indexToToggle
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Change category of task
  const handleChangeCategory = (indexToChange, newCategory) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === indexToChange ? { ...task, category: newCategory } : task
      )
    );
  };

  // Toggle set of tasks viewing
  const toggleView = () => {
    setShowCompleted((prev) => !prev);
    setEditingIndex(null);
    setEditingText('');
  };

  const handleCategoryFilterChange = (event) => {
    setSelectedCategory(event.target.value);
    setEditingIndex(null);
    setEditingText('');
  };

  const handleSortChange = (event) => {
    setSortMode(event.target.value);
  };


  const handleAddCategoryClick = () => {
    setIsAddingCategory(true);
    setNewCategoryName('');
  };

  const handleConfirmAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setIsAddingCategory(false);
      setNewCategoryName('');
      return;
    }

    setCategories((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );

    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleNewCategoryKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleConfirmAddCategory();
    } else if (event.key === 'Escape') {
      handleCancelAddCategory();
    }
  };

  // Categories

  const handleStartCategoryEdit = (index) => {
    // Don't allow editing uncategorized
    if (categories[index] === 'Uncategorized') return;

    setCategoryEditingIndex(index);
    setCategoryEditingName(categories[index]);
  };

  const handleSaveCategoryEdit = () => {
    const trimmed = categoryEditingName.trim();
    if (!trimmed || categoryEditingIndex === null) {
      setCategoryEditingIndex(null);
      setCategoryEditingName('');
      return;
    }

    setCategories((prev) => {
      const oldName = prev[categoryEditingIndex];

      // If name didn't change exit
      if (oldName === trimmed) {
        return prev;
      }

      // Avoid duplicates
      if (prev.includes(trimmed)) {
        // If there's already a category with this name exit edit mode
        return prev;
      }

      const updated = prev.map((cat, idx) =>
        idx === categoryEditingIndex ? trimmed : cat
      );

      // Update tasks that used old category name
      setTasks((taskPrev) =>
        taskPrev.map((task) =>
          task.category === oldName ? { ...task, category: trimmed } : task
        )
      );

      // Update selectedCategory
      setSelectedCategory((sel) => (sel === oldName ? trimmed : sel));

      return updated;
    });

    setCategoryEditingIndex(null);
    setCategoryEditingName('');
  };

  const handleCancelCategoryEdit = () => {
    setCategoryEditingIndex(null);
    setCategoryEditingName('');
  };

  const handleCategoryEditKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveCategoryEdit();
    } else if (event.key === 'Escape') {
      handleCancelCategoryEdit();
    }
  };

  const handleDeleteCategory = (indexToRemove) => {
    const nameToRemove = categories[indexToRemove];

    // Don't allow deleting Uncategorized
    if (nameToRemove === 'Uncategorized') return;

    setCategories((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove)
    );

    // Reassign tasks using this category to uncategorized
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.category === nameToRemove
          ? { ...task, category: 'Uncategorized' }
          : task
      )
    );

    // If filtering by that category, reset to All
    setSelectedCategory((sel) =>
      sel === nameToRemove ? 'All' : sel
    );

    // If editing category, exit edit mode
    if (categoryEditingIndex === indexToRemove) {
      setCategoryEditingIndex(null);
      setCategoryEditingName('');
    }
  };

  // Visible tasks

  let visibleTasks = tasks
    .map((task, index) => ({ task, index }))
    .filter((item) => {
      const matchesCompleted = item.task.completed === showCompleted;
      const matchesCategory =
        selectedCategory === 'All' ||
        item.task.category === selectedCategory;

      return matchesCompleted && matchesCategory;
    });

  // Apply sorting
  if (sortMode === 'alpha') {
    visibleTasks = [...visibleTasks].sort((a, b) =>
      a.task.text.localeCompare(b.task.text)
    );
  } else if (sortMode === 'category') {
    visibleTasks = [...visibleTasks].sort((a, b) => {
      const catCompare = a.task.category.localeCompare(b.task.category);
      if (catCompare !== 0) return catCompare;
      return a.task.text.localeCompare(b.task.text);
    });
  } else if (sortMode === 'recent') {
    // Newest first
    visibleTasks = [...visibleTasks].sort(
      (a, b) => (b.task.createdAt || 0) - (a.task.createdAt || 0)
    );
  }

  const hasNoVisibleTasks = visibleTasks.length === 0;

  const viewTitle = showCompleted ? 'Completed Tasks' : 'Active Tasks';
  const emptyMessage = hasNoVisibleTasks
    ? showCompleted
      ? 'No completed tasks in this category.'
      : 'No active tasks in this category. Add one above!'
    : '';

  const toggleButtonLabel = showCompleted
    ? 'View Active Tasks'
    : 'View Completed Tasks';

  // Categories except "Uncategorized" for management list
  const customCategories = categories.filter(
    (cat) => cat !== 'Uncategorized'
  );

  return (
    <div className="background">
      <div className="scrollableDiv">
        <h1 className="todo-title">My Tasks</h1>
        <p className="todo-subtitle">
          Add tasks and manage what you need to get done.
        </p>

        {/* Task input row */}
        <div className="todo-input-row">
          <input
            className="todo-input"
            type="text"
            placeholder="Enter a new task"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="todo-add-button" onClick={handleAddTask}>
            Add
          </button>
        </div>


        <div className="todo-filter-row">
          <div className="todo-view-toggle">
            <button className="todo-toggle-button" onClick={toggleView}>
              {toggleButtonLabel}
            </button>
          </div>

          <div className="todo-category-filter">
            <label className="todo-category-label">Category:</label>
            <select
              className="todo-category-select"
              value={selectedCategory}
              onChange={handleCategoryFilterChange}
            >
              <option value="All">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              className="todo-add-category-button"
              onClick={handleAddCategoryClick}
              disabled={isAddingCategory}
            >
              + Add Category
            </button>

            {isAddingCategory && (
              <div className="todo-add-category-inline">
                <input
                  className="todo-add-category-input"
                  type="text"
                  placeholder="New category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={handleNewCategoryKeyDown}
                  autoFocus
                />
                <button
                  className="todo-save-button"
                  onClick={handleConfirmAddCategory}
                >
                  Save
                </button>
                <button
                  className="todo-cancel-button"
                  onClick={handleCancelAddCategory}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="todo-category-manage-toggle">
            <button
              className="todo-toggle-button"
              onClick={() =>
                setShowCategoryManager((prev) => !prev)
              }
            >
              {showCategoryManager
                ? 'Hide Categories'
                : 'Manage Categories'}
            </button>
          </div>
        </div>

        {showCategoryManager && (
          <div className="todo-category-manage">
            <h3 className="todo-category-manage-title">
              Manage Categories
            </h3>
            {customCategories.length === 0 ? (
              <p className="todo-empty">
                No custom categories yet. Add one above to get started.
              </p>
            ) : (
              <ul className="todo-category-list">
                {customCategories.map((cat) => {
                  const index = categories.indexOf(cat);
                  const isEditingCat = index === categoryEditingIndex;

                  return (
                    <li key={cat} className="todo-category-item">
                      {isEditingCat ? (
                        <>
                          <input
                            className="todo-add-category-input"
                            type="text"
                            value={categoryEditingName}
                            onChange={(e) =>
                              setCategoryEditingName(e.target.value)
                            }
                            onKeyDown={handleCategoryEditKeyDown}
                            autoFocus
                          />
                          <div className="todo-category-actions">
                            <button
                              className="todo-save-button"
                              onClick={handleSaveCategoryEdit}
                            >
                              Save
                            </button>
                            <button
                              className="todo-cancel-button"
                              onClick={handleCancelCategoryEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="todo-category-name">
                            {cat}
                          </span>
                          <div className="todo-category-actions">
                            <button
                              className="todo-edit-button"
                              onClick={() =>
                                handleStartCategoryEdit(index)
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="todo-delete-button"
                              onClick={() =>
                                handleDeleteCategory(index)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <div className="todo-section-header">
          <h2 className="todo-section-title">{viewTitle}</h2>
          <div className="todo-sort">
            <label className="todo-sort-label">Sort:</label>
            <select
              className="todo-sort-select"
              value={sortMode}
              onChange={handleSortChange}
            >
              <option value="recent">Recently added</option>
              <option value="alpha">Alphabetical</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        <ul className="todo-list">
          {hasNoVisibleTasks ? (
            <li className="todo-empty">{emptyMessage}</li>
          ) : (
            visibleTasks.map(({ task, index }) => {
              const isEditing = index === editingIndex;

              return (
                <li
                  key={index}
                  className={
                    'todo-item' +
                    (task.completed ? ' todo-item-completed' : '')
                  }
                >
                 
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(index)}
                  />

                  {isEditing ? (
                    <>
                      <input
                        className="todo-edit-input"
                        type="text"
                        value={editingText}
                        onChange={(e) =>
                          setEditingText(e.target.value)
                        }
                        onKeyDown={handleEditKeyDown}
                        autoFocus
                      />
                    </>
                  ) : (
                    <>
                      <span
                        className={
                          'todo-text' +
                          (task.completed ? ' todo-text-completed' : '')
                        }
                      >
                        {task.text}
                      </span>
                    </>
                  )}

                  
                  <select
                    className="todo-category-select-inline"
                    value={task.category}
                    onChange={(e) =>
                      handleChangeCategory(index, e.target.value)
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  
                  <div className="todo-actions">
                    {isEditing ? (
                      <>
                        <button
                          className="todo-save-button"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="todo-cancel-button"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="todo-edit-button"
                          onClick={() => handleStartEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="todo-delete-button"
                          onClick={() => handleDeleteTask(index)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};
