import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiCheckSquare,
  FiClock,
  FiBell,
  FiCheckCircle,
  FiArrowRight,
  FiPlay,
  FiMapPin
} from 'react-icons/fi';
import {
  mockEvents,
  mockTasks,
  mockSchedules,
  mockAnnouncements,
  mockUsers
} from '../../data/mockData';
import {
  getVolunteerDashboard,
  getMyTasks,
  getEvents,
  getAnnouncements,
  getSchedules,
  updateTaskStatus,
  getMe
} from '../../services/api';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import VolunteerTaskCard from '../../components/volunteer/VolunteerTaskCard';
import VolunteerEventCard from '../../components/volunteer/VolunteerEventCard';
import AnnouncementCard from '../../components/student/AnnouncementCard';

const VolunteerDashboard = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : mockUsers.volunteer;
  });

  const [tasks, setTasks] = useState(mockTasks);
  const [events, setEvents] = useState(mockEvents);
  const [schedules, setSchedules] = useState(mockSchedules);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMe().then((u) => {
      if (isMounted && u) setCurrentUser(u);
    }).catch(console.warn);

    getVolunteerDashboard().then((data) => {
      if (isMounted && data) {
        setStats(data);
        if (data.myTasks?.length > 0) setTasks(data.myTasks);
        if (data.assignedEvents?.length > 0) setEvents(data.assignedEvents);
        if (data.upcomingSchedule?.length > 0) setSchedules(data.upcomingSchedule);
        if (data.recentAnnouncements?.length > 0) setAnnouncements(data.recentAnnouncements);
      }
    }).catch(console.warn);

    getMyTasks().then((tsks) => {
      if (isMounted && Array.isArray(tsks) && tsks.length > 0) setTasks(tsks);
    }).catch(console.warn);

    getEvents().then((evts) => {
      if (isMounted && Array.isArray(evts) && evts.length > 0) setEvents(evts);
    }).catch(console.warn);

    getAnnouncements().then((anns) => {
      if (isMounted && Array.isArray(anns) && anns.length > 0) setAnnouncements(anns);
    }).catch(console.warn);

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.warn('Status update notice:', err);
    }
    setTasks(
      tasks.map((t) => ((t._id === taskId || t.id === taskId) ? { ...t, status: newStatus } : t))
    );
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  const assignedEvents = events.filter((e) =>
    (currentUser.assignedEvents || ['TechFest 2026', 'CodeSprint']).some((title) =>
      e.title?.includes(title.split(' ')[0])
    )
  );

  const upcomingSchedule = schedules.slice(0, 4);
  const volunteerAnnouncements = announcements.filter(
    (a) => a.audience === 'Volunteers' || a.audience === 'All Participants'
  ).slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Volunteer Station — Hello, ${(currentUser.name || 'Volunteer').split(' ')[0]}! 🎖️`}
        subtitle="Manage your assigned duty shifts, execute stage and logistics tasks, and stay coordinated."
      >
        <Link to="/volunteer/tasks" className="btn btn-primary">
          <FiCheckSquare />
          <span>My Task Queue</span>
        </Link>
      </PageHeader>

      {/* Volunteer KPI Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Assigned Events"
          value={stats?.assignedEventsCount ?? (assignedEvents.length || 3)}
          icon={FiCalendar}
          colorScheme="blue"
          description="festivals on duty"
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.pendingTasksCount ?? pendingTasks.length}
          icon={FiClock}
          colorScheme="amber"
          description="awaiting completion"
        />
        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasksCount ?? completedTasks.length}
          icon={FiCheckCircle}
          colorScheme="emerald"
          description="logged & verified"
        />
        <StatCard
          title="Duty Shifts"
          value={stats?.dutyShiftsCount ?? 4}
          icon={FiCheckSquare}
          colorScheme="purple"
          description="scheduled sessions"
        />
      </div>

      {/* Two columns: Assigned Tasks Queue vs Shifts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Left Column: My Active Assigned Tasks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                My Action Queue
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tasks assigned directly to your station
              </p>
            </div>
            <Link to="/volunteer/tasks" className="btn btn-outline btn-sm">
              <span>View All ({tasks.length})</span>
              <FiArrowRight />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.slice(0, 3).map((task) => (
              <VolunteerTaskCard
                key={task.id || task._id}
                task={task}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Shift Agenda */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Duty Roster Timeline
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Upcoming program checkpoints
              </p>
            </div>
            <Link to="/volunteer/schedule" className="btn btn-outline btn-sm">
              <span>Full Roster</span>
            </Link>
          </div>

          <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {upcomingSchedule.map((item, idx) => (
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
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    {item.startTime}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                    {item.activity}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <FiMapPin style={{ color: 'var(--secondary)' }} />
                    <span>{item.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteer Event Cards */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Assigned College Events
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Festivals where you are registered as active crew coordinator
            </p>
          </div>
          <Link to="/volunteer/events" className="btn btn-outline btn-sm">
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid-cols-2">
          {assignedEvents.slice(0, 2).map((event) => (
            <VolunteerEventCard key={event.id || event._id} event={event} />
          ))}
        </div>
      </div>

      {/* Volunteer Announcements */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Crew Briefings & Circulars
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Important operational notes from lead faculty conveners
            </p>
          </div>
          <Link to="/volunteer/announcements" className="btn btn-outline btn-sm">
            <span>View All</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid-cols-3">
          {volunteerAnnouncements.map((ann) => (
            <AnnouncementCard key={ann.id || ann._id} announcement={ann} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
