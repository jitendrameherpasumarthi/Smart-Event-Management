import React from 'react';
import { FiClock, FiCalendar, FiCheckCircle, FiPlay, FiAlertCircle } from 'react-icons/fi';
import { getPriorityClass } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

const VolunteerTaskCard = ({
  task,
  onStatusChange
}) => {
  const isPending = task.status === 'Pending';
  const isInProgress = task.status === 'In Progress';
  const isCompleted = task.status === 'Completed';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        borderLeft: isCompleted
          ? '4px solid var(--success)'
          : isInProgress
          ? '4px solid var(--info)'
          : '4px solid var(--warning)'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className={`badge ${getPriorityClass(task.priority)}`}>
            {task.priority} Priority
          </span>
          <StatusBadge status={task.status} />
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
          {task.title}
        </h3>

        <div style={{ display: 'inline-block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
          {task.eventName}
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {task.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          <FiClock style={{ color: 'var(--primary)' }} />
          <span>Deadline: <strong>{task.deadline}</strong></span>
        </div>
      </div>

      <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
        {isPending && (
          <button
            type="button"
            onClick={() => onStatusChange(task.id, 'In Progress')}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <FiPlay />
            <span>Start Task</span>
          </button>
        )}

        {isInProgress && (
          <button
            type="button"
            onClick={() => onStatusChange(task.id, 'Completed')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', backgroundColor: 'var(--success)' }}
          >
            <FiCheckCircle />
            <span>Mark Completed</span>
          </button>
        )}

        {isCompleted && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: 'var(--success)',
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '0.35rem 0'
            }}
          >
            <FiCheckCircle />
            <span>Task Done!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerTaskCard;
