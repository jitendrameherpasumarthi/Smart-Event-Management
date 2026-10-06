import React from 'react';
import { FiCheck, FiTrash2, FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

const ParticipantTable = ({
  participants,
  onApprove,
  onRemove
}) => {
  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Dept & Year</th>
              <th>Event Registered</th>
              <th>Registration Date</th>
              <th>Ticket No</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => {
              const displayName = p.name || p.studentName || 'Student';
              const displayEmail = p.email || p.studentEmail || 'student@college.edu';
              const displayDept = p.department || p.studentDepartment || 'General';
              const displayYear = p.year || p.studentYear || '2026';
              const displayEvent = p.eventName || p.event?.title || p.title || 'Campus Event';
              const displayDate = p.registrationDate || p.createdAt || new Date();
              const displayTicket = p.ticketNumber || p.ticketCode || `TKT-${(p._id || p.id || '001').toString().slice(-6).toUpperCase()}`;

              return (
                <tr key={p.id || p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: '#eff6ff',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        {displayName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                          {displayName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {displayEmail}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{displayDept}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{displayYear}</div>
                  </td>

                  <td style={{ maxWidth: '200px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>
                      {displayEvent}
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                    {formatDate(displayDate)}
                  </td>

                  <td>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      {displayTicket}
                    </span>
                  </td>

                  <td>
                    <StatusBadge status={p.status || 'Confirmed'} />
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      {p.status === 'Pending' && onApprove && (
                        <button
                          type="button"
                          onClick={() => onApprove(p)}
                          className="btn-icon btn-ghost"
                          title="Approve Registration"
                          style={{ color: 'var(--success)' }}
                        >
                          <FiCheck style={{ fontSize: '1.1rem' }} />
                        </button>
                      )}
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(p)}
                          className="btn-icon btn-ghost"
                          title="Remove Participant"
                          style={{ color: 'var(--danger)' }}
                        >
                          <FiTrash2 style={{ fontSize: '1rem' }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantTable;
