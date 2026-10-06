import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = "No items found",
  description = "Try adjusting your search or filters to find what you are looking for.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-box">
        <Icon />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
