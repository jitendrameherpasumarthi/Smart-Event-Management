import axios from 'axios';
import {
  mockEvents,
  mockParticipants,
  mockVolunteers,
  mockTasks,
  mockSchedules,
  mockAnnouncements,
  mockUsers,
} from '../data/mockData.js';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Safe storage wrapper for browser and test environments
const storage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        return globalThis.localStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      } else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.setItem(key, val);
      }
    } catch {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      } else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        globalThis.localStorage.removeItem(key);
      }
    } catch {}
  }
};

// Request interceptor: attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 token expiry and return payload
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);

// Helper to normalize backend documents so they always have `id`
const normalizeDoc = (doc) => {
  if (!doc || typeof doc !== 'object') return doc;
  return {
    ...doc,
    id: doc.customId || doc._id || doc.id,
    _id: doc._id || doc.id,
  };
};

const normalizeList = (list, fallback = []) => {
  if (!Array.isArray(list)) return fallback;
  return list.map(normalizeDoc);
};

/* =========================================================
   AUTH & USER SERVICES
   ========================================================= */
export const login = async (email, password) => {
  try {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.token) {
      storage.setItem('token', res.data.token);
      storage.setItem('userRole', res.data.user?.role || 'student');
      storage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const res = await apiClient.post('/auth/register', userData);
    if (res.data?.token) {
      storage.setItem('token', res.data.token);
      storage.setItem('userRole', res.data.user?.role || 'student');
      storage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMe = async () => {
  try {
    const res = await apiClient.get('/auth/me');
    return res.data?.user ? normalizeDoc(res.data.user) : null;
  } catch {
    const cached = storage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  }
};

export const logout = () => {
  storage.removeItem('token');
  storage.removeItem('userRole');
  storage.removeItem('user');
};

export const getUserProfile = async (role = 'student') => {
  try {
    const res = await apiClient.get('/users/profile');
    return res.data?.data ? normalizeDoc(res.data.data) : mockUsers[role] || mockUsers.student;
  } catch {
    return mockUsers[role] || mockUsers.student;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const res = await apiClient.put('/users/profile', profileData);
    if (res.data?.data) {
      storage.setItem('user', JSON.stringify(res.data.data));
    }
    return res.data;
  } catch (error) {
    if (error.response?.data) throw error.response.data;
    return { success: true, data: profileData };
  }
};

/* =========================================================
   EVENTS API
   ========================================================= */
export const getEvents = async (params = {}) => {
  try {
    const res = await apiClient.get('/events', { params });
    const events = res.data?.data || res.data;
    return normalizeList(events, mockEvents);
  } catch {
    return mockEvents;
  }
};

export const getEventById = async (id) => {
  try {
    const res = await apiClient.get(`/events/${id}`);
    const event = res.data?.data || res.data;
    return event ? normalizeDoc(event) : mockEvents.find((evt) => evt.id === id) || null;
  } catch {
    return mockEvents.find((evt) => evt.id === id) || null;
  }
};

export const createEvent = async (data) => {
  try {
    const res = await apiClient.post('/events', data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    if (error.response?.data) throw error.response.data;
    return { id: `evt-${Date.now()}`, ...data };
  }
};

export const updateEvent = async (id, data) => {
  try {
    const res = await apiClient.put(`/events/${id}`, data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    if (error.response?.data) throw error.response.data;
    return { id, ...data };
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await apiClient.delete(`/events/${id}`);
    return res.data;
  } catch (error) {
    if (error.response?.data) throw error.response.data;
    return { success: true, id };
  }
};

/* =========================================================
   PARTICIPANTS & REGISTRATIONS API
   ========================================================= */
export const getRegistrations = async (params = {}) => {
  try {
    const res = await apiClient.get('/registrations', { params });
    const regs = res.data?.data || res.data;
    return normalizeList(regs, mockParticipants);
  } catch {
    return mockParticipants;
  }
};

export const getParticipants = async (params = {}) => {
  return await getRegistrations(params);
};

export const getRegistrationById = async (id) => {
  try {
    const res = await apiClient.get(`/registrations/${id}`);
    return res.data?.data ? normalizeDoc(res.data.data) : null;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createRegistration = async (data) => {
  try {
    const res = await apiClient.post('/registrations', data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerForEvent = async (eventId, participantData = {}) => {
  try {
    const res = await apiClient.post('/registrations', {
      eventId,
      ...participantData,
    });
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cancelRegistration = async (id) => {
  try {
    const res = await apiClient.delete(`/registrations/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateRegistrationStatus = async (id, status) => {
  try {
    const res = await apiClient.patch(`/registrations/${id}/status`, { status });
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* =========================================================
   VOLUNTEERS API
   ========================================================= */
export const getVolunteers = async (params = {}) => {
  try {
    const res = await apiClient.get('/volunteers', { params });
    const vols = res.data?.data || res.data;
    return normalizeList(vols, mockVolunteers);
  } catch {
    return mockVolunteers;
  }
};

export const getMyVolunteerProfile = async () => {
  try {
    const res = await apiClient.get('/volunteers/me');
    return res.data?.data ? normalizeDoc(res.data.data) : null;
  } catch {
    return mockUsers.volunteer;
  }
};

export const createVolunteer = async (data) => {
  try {
    const res = await apiClient.post('/volunteers', data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateVolunteerStatus = async (id, status) => {
  try {
    const res = await apiClient.patch(`/volunteers/${id}/status`, { status });
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const assignEventToVolunteer = async (id, eventName) => {
  try {
    const res = await apiClient.post(`/volunteers/${id}/assign-event`, { eventName });
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* =========================================================
   TASKS API
   ========================================================= */
export const getTasks = async (params = {}) => {
  try {
    const res = await apiClient.get('/tasks', { params });
    const tasks = res.data?.data || res.data;
    return normalizeList(tasks, mockTasks);
  } catch {
    return mockTasks;
  }
};

export const getMyTasks = async () => {
  try {
    const res = await apiClient.get('/tasks/my');
    const tasks = res.data?.data || res.data;
    return normalizeList(tasks, mockTasks);
  } catch {
    return mockTasks;
  }
};

export const createTask = async (data) => {
  try {
    const res = await apiClient.post('/tasks', data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateTask = async (id, data) => {
  try {
    const res = await apiClient.put(`/tasks/${id}`, data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    const res = await apiClient.patch(`/tasks/${taskId}/status`, { status });
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteTask = async (id) => {
  try {
    const res = await apiClient.delete(`/tasks/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* =========================================================
   SCHEDULES API
   ========================================================= */
export const getSchedules = async (params = {}) => {
  try {
    const res = await apiClient.get('/schedules', { params });
    const schedules = res.data?.data || res.data;
    return normalizeList(schedules, mockSchedules);
  } catch {
    return mockSchedules;
  }
};

export const getScheduleById = async (id) => {
  try {
    const res = await apiClient.get(`/schedules/${id}`);
    return res.data?.data ? normalizeDoc(res.data.data) : null;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createSchedule = async (data) => {
  try {
    const res = await apiClient.post('/schedules', data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateSchedule = async (id, data) => {
  try {
    const res = await apiClient.put(`/schedules/${id}`, data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteSchedule = async (id) => {
  try {
    const res = await apiClient.delete(`/schedules/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* =========================================================
   ANNOUNCEMENTS API
   ========================================================= */
export const getAnnouncements = async (params = {}) => {
  try {
    const res = await apiClient.get('/announcements', { params });
    const announcements = res.data?.data || res.data;
    return normalizeList(announcements, mockAnnouncements);
  } catch {
    return mockAnnouncements;
  }
};

export const getAnnouncementById = async (id) => {
  try {
    const res = await apiClient.get(`/announcements/${id}`);
    return res.data?.data ? normalizeDoc(res.data.data) : null;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createAnnouncement = async (data) => {
  try {
    const res = await apiClient.post('/announcements', data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateAnnouncement = async (id, data) => {
  try {
    const res = await apiClient.put(`/announcements/${id}`, data);
    return res.data?.data ? normalizeDoc(res.data.data) : res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const res = await apiClient.delete(`/announcements/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/* =========================================================
   DASHBOARD ANALYTICS API
   ========================================================= */
export const getStudentDashboard = async () => {
  try {
    const res = await apiClient.get('/dashboard/student');
    return res.data?.data || null;
  } catch {
    return null;
  }
};

export const getOrganizerDashboard = async () => {
  try {
    const res = await apiClient.get('/dashboard/organizer');
    return res.data?.data || null;
  } catch {
    return null;
  }
};

export const getVolunteerDashboard = async () => {
  try {
    const res = await apiClient.get('/dashboard/volunteer');
    return res.data?.data || null;
  } catch {
    return null;
  }
};

/* =========================================================
   HEALTH CHECK API
   ========================================================= */
export const getHealth = async () => {
  try {
    const res = await apiClient.get('/health');
    return res.data;
  } catch (error) {
    return { success: false, status: 'offline', error: error.message };
  }
};

export default apiClient;
