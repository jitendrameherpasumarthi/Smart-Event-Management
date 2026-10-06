import React, { useState, useEffect } from 'react';
import { FiCheckSquare, FiFilter, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { mockTasks, mockUsers } from '../../data/mockData';
import { getMyTasks, updateTaskStatus } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import VolunteerTaskCard from '../../components/volunteer/VolunteerTaskCard';
import EmptyState from '../../components/common/EmptyState';

const MyTasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [activeFilter, setActiveFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    getMyTasks().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setTasks(data);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.warn('Task status update notice:', err);
    }

    setTasks(
      tasks.map((t) => ((t._id === taskId || t.id === taskId) ? { ...t, status: newStatus } : t))
    );

    if (newStatus === 'Completed') {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
      setSuccessMsg('Task marked as Completed! Great job!');
    } else {
      setSuccessMsg(`Task transitioned to ${newStatus}.`);
    }

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'All') return true;
    return (t.status || '').toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div>
      <PageHeader
        title="My Assigned Tasks & Action Items"
        subtitle="Manage assigned responsibilities, update task statuses as you execute, and coordinate with event conveners."
      />

      {successMsg && (
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
            fontSize: '0.88rem'
          }}
        >
          <FiCheckCircle /> {successMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: activeFilter === tab ? 'var(--primary)' : '#ffffff',
              color: activeFilter === tab ? '#ffffff' : 'var(--text-muted)',
              border: `1px solid ${activeFilter === tab ? 'var(--primary)' : 'var(--border-color)'}`,
              transition: 'var(--transition)'
            }}
          >
            {tab} Tasks
          </button>
        ))}
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid-cols-3">
          {filteredTasks.map((task) => (
            <VolunteerTaskCard
              key={task.id || task._id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiCheckSquare}
          title="No tasks in this category"
          description="You don't have any tasks matching this filter status right now."
        />
      )}
    </div>
  );
};

export default MyTasks;
