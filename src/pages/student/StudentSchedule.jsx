import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiMapPin, FiUser, FiFilter } from 'react-icons/fi';
import { mockSchedules, mockEvents } from '../../data/mockData';
import { getSchedules, getEvents } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import PageHeader from '../../components/common/PageHeader';

const StudentSchedule = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [events, setEvents] = useState(mockEvents);
  const [selectedEventId, setSelectedEventId] = useState('All');

  useEffect(() => {
    let isMounted = true;
    Promise.all([getSchedules(), getEvents()]).then(([schData, evtData]) => {
      if (isMounted) {
        if (Array.isArray(schData) && schData.length > 0) setSchedules(schData);
        if (Array.isArray(evtData) && evtData.length > 0) setEvents(evtData);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSchedules = schedules.filter((item) => {
    if (selectedEventId === 'All') return true;
    return item.eventId === selectedEventId || item.event?._id === selectedEventId || item.event?.customId === selectedEventId;
  });

  return (
    <div>
      <PageHeader
        title="Event Schedule & Daily Agendas"
        subtitle="Follow live session schedules, track workshop hours, competition timings, and auditorium keynotes."
      />

      {/* Filter by event */}
      <div className="filter-bar" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <FiFilter style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Filter Schedule by Event:
          </span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '240px', fontSize: '0.85rem' }}
          >
            <option value="All">All College Events</option>
            {events.map((evt) => (
              <option key={evt.id || evt._id} value={evt.id || evt._id}>
                {evt.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div className="timeline-container">
          {filteredSchedules.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot">
                <FiClock />
              </div>

              <div className="timeline-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        backgroundColor: 'var(--primary-light)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'inline-block',
                        marginBottom: '0.35rem'
                      }}
                    >
                      {item.eventName}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.activity}
                    </h3>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      backgroundColor: '#eff6ff',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <FiClock />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                </div>

                {item.description && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-light)',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '0.6rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiCalendar style={{ color: 'var(--primary)' }} />
                    {formatDate(item.date)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiMapPin style={{ color: 'var(--primary)' }} />
                    {item.venue}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiUser style={{ color: 'var(--primary)' }} />
                    {item.coordinator}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
