import React from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit2, FiTrash2, FiMapPin, FiCalendar, FiUsers } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

const EventTable = ({
  events,
  onDelete
}) => {
  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Details</th>
              <th>Category</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Participants</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td style={{ minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={event.banner}
                      alt={event.title}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {event.organizer}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {event.category}
                  </span>
                </td>

                <td style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formatDate(event.date)}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.startTime}</span>
                  </div>
                </td>

                <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                    <FiMapPin style={{ color: 'var(--text-light)' }} />
                    {event.venue}
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: '60px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700 }}>{event.registeredCount || 0}</span>
                        <span style={{ color: 'var(--text-light)' }}>/ {event.maxParticipants}</span>
                      </div>
                      <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: 'var(--primary)',
                            width: `${Math.min(100, Math.round(((event.registeredCount || 0) / (event.maxParticipants || 1)) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <StatusBadge status={event.status || 'Published'} />
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    <Link
                      to={`/events/${event.id}`}
                      className="btn-icon btn-ghost"
                      title="View Event Details"
                    >
                      <FiEye style={{ fontSize: '1rem' }} />
                    </Link>
                    <Link
                      to={`/organizer/events/edit/${event.id}`}
                      className="btn-icon btn-ghost"
                      title="Edit Event"
                    >
                      <FiEdit2 style={{ fontSize: '1rem', color: 'var(--primary)' }} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(event)}
                      className="btn-icon btn-ghost"
                      title="Delete Event"
                      style={{ color: 'var(--danger)' }}
                    >
                      <FiTrash2 style={{ fontSize: '1rem' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
