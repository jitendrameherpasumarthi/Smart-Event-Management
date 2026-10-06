import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiCheckCircle,
  FiArrowLeft,
  FiShare2,
  FiMail,
  FiShield,
  FiInfo,
  FiAward
} from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { mockEvents, mockSchedules } from '../../data/mockData';
import { getEventById, registerForEvent, getRegistrations } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(() => mockEvents.find((e) => e.id === id) || mockEvents[0]);
  const [schedules, setSchedules] = useState(() =>
    mockSchedules.filter((s) => s.eventId === id || s.eventName?.includes(event.title?.split(' ')[0]))
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const [registrationData, setRegistrationData] = useState(() => {
    const cachedUser = localStorage.getItem('user');
    const user = cachedUser ? JSON.parse(cachedUser) : null;
    return {
      name: user?.name || 'Aarav Sharma',
      email: user?.email || 'aarav.sharma@college.edu',
      department: user?.department || 'Computer Science',
      year: user?.year || '3rd Year',
      phone: user?.phone || '+91 98765 43210'
    };
  });

  useEffect(() => {
    let isMounted = true;
    getEventById(id).then((data) => {
      if (isMounted && data) {
        setEvent(data);
        if (data.schedules && data.schedules.length > 0) {
          setSchedules(data.schedules);
        }
      }
    }).catch(console.warn);

    // Check if user is registered for this event
    const token = localStorage.getItem('token');
    if (token) {
      getRegistrations().then((regs) => {
        if (isMounted && Array.isArray(regs)) {
          const match = regs.find(
            (r) =>
              (r.event?._id === id || r.eventId === id || r.event?.customId === id) &&
              r.status !== 'Cancelled'
          );
          if (match) {
            setIsRegistered(true);
            setIssuedTicket(match.ticketNumber);
          }
        }
      }).catch(console.warn);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);

    try {
      const res = await registerForEvent(event._id || event.id || id, registrationData);
      setIsRegistered(true);
      setIssuedTicket(res.ticketNumber || res.data?.ticketNumber || 'TF26-8819');
      setShowRegisterModal(false);

      // Increment registered count locally
      setEvent((prev) => ({
        ...prev,
        registeredCount: (prev.registeredCount || 0) + 1,
      }));

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('Registration error:', err.message || err);
      if (err.message && err.message.includes('already registered')) {
        setIsRegistered(true);
        setIssuedTicket(err.ticketNumber || 'Confirmed');
        setShowRegisterModal(false);
      } else {
        setRegError(err.message || 'Failed to submit registration. Please try again.');
      }
    } finally {
      setRegLoading(false);
    }
  };

  const eventSchedules = schedules.length > 0
    ? schedules
    : mockSchedules.filter((s) => s.eventId === event.id || s.eventName?.includes(event.title?.split(' ')[0]));

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top back navigation */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Event link copied to clipboard!');
              }
            }}
            className="btn btn-outline btn-sm"
          >
            <FiShare2 />
            <span>Share Event</span>
          </button>
        </div>
      </div>

      {/* Hero Banner with Overlay */}
      <div
        style={{
          position: 'relative',
          height: '380px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <img
          src={event.banner}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-info" style={{ backdropFilter: 'blur(4px)', fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              {event.category}
            </span>
            {event.status && (
              <StatusBadge status={event.status} />
            )}
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            {event.title}
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '1.05rem', maxWidth: '800px', lineHeight: 1.5 }}>
            {event.description}
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Details, Requirements, Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* About Section */}
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              About this Event
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {event.about || event.description}
            </p>

            {event.tags && event.tags.length > 0 && (
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#f1f5f9',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      fontWeight: 500
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Event Schedule & Sessions */}
          <div className="card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Program Schedule & Agenda
            </h2>
            {eventSchedules.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {eventSchedules.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      display: 'flex',
                      gap: '1.25rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: '#f8fafc',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        minWidth: '90px'
                      }}
                    >
                      <FiClock style={{ color: 'var(--primary)', marginBottom: '0.25rem' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.startTime}
                      </span>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {item.activity}
                      </h4>
                      {item.description && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                          {item.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                        <span>📍 Venue: {item.venue}</span>
                        {item.coordinator && <span>👤 Lead: {item.coordinator}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Detailed session agenda will be published soon.
              </p>
            )}
          </div>

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Rules & Eligibility Criteria
              </h2>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {event.rules.map((rule, idx) => (
                  <li key={idx} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Event Metadata & Registration Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Registration Card */}
          <div className="card" style={{ border: '2px solid var(--primary-light)', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Registration & Venue
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <FiCalendar style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Date</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {formatDate(event.date)}
                    {event.endDate && event.endDate !== event.date ? ` - ${formatDate(event.endDate)}` : ''}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <FiClock style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Timing</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {event.startTime} - {event.endTime || '05:00 PM'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <FiMapPin style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Location</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{event.venue}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                <FiUsers style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Capacity</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <strong>{event.registeredCount || 0}</strong> / {event.maxParticipants} Registered
                  </div>
                </div>
              </div>
            </div>

            {/* Registration State Button */}
            {isRegistered ? (
              <div
                style={{
                  backgroundColor: '#ecfdf5',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <FiCheckCircle style={{ fontSize: '2rem', color: '#059669', marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                  You are Registered!
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#047857', marginBottom: '1rem' }}>
                  Ticket ID: #{issuedTicket || 'TF26-8819'}
                </p>
                <Link to="/student/registrations" className="btn btn-outline btn-sm" style={{ width: '100%', backgroundColor: '#ffffff' }}>
                  View In My Registrations
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                Register for Event
              </button>
            )}
          </div>

          {/* Organizer Info Box */}
          <div className="card">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              Organized By
            </h4>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {event.organizer}
            </p>
            {event.organizerContact && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--primary)' }}>
                <FiMail />
                <a href={`mailto:${event.organizerContact}`}>{event.organizerContact}</a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Confirm Registration</h3>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="btn-ghost btn-icon"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister}>
              <div className="modal-body">
                {regError && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    {regError}
                  </div>
                )}

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  You are registering for <strong>{event.title}</strong>. Please confirm your details:
                </p>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">College Email</label>
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      value={registrationData.department}
                      onChange={(e) => setRegistrationData({ ...registrationData, department: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input
                      type="text"
                      value={registrationData.year}
                      onChange={(e) => setRegistrationData({ ...registrationData, year: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={regLoading} className="btn btn-primary">
                  {regLoading ? 'Reserving Seat...' : 'Confirm & Generate Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
