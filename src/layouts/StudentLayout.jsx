import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userRole = localStorage.getItem('userRole') || 'student';

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole="student"
      />

      <div className="main-content-wrapper">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          userRole="student"
        />

        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
