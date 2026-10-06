import React, { useState, useEffect } from 'react';
import { FiUserCheck, FiPlus, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { mockVolunteers, mockEvents } from '../../data/mockData';
import { getVolunteers, updateVolunteerStatus, assignEventToVolunteer, getEvents } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import VolunteerTable from '../../components/organizer/VolunteerTable';
import EmptyState from '../../components/common/EmptyState';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState(mockVolunteers);
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    eventId: mockEvents[0]?.id || '',
    taskTitle: '',
    roleArea: 'Stage Setup & Hospitality'
  });
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([getVolunteers(), getEvents()]).then(([vols, evts]) => {
      if (isMounted) {
        if (Array.isArray(vols) && vols.length > 0) setVolunteers(vols);
        if (Array.isArray(evts) && evts.length > 0) {
          setEvents(evts);
          if (evts[0]) {
            setAssignmentData((prev) => ({ ...prev, eventId: evts[0].id || evts[0]._id }));
          }
        }
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVolunteers = volunteers.filter((v) =>
    (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.department || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (vol) => {
    try {
      await updateVolunteerStatus(vol._id || vol.id, 'Active');
    } catch (err) {
      console.warn('Volunteer approve notice:', err);
    }
    setVolunteers(
      volunteers.map((v) => ((v._id === vol._id || v.id === vol.id) ? { ...v, status: 'Active' } : v))
    );
    setAlertMsg(`Volunteer application for ${vol.name} approved!`);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleReject = async (vol) => {
    try {
      await updateVolunteerStatus(vol._id || vol.id, 'Rejected');
    } catch (err) {
      console.warn('Volunteer reject notice:', err);
    }
    setVolunteers(
      volunteers.map((v) => ((v._id === vol._id || v.id === vol.id) ? { ...v, status: 'Rejected' } : v))
    );
    setAlertMsg(`Volunteer application for ${vol.name} marked as rejected.`);
    setTimeout(() => setAlertMsg(''), 3000);
  };

  const handleOpenAssign = (vol) => {
    setSelectedVolunteer(vol);
    setShowAssignModal(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    const eventObj = events.find((evt) => (evt.id === assignmentData.eventId || evt._id === assignmentData.eventId));
    const eventName = eventObj ? (eventObj.title?.split(':')[0] || eventObj.title) : 'TechFest 2026';

    if (selectedVolunteer) {
      try {
        await assignEventToVolunteer(selectedVolunteer._id || selectedVolunteer.id, eventName);
      } catch (err) {
        console.warn('Assign event notice:', err);
      }

      setVolunteers(
        volunteers.map((v) =>
          (v._id === selectedVolunteer._id || v.id === selectedVolunteer.id)
            ? {
                ...v,
                assignedEvents: [...new Set([...(v.assignedEvents || []), eventName])],
                assignedTasksCount: (v.assignedTasksCount || 0) + 1
              }
            : v
        )
      );
      setAlertMsg(`Assigned ${selectedVolunteer.name} to "${eventName}".`);
      setTimeout(() => setAlertMsg(''), 3000);
    }

    setShowAssignModal(false);
    setSelectedVolunteer(null);
  };

  return (
    <div>
      <PageHeader
        title="Volunteer Coordination Hub"
        subtitle="Review volunteer applications, assign duty shifts, monitor task completion, and coordinate event crews."
      />

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
          placeholder="Search by volunteer name, department, or email..."
        />
      </div>

      {filteredVolunteers.length > 0 ? (
        <VolunteerTable
          volunteers={filteredVolunteers}
          onApprove={handleApprove}
          onReject={handleReject}
          onAssignDuty={handleOpenAssign}
        />
      ) : (
        <EmptyState
          icon={FiUserCheck}
          title="No volunteers found"
          description="No volunteer profiles match your search criteria. Try modifying your search."
        />
      )}

      {/* Assign Event/Duty Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Assign Event Responsibility
              </h3>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="btn-ghost btn-icon"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAssignment}>
              <div className="modal-body">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Assigning responsibilities to <strong>{selectedVolunteer?.name}</strong> ({selectedVolunteer?.department})
                </p>

                <div className="form-group">
                  <label className="form-label">Event Assignment</label>
                  <select
                    value={assignmentData.eventId}
                    onChange={(e) => setAssignmentData({ ...assignmentData, eventId: e.target.value })}
                    className="form-select"
                    required
                  >
                    {events.map((evt) => (
                      <option key={evt.id || evt._id} value={evt.id || evt._id}>
                        {evt.title} ({evt.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Duty Area</label>
                  <select
                    value={assignmentData.roleArea}
                    onChange={(e) => setAssignmentData({ ...assignmentData, roleArea: e.target.value })}
                    className="form-select"
                  >
                    <option value="Stage Setup & Hospitality">Stage Setup & Hospitality</option>
                    <option value="Registration Desk & Badges">Registration Desk & Badges</option>
                    <option value="Technical Lab & AV Sound">Technical Lab & AV Sound</option>
                    <option value="Crowd & Security Management">Crowd & Security Management</option>
                    <option value="Guest Reception & Escort">Guest Reception & Escort</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;
