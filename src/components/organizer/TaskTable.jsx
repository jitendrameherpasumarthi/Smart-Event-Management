import React from 'react';
import { FiEdit2, FiTrash2, FiClock, FiUser } from 'react-icons/fi';
import { getPriorityClass } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

const TaskTable = ({
  tasks,
  onEdit,
  onDelete
}) => {
  return (
    <div className="table-container">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task & Description</th>
              <th>Event</th>
              <th>Assigned Volunteer</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td style={{ minWidth: '220px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {task.description?.length > 70
                      ? `${task.description.substring(0, 70)}...`
                      : task.description}
                  </div>
                </td>

                <td style={{ whiteSpace: 'nowrap' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      backgroundColor: 'var(--primary-light)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {task.eventName}
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <FiUser style={{ color: 'var(--text-light)' }} />
                    <span style={{ fontWeight: 600 }}>{task.assignedVolunteerName || 'Unassigned'}</span>
                  </div>
                </td>

                <td>
                  <span className={`badge ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>

                <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiClock style={{ color: 'var(--text-light)' }} />
                    <span>{task.deadline}</span>
                  </div>
                </td>

                <td>
                  <StatusBadge status={task.status || 'Pending'} />
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(task)}
                        className="btn-icon btn-ghost"
                        title="Edit Task"
                      >
                        <FiEdit2 style={{ fontSize: '1rem', color: 'var(--primary)' }} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(task)}
                        className="btn-icon btn-ghost"
                        title="Delete Task"
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

export default TaskTable;
