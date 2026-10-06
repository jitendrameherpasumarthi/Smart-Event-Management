import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiMail, FiLock, FiUserCheck, FiInfo, FiArrowRight, FiLoader } from 'react-icons/fi';
import { mockUsers } from '../../data/mockData';
import { login } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('aarav.sharma@college.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail(mockUsers.student.email);
    } else if (role === 'organizer') {
      setEmail(mockUsers.organizer.email);
    } else if (role === 'volunteer') {
      setEmail(mockUsers.volunteer.email);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      // Authenticate against Express Backend
      const data = await login(email, password);
      const userRole = data.user?.role || selectedRole;

      if (userRole === 'organizer') {
        navigate('/organizer/dashboard');
      } else if (userRole === 'volunteer') {
        navigate('/volunteer/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      // Fallback demo login if network error or fallback
      console.warn('Backend login notice:', err.message || err);
      if (err.message && err.message !== 'Network Error' && !err.message.includes('timeout')) {
        setError(err.message || 'Invalid email or password.');
      } else {
        // In offline fallback mode:
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('user', JSON.stringify(mockUsers[selectedRole] || mockUsers.student));
        if (selectedRole === 'organizer') {
          navigate('/organizer/dashboard');
        } else if (selectedRole === 'volunteer') {
          navigate('/volunteer/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 76px - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--bg-main)'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            className="brand-icon-box"
            style={{ margin: '0 auto 1rem', width: '48px', height: '48px', fontSize: '1.5rem' }}
          >
            <FiCalendar />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Welcome to EventHub
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Sign in to access your college event workspace
          </p>
        </div>

        {/* Demo Mode Alert */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.8rem',
            color: '#1e40af'
          }}
        >
          <FiInfo style={{ fontSize: '1.25rem', flexShrink: 0 }} />
          <span>
            <strong>Connected Backend:</strong> Choose a demo role below to load credentials or enter your account.
          </span>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>
            Select Demo Account
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              backgroundColor: '#f1f5f9',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {['student', 'organizer', 'volunteer'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                style={{
                  padding: '0.5rem 0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: selectedRole === role ? 700 : 500,
                  backgroundColor: selectedRole === role ? '#ffffff' : 'transparent',
                  color: selectedRole === role ? 'var(--primary)' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: selectedRole === role ? 'var(--shadow-xs)' : 'none',
                  textTransform: 'capitalize',
                  transition: 'var(--transition)'
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {error && (
            <div className="error-text" style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-sm)' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">College Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@college.edu"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Password</span>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('For demo accounts, use password: password123');
                }}
                style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem', opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
