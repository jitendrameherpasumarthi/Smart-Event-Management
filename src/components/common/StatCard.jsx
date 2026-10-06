import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up',
  description,
  colorScheme = 'blue' // blue, purple, emerald, amber
}) => {
  const colorMap = {
    blue: {
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      accent: '#2563eb'
    },
    purple: {
      iconBg: '#f5f3ff',
      iconColor: '#7c3aed',
      accent: '#7c3aed'
    },
    emerald: {
      iconBg: '#ecfdf5',
      iconColor: '#10b981',
      accent: '#10b981'
    },
    amber: {
      iconBg: '#fffbeb',
      iconColor: '#f59e0b',
      accent: '#f59e0b'
    }
  };

  const scheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <div className="stat-card">
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {value}
        </h3>
        
        {(trend || description) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
            {trend && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: trendType === 'up' ? '#059669' : '#dc2626',
                  backgroundColor: trendType === 'up' ? '#ecfdf5' : '#fef2f2',
                  padding: '0.15rem 0.45rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {trendType === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                {trend}
              </span>
            )}
            {description && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                {description}
              </span>
            )}
          </div>
        )}
      </div>

      {Icon && (
        <div
          className="stat-icon-wrapper"
          style={{
            backgroundColor: scheme.iconBg,
            color: scheme.iconColor
          }}
        >
          <Icon />
        </div>
      )}
    </div>
  );
};

export default StatCard;
