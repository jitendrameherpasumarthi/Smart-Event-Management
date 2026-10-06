import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiHome, FiCompass } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          marginBottom: '1.5rem'
        }}
      >
        <FiAlertOctagon />
      </div>

      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: '460px', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          <FiHome />
          <span>Back to Home</span>
        </Link>
        <Link to="/events" className="btn btn-outline">
          <FiCompass />
          <span>Explore Events</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
