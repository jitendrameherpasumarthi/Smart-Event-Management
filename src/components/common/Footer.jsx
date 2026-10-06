import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiHeart, FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-grid">
        <div>
          <div className="brand-logo" style={{ marginBottom: '1rem' }}>
            <div className="brand-icon-box">
              <FiCalendar />
            </div>
            <span>EventHub</span>
          </div>
          <p style={{ maxWidth: '320px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            Smart Event Management & Volunteer Coordination Platform built for modern colleges and campus communities.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="#github" className="btn-icon btn-outline" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="#twitter" className="btn-icon btn-outline" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#linkedin" className="btn-icon btn-outline" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href="#contact" className="btn-icon btn-outline" aria-label="Email">
              <FiMail />
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <Link to="/events" className="public-nav-link">Explore Events</Link>
            </li>
            <li>
              <Link to="/login" className="public-nav-link">Role Sign In</Link>
            </li>
            <li>
              <Link to="/register" className="public-nav-link">Student Registration</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Portals
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li>
              <Link to="/student/dashboard" className="public-nav-link">Student Hub</Link>
            </li>
            <li>
              <Link to="/organizer/dashboard" className="public-nav-link">Organizer Studio</Link>
            </li>
            <li>
              <Link to="/volunteer/dashboard" className="public-nav-link">Volunteer Desk</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
            EventHub Vision
          </h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            Empowering students, campus leaders, and volunteer squads to plan, coordinate, and celebrate monumental events seamlessly.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} EventHub. All rights reserved. Plan. Coordinate. Celebrate.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          Crafted with <FiHeart style={{ color: 'var(--danger)' }} /> for Campus Excellence
        </div>
      </div>
    </footer>
  );
};

export default Footer;
