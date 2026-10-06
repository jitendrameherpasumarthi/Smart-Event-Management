import React, { useState, useEffect } from 'react';
import { FiClock, FiPlus, FiCalendar, FiMapPin, FiUser, FiCheck } from 'react-icons/fi';
import { mockSchedules, mockEvents } from '../../data/mockData';
import { getSchedules, createSchedule, deleteSchedule, getEvents } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import ScheduleTable from '../../components/organizer/ScheduleTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';

const Schedule = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [events, setEvents] = useState(mockEvents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const [formData, setFormData] = useState({
    eventId: mockEvents[0]?.id || '',
    activity: '',
    description: '',
    date: '2026-11-15',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    venue: 'Main Auditorium',
    coordinator: 'Dr. Rajesh Verma'
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([getSchedules(), getEvents()]).then(([schData, evtData]) => {
      if (isMounted) {
        if (Array.isArray(schData) && schData.length > 0) setSchedules(schData);
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

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    const eventObj = events.find((evt) => (evt.id === formData.eventId || evt._id === formData.eventId));
    const eventName = eventObj ? eventObj.title : 'TechFest 2026';

    const payload = {
      ...formData,
      eventName,
    };

    try {
      const res = await createSchedule(payload);
      const created = res.data || { id: `sch-${Date.now()}`, ...payload };
      setSchedules([created, ...schedules]);
    } catch {
      const newScheduleItem = {
        id: `sch-${Date.now()}`,
        ...payload
      };
      setSchedules([newScheduleItem, ...schedules]);
    }

    setShowAddModal(false);
    setAlertMsg(`Schedule slot "${formData.activity}" added successfully.`);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleDeleteRequest = (item) => {
    setSelectedToDelete(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedToDelete) {
      try {
        await deleteSchedule(selectedToDelete._id || selectedToDelete.id);
      } catch (err) {
        console.warn('Delete schedule notice:', err);
      }
      setSchedules(schedules.filter((s) => (s._id !== selectedToDelete._id && s.id !== selectedToDelete.id)));
      setAlertMsg(`Schedule slot removed.`);
      setTimeout(() => setAlertMsg(''), 3000);
    }
    setIsConfirmOpen(false);
    setSelectedToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Event Timetables & Program Agenda"
        subtitle="Manage master schedules, timeline slots, venue room allocations, and session coordinators across the festival calendar."
      >
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <FiPlus />
          <span>Add Program Slot</span>
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

      {schedules.length > 0 ? (
        <ScheduleTable
          schedules={schedules}
          onDelete={handleDeleteRequest}
        />
      ) : (
        <EmptyState
          icon={FiClock}
          title="No schedule items created"
          description="Build out your event agendas by adding activity time blocks, keynote speakers, and session venues."
          actionLabel="Add First Slot"
          onAction={() => setShowAddModal(true)}
        />
      )}

      {/* Add Schedule Slot Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Program Agenda Slot</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-ghost btn-icon"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSchedule}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Activity Title</label>
                  <input
                    type="text"
                    value={formData.activity}
                    onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Inauguration & Keynote Address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Session Brief</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-textarea"
                    rows="2"
                    placeholder="Brief description of the activity..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Associated Event</label>
                  <select
                    value={formData.eventId}
                    onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                    className="form-select"
                    required
                  >
                    {events.map((evt) => (
                      <option key={evt.id || evt._id} value={evt.id || evt._id}>
                        {evt.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Venue / Room</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Main Auditorium"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="text"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="form-input"
                      placeholder="09:30 AM"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="text"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="form-input"
                      placeholder="11:00 AM"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Session Lead / Coordinator</label>
                  <input
                    type="text"
                    value={formData.coordinator}
                    onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Dr. Rajesh Verma"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Schedule Slot?"
        message={`Are you sure you want to remove "${selectedToDelete?.activity}" from the timetable?`}
        confirmLabel="Remove Slot"
        cancelLabel="Keep"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Schedule;
