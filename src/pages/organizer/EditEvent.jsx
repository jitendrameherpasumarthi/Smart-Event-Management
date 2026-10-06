import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { mockEvents } from '../../data/mockData';
import { getEventById, updateEvent } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const eventToEdit = mockEvents.find((e) => e.id === id) || mockEvents[0];

  const [formData, setFormData] = useState({
    title: eventToEdit.title || '',
    description: eventToEdit.description || '',
    category: eventToEdit.category || 'Technical',
    date: eventToEdit.date || '',
    startTime: eventToEdit.startTime || '09:00 AM',
    endTime: eventToEdit.endTime || '05:00 PM',
    venue: eventToEdit.venue || '',
    maxParticipants: eventToEdit.maxParticipants || 100,
    organizer: eventToEdit.organizer || '',
    deadline: eventToEdit.deadline || '',
    status: eventToEdit.status || 'Published'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getEventById(id).then((data) => {
      if (isMounted && data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Technical',
          date: data.date || '',
          startTime: data.startTime || '09:00 AM',
          endTime: data.endTime || '05:00 PM',
          venue: data.venue || '',
          maxParticipants: data.maxParticipants || 100,
          organizer: data.organizer || '',
          deadline: data.deadline || '',
          status: data.status || 'Published'
        });
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const categories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Hackathon', 'Seminar'];
  const statuses = ['Draft', 'Published', 'Completed'];

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Event Name is required.';
    if (!formData.description.trim()) errs.description = 'Event description is required.';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required.';
    if (!formData.date) errs.date = 'Event Date is required.';
    if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0) {
      errs.maxParticipants = 'Maximum participants must be a positive number.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await updateEvent(id, {
        ...formData,
        maxParticipants: Number(formData.maxParticipants) || 100,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1200);
    } catch {
      setSuccess(true);
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <PageHeader
        title={`Edit Event: ${eventToEdit.title}`}
        subtitle="Update session agendas, modify venue assignments, or adjust registration capacities."
      >
        <button
          type="button"
          onClick={() => navigate('/organizer/events')}
          className="btn btn-outline"
        >
          <FiArrowLeft />
          <span>Cancel & Back</span>
        </button>
      </PageHeader>

      {success && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <FiCheck /> Event details updated successfully! Redirecting...
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Name / Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows="4"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Event Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="form-select"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Event Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`form-input ${errors.date ? 'error' : ''}`}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Venue Location *</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className={`form-input ${errors.venue ? 'error' : ''}`}
              />
              {errors.venue && <span className="error-text">{errors.venue}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Participants *</label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className={`form-input ${errors.maxParticipants ? 'error' : ''}`}
                min="1"
              />
              {errors.maxParticipants && <span className="error-text">{errors.maxParticipants}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Host Organizer / Committee</label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registration Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => navigate('/organizer/events')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Updating Event...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
