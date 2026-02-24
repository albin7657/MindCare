import { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLogin, onNavigate }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.username, password: credentials.password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role === 'admin') {
          onLogin(data);
        } else {
          setError('Access denied: Unauthorized role');
        }
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-header">
          <div className="admin-badge">Admin Access</div>
          <h1 className="admin-title">MindCare Admin Portal</h1>
          <p className="admin-subtitle">
            Secure login for authorized administrators only
          </p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Enter admin username"
              value={credentials.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Access Admin Dashboard
          </button>
        </form>

        <div className="admin-footer">
          <button
            type="button"
            className="link-button"
            onClick={() => onNavigate('login')}
          >
            ← Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
}



export default AdminLogin;
