import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiCalendar, FiFilter, FiCheck, FiTrash2 } from 'react-icons/fi';
import { mockEvents } from '../../data/mockData';
import { getEvents, deleteEvent } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import EventTable from '../../components/organizer/EventTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';

const ManageEvents = () => {
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    getEvents().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setEvents(data);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Hackathon', 'Seminar'];
  const statuses = ['All', 'Published', 'Draft', 'Completed'];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchQuery =
        (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.venue || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.organizer || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' || (e.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const matchStatus =
        selectedStatus === 'All' || (e.status && (e.status || '').toLowerCase() === selectedStatus.toLowerCase());

      return matchQuery && matchCategory && matchStatus;
    });
  }, [events, searchQuery, selectedCategory, selectedStatus]);

  const handleDeleteRequest = (event) => {
    setSelectedToDelete(event);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedToDelete) {
      try {
        await deleteEvent(selectedToDelete._id || selectedToDelete.id);
        setEvents(events.filter((e) => (e._id !== selectedToDelete._id && e.id !== selectedToDelete.id)));
      } catch {
        setEvents(events.filter((e) => e.id !== selectedToDelete.id));
      }
      setAlertMsg(`Event "${selectedToDelete.title}" was deleted successfully.`);
      setTimeout(() => setAlertMsg(''), 3000);
    }
    setIsConfirmOpen(false);
    setSelectedToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Manage Campus Events"
        subtitle="Create, configure, publish, and oversee all institutional symposiums, workshops, and fests."
      >
        <Link to="/organizer/events/create" className="btn btn-primary">
          <FiPlus />
          <span>Create Event</span>
        </Link>
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
          placeholder="Search by event title, venue, or coordinator..."
        />

        <div className="filter-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
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

      {filteredEvents.length > 0 ? (
        <EventTable
          events={filteredEvents}
          onDelete={handleDeleteRequest}
        />
      ) : (
        <EmptyState
          icon={FiCalendar}
          title="No events found"
          description="No events matched your current search filters. Create a new event or clear filters."
          actionLabel="Create Event"
          onAction={() => {}}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Event?"
        message={`Are you sure you want to delete "${selectedToDelete?.title}"? All associated volunteer tasks, participant passes, and schedules will be deleted.`}
        confirmLabel="Delete Event"
        cancelLabel="Keep Event"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default ManageEvents;
