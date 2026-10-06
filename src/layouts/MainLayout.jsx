import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FiCalendar, FiMenu, FiX, FiUser } from 'react-icons/fi';
import Footer from '../components/common/Footer';

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentRole = localStorage.getItem('userRole');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Public Navbar */}
      <header className="public-navbar">
        <Link to="/" className="brand-logo">
          <div className="brand-icon-box">
            <FiCalendar />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ lineHeight: 1.1 }}>EventHub</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              College Edition
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="public-nav-links">
          <NavLink to="/" className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}>
            Explore Events
          </NavLink>
          {currentRole && (
            <NavLink
              to={`/${currentRole}/dashboard`}
              className="public-nav-link"
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                backgroundColor: 'var(--primary-light)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              Go to {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard
            </NavLink>
          )}
        </nav>

        {/* Auth CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!currentRole ? (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join Portal
              </Link>
            </>
          ) : (
            <Link to={`/${currentRole}/dashboard`} className="btn btn-primary btn-sm">
              <FiUser /> Dashboard
            </Link>
          )}

          <button
            type="button"
            className="btn-ghost btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Main Page Outlet */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
