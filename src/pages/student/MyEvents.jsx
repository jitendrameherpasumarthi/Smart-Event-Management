import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiCompass, FiCheckCircle } from 'react-icons/fi';
import { mockEvents, mockParticipants, mockUsers } from '../../data/mockData';
import { getRegistrations, getEvents } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import EventCard from '../../components/student/EventCard';
import EmptyState from '../../components/common/EmptyState';

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [registrations, setRegistrations] = useState(mockParticipants.filter((p) => p.email === mockUsers.student.email));
  const [allEvents, setAllEvents] = useState(mockEvents);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getRegistrations(), getEvents()]).then(([regs, evts]) => {
      if (isMounted) {
        if (Array.isArray(regs)) setRegistrations(regs);
        if (Array.isArray(evts)) setAllEvents(evts);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const registeredEventIds = registrations
    .filter((r) => r.status !== 'Cancelled')
    .map((r) => r.event?._id || r.event?.customId || r.eventId || r.event?.id);

  const upcomingEvents = allEvents.filter((e) =>
    registeredEventIds.includes(e._id) || registeredEventIds.includes(e.customId) || registeredEventIds.includes(e.id)
  );

  const pastEvents = [
    {
      id: 'evt-past-1',
      title: 'InnoVation Summit 2025',
      category: 'Seminar',
      description: 'Annual college research seminar on sustainable clean energy solutions.',
      banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
      date: '2025-09-18',
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      venue: 'Seminar Hall A',
      organizer: 'Dept. of Electrical Engineering',
      maxParticipants: 200,
      registeredCount: 200,
      status: 'Completed'
    },
    {
      id: 'evt-past-2',
      title: 'National Robotics Derby 2025',
      category: 'Technical',
      description: 'Autonomous rover challenge and line-follower robot league.',
      banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      date: '2025-10-12',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      venue: 'Campus Indoor Stadium',
      organizer: 'Robotics Society',
      maxParticipants: 150,
      registeredCount: 150,
      status: 'Completed'
    }
  ];

  const currentDisplay = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div>
      <PageHeader
        title="My Enrolled Events"
        subtitle="Track your registered college events, symposium passes, and past festival participation."
      >
        <Link to="/events" className="btn btn-primary">
          <FiCompass />
          <span>Browse More Events</span>
        </Link>
      </PageHeader>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`btn ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
        >
          <FiCalendar />
          <span>Upcoming Events ({upcomingEvents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`btn ${activeTab === 'past' ? 'btn-primary' : 'btn-outline'}`}
        >
          <FiCheckCircle />
          <span>Past & Completed ({pastEvents.length})</span>
        </button>
      </div>

      {currentDisplay.length > 0 ? (
        <div className="grid-cols-3">
          {currentDisplay.map((event) => (
            <EventCard
              key={event.id || event._id}
              event={event}
              isRegistered={true}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiCalendar}
          title="No events found in this tab"
          description="Browse the upcoming college event catalog to register for technical competitions, workshops, and fests."
          actionLabel="Explore Catalog"
          onAction={() => {}}
        />
      )}
    </div>
  );
};

export default MyEvents;
