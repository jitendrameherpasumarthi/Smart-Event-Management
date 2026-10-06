import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCheck, FiEdit2, FiStar, FiCalendar, FiAward } from 'react-icons/fi';
import { mockUsers } from '../../data/mockData';
import { getUserProfile, updateUserProfile } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const VolunteerProfile = () => {
  const [user, setUser] = useState(mockUsers.volunteer);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...mockUsers.volunteer,
    skillsInput: (mockUsers.volunteer.skills || []).join(', ')
  });
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getUserProfile('volunteer').then((data) => {
      if (isMounted && data) {
        setUser(data);
        setFormData({
          ...data,
          skillsInput: (data.skills || []).join(', ')
        });
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedSkills = formData.skillsInput
      ? formData.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : user.skills;

    const payload = {
      ...formData,
      skills: updatedSkills
    };

    try {
      const res = await updateUserProfile(payload);
      const updated = res.data || payload;
      setUser(updated);
      setFormData({
        ...updated,
        skillsInput: (updated.skills || []).join(', ')
      });
    } catch {
      setUser(payload);
    }

    setIsEditing(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <PageHeader
        title="Volunteer Marshal Profile"
        subtitle="Manage duty preferences, special skill endorsements, and assigned festival responsibilities."
      >
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            <FiEdit2 />
            <span>Edit Profile</span>
          </button>
        )}
      </PageHeader>

      {showSavedMsg && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <FiCheck /> Volunteer profile updated successfully.
        </div>
      )}

      {isEditing ? (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Edit Volunteer Information
          </h3>

          <form onSubmit={handleSave}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Availability Schedule</label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="form-input"
                placeholder="e.g. Weekdays & Weekends (Full Day)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Operational Skills (Comma separated)</label>
              <input
                type="text"
                value={formData.skillsInput}
                onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                className="form-input"
                placeholder="Stage Management, AV Tech, Registration Desk, Crowd Control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio & Volunteer Experience</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--accent-light)',
                boxShadow: 'var(--shadow-md)'
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {user.name}
                </h2>
                <span className="badge badge-info" style={{ backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
                  Active Volunteer
                </span>
              </div>

              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {user.department} • {user.year}
              </p>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {user.bio}
              </p>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Skills & Logistics Expertise
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#eff6ff',
                      color: 'var(--primary)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid #bfdbfe'
                    }}
                  >
                    ★ {skill}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.88rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Availability: </span>
                <strong>{user.availability}</strong>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Assigned Event Responsibilities
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {user.assignedEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-main)'
                    }}
                  >
                    📍 {evt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerProfile;
