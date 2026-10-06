import React, { useState, useEffect } from 'react';
import { FiCheckSquare, FiPlus, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { mockTasks, mockEvents, mockVolunteers } from '../../data/mockData';
import { getTasks, createTask, updateTask, deleteTask, getEvents, getVolunteers } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import TaskTable from '../../components/organizer/TaskTable';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';

const Tasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [events, setEvents] = useState(mockEvents);
  const [volunteers, setVolunteers] = useState(mockVolunteers);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedToDelete, setSelectedToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventId: mockEvents[0]?.id || '',
    assignedVolunteerId: mockVolunteers[0]?.id || '',
    priority: 'High',
    deadline: '2026-11-15 10:00 AM',
    status: 'Pending'
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([getTasks(), getEvents(), getVolunteers()]).then(([tsks, evts, vols]) => {
      if (isMounted) {
        if (Array.isArray(tsks) && tsks.length > 0) setTasks(tsks);
        if (Array.isArray(evts) && evts.length > 0) setEvents(evts);
        if (Array.isArray(vols) && vols.length > 0) setVolunteers(vols);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      eventId: events[0]?.id || events[0]?._id || '',
      assignedVolunteerId: volunteers[0]?.id || volunteers[0]?._id || '',
      priority: 'High',
      deadline: '2026-11-15 10:00 AM',
      status: 'Pending'
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      eventId: task.eventId || task.event?._id || '',
      assignedVolunteerId: task.assignedVolunteerId || '',
      priority: task.priority || 'Medium',
      deadline: task.deadline || '',
      status: task.status || 'Pending'
    });
    setShowCreateModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    const eventObj = events.find((evt) => (evt.id === formData.eventId || evt._id === formData.eventId));
    const volunteerObj = volunteers.find((v) => (v.id === formData.assignedVolunteerId || v._id === formData.assignedVolunteerId));

    const taskPayload = {
      title: formData.title,
      description: formData.description,
      eventId: formData.eventId,
      eventName: eventObj ? eventObj.title : 'TechFest 2026',
      assignedVolunteerId: formData.assignedVolunteerId,
      assignedVolunteerName: volunteerObj ? volunteerObj.name : 'Unassigned',
      priority: formData.priority,
      deadline: formData.deadline,
      status: formData.status
    };

    if (editingTask) {
      try {
        const res = await updateTask(editingTask._id || editingTask.id, taskPayload);
        const updated = res.data || { ...editingTask, ...taskPayload };
        setTasks(tasks.map((t) => ((t._id === editingTask._id || t.id === editingTask.id) ? updated : t)));
      } catch {
        setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...editingTask, ...taskPayload } : t)));
      }
    } else {
      try {
        const res = await createTask(taskPayload);
        const created = res.data || { ...taskPayload, id: `tsk-${Date.now()}` };
        setTasks([created, ...tasks]);
      } catch {
        const newTask = {
          id: `tsk-${Date.now()}`,
          ...taskPayload
        };
        setTasks([newTask, ...tasks]);
      }
    }

    setShowCreateModal(false);
  };

  const handleDeleteRequest = (task) => {
    setSelectedToDelete(task);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedToDelete) {
      try {
        await deleteTask(selectedToDelete._id || selectedToDelete.id);
      } catch (err) {
        console.warn('Delete task notice:', err);
      }
      setTasks(tasks.filter((t) => (t._id !== selectedToDelete._id && t.id !== selectedToDelete.id)));
    }
    setIsConfirmOpen(false);
    setSelectedToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Event Operations & Task Delegation"
        subtitle="Create logistical tasks, delegate duties to volunteer coordinators, and monitor live progress across campus fests."
      >
        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-primary"
        >
          <FiPlus />
          <span>Create Task</span>
        </button>
      </PageHeader>

      {/* Metric Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Total Tasks"
          value={total}
          icon={FiCheckSquare}
          colorScheme="blue"
          description="assigned across teams"
        />
        <StatCard
          title="Pending Action"
          value={pending}
          icon={FiClock}
          colorScheme="amber"
          description="awaiting initiation"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={FiAlertCircle}
          colorScheme="purple"
          description="actively being handled"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={FiCheckCircle}
          colorScheme="emerald"
          description="verified & finished"
        />
      </div>

      {tasks.length > 0 ? (
        <TaskTable
          tasks={tasks}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteRequest}
        />
      ) : (
        <EmptyState
          icon={FiCheckSquare}
          title="No operational tasks delegated yet"
          description="Start planning fest logistics by delegating tasks to student volunteers."
          actionLabel="Create First Task"
          onAction={handleOpenCreate}
        />
      )}

      {/* Create / Edit Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {editingTask ? 'Edit Task Details' : 'Create & Assign Task'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-ghost btn-icon"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTask}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Test Audio-Visual Rig at Main Auditorium"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Instructions</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-textarea"
                    rows="3"
                    placeholder="Provide detailed instructions for the volunteer..."
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Associated Event</label>
                    <select
                      value={formData.eventId}
                      onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                      className="form-select"
                      required
                    >
                      {events.map((evt) => (
                        <option key={evt.id || evt._id} value={evt.id || evt._id}>
                          {evt.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assigned Volunteer</label>
                    <select
                      value={formData.assignedVolunteerId}
                      onChange={(e) => setFormData({ ...formData, assignedVolunteerId: e.target.value })}
                      className="form-select"
                      required
                    >
                      {volunteers.map((vol) => (
                        <option key={vol.id || vol._id} value={vol.id || vol._id}>
                          {vol.name} ({vol.department})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="form-select"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="form-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Completion Deadline</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 2026-11-15 05:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Save Changes' : 'Delegate Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Task?"
        message={`Are you sure you want to delete "${selectedToDelete?.title}"? This task assignment will be removed.`}
        confirmLabel="Delete Task"
        cancelLabel="Keep"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default Tasks;
