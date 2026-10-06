import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiFilter, FiTag, FiSearch } from 'react-icons/fi';
import { mockEvents } from '../../data/mockData';
import { getEvents } from '../../services/api';
import EventCard from '../../components/student/EventCard';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    let isMounted = true;
    getEvents().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setEvents(data);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Sports',
    'Workshop',
    'Hackathon',
    'Seminar'
  ];

  const statuses = ['All', 'Published', 'Draft'];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.venue || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.organizer || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        (event.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All' ||
        (event.status || '').toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1440px', margin: '0 auto' }}>
      <PageHeader
        title="College Events & Activities"
        subtitle="Explore upcoming hackathons, tech symposiums, cultural nights, and athletic championships."
      />

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search by event title, venue, or keywords..."
        />

        <div className="filter-actions">
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Quick Pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '0.35rem'
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
              border: `1px solid ${selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)'}`,
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid-cols-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterClick={(evt) => navigate(`/events/${evt.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiCalendar}
          title="No events match your criteria"
          description="Try changing your search terms, selecting another category, or resetting active filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedStatus('All');
          }}
        />
      )}
    </div>
  );
};

export default Events;
