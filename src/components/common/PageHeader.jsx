import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  children,
  badge
}) => {
  return (
    <div className="page-header">
      <div className="page-header-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h1>{title}</h1>
          {badge && <span className="badge badge-info">{badge}</span>}
        </div>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && (
        <div className="page-header-actions">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
