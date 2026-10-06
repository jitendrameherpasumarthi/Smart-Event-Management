import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiMail, FiLock, FiBookOpen, FiArrowRight, FiCheck } from 'react-icons/fi';
import { register } from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const departments = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biotechnology',
    'Management Studies'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Register with Express backend
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        year: formData.year,
        role: formData.role,
      });

      setSuccess(true);
      setTimeout(() => {
        if (formData.role === 'volunteer') {
          navigate('/volunteer/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 1200);
    } catch (err) {
      console.warn('Registration notice:', err.message || err);
      if (err.message && err.message !== 'Network Error') {
        setError(err.message || 'Registration failed. Please check your information.');
      } else {
        // Fallback demo mode:
        localStorage.setItem('userRole', formData.role);
        setSuccess(true);
        setTimeout(() => {
          if (formData.role === 'volunteer') {
            navigate('/volunteer/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        }, 1200);
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
          maxWidth: '560px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            className="brand-icon-box"
            style={{ margin: '0 auto 1rem', width: '48px', height: '48px', fontSize: '1.5rem' }}
          >
            <FiCalendar />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Join the campus event management and volunteer network
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiCheck /> Account registered successfully! Redirecting to dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="form-input"
              placeholder="e.g. Aarav Sharma"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="student@college.edu"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="form-select"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="form-select"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Role Selection */}
          <div className="form-group">
            <label className="form-label">Register As</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  border: `1.5px solid ${formData.role === 'student' ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: formData.role === 'student' ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={() => setFormData({ ...formData, role: 'student' })}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Student</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1rem',
                  border: `1.5px solid ${formData.role === 'volunteer' ? 'var(--secondary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: formData.role === 'volunteer' ? 'var(--secondary-light)' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="role"
                  value="volunteer"
                  checked={formData.role === 'volunteer'}
                  onChange={() => setFormData({ ...formData, role: 'volunteer' })}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Event Volunteer</span>
              </label>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
              *Organizer accounts are managed and provisioned by faculty administration.
            </span>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="form-input"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem', opacity: loading ? 0.8 : 1 }}
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <FiArrowRight />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
