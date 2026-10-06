import React from 'react';
import { getStatusClass } from '../../utils/helpers';

const StatusBadge = ({ status, customClass = '' }) => {
  if (!status) return null;
  const statusClass = getStatusClass(status);

  return (
    <span className={`badge ${statusClass} ${customClass}`}>
      <span className="badge-dot"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
