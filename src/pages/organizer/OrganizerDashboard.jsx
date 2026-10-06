import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiCheckSquare,
  FiTrendingUp,
  FiPlus,
  FiBell,
  FiArrowRight,
  FiActivity,
  FiPieChart,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import {
  mockEvents,
  mockParticipants,
  mockVolunteers,
  mockTasks,
  mockAnnouncements,
  mockOrganizerAnalytics,
  mockUsers
} from '../../data/mockData';
import {
  getOrganizerDashboard,
  getEvents,
  getRegistrations,
  getVolunteers,
  getTasks,
  getAnnouncements,
  getMe
} from '../../services/api';
import StatCard from '../../components/common/StatCard';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : mockUsers.organizer;
  });

  const [activeDataIndex, setActiveDataIndex] = useState(null);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState(mockEvents);
  const [registrations, setRegistrations] = useState(mockParticipants);
  const [volunteers, setVolunteers] = useState(mockVolunteers);
  const [tasks, setTasks] = useState(mockTasks);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);

  useEffect(() => {
    let isMounted = true;

    getMe().then((u) => {
      if (isMounted && u) setCurrentUser(u);
    }).catch(console.warn);

    getOrganizerDashboard().then((data) => {
      if (isMounted && data) {
        setStats(data);
        if (data.recentRegistrations?.length > 0) setRegistrations(data.recentRegistrations);
        if (data.urgentTasks?.length > 0) setTasks(data.urgentTasks);
      }
    }).catch(console.warn);

    getEvents().then((evts) => {
      if (isMounted && Array.isArray(evts)) setEvents(evts);
    }).catch(console.warn);

    getVolunteers().then((vols) => {
      if (isMounted && Array.isArray(vols)) setVolunteers(vols);
    }).catch(console.warn);

    getTasks().then((tsks) => {
      if (isMounted && Array.isArray(tsks)) setTasks(tsks);
    }).catch(console.warn);

    getAnnouncements().then((anns) => {
      if (isMounted && Array.isArray(anns)) setAnnouncements(anns);
    }).catch(console.warn);

    return () => {
      isMounted = false;
    };
  }, []);

  const totalEvents = stats?.totalEvents ?? events.length;
  const totalVolunteers = stats?.totalVolunteers ?? volunteers.length;
  const totalParticipants = stats?.totalParticipants ?? registrations.length;
  const pendingTasks = stats?.pendingTasks ?? tasks.filter((t) => t.status === 'Pending').length;
  const completionRate = stats?.completionRate ?? 68;

  const recentRegistrations = registrations.slice(0, 5);
  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent' || t.status === 'Pending').slice(0, 4);

  // SVG Area Chart points
  const regData = stats?.monthlyRegistrations || mockOrganizerAnalytics.monthlyRegistrations;
  const maxReg = Math.max(...regData.map((d) => d.count || 1));
  const svgWidth = 540;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 20;

  const points = regData.map((d, i) => {
    const x = paddingX + (i * (svgWidth - 2 * paddingX)) / (regData.length - 1);
    const y = svgHeight - paddingY - (d.count / maxReg) * (svgHeight - 2 * paddingY);
    return { x, y, ...d };
  });

  const areaPath = `M ${points[0].x} ${svgHeight - paddingY} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x} ${svgHeight - paddingY} Z`;

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Donut chart calculations
  const categoryData = mockOrganizerAnalytics.categoryDistribution;
  let accumulatedAngle = 0;
  const donutRadius = 60;
  const donutHole = 38;
  const center = 80;

  return (
    <div>
      <PageHeader
        title="Organizer Command Center"
        subtitle={`Welcome, ${currentUser?.name || 'Dr. Rajesh Verma'}. Track live participant volumes, volunteer allocations, and operational tasks across all college events.`}
      >
        <Link to="/organizer/events/create" className="btn btn-primary">
          <FiPlus />
          <span>Create New Event</span>
        </Link>
      </PageHeader>

      {/* Main KPI Stats */}
      <div className="grid-cols-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={FiCalendar}
          colorScheme="blue"
          trend="+3"
          description="active this term"
        />
        <StatCard
          title="Total Registrations"
          value={totalParticipants.toLocaleString()}
          icon={FiUsers}
          colorScheme="purple"
          trend="+18%"
          description="vs last year"
        />
        <StatCard
          title="Active Volunteers"
          value={totalVolunteers}
          icon={FiUserCheck}
          colorScheme="emerald"
          description="Deployed across campus"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={FiCheckSquare}
          colorScheme="amber"
          description={`${urgentTasks.length} high priority`}
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem',
          padding: '1.25rem 1.75rem',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <FiActivity />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Events</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{events.filter((e) => e.status !== 'Completed').length || 6} Events</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <FiCheckCircle />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completed Events</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{events.filter((e) => e.status === 'Completed').length || 2} Concluded</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f5f3ff', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            <FiPieChart />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Task Completion Rate</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{completionRate}% Executed</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem', marginBottom: '2rem' }}>
        {/* Registration Velocity Area Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Registration Velocity Overview</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly student signups across departments</p>
            </div>
            <span className="badge badge-success">+24% Monthly Growth</span>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#e2e8f0" strokeWidth="1" />
              <line x1={paddingX} y1={(svgHeight - 2 * paddingY) / 2 + paddingY} x2={svgWidth - paddingX} y2={(svgHeight - 2 * paddingY) / 2 + paddingY} stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />

              {/* Area & Line */}
              <path d={areaPath} fill="url(#chartGradient)" />
              <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={activeDataIndex === idx ? 6 : 4}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth={activeDataIndex === idx ? 3 : 2}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={() => setActiveDataIndex(idx)}
                    onMouseLeave={() => setActiveDataIndex(null)}
                  />
                  <text
                    x={p.x}
                    y={svgHeight - 4}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {p.month}
                  </text>
                  {activeDataIndex === idx && (
                    <g>
                      <rect
                        x={p.x - 30}
                        y={p.y - 30}
                        width="60"
                        height="22"
                        rx="4"
                        fill="#0f172a"
                      />
                      <text
                        x={p.x}
                        y={p.y - 15}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="700"
                      >
                        {p.count}
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="card">
          <div style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category Breakdown</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share of registered student interests</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 160 160" style={{ width: '150px', height: '150px' }}>
              {categoryData.map((cat, idx) => {
                const strokeDasharray = `${(cat.value / 100) * (2 * Math.PI * 50)} ${2 * Math.PI * 50}`;
                const strokeDashoffset = -accumulatedAngle * (2 * Math.PI * 50) / 100;
                accumulatedAngle += cat.value;

                return (
                  <circle
                    key={idx}
                    cx="80"
                    cy="80"
                    r="50"
                    fill="transparent"
                    stroke={cat.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 80 80)"
                  />
                );
              })}
              <text x="80" y="76" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--text-main)">
                100%
              </text>
              <text x="80" y="92" textAnchor="middle" fontSize="10" fill="var(--text-muted)">
                Active Shares
              </text>
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {categoryData.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }}></span>
                <span>{cat.name} ({cat.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          backgroundColor: '#f8fafc',
          padding: '1.25rem 1.5rem',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
          Quick Management Actions:
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/organizer/events/create" className="btn btn-outline" style={{ backgroundColor: '#ffffff' }}>
            <FiPlus /> Create Event
          </Link>
          <Link to="/organizer/tasks" className="btn btn-outline" style={{ backgroundColor: '#ffffff' }}>
            <FiCheckSquare /> Add Task
          </Link>
          <Link to="/organizer/volunteers" className="btn btn-outline" style={{ backgroundColor: '#ffffff' }}>
            <FiUsers /> Assign Volunteer
          </Link>
          <Link to="/organizer/announcements" className="btn btn-outline" style={{ backgroundColor: '#ffffff' }}>
            <FiBell /> Post Announcement
          </Link>
        </div>
      </div>

      {/* Double Column Tables: Recent Registrations & Pending Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
        {/* Recent Registrations Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Registrations</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest students joining events</p>
            </div>
            <Link to="/organizer/participants" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All →
            </Link>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Event</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((p) => (
                  <tr key={p.id || p._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name || p.studentName || 'Student'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.department || 'General'}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {((p.eventName || p.event?.title || p.title || 'Campus Event').split(':')[0])}
                    </td>
                    <td>
                      <StatusBadge status={p.status || 'Confirmed'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending & Urgent Operational Tasks */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Critical & Pending Tasks</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>High priority duties requiring completion</p>
            </div>
            <Link to="/organizer/tasks" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
              Manage Tasks →
            </Link>
          </div>

          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {urgentTasks.map((t) => (
              <div
                key={t.id || t._id}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t.eventName || t.event?.title || 'Campus Event'} • Assignee: <strong>{t.assignedVolunteerName || t.assignedVolunteer?.name || 'Unassigned'}</strong>
                  </div>
                </div>
                <StatusBadge status={t.status || 'Pending'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
