import React, { useState, useEffect } from 'react';
import { FiBell, FiPlus, FiTrash2, FiEdit2, FiTag, FiClock, FiCheck } from 'react-icons/fi';
import { mockAnnouncements, mockEvents } from '../../data/mockData';
import { getAnnouncements, createAnnouncement, deleteAnnouncement, getEvents } from '../../services/api';
import { formatDate, getPriorityClass } from '../../utils/helpers';
import PageHeader from '../../components/common/PageHeader';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [events, setEvents] = useState(mockEvents);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    eventId: mockEvents[0]?.id || '',
    priority: 'Normal',
    audience: 'All Participants'
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([getAnnouncements(), getEvents()]).then(([annData, evtData]) => {
      if (isMounted) {
        if (Array.isArray(annData) && annData.length > 0) setAnnouncements(annData);
        if (Array.isArray(evtData) && evtData.length > 0) {
          setEvents(evtData);
          if (evtData[0]) {
            setFormData((prev) => ({ ...prev, eventId: evtData[0].id || evtData[0]._id }));
          }
        }
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    const eventObj = events.find((evt) => (evt.id === formData.eventId || evt._id === formData.eventId));

    const payload = {
      title: formData.title,
      message: formData.message,
      eventId: formData.eventId,
      eventName: eventObj ? (eventObj.title.split(':')[0] || eventObj.title) : 'General Campus',
      postedBy: 'Dr. Rajesh Verma (Lead Organizer)',
      priority: formData.priority,
      audience: formData.audience
    };

    try {
      const res = await createAnnouncement(payload);
      const created = res.data || { id: `ann-${Date.now()}`, ...payload };
      setAnnouncements([created, ...announcements]);
    } catch {
      const newAnnouncement = {
        id: `ann-${Date.now()}`,
        ...payload
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    setShowCreateModal(false);
    setAlertMsg('Announcement broadcasted successfully!');
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleDeleteRequest = (ann) => {
    setSelectedToDelete(ann);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedToDelete) {
      try {
        await deleteAnnouncement(selectedToDelete._id || selectedToDelete.id);
      } catch (err) {
        console.warn('Delete announcement notice:', err);
      }
      setAnnouncements(announcements.filter((a) => (a._id !== selectedToDelete._id && a.id !== selectedToDelete.id)));
      setAlertMsg('Announcement retracted.');
      setTimeout(() => setAlertMsg(''), 3000);
    }
    setIsConfirmOpen(false);
    setSelectedToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Campus Circulars & Broadcast Center"
        subtitle="Publish official event notifications, schedule changes, prize announcements, and emergency updates to students and volunteers."
      >
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <FiPlus />
          <span>New Announcement</span>
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

      {announcements.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', maxWidth: '960px' }}>
          {announcements.map((ann) => (
            <div
              key={ann.id || ann._id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '1.35rem 1.5rem'
              }}
            >
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${getPriorityClass(ann.priority)}`} style={{ fontSize: '0.72rem' }}>
                    {ann.priority} Priority
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      backgroundColor: 'var(--primary-light)',
                      padding: '0.15rem 0.6rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {ann.eventName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    • Audience: <strong>{ann.audience}</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {ann.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                  {ann.message}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  <span>Posted by: <strong>{ann.postedBy}</strong></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FiClock />
                    <span>{formatDate(ann.date || ann.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => handleDeleteRequest(ann)}
                  className="btn-ghost btn-icon"
                  style={{ color: 'var(--danger)' }}
                  title="Retract Announcement"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiBell}
          title="No circulars published"
          description="Broadcast campus-wide notifications or fest specific circulars from this dashboard."
          actionLabel="Publish First Announcement"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Broadcast Campus Circular</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-ghost btn-icon"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Announcement Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="e.g. CodeSprint Round 2 Server Link Active"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message Body</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                    rows="4"
                    placeholder="Enter the official announcement text..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Event Context</label>
                  <select
                    value={formData.eventId}
                    onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                    className="form-select"
                  >
                    <option value="">General Campus (All Events)</option>
                    {events.map((evt) => (
                      <option key={evt.id || evt._id} value={evt.id || evt._id}>
                        {evt.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="form-select"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent Alert</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select
                      value={formData.audience}
                      onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                      className="form-select"
                    >
                      <option value="All Participants">All Participants & Students</option>
                      <option value="Volunteers">Volunteer Squad Only</option>
                      <option value="Students">Registered Students</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Retract Announcement?"
        message={`Are you sure you want to retract "${selectedToDelete?.title}"? It will no longer appear on participant dashboard feeds.`}
        confirmLabel="Retract Broadcast"
        cancelLabel="Keep"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Announcements;
