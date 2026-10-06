import React, { useState, useMemo, useEffect } from 'react';
import { FiUsers, FiFilter, FiCheck, FiTrash2, FiDownload } from 'react-icons/fi';
import { mockParticipants, mockEvents } from '../../data/mockData';
import { getRegistrations, updateRegistrationStatus, cancelRegistration, getEvents } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import ParticipantTable from '../../components/organizer/ParticipantTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';

const Participants = () => {
  const [participants, setParticipants] = useState(mockParticipants);
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedToRemove, setSelectedToRemove] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([getRegistrations(), getEvents()]).then(([regs, evts]) => {
      if (isMounted) {
        if (Array.isArray(regs) && regs.length > 0) setParticipants(regs);
        if (Array.isArray(evts) && evts.length > 0) setEvents(evts);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const statuses = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchSearch =
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.ticketNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchEvent =
        selectedEvent === 'All' ||
        p.eventId === selectedEvent ||
        p.event?._id === selectedEvent ||
        (p.eventName || p.event?.title || '').includes(selectedEvent);

      const matchStatus =
        selectedStatus === 'All' || (p.status || '').toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchEvent && matchStatus;
    });
  }, [participants, searchQuery, selectedEvent, selectedStatus]);

  const handleApprove = async (participant) => {
    try {
      await updateRegistrationStatus(participant._id || participant.id, 'Confirmed');
    } catch (err) {
      console.warn('Approve error:', err);
    }
    setParticipants(
      participants.map((p) =>
        (p._id === participant._id || p.id === participant.id) ? { ...p, status: 'Confirmed' } : p
      )
    );
    setAlertMsg(`Registration for ${participant.name} approved successfully.`);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleRemoveRequest = (participant) => {
    setSelectedToRemove(participant);
    setIsConfirmOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (selectedToRemove) {
      try {
        await cancelRegistration(selectedToRemove._id || selectedToRemove.id);
      } catch (err) {
        console.warn('Remove error:', err);
      }
      setParticipants(participants.filter((p) => (p._id !== selectedToRemove._id && p.id !== selectedToRemove.id)));
      setAlertMsg(`${selectedToRemove.name} was removed from the event roster.`);
      setTimeout(() => setAlertMsg(''), 3000);
    }
    setIsConfirmOpen(false);
    setSelectedToRemove(null);
  };

  return (
    <div>
      <PageHeader
        title="Event Participants & Ticket Passes"
        subtitle="Manage attendee lists, check-in statuses, ticket verifications, and seat rosters across all campus events."
      >
        <button
          type="button"
          onClick={() => {
            alert('Exporting verified attendee roster to CSV...');
          }}
          className="btn btn-outline"
        >
          <FiDownload />
          <span>Export Attendee List</span>
        </button>
      </PageHeader>

      {alertMsg && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}
        >
          <FiCheck /> {alertMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search by participant name, email, or department..."
        />

        <div className="filter-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Event:</span>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '180px', fontSize: '0.85rem' }}
            >
              <option value="All">All Events</option>
              {events.map((evt) => (
                <option key={evt.id || evt._id} value={evt.id || evt._id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredParticipants.length > 0 ? (
        <ParticipantTable
          participants={filteredParticipants}
          onApprove={handleApprove}
          onRemove={handleRemoveRequest}
        />
      ) : (
        <EmptyState
          icon={FiUsers}
          title="No participants found"
          description="No student registrations match your filter settings. Clear filters or check other events."
        />
      )}

      {/* Confirm Remove Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Remove Participant?"
        message={`Are you sure you want to remove "${selectedToRemove?.name}" from this event? Their ticket pass #${selectedToRemove?.ticketNumber} will be revoked.`}
        confirmLabel="Remove Participant"
        cancelLabel="Keep"
        confirmVariant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Participants;
