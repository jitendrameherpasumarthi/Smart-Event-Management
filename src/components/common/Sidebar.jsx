import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiHome,
  FiUsers,
  FiUserCheck,
  FiCheckSquare,
  FiClock,
  FiBell,
  FiUser,
  FiLogOut,
  FiLayers,
  FiClipboard,
  FiGlobe,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose, userRole = 'student' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: FiHome },
    { name: 'My Events', path: '/student/events', icon: FiCalendar },
    { name: 'My Registrations', path: '/student/registrations', icon: FiClipboard },
    { name: 'Schedule', path: '/student/schedule', icon: FiClock },
    { name: 'Announcements', path: '/student/announcements', icon: FiBell },
    { name: 'My Profile', path: '/student/profile', icon: FiUser },
  ];

  const organizerLinks = [
    { name: 'Dashboard', path: '/organizer/dashboard', icon: FiHome },
    { name: 'Manage Events', path: '/organizer/events', icon: FiLayers },
    { name: 'Participants', path: '/organizer/participants', icon: FiUsers },
    { name: 'Volunteers', path: '/organizer/volunteers', icon: FiUserCheck },
    { name: 'Tasks', path: '/organizer/tasks', icon: FiCheckSquare },
    { name: 'Schedule', path: '/organizer/schedule', icon: FiClock },
    { name: 'Announcements', path: '/organizer/announcements', icon: FiBell },
    { name: 'Profile', path: '/organizer/profile', icon: FiUser },
  ];

  const volunteerLinks = [
    { name: 'Dashboard', path: '/volunteer/dashboard', icon: FiHome },
    { name: 'Assigned Events', path: '/volunteer/events', icon: FiCalendar },
    { name: 'My Tasks', path: '/volunteer/tasks', icon: FiCheckSquare },
    { name: 'Schedule', path: '/volunteer/schedule', icon: FiClock },
    { name: 'Announcements', path: '/volunteer/announcements', icon: FiBell },
    { name: 'Volunteer Profile', path: '/volunteer/profile', icon: FiUser },
  ];

  const links =
    userRole === 'organizer'
      ? organizerLinks
      : userRole === 'volunteer'
      ? volunteerLinks
      : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <NavLink to="/" className="brand-logo" onClick={onClose}>
            <div className="brand-icon-box">
              <FiCalendar />
            </div>
            <div>
              <div style={{ lineHeight: 1.1 }}>EventHub</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                College Edition
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="btn-ghost btn-icon"
            style={{ display: 'none' }} // shown via media queries if necessary
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">
            {userRole.toUpperCase()} MENU
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="nav-icon" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}

          <div className="sidebar-section-title" style={{ marginTop: '1.25rem' }}>
            EXPLORE
          </div>

          <NavLink
            to="/events"
            onClick={onClose}
            className="nav-link"
          >
            <FiGlobe className="nav-icon" />
            <span>Public Events</span>
          </NavLink>
        </nav>

        {/* Footer actions */}
        <div className="sidebar-footer">
          <button
            type="button"
            onClick={handleLogout}
            className="nav-link"
            style={{
              width: '100%',
              color: 'var(--danger)',
              justifyContent: 'flex-start',
              padding: '0.65rem 0.75rem'
            }}
          >
            <FiLogOut className="nav-icon" style={{ color: 'var(--danger)' }} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
