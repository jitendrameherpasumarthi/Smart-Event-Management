import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiUsers,
  FiCheckSquare,
  FiClock,
  FiBell,
  FiBarChart2,
  FiArrowRight,
  FiCheckCircle,
  FiCompass,
  FiShield,
  FiAward
} from 'react-icons/fi';
import { mockEvents } from '../../data/mockData';
import { getEvents } from '../../services/api';
import EventCard from '../../components/student/EventCard';

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockEvents);

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

  const upcomingEvents = events.slice(0, 4);

  const features = [
    {
      icon: FiCalendar,
      title: "Event Management",
      description: "Create, organize and manage college events effortlessly with full agenda and venue tracking.",
      color: "blue"
    },
    {
      icon: FiUsers,
      title: "Volunteer Coordination",
      description: "Assign volunteers to specific duties, monitor workload balance, and track execution live.",
      color: "purple"
    },
    {
      icon: FiCheckSquare,
      title: "Task Management",
      description: "Create actionable tasks, assign priorities, set deadlines, and monitor real-time completion.",
      color: "emerald"
    },
    {
      icon: FiClock,
      title: "Smart Scheduling",
      description: "Keep everyone synced with centralized real-time event timelines and session agendas.",
      color: "amber"
    },
    {
      icon: FiBell,
      title: "Targeted Announcements",
      description: "Broadcast urgent circulars and updates directly to participants and volunteer squads.",
      color: "blue"
    },
    {
      icon: FiBarChart2,
      title: "Live Analytics",
      description: "Track registrations, ticket velocity, task burn-down, and volunteer participation rates.",
      color: "purple"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Create Event",
      desc: "Organizers define agendas, venues, ticket quotas, and registration criteria."
    },
    {
      step: "02",
      title: "Register Participants",
      desc: "Students browse upcoming symposiums, workshops and register in one click."
    },
    {
      step: "03",
      title: "Assign Volunteers",
      desc: "Delegate duties, AV logistics, hospitality, and crowd management tasks."
    },
    {
      step: "04",
      title: "Conduct Event",
      desc: "Execute flawlessly with live timelines, check-ins, and broadcast alerts."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <div className="hero-badge">
            <FiAward style={{ color: 'var(--primary)' }} />
            <span>Smart College Event OS</span>
          </div>

          <h1 className="hero-title">
            Manage College Events <span className="hero-gradient-text">Smarter.</span>
          </h1>

          <p className="hero-description">
            Plan events, coordinate volunteers, manage participants, schedules, tasks, and announcements from one centralized platform.
          </p>

          <div className="hero-cta-group">
            <Link to="/events" className="btn btn-primary btn-lg">
              <FiCompass />
              <span>Explore Events</span>
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              <span>Get Started</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* Quick metric highlights */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>2,000+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Students</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>50+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campus Events / Year</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>99.4%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Hero Illustration / Modern Dashboard Card Visual */}
        <div>
          <div className="hero-card-preview">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.5rem' }}>EventHub Command Center</span>
              </div>
              <span className="badge badge-success">Live Operations</span>
            </div>

            {/* Mock Live Event card preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  <FiCalendar />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>TechFest 2026: Apex Tech Expo</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Main Auditorium • 384 Registrations</div>
                </div>
                <span className="badge badge-info">Ongoing</span>
              </div>

              {/* Mini task feed */}
              <div style={{ padding: '0.85rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Active Volunteer Deployment</span>
                  <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>4 Assigned</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FiCheckCircle style={{ color: '#10b981' }} /> Main Stage Sound Check
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>Rohan G.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FiClock style={{ color: '#3b82f6' }} /> QR Check-in Counter Setup
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>Priyanka N.</span>
                  </div>
                </div>
              </div>

              {/* Live Metric bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                <div style={{ padding: '0.65rem', backgroundColor: '#f5f3ff', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed' }}>96%</div>
                  <div style={{ fontSize: '0.7rem', color: '#6d28d9' }}>Capacity</div>
                </div>
                <div style={{ padding: '0.65rem', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>15/15</div>
                  <div style={{ fontSize: '0.7rem', color: '#047857' }}>Keynotes Set</div>
                </div>
                <div style={{ padding: '0.65rem', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2563eb' }}>100%</div>
                  <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>Volunteer Sync</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section" style={{ backgroundColor: '#ffffff' }}>
        <div className="section-header">
          <span className="section-badge">Comprehensive Platform</span>
          <h2 className="section-title">Engineered for Seamless Campus Events</h2>
          <p className="section-subtitle">
            From technical hackathons to massive cultural fests, EventHub delivers the toolset college organizers need.
          </p>
        </div>

        <div className="grid-cols-3">
          {features.map((f, index) => {
            const Icon = f.icon;
            return (
              <div
                key={index}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'var(--transition)'
                }}
              >
                <div
                  className="stat-icon-wrapper"
                  style={{
                    backgroundColor:
                      f.color === 'purple'
                        ? '#f5f3ff'
                        : f.color === 'emerald'
                        ? '#ecfdf5'
                        : f.color === 'amber'
                        ? '#fffbeb'
                        : '#eff6ff',
                    color:
                      f.color === 'purple'
                        ? '#7c3aed'
                        : f.color === 'emerald'
                        ? '#10b981'
                        : f.color === 'amber'
                        ? '#f59e0b'
                        : '#2563eb'
                  }}
                >
                  <Icon />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-section">
        <div className="section-header">
          <span className="section-badge">Simple & Intuitive</span>
          <h2 className="section-title">How EventHub Powers Your Campus</h2>
          <p className="section-subtitle">
            Follow our 4-step workflow to effortlessly execute your next flagship event.
          </p>
        </div>

        <div className="grid-cols-4">
          {steps.map((s, index) => (
            <div
              key={index}
              className="card"
              style={{
                position: 'relative',
                paddingTop: '2rem'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '20px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
                }}
              >
                {s.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Showcase */}
      <section className="landing-section" style={{ backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="section-badge">Campus Buzz</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Upcoming Events</h2>
          </div>
          <Link to="/events" className="btn btn-outline">
            <span>View All Events</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid-cols-4">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterClick={(evt) => navigate(`/events/${evt.id}`)}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
          color: '#ffffff',
          padding: '4.5rem 2rem',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to organize your next college event?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6, color: '#e0e7ff' }}>
            Join hundreds of collegiate committees, student societies, and volunteer squads using EventHub to deliver memorable experiences.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              className="btn btn-lg"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              Get Started Now
            </Link>
            <Link
              to="/events"
              className="btn btn-lg"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Explore Campus Calendar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
