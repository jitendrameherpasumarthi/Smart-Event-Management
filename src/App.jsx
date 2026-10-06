import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import StudentLayout from './layouts/StudentLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import VolunteerLayout from './layouts/VolunteerLayout';

// Public Pages
import Home from './pages/public/Home';
import Events from './pages/public/Events';
import EventDetails from './pages/public/EventDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyEvents from './pages/student/MyEvents';
import MyRegistrations from './pages/student/MyRegistrations';
import StudentSchedule from './pages/student/StudentSchedule';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentProfile from './pages/student/StudentProfile';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import ManageEvents from './pages/organizer/ManageEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/organizer/EditEvent';
import Participants from './pages/organizer/Participants';
import Volunteers from './pages/organizer/Volunteers';
import Tasks from './pages/organizer/Tasks';
import Schedule from './pages/organizer/Schedule';
import Announcements from './pages/organizer/Announcements';
import OrganizerProfile from './pages/organizer/OrganizerProfile';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerEvents from './pages/volunteer/VolunteerEvents';
import MyTasks from './pages/volunteer/MyTasks';
import VolunteerSchedule from './pages/volunteer/VolunteerSchedule';
import VolunteerAnnouncements from './pages/volunteer/VolunteerAnnouncements';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';

// Route Protection Component for Demo Auth
const ProtectedRoute = ({ allowedRole, children }) => {
  const currentRole = localStorage.getItem('userRole');

  if (!currentRole) {
    // If not authenticated in demo mode, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user role doesn't match the required portal, redirect to their own dashboard
  if (allowedRole && currentRole !== allowedRole) {
    return <Navigate to={`/${currentRole}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Student Portal Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="events" element={<MyEvents />} />
          <Route path="registrations" element={<MyRegistrations />} />
          <Route path="schedule" element={<StudentSchedule />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Organizer Portal Routes */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRole="organizer">
              <OrganizerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/organizer/dashboard" replace />} />
          <Route path="dashboard" element={<OrganizerDashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/edit/:id" element={<EditEvent />} />
          <Route path="participants" element={<Participants />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="profile" element={<OrganizerProfile />} />
        </Route>

        {/* Volunteer Portal Routes */}
        <Route
          path="/volunteer"
          element={
            <ProtectedRoute allowedRole="volunteer">
              <VolunteerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/volunteer/dashboard" replace />} />
          <Route path="dashboard" element={<VolunteerDashboard />} />
          <Route path="events" element={<VolunteerEvents />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="schedule" element={<VolunteerSchedule />} />
          <Route path="announcements" element={<VolunteerAnnouncements />} />
          <Route path="profile" element={<VolunteerProfile />} />
        </Route>

        {/* 404 Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
