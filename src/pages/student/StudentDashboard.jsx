import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiBell,
  FiCheckCircle,
  FiCompass,
  FiClipboard,
  FiArrowRight,
  FiMapPin
} from 'react-icons/fi';
import { mockEvents, mockParticipants, mockAnnouncements, mockSchedules, mockUsers } from '../../data/mockData';
import { getStudentDashboard, getEvents, getRegistrations, getAnnouncements, getSchedules, getMe } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import EventCard from '../../components/student/EventCard';
import AnnouncementCard from '../../components/student/AnnouncementCard';
import { formatDate } from '../../utils/helpers';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : mockUsers.student;
  });

  const [registrations, setRegistrations] = useState(mockParticipants.filter((p) => p.email === mockUsers.student.email));
  const [events, setEvents] = useState(mockEvents);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [schedules, setSchedules] = useState(mockSchedules);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Load logged in user
    getMe().then((usr) => {
      if (isMounted && usr) setCurrentUser(usr);
    }).catch(console.warn);

    // Load student dashboard analytics from backend
    getStudentDashboard().then((data) => {
      if (isMounted && data) {
        setStats(data);
        if (data.upcomingEvents?.length > 0) setEvents(data.upcomingEvents);
        if (data.recentAnnouncements?.length > 0) setAnnouncements(data.recentAnnouncements);
        if (data.upcomingSchedule?.length > 0) setSchedules(data.upcomingSchedule);
      }
    }).catch(console.warn);

    // Load registrations
    getRegistrations().then((regs) => {
      if (isMounted && Array.isArray(regs) && regs.length > 0) {
        setRegistrations(regs);
      }
    }).catch(console.warn);

    // Load all events for recommendations
    getEvents().then((evts) => {
      if (isMounted && Array.isArray(evts) && evts.length > 0) {
        setEvents(evts);
      }
    }).catch(console.warn);

    return () => {
      isMounted = false;
    };
  }, []);

  const registeredEventIds = registrations
    .filter((r) => r.status !== 'Cancelled')
    .map((r) => r.event?._id || r.event?.customId || r.eventId || r.event?.id);

  const myUpcomingEvents = events.filter((e) =>
    registeredEventIds.includes(e._id) || registeredEventIds.includes(e.customId) || registeredEventIds.includes(e.id)
  );

  const otherEvents = events
    .filter((e) => !registeredEventIds.includes(e._id) && !registeredEventIds.includes(e.customId) && !registeredEventIds.includes(e.id))
    .slice(0, 3);

  const recentAnnouncements = announcements.slice(0, 3);
  const mySchedule = schedules.slice(0, 4);

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${(currentUser.name || 'Student').split(' ')[0]}! 👋`}
        subtitle="Here is an overview of your college event registrations, upcoming schedule, and latest campus circulars."
      >
        <Link to="/events" className="btn btn-primary">
          <FiCompass />
          <span>Browse All Events</span>
        </Link>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Registered Events"
          value={stats?.registeredEventsCount ?? registrations.length}
          icon={FiClipboard}
          colorScheme="blue"
          trend="+2"
          description="active passes"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEventsCount ?? myUpcomingEvents.length}
          icon={FiCalendar}
          colorScheme="purple"
          description="Next: Nov 2026"
        />
        <StatCard
          title="Attended Fests"
          value={stats?.completedEventsCount ?? 4}
          icon={FiCheckCircle}
          colorScheme="emerald"
          description="verified attendance"
        />
        <StatCard
          title="Campus Notices"
          value={stats?.announcementsCount ?? announcements.length}
          icon={FiBell}
          colorScheme="amber"
          description="latest announcements"
        />
      </div>

      {/* Two Columns: My Registered Events vs Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Left Column: My Upcoming Registered Events */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                My Registered Events
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Events you are signed up to participate in
              </p>
            </div>
            <Link to="/student/events" className="btn btn-outline btn-sm">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {myUpcomingEvents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {myUpcomingEvents.slice(0, 2).map((event) => (
                <EventCard
                  key={event.id || event._id}
                  event={event}
                  isRegistered={true}
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <FiCalendar style={{ fontSize: '2.5rem', color: 'var(--text-light)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                No Registered Events Yet
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Explore campus hackathons, technical conferences, and cultural symposiums.
              </p>
              <Link to="/events" className="btn btn-primary btn-sm" style={{ margin: '0 auto' }}>
                Explore Campus Events
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Schedule Agenda */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Upcoming Agenda
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Upcoming schedule & sessions
              </p>
            </div>
            <Link to="/student/schedule" className="btn btn-outline btn-sm">
              <span>Full Schedule</span>
            </Link>
          </div>

          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {mySchedule.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
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
                    padding: '0.35rem 0.55rem',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    minWidth: '65px'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {item.startTime}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                    {item.activity}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <FiMapPin style={{ color: 'var(--primary)' }} />
                    <span>{item.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Campus Announcements & Alerts
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Stay informed with official circulars and fest notifications
            </p>
          </div>
          <Link to="/student/announcements" className="btn btn-outline btn-sm">
            <span>View All ({announcements.length})</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid-cols-3">
          {recentAnnouncements.map((ann) => (
            <AnnouncementCard key={ann.id || ann._id} announcement={ann} />
          ))}
        </div>
      </div>

      {/* Recommended Other Events */}
      {otherEvents.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Recommended For You
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Popular technical & cultural events happening this term
              </p>
            </div>
            <Link to="/events" className="btn btn-outline btn-sm">
              <span>Explore All</span>
              <FiArrowRight />
            </Link>
          </div>

          <div className="grid-cols-3">
            {otherEvents.map((evt) => (
              <EventCard
                key={evt.id || evt._id}
                event={evt}
                onRegisterClick={() => navigate(`/events/${evt.id || evt._id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
