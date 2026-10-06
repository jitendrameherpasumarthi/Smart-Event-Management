import React, { useState, useEffect } from 'react';
import { FiBell, FiFilter } from 'react-icons/fi';
import { mockAnnouncements } from '../../data/mockData';
import { getAnnouncements } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import AnnouncementCard from '../../components/student/AnnouncementCard';
import EmptyState from '../../components/common/EmptyState';

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [priorityFilter, setPriorityFilter] = useState('All');

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

  const filteredAnnouncements = announcements.filter((ann) => {
    if (priorityFilter === 'All') return true;
    return (ann.priority || '').toLowerCase() === priorityFilter.toLowerCase();
  });

  return (
    <div>
      <PageHeader
        title="Campus Circulars & Announcements"
        subtitle="Stay updated with critical alerts, venue reallocations, prize pool additions, and schedule updates."
      />

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['All', 'Urgent', 'Important', 'Normal'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriorityFilter(p)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: priorityFilter === p ? 'var(--primary)' : '#ffffff',
              color: priorityFilter === p ? '#ffffff' : 'var(--text-muted)',
              border: `1px solid ${priorityFilter === p ? 'var(--primary)' : 'var(--border-color)'}`,
              transition: 'var(--transition)'
            }}
          >
            {p} Announcements
          </button>
        ))}
      </div>

      {filteredAnnouncements.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '960px' }}>
          {filteredAnnouncements.map((ann) => (
            <AnnouncementCard key={ann.id || ann._id} announcement={ann} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiBell}
          title="No circulars in this priority"
          description="There are currently no announcements matching this filter."
        />
      )}
    </div>
  );
};

export default StudentAnnouncements;
