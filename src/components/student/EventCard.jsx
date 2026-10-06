import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

const EventCard = ({
  event,
  isRegistered = false,
  onRegisterClick
}) => {
  const getCategoryBadgeClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('tech') || cat.includes('hackathon')) return 'badge-info';
    if (cat.includes('cultural')) return 'badge-warning';
    if (cat.includes('sport')) return 'badge-success';
    return 'badge-neutral';
  };

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
      {/* Event Banner */}
      <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
        <img
          src={event.banner}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap'
          }}
        >
          <span className={`badge ${getCategoryBadgeClass(event.category)}`} style={{ backdropFilter: 'blur(4px)' }}>
            {event.category}
          </span>
          {event.status && (
            <StatusBadge status={event.status} />
          )}
        </div>

        {isRegistered && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            Registered
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: 'var(--text-main)',
            lineHeight: 1.3
          }}
        >
          {event.title}
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            lineHeight: 1.5,
            flex: 1
          }}
        >
          {event.description?.length > 90
            ? `${event.description.substring(0, 90)}...`
            : event.description}
        </p>

        {/* Metadata grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCalendar style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>{formatDate(event.date)}</span>
            {event.startTime && (
              <>
                <span style={{ color: 'var(--border-color)' }}>•</span>
                <FiClock style={{ color: 'var(--text-light)', flexShrink: 0 }} />
                <span>{event.startTime}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiMapPin style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.venue}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiUsers style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>
              <strong>{event.registeredCount || 0}</strong> / {event.maxParticipants} Registered
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to={`/events/${event.id}`}
            className="btn btn-outline"
            style={{ flex: 1, fontSize: '0.82rem' }}
          >
            <span>View Details</span>
            <FiArrowRight style={{ fontSize: '0.9rem' }} />
          </Link>

          {!isRegistered && onRegisterClick && (
            <button
              type="button"
              onClick={() => onRegisterClick(event)}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.4rem 0.85rem' }}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
