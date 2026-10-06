import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiAward, FiEdit2, FiCheck, FiShield } from 'react-icons/fi';
import { mockUsers } from '../../data/mockData';
import { getUserProfile, updateUserProfile } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';

const OrganizerProfile = () => {
  const [user, setUser] = useState(mockUsers.organizer);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...mockUsers.organizer });
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getUserProfile('organizer').then((data) => {
      if (isMounted && data) {
        setUser(data);
        setFormData(data);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserProfile(formData);
      const updated = res.data || formData;
      setUser(updated);
      setFormData(updated);
    } catch {
      setUser(formData);
    }
    setIsEditing(false);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <PageHeader
        title="Organizer & Faculty Profile"
        subtitle="Manage faculty convener details, campus committee associations, and administrative roles."
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
          <FiCheck /> Organizer profile updated successfully.
        </div>
      )}

      {isEditing ? (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Edit Convener Profile
          </h3>

          <form onSubmit={handleSave}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name & Honorific</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institutional Email</label>
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
                <label className="form-label">Department / Faculty Division</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Administrative Designation</label>
                <input
                  type="text"
                  value={formData.roleTitle || 'Lead Faculty Convener'}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio & Event Coordination Background</label>
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
                border: '4px solid var(--secondary-light)',
                boxShadow: 'var(--shadow-md)'
              }}
            />

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {user.name}
                </h2>
                <span className="badge badge-info" style={{ backgroundColor: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}>
                  Convener / Organizer
                </span>
              </div>

              <p style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                {user.roleTitle || 'Lead Faculty Convener'} • {user.department}
              </p>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {user.bio}
              </p>
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Administrative Privileges
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Role Level:</span>
                  <span style={{ fontWeight: 700, color: '#6d28d9' }}>Super Organizer</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Managed Events:</span>
                  <span style={{ fontWeight: 600 }}>8 Active Symposiums</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Broadcast Access:</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>Campus Wide Authorized</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Official Contact
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                  <span style={{ fontWeight: 600 }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                  <span style={{ fontWeight: 600 }}>{user.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Office Location:</span>
                  <span style={{ fontWeight: 600 }}>Deanery Block, Room 204</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerProfile;
