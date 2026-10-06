import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiArrowRight } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

const EventRegistrationCard = ({
  registration,
  onCancelRegistration
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        borderLeft: '4px solid var(--primary)'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#f1f5f9',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)'
            }}
          >
            {registration.ticketNumber || `TKT-${registration.id}`}
          </span>
          <StatusBadge status={registration.status || 'Confirmed'} />
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-main)' }}>
          {registration.eventName}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCalendar style={{ color: 'var(--primary)' }} />
            <span>Registered: {formatDate(registration.registrationDate)}</span>
          </div>
          {registration.venue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiMapPin style={{ color: 'var(--primary)' }} />
              <span>{registration.venue}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', gap: '0.5rem' }}>
        <Link
          to={`/events/${registration.eventId}`}
          className="btn btn-outline btn-sm"
          style={{ flex: 1 }}
        >
          <span>View Event</span>
          <FiArrowRight />
        </Link>

        {registration.status !== 'Cancelled' && onCancelRegistration && (
          <button
            type="button"
            onClick={() => onCancelRegistration(registration)}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--danger)', fontSize: '0.8rem' }}
          >
            Cancel Pass
          </button>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationCard;
