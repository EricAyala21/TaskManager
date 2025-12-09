import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/\d/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Username validation
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    // Password validation
    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (isSignUp) {
      // Sign up validation
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // "Sign up" successful - just pass the username to parent
      onLogin(username.trim());
    } else {
      // Login - just check password is entered
      if (!password) {
        setError('Please enter a password');
        return;
      }

      // "Login" - just pass the username to parent
      onLogin(username.trim());
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Task Management System</h1>
        <h2>{isSignUp ? 'Create Account' : 'Login'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "Password (min 6 chars, must contain number)" : "Enter your password"}
            />
            {isSignUp && (
              <small className="password-hint">
                Must be at least 6 characters and contain a number
              </small>
            )}
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="toggle-mode">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={toggleMode} className="link-button">
                Login here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={toggleMode} className="link-button">
                Sign up here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
