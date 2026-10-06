import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiXCircle, FiCalendar, FiCompass, FiDownload, FiCheck } from 'react-icons/fi';
import { mockParticipants, mockUsers } from '../../data/mockData';
import { getRegistrations, cancelRegistration } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState(mockParticipants.filter((p) => p.email === mockUsers.student.email));
  const [selectedToCancel, setSelectedToCancel] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getRegistrations().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setRegistrations(data);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenCancel = (reg) => {
    setSelectedToCancel(reg);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedToCancel) {
      try {
        await cancelRegistration(selectedToCancel._id || selectedToCancel.id);
        setRegistrations(
          registrations.map((r) =>
            (r._id === selectedToCancel._id || r.id === selectedToCancel.id)
              ? { ...r, status: 'Cancelled' }
              : r
          )
        );
      } catch (err) {
        console.warn('Cancellation fallback:', err);
        setRegistrations(
          registrations.map((r) =>
            (r.id === selectedToCancel.id) ? { ...r, status: 'Cancelled' } : r
          )
        );
      }
    }
    setIsConfirmOpen(false);
    setSelectedToCancel(null);
  };

  return (
    <div>
      <PageHeader
        title="My Event Registrations & Passes"
        subtitle="Manage your confirmed registration tickets, check-in QR credentials, and pass statuses."
      >
        <Link to="/events" className="btn btn-primary">
          <FiCompass />
          <span>New Registration</span>
        </Link>
      </PageHeader>

      {registrations.length > 0 ? (
        <div className="table-container">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Pass / Ticket No</th>
                  <th>Registered On</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id || reg.id || reg.ticketNumber}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {reg.eventName || reg.event?.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          {reg.department || 'Computer Science'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          backgroundColor: '#f1f5f9',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem'
                        }}
                      >
                        {reg.ticketNumber}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {formatDate(reg.registrationDate || reg.createdAt)}
                    </td>
                    <td>
                      <StatusBadge status={reg.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <Link
                          to={`/events/${reg.event?.customId || reg.event?._id || reg.eventId || 'evt-101'}`}
                          className="btn-ghost btn-icon"
                          title="View Event Details"
                          style={{ display: 'inline-flex' }}
                        >
                          <FiEye />
                        </Link>

                        {reg.status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancel(reg)}
                            className="btn-ghost btn-icon"
                            style={{ color: 'var(--danger)', display: 'inline-flex' }}
                            title="Cancel Registration"
                          >
                            <FiXCircle />
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
      ) : (
        <EmptyState
          icon={FiCalendar}
          title="No registrations found"
          description="You haven't registered for any events yet. Check out the event catalog to reserve your seats."
          actionLabel="Browse Events"
          onAction={() => {}}
        />
      )}

      {/* Confirmation Modal for Seat Cancellation */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Registration?"
        message={`Are you sure you want to cancel your pass #${selectedToCancel?.ticketNumber} for ${selectedToCancel?.eventName || selectedToCancel?.event?.title}? Your seat will be released.`}
        confirmText="Yes, Cancel Pass"
        confirmVariant="danger"
      />
    </div>
  );
};

export default MyRegistrations;
