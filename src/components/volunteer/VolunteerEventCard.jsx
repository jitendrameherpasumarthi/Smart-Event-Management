import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiCheckSquare, FiArrowRight } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

const VolunteerEventCard = ({
  event,
  tasksCount = 0,
  completedCount = 0
}) => {
  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
        height: '100%'
      }}
    >
      <div style={{ position: 'relative', height: '150px', width: '100%', overflow: 'hidden' }}>
        <img
          src={event.banner}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span className="badge badge-info">{event.category}</span>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            Assigned Volunteer
          </span>
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiCalendar style={{ color: 'var(--primary)' }} />
            <span>{formatDate(event.date)} ({event.startTime})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiMapPin style={{ color: 'var(--primary)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</span>
          </div>
        </div>

        {/* Task progress for volunteer */}
        <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FiCheckSquare style={{ color: 'var(--primary)' }} /> Your Tasks Progress
            </span>
            <span style={{ fontWeight: 700 }}>{completedCount} / {tasksCount}</span>
          </div>
          <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: 'var(--primary)',
                width: `${tasksCount > 0 ? (completedCount / tasksCount) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="btn btn-outline btn-sm"
          style={{ width: '100%' }}
        >
          <span>View Full Event Info</span>
          <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default VolunteerEventCard;
