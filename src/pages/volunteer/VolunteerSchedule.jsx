import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiMapPin, FiUser, FiCheckSquare, FiStar } from 'react-icons/fi';
import { mockSchedules, mockUsers } from '../../data/mockData';
import { getSchedules, getMe } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import PageHeader from '../../components/common/PageHeader';

const VolunteerSchedule = () => {
  const [schedules, setSchedules] = useState(mockSchedules);
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : mockUsers.volunteer;
  });
  const [filterMyDutiesOnly, setFilterMyDutiesOnly] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getSchedules(), getMe()]).then(([schData, u]) => {
      if (isMounted) {
        if (Array.isArray(schData) && schData.length > 0) setSchedules(schData);
        if (u) setCurrentUser(u);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const schedulesWithDuty = schedules.map((item) => {
    const isMyDuty = (item.coordinator || '').includes(currentUser.name || 'Rohan Gupta') || (item.coordinator || '').includes('Volunteer');
    return {
      ...item,
      isMyDuty
    };
  });

  const displayedSchedules = filterMyDutiesOnly
    ? schedulesWithDuty.filter((s) => s.isMyDuty)
    : schedulesWithDuty;

  return (
    <div>
      <PageHeader
        title="Volunteer Duty Schedule & Timelines"
        subtitle="Review master campus event schedules with your assigned coordination duties prominently highlighted."
      />

      {/* Filter toggle */}
      <div className="filter-bar" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            <input
              type="checkbox"
              checked={filterMyDutiesOnly}
              onChange={(e) => setFilterMyDutiesOnly(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <span>Show Only My Assigned Duty Shifts</span>
          </label>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div className="timeline-container">
          {displayedSchedules.map((item) => (
            <div key={item.id} className="timeline-item">
              <div
                className="timeline-dot"
                style={{
                  backgroundColor: item.isMyDuty ? '#7c3aed' : 'var(--primary)',
                  boxShadow: item.isMyDuty ? '0 0 0 3px #ddd6fe' : '0 0 0 2px var(--border-color)'
                }}
              >
                {item.isMyDuty ? <FiStar /> : <FiClock />}
              </div>

              <div
                className="timeline-card"
                style={{
                  borderLeft: item.isMyDuty ? '4px solid #7c3aed' : '1px solid var(--border-color)',
                  backgroundColor: item.isMyDuty ? '#faf5ff' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          backgroundColor: 'var(--primary-light)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        {item.eventName}
                      </span>
                      {item.isMyDuty && (
                        <span className="badge" style={{ backgroundColor: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }}>
                          ★ Your Assigned Shift
                        </span>
                      )}
                    </div>
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
                      color: item.isMyDuty ? '#6d28d9' : 'var(--primary)',
                      backgroundColor: item.isMyDuty ? '#ede9fe' : '#eff6ff',
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
                    <FiUser style={{ color: item.isMyDuty ? '#7c3aed' : 'var(--primary)' }} />
                    <strong>{item.coordinator}</strong>
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

export default VolunteerSchedule;
