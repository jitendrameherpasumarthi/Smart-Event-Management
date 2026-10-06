import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiBell,
  FiSearch,
  FiUser,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiChevronDown,
  FiCheckCircle
} from 'react-icons/fi';
import { mockUsers } from '../../data/mockData';
import { logout } from '../../services/api';

const Navbar = ({ onToggleSidebar, userRole = 'student' }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem('user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return mockUsers[userRole] || mockUsers.student;
  });

  useEffect(() => {
    const cached = localStorage.getItem('user');
    if (cached) {
      try {
        setCurrentUser(JSON.parse(cached));
      } catch {
        // ignore
      }
    } else {
      setCurrentUser(mockUsers[userRole] || mockUsers.student);
    }
  }, [userRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfilePath = () => {
    if (userRole === 'organizer') return '/organizer/profile';
    if (userRole === 'volunteer') return '/volunteer/profile';
    return '/student/profile';
  };

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn-ghost btn-icon"
          style={{ display: 'flex', fontSize: '1.25rem' }}
          aria-label="Toggle navigation menu"
        >
          <FiMenu />
        </button>

        {/* Global Quick Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: 'var(--text-light)',
              fontSize: '1rem'
            }}
          />
          <input
            type="text"
            placeholder="Search within portal..."
            style={{
              padding: '0.45rem 0.85rem 0.45rem 2.3rem',
              fontSize: '0.85rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#f8fafc',
              outline: 'none',
              width: '220px',
              transition: 'var(--transition)'
            }}
            onFocus={(e) => {
              e.target.style.width = '300px';
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
              e.target.style.width = '220px';
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.borderColor = 'var(--border-color)';
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Role switcher badge / indicator */}
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor:
              userRole === 'organizer'
                ? '#f5f3ff'
                : userRole === 'volunteer'
                ? '#ecfdf5'
                : '#eff6ff',
            color:
              userRole === 'organizer'
                ? '#6d28d9'
                : userRole === 'volunteer'
                ? '#047857'
                : '#1d4ed8',
            border: `1px solid ${
              userRole === 'organizer'
                ? '#ddd6fe'
                : userRole === 'volunteer'
                ? '#a7f3d0'
                : '#bfdbfe'
            }`
          }}
        >
          {userRole} Portal
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            style={{
              position: 'relative',
              fontSize: '1.2rem',
              color: 'var(--text-muted)'
            }}
            aria-label="Notifications"
          >
            <FiBell />
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--danger)',
                borderRadius: '50%',
                border: '2px solid #ffffff'
              }}
            />
          </button>

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '320px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                zIndex: 60,
                overflow: 'hidden',
                animation: 'slideUp 0.2s ease-out'
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</span>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>3 New</span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    🎉 TechFest 2026 Room Allocation
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Check CS Block lab schedules</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>10 mins ago</span>
                </div>
                <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.82rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    ⚡ CodeSprint Hackathon Update
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Prize pool elevated to ₹1,50,000</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>1 hour ago</span>
                </div>
                <div style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    📋 Volunteer Meeting Tomorrow
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Room 102 at 04:30 PM</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Yesterday</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)'
            }}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border-color)'
              }}
            />
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {currentUser.role}
              </span>
            </div>
            <FiChevronDown style={{ color: 'var(--text-light)', fontSize: '0.9rem' }} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '220px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                zIndex: 60,
                padding: '0.5rem',
                animation: 'slideUp 0.2s ease-out'
              }}
            >
              <div style={{ padding: '0.65rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.35rem' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.name}</p>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{currentUser.email}</p>
              </div>

              <Link
                to={getProfilePath()}
                onClick={() => setDropdownOpen(false)}
                className="nav-link"
                style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
              >
                <FiUser className="nav-icon" style={{ fontSize: '1rem' }} />
                View Profile
              </Link>

              <Link
                to="/events"
                onClick={() => setDropdownOpen(false)}
                className="nav-link"
                style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
              >
                <FiCalendar className="nav-icon" style={{ fontSize: '1rem' }} />
                Explore Public Events
              </Link>

              <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.35rem 0' }}></div>

              <button
                type="button"
                onClick={handleLogout}
                className="nav-link"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <FiLogOut className="nav-icon" style={{ fontSize: '1rem', color: 'var(--danger)' }} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
