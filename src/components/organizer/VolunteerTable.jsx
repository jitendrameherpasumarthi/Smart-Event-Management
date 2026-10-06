import React from 'react';
import { FiCheck, FiX, FiPlusCircle, FiCheckSquare } from 'react-icons/fi';
import StatusBadge from '../common/StatusBadge';

const VolunteerTable = ({
  volunteers,
  onApprove,
  onReject,
  onAssignTask
}) => {
  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Dept & Year</th>
              <th>Assigned Events</th>
              <th>Tasks Load</th>
              <th>Availability</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((vol) => (
              <tr key={vol.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#f5f3ff',
                        color: 'var(--secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {vol.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                        {vol.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {vol.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{vol.department}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vol.year}</div>
                </td>

                <td style={{ maxWidth: '200px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {vol.assignedEvents?.length > 0 ? (
                      vol.assignedEvents.map((evtName, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            backgroundColor: '#eff6ff',
                            color: 'var(--primary)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          {evtName}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>None assigned</span>
                    )}
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <FiCheckSquare style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 700 }}>{vol.completedTasksCount || 0}</span>
                    <span style={{ color: 'var(--text-light)' }}>/ {vol.assignedTasksCount || 0} Done</span>
                  </div>
                </td>

                <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '160px' }}>
                  {vol.availability}
                </td>

                <td>
                  <StatusBadge status={vol.status || 'Active'} />
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    {vol.status === 'Pending' && onApprove && (
                      <button
                        type="button"
                        onClick={() => onApprove(vol)}
                        className="btn-icon btn-ghost"
                        title="Approve Volunteer"
                        style={{ color: 'var(--success)' }}
                      >
                        <FiCheck style={{ fontSize: '1.1rem' }} />
                      </button>
                    )}
                    {vol.status === 'Pending' && onReject && (
                      <button
                        type="button"
                        onClick={() => onReject(vol)}
                        className="btn-icon btn-ghost"
                        title="Reject Volunteer"
                        style={{ color: 'var(--danger)' }}
                      >
                        <FiX style={{ fontSize: '1.1rem' }} />
                      </button>
                    )}
                    {onAssignTask && (
                      <button
                        type="button"
                        onClick={() => onAssignTask(vol)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        <FiPlusCircle />
                        <span>Assign Task</span>
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

export default VolunteerTable;
