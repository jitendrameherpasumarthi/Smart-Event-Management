import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCompass } from 'react-icons/fi';
import { mockEvents, mockTasks, mockUsers } from '../../data/mockData';
import { getEvents, getMyVolunteerProfile, getTasks } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import VolunteerEventCard from '../../components/volunteer/VolunteerEventCard';
import EmptyState from '../../components/common/EmptyState';

const VolunteerEvents = () => {
  const [events, setEvents] = useState(mockEvents);
  const [tasks, setTasks] = useState(mockTasks);
  const [volunteerProfile, setVolunteerProfile] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : mockUsers.volunteer;
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([getEvents(), getMyVolunteerProfile(), getTasks()]).then(([evts, profile, tsks]) => {
      if (isMounted) {
        if (Array.isArray(evts) && evts.length > 0) setEvents(evts);
        if (profile) setVolunteerProfile(profile);
        if (Array.isArray(tsks) && tsks.length > 0) setTasks(tsks);
      }
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  const assignedTitles = volunteerProfile.assignedEvents || mockUsers.volunteer.assignedEvents;
  const assignedEvents = events.filter((e) =>
    assignedTitles.some((title) => (e.title || '').includes(title.split(' ')[0]))
  );

  return (
    <div>
      <PageHeader
        title="My Assigned Events & Festivals"
        subtitle="Review events where you are registered as a designated volunteer, view duty locations, and monitor task completion."
      />

      {assignedEvents.length > 0 ? (
        <div className="grid-cols-3">
          {assignedEvents.map((evt) => {
            const eventTasks = tasks.filter((t) => (t.eventId === evt.id || t.eventId === evt._id || t.eventName === evt.title));
            const doneTasks = eventTasks.filter((t) => t.status === 'Completed');
            return (
              <VolunteerEventCard
                key={evt.id || evt._id}
                event={evt}
                tasksCount={eventTasks.length || 3}
                completedCount={doneTasks.length || 1}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FiCalendar}
          title="No events currently assigned"
          description="The faculty organizing committee will assign volunteer duties as upcoming event dates approach."
        />
      )}
    </div>
  );
};

export default VolunteerEvents;
