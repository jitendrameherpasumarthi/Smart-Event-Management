import React from 'react';
import { FiBell, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import { formatDate, getPriorityClass } from '../../utils/helpers';

const AnnouncementCard = ({ announcement }) => {
  const priorityClass = getPriorityClass(announcement.priority);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        borderLeft: announcement.priority === 'Urgent'
          ? '4px solid #ef4444'
          : announcement.priority === 'Important'
          ? '4px solid #f59e0b'
          : '4px solid #3b82f6'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`badge ${priorityClass}`} style={{ fontSize: '0.72rem' }}>
            {announcement.priority}
          </span>
          {announcement.eventName && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {announcement.eventName}
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FiCalendar /> {formatDate(announcement.date)}
        </span>
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
        {announcement.title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {announcement.message}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-light)',
          paddingTop: '0.65rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: '0.25rem'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FiUser /> {announcement.postedBy}
        </span>
        {announcement.audience && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FiTag /> Audience: <strong>{announcement.audience}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;
