import React, { useState, useEffect } from 'react';
import { FiBell, FiFilter } from 'react-icons/fi';
import { mockAnnouncements } from '../../data/mockData';
import { getAnnouncements } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import AnnouncementCard from '../../components/student/AnnouncementCard';
import EmptyState from '../../components/common/EmptyState';

const VolunteerAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [filterPriority, setFilterPriority] = useState('All');

  useEffect(() => {
    let isMounted = true;
    getAnnouncements().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setAnnouncements(data);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter volunteer targeted + campus wide circulars
  const volunteerCirculars = announcements.filter(
    (a) => a.audience === 'Volunteers' || a.audience === 'All Participants'
  );

  const displayedAnnouncements = volunteerCirculars.filter((ann) => {
    if (filterPriority === 'All') return true;
    return (ann.priority || '').toLowerCase() === filterPriority.toLowerCase();
  });

  return (
    <div>
      <PageHeader
        title="Volunteer Directives & Circulars"
        subtitle="Critical advisories for stage coordinators, registration volunteers, logistics runners, and student marshals."
      />

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['All', 'Urgent', 'Important', 'Normal'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilterPriority(p)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: filterPriority === p ? '#7c3aed' : '#ffffff',
              color: filterPriority === p ? '#ffffff' : 'var(--text-muted)',
              border: `1px solid ${filterPriority === p ? '#7c3aed' : 'var(--border-color)'}`,
              transition: 'var(--transition)'
            }}
          >
            {p} Priority
          </button>
        ))}
      </div>

      {displayedAnnouncements.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '960px' }}>
          {displayedAnnouncements.map((ann) => (
            <AnnouncementCard key={ann.id || ann._id} announcement={ann} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiBell}
          title="No circulars found"
          description="There are currently no volunteer announcements in this category."
        />
      )}
    </div>
  );
};

export default VolunteerAnnouncements;
