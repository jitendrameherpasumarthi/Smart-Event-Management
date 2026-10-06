import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCalendar, FiArrowLeft, FiCheck, FiInfo } from 'react-icons/fi';
import { createEvent } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    date: '',
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    venue: '',
    maxParticipants: 100,
    organizer: 'Dept. of Computer Science & Engineering',
    deadline: '',
    status: 'Published',
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

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
    setApiError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createEvent({
        ...formData,
        maxParticipants: Number(formData.maxParticipants) || 100,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/organizer/events');
      }, 1200);
    } catch (err) {
      console.warn('Create event error:', err);
      setApiError(err.message || 'Failed to create event. Please verify all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <PageHeader
        title="Create New Campus Event"
        subtitle="Fill in the event details, session timings, seat quotas, and venue specifications."
      >
        <button
          type="button"
          onClick={() => navigate('/organizer/events')}
          className="btn btn-outline"
        >
          <FiArrowLeft />
          <span>Back to Events</span>
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
          <FiCheck /> Event published successfully! Redirecting to event list...
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="form-group">
            <label className="form-label">
              Event Name / Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Apex AI Hackathon 2026"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows="4"
              placeholder="Provide an overview of the event objective, who should attend, and highlights..."
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* Category and Status Grid */}
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

          {/* Date and Time slots */}
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
                placeholder="09:00 AM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
                placeholder="05:00 PM"
              />
            </div>
          </div>

          {/* Venue and Maximum Participants */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Venue Location *</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className={`form-input ${errors.venue ? 'error' : ''}`}
                placeholder="e.g. Main Auditorium & CS Block Lab 4"
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

          {/* Organizing Department and Deadline */}
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

          {/* Form Actions */}
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
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
