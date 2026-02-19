import { useState } from 'react';
import './Login.css';

function Login({ onNavigate, onAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const doAuth = async () => {
      try {
        if (isSignUp) {
          // Register
          const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
          });
          const data = await res.json();
          if (res.ok) {
            setMessage('Registration successful — you are now signed in');
            // try to log in automatically
            const loginRes = await fetch('http://localhost:5000/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const user = await loginRes.json();
            if (loginRes.ok && onAuth) onAuth(user);
            setTimeout(() => {
              setMessage(null);
              onNavigate('home');
            }, 1000);
          } else {
            setError(data.message || JSON.stringify(data));
            setTimeout(() => setError(null), 4000);
          }
        } else {
          // Login
          const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, password: formData.password })
          });
          const user = await res.json();
          if (res.ok && onAuth) {
            setMessage('Login successful');
            onAuth(user);
            setTimeout(() => {
              setMessage(null);
              onNavigate('home');
            }, 900);
          } else {
            setError(user || 'Login failed');
            setTimeout(() => setError(null), 4000);
          }
        }
      } catch (err) {
        console.error('Auth error', err);
        setError('Authentication error');
        setTimeout(() => setError(null), 4000);
      }
    };

    doAuth();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="login-subtitle">
            {isSignUp 
              ? 'Join MindCare and start your wellness journey' 
              : 'Sign in to continue your mental wellness journey'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {message && (
            <div className="login-toast success" style={{background:'#d4edda',color:'#155724',padding:'10px',borderRadius:6,marginBottom:12}}>
              {message}
            </div>
          )}
          {error && (
            <div className="login-toast error" style={{background:'#fdecea',color:'#721c24',padding:'10px',borderRadius:6,marginBottom:12}}>
              {error}
            </div>
          )}
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {!isSignUp && (
            <div className="forgot-password">
              <button type="button" className="link-button">
                Forgot Password?
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="login-toggle">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button" 
              className="link-button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
          <p className="admin-login-link">
            <button 
              type="button" 
              className="link-button admin-link"
              onClick={() => onNavigate('admin-login')}
            >
              Admin Login →
            </button>
          </p>
        </div>

        <div className="login-footer">
          <p className="disclaimer">
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            This tool is for educational purposes only and is not a substitute for 
            professional mental health care.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
