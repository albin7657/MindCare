import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Login.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

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
        const fetchOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        };

        if (isSignUp) {
          // Register
          const res = await fetch('http://localhost:5000/api/auth/register', {
            ...fetchOptions,
            body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
          });

          let data;
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await res.json();
          } else {
            data = { message: await res.text() };
          }

          if (res.ok) {
            setMessage('Registration successful — you are now signed in');
            // try to log in automatically
            const loginRes = await fetch('http://localhost:5000/api/auth/login', {
              ...fetchOptions,
              body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            let userData;
            const loginContentType = loginRes.headers.get("content-type");
            if (loginContentType && loginContentType.indexOf("application/json") !== -1) {
              userData = await loginRes.json();
            } else {
              userData = { message: await loginRes.text() };
            }

            if (loginRes.ok && onAuth) onAuth(userData);
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
            ...fetchOptions,
            body: JSON.stringify({ email: formData.email, password: formData.password })
          });

          let data;
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await res.json();
          } else {
            data = { message: await res.text() };
          }

          if (res.ok && onAuth) {
            setMessage('Login successful');
            onAuth(data);
            setTimeout(() => {
              setMessage(null);
              onNavigate('home');
            }, 900);
          } else {
            setError(data.message || 'Login failed');
            setTimeout(() => setError(null), 4000);
          }
        }
      } catch (err) {
        console.error('Auth error', err);
        setError('Authentication error: ' + (err.message || 'Unknown error'));
        setTimeout(() => setError(null), 4000);
      }
    };

    doAuth();
  };

  return (
    <motion.div className="login-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
      <motion.div className="login-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55, ease: 'easeOut' }}>
        <motion.div className="login-header" variants={fadeInUp} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <motion.h1 className="login-title" key={`title-${isSignUp ? 'signup' : 'signin'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'easeOut' }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</motion.h1>
          <motion.p className="login-subtitle" key={`subtitle-${isSignUp ? 'signup' : 'signin'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            {isSignUp
              ? 'Join MindCare and start your wellness journey'
              : 'Sign in to continue your mental wellness journey'}
          </motion.p>
        </motion.div>

        <motion.form className="login-form" onSubmit={handleSubmit} variants={fadeInUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
          {message && (
            <div className="login-toast success" style={{ background: '#d4edda', color: '#155724', padding: '10px', borderRadius: 6, marginBottom: 12 }}>
              {message}
            </div>
          )}
          {error && (
            <div className="login-toast error" style={{ background: '#fdecea', color: '#721c24', padding: '10px', borderRadius: 6, marginBottom: 12 }}>
              {error}
            </div>
          )}
          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                key="signup-name"
                className="form-group"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div className="form-group" variants={fadeInUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
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
          </motion.div>

          <motion.div className="form-group" variants={fadeInUp} transition={{ duration: 0.4, ease: 'easeOut' }}>
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
          </motion.div>

          <AnimatePresence mode="wait">
            {isSignUp && (
              <motion.div
                key="signup-confirm"
                className="form-group"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {!isSignUp && (
            <motion.div className="forgot-password" variants={fadeInUp} transition={{ duration: 0.35, ease: 'easeOut' }}>
              <button type="button" className="link-button">
                Forgot Password?
              </button>
            </motion.div>
          )}

          <motion.button type="submit" className="btn btn-primary btn-full" variants={fadeInUp} whileHover={{ y: -2, scale: 1.01 }} transition={{ duration: 0.2 }}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </motion.button>
        </motion.form>

        <motion.div className="login-divider" variants={fadeInUp} transition={{ duration: 0.35, ease: 'easeOut' }}>
          <span>or</span>
        </motion.div>

        <motion.div className="login-toggle" variants={fadeInUp} transition={{ duration: 0.35, ease: 'easeOut' }}>
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
        </motion.div>

        <motion.div className="login-footer" variants={fadeInUp} transition={{ duration: 0.35, ease: 'easeOut' }}>
          <p className="disclaimer">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            This tool is for educational purposes only and is not a substitute for
            professional mental health care.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
