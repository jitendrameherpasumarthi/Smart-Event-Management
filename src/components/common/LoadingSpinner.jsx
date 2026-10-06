import React from 'react';

const LoadingSpinner = ({ message = "Loading data..." }) => {
  return (
    <div className="spinner-wrapper" style={{ flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
