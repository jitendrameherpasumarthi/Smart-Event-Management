import React from 'react';
import { FiTrash2, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const ScheduleTable = ({
  schedules,
  onDelete
}) => {
  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Activity & Description</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Venue</th>
              <th>Coordinator</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item) => (
              <tr key={item.id}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      backgroundColor: 'var(--primary-light)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {item.eventName}
                  </span>
                </td>

                <td style={{ minWidth: '200px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem', marginBottom: '0.15rem' }}>
                    {item.activity}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {item.description}
                    </div>
                  )}
                </td>

                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  {formatDate(item.date)}
                </td>

                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiClock style={{ color: 'var(--text-light)' }} />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                </td>

                <td style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                    <FiMapPin style={{ color: 'var(--text-light)' }} />
                    <span>{item.venue}</span>
                  </div>
                </td>

                <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiUser style={{ color: 'var(--text-light)' }} />
                    <span>{item.coordinator}</span>
                  </div>
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="btn-icon btn-ghost"
                        title="Delete Schedule"
                        style={{ color: 'var(--danger)' }}
                      >
                        <FiTrash2 style={{ fontSize: '1rem' }} />
                      </button>
                    )}
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

export default ScheduleTable;
