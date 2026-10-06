// Utility and Helper Functions for EventHub

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', options);
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

export const getStatusClass = (status) => {
  const normalized = (status || '').toLowerCase().trim();
  switch (normalized) {
    case 'completed':
    case 'active':
    case 'approved':
    case 'confirmed':
    case 'published':
      return 'badge-success';
    case 'in progress':
    case 'ongoing':
    case 'upcoming':
      return 'badge-info';
    case 'pending':
    case 'draft':
      return 'badge-warning';
    case 'cancelled':
    case 'rejected':
    case 'closed':
      return 'badge-danger';
    default:
      return 'badge-neutral';
  }
};

export const getPriorityClass = (priority) => {
  const normalized = (priority || '').toLowerCase().trim();
  switch (normalized) {
    case 'urgent':
      return 'priority-urgent';
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'priority-medium';
  }
};

export const getCategoryColor = (category) => {
  const normalized = (category || '').toLowerCase();
  if (normalized.includes('tech') || normalized.includes('hackathon')) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (normalized.includes('cultural') || normalized.includes('art')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (normalized.includes('sport')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (normalized.includes('workshop') || normalized.includes('seminar')) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-indigo-50 text-indigo-700 border-indigo-200';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
