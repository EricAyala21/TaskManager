import './ToDo.css';
import { useState } from 'react';

export const ToDo = () => {
  // State for  text in input
  const [taskInput, setTaskInput] = useState('');
  // State for list of tasks
  const [tasks, setTasks] = useState([]);

  // Which task is being edit
  const [editingIndex, setEditingIndex] = useState(null);
  // Temp text while editing
  const [editingText, setEditingText] = useState('');

  const handleAddTask = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    setTasks((prevTasks) => [...prevTasks, trimmed]);
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

    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index]);
  };

  const handleSaveEdit = () => {
    const trimmed = editingText.trim();
    if (!trimmed) return;

    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === editingIndex ? trimmed : task
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

  return (
    <div className="background">
      <div className="scrollableDiv">
        <h1 className="todo-title">My Tasks</h1>
        <p className="todo-subtitle">
          Add tasks and manage what you need to get done.
        </p>

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

        <ul className="todo-list">
          {tasks.length === 0 ? (
            <li className="todo-empty">No tasks yet. Add one above!</li>
          ) : (
            tasks.map((task, index) => {
              const isEditing = index === editingIndex;

              return (
                <li key={index} className="todo-item">
                  {isEditing ? (
                    <>
                      <input
                        className="todo-edit-input"
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        autoFocus
                      />
                      <div className="todo-actions">
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
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="todo-text">{task}</span>
                      <div className="todo-actions">
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
                          ✕
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};
