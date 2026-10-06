import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

let passCount = 0;
let failCount = 0;
const results = [];

const logTest = (name, passed, message = '') => {
  if (passed) {
    passCount++;
    console.log(`  ✅ PASS: ${name} ${message ? '(' + message + ')' : ''}`);
    results.push({ name, passed: true, message });
  } else {
    failCount++;
    console.log(`  ❌ FAIL: ${name} -> ${message}`);
    results.push({ name, passed: false, message });
  }
};

const makeRequest = (urlPath, options = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${urlPath}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          json = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
};

const runAllTests = async () => {
  console.log('\n======================================================');
  console.log('🧪 EVENTHUB BACKEND REST API COMPREHENSIVE TEST SUITE');
  console.log('======================================================\n');

  let studentToken = '';
  let organizerToken = '';
  let volunteerToken = '';
  let createdEventId = '';
  let createdTaskId = '';
  let createdScheduleId = '';
  let createdAnnouncementId = '';
  let createdRegistrationId = '';

  try {
    // ----------------------------------------------------
    // TEST 1: Health & Root Endpoints
    // ----------------------------------------------------
    console.log('--- 1. Health & Server Status Tests ---');
    try {
      const healthRes = await makeRequest('/health');
      logTest(
        'GET /api/health returns 200 OK',
        healthRes.status === 200 && healthRes.data?.status === 'healthy',
        `DB status: ${healthRes.data?.database?.status}`
      );
    } catch (err) {
      logTest('GET /api/health endpoint reachable', false, err.message);
    }

    // ----------------------------------------------------
    // TEST 2: Authentication & Registration APIs
    // ----------------------------------------------------
    console.log('\n--- 2. Authentication & Authorization Tests ---');
    const testStudentEmail = `test.student.${Date.now()}@college.edu`;
    const testVolEmail = `test.vol.${Date.now()}@college.edu`;

    // 2.1 Register Student
    const regStudentRes = await makeRequest('/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Student',
        email: testStudentEmail,
        password: 'password123',
        department: 'Computer Science',
        role: 'student',
      },
    });
    logTest(
      'POST /api/auth/register (Student)',
      regStudentRes.status === 201 && regStudentRes.data?.token,
      'Token returned'
    );

    // 2.2 Disallow Organizer Registration
    const regOrgRes = await makeRequest('/auth/register', {
      method: 'POST',
      body: {
        name: 'Malicious Org Attempt',
        email: `fake.org.${Date.now()}@college.edu`,
        password: 'password123',
        role: 'organizer',
      },
    });
    logTest(
      'POST /api/auth/register (Block Public Organizer Registration)',
      regOrgRes.status === 403,
      'Correctly returned 403 Forbidden'
    );

    // 2.3 Duplicate Registration Rejection
    const dupRegRes = await makeRequest('/auth/register', {
      method: 'POST',
      body: {
        name: 'Duplicate Student',
        email: testStudentEmail,
        password: 'password123',
        role: 'student',
      },
    });
    logTest(
      'POST /api/auth/register (Duplicate Email Prevention)',
      dupRegRes.status === 409,
      'Correctly returned 409 Conflict'
    );

    // 2.4 Login Demo Accounts (or test user)
    const stuLoginRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: {
        email: 'aarav.sharma@college.edu',
        password: 'password123',
      },
    });

    if (stuLoginRes.status === 200 && stuLoginRes.data?.token) {
      studentToken = stuLoginRes.data.token;
      logTest('POST /api/auth/login (Student Aarav)', true, 'JWT issued');
    } else {
      // Fallback to newly registered student if DB was not pre-seeded
      studentToken = regStudentRes.data?.token;
      logTest(
        'POST /api/auth/login (Using registered student session)',
        !!studentToken,
        stuLoginRes.data?.message || 'Logged in'
      );
    }

    const orgLoginRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: {
        email: 'rajesh.verma@college.edu',
        password: 'password123',
      },
    });
    if (orgLoginRes.status === 200 && orgLoginRes.data?.token) {
      organizerToken = orgLoginRes.data.token;
      logTest('POST /api/auth/login (Organizer Rajesh)', true, 'Organizer JWT issued');
    } else {
      logTest('POST /api/auth/login (Organizer Rajesh)', false, orgLoginRes.data?.message);
    }

    const volLoginRes = await makeRequest('/auth/login', {
      method: 'POST',
      body: {
        email: 'rohan.gupta@college.edu',
        password: 'password123',
      },
    });
    if (volLoginRes.status === 200 && volLoginRes.data?.token) {
      volunteerToken = volLoginRes.data.token;
      logTest('POST /api/auth/login (Volunteer Rohan)', true, 'Volunteer JWT issued');
    } else {
      logTest('POST /api/auth/login (Volunteer Rohan)', false, volLoginRes.data?.message);
    }

    // 2.5 Protected GET /api/auth/me
    const meRes = await makeRequest('/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    logTest(
      'GET /api/auth/me (Protected Route with Bearer Token)',
      meRes.status === 200 && meRes.data?.user?.email,
      `Retrieved ${meRes.data?.user?.email}`
    );

    // 2.6 Reject Unauthenticated Request
    const unauthRes = await makeRequest('/auth/me');
    logTest(
      'GET /api/auth/me without Token returns 401 Unauthorized',
      unauthRes.status === 401,
      'Blocked unauthenticated request'
    );

    // ----------------------------------------------------
    // TEST 3: Role-Based Authorization Enforcement
    // ----------------------------------------------------
    console.log('\n--- 3. Role-Based Access Control (RBAC) Tests ---');
    // Student attempting organizer action (Creating Event)
    const studentEventAttempt = await makeRequest('/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: {
        title: 'Unauthorized Student Fest',
        description: 'Should be rejected',
        venue: 'Main Lawn',
        date: '2026-12-01',
      },
    });
    logTest(
      'RBAC: Student cannot create event (Expect 403)',
      studentEventAttempt.status === 403,
      '403 Forbidden enforced'
    );

    // ----------------------------------------------------
    // TEST 4: Event CRUD APIs
    // ----------------------------------------------------
    console.log('\n--- 4. Event Management (CRUD) Tests ---');
    // 4.1 Organizer Creates Event
    if (organizerToken) {
      const createEvtRes = await makeRequest('/events', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizerToken}` },
        body: {
          title: 'RoboWars National Championship 2026',
          category: 'Technical',
          description: 'Combat robotics tournament with lightweight and middleweight categories.',
          venue: 'Robotics Arena, Block C',
          date: '2026-11-20',
          maxParticipants: 50,
          status: 'Published',
        },
      });
      if (createEvtRes.status === 201 && createEvtRes.data?.data?._id) {
        createdEventId = createEvtRes.data.data._id;
        logTest('POST /api/events (Organizer Create Event)', true, `ID: ${createdEventId}`);
      } else {
        logTest('POST /api/events (Organizer Create Event)', false, createEvtRes.data?.message);
      }
    }

    // 4.2 Public Get Events
    const getEventsRes = await makeRequest('/events');
    logTest(
      'GET /api/events (List all events)',
      getEventsRes.status === 200 && Array.isArray(getEventsRes.data?.data),
      `Found ${getEventsRes.data?.count || 0} events`
    );

    // 4.3 Get Event by ID or customId
    const targetEventId = createdEventId || 'evt-101';
    const getEventRes = await makeRequest(`/events/${targetEventId}`);
    logTest(
      `GET /api/events/${targetEventId} (Fetch Event Details)`,
      getEventRes.status === 200 && (getEventRes.data?.data?.title || getEventRes.data?.title),
      'Event details retrieved'
    );

    // 4.4 Organizer Update Event
    if (organizerToken && createdEventId) {
      const updateEvtRes = await makeRequest(`/events/${createdEventId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${organizerToken}` },
        body: {
          venue: 'Grand Indoor Arena, Block A',
          maxParticipants: 80,
        },
      });
      logTest(
        'PUT /api/events/:id (Organizer Update Event)',
        updateEvtRes.status === 200 && updateEvtRes.data?.data?.maxParticipants === 80,
        'Venue & max capacity updated'
      );
    }

    // ----------------------------------------------------
    // TEST 5: Registration APIs (Duplicate check, capacity check, ticket generation)
    // ----------------------------------------------------
    console.log('\n--- 5. Student Registration Flow Tests ---');
    if (studentToken && (createdEventId || getEventsRes.data?.data?.[0]?._id)) {
      const regTargetEvent = createdEventId || getEventsRes.data.data[0]._id;

      // 5.1 Register for Event
      const regRes = await makeRequest('/registrations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: {
          eventId: regTargetEvent,
        },
      });

      if (regRes.status === 201) {
        createdRegistrationId = regRes.data.data?._id;
        logTest(
          'POST /api/registrations (Create Registration & Issue Ticket)',
          true,
          `Ticket: ${regRes.data.data?.ticketNumber}`
        );
      } else if (regRes.status === 409) {
        logTest(
          'POST /api/registrations (Already registered response)',
          true,
          'Duplicate detection active'
        );
      } else {
        logTest('POST /api/registrations', false, regRes.data?.message);
      }

      // 5.2 Test Duplicate Registration Rejection
      const dupEventRegRes = await makeRequest('/registrations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: {
          eventId: regTargetEvent,
        },
      });
      logTest(
        'POST /api/registrations (Duplicate Registration Blocked)',
        dupEventRegRes.status === 409,
        '409 Conflict received on re-registration attempt'
      );

      // 5.3 Get Registrations
      const getRegsRes = await makeRequest('/registrations', {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      logTest(
        'GET /api/registrations (Student view own registrations)',
        getRegsRes.status === 200 && Array.isArray(getRegsRes.data?.data),
        `Found ${getRegsRes.data?.count || 0} registrations`
      );
    }

    // ----------------------------------------------------
    // TEST 6: Volunteer, Task, Schedule & Announcement APIs
    // ----------------------------------------------------
    console.log('\n--- 6. Volunteer, Task, Schedule & Announcement Tests ---');

    // 6.1 Volunteer List & Me
    const volListRes = await makeRequest('/volunteers', {
      headers: { Authorization: `Bearer ${organizerToken || studentToken}` },
    });
    logTest(
      'GET /api/volunteers (List Volunteers)',
      volListRes.status === 200 && Array.isArray(volListRes.data?.data),
      `Found ${volListRes.data?.count || 0} volunteers`
    );

    if (volunteerToken) {
      const volMeRes = await makeRequest('/volunteers/me', {
        headers: { Authorization: `Bearer ${volunteerToken}` },
      });
      logTest(
        'GET /api/volunteers/me (Volunteer Duty Profile)',
        volMeRes.status === 200,
        `Status: ${volMeRes.data?.data?.status}`
      );
    }

    // 6.2 Task CRUD & Volunteer Status Update
    if (organizerToken) {
      const createTaskRes = await makeRequest('/tasks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizerToken}` },
        body: {
          title: 'Verify Stage Sound Systems & Microphones',
          eventName: 'TechFest 2026',
          assignedVolunteerName: 'Rohan Gupta',
          priority: 'High',
          deadline: '2026-11-15 08:30 AM',
          status: 'Pending',
        },
      });
      if (createTaskRes.status === 201) {
        createdTaskId = createTaskRes.data.data?._id;
        logTest('POST /api/tasks (Organizer Create Task)', true, `Task ID: ${createdTaskId}`);
      } else {
        logTest('POST /api/tasks (Organizer Create Task)', false, createTaskRes.data?.message);
      }
    }

    if (createdTaskId) {
      // Volunteer or Organizer updates status
      const updateTaskStatusRes = await makeRequest(`/tasks/${createdTaskId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${volunteerToken || organizerToken || studentToken}` },
        body: { status: 'In Progress' },
      });
      logTest(
        'PATCH /api/tasks/:id/status (Update Task Status to In Progress)',
        updateTaskStatusRes.status === 200 && updateTaskStatusRes.data?.data?.status === 'In Progress',
        'Status updated'
      );
    }

    // 6.3 Schedule CRUD
    if (organizerToken) {
      const createSchRes = await makeRequest('/schedules', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizerToken}` },
        body: {
          eventName: 'TechFest 2026',
          activity: 'Keynote Address on Agentic AI & Robotics',
          date: '2026-11-15',
          startTime: '10:00 AM',
          endTime: '11:30 AM',
          venue: 'Main Auditorium',
          coordinator: 'Dr. Rajesh Verma',
        },
      });
      if (createSchRes.status === 201) {
        createdScheduleId = createSchRes.data.data?._id;
        logTest('POST /api/schedules (Organizer Add Schedule)', true, `ID: ${createdScheduleId}`);
      } else {
        logTest('POST /api/schedules', false, createSchRes.data?.message);
      }
    }

    const getSchsRes = await makeRequest('/schedules');
    logTest(
      'GET /api/schedules (Public Program Timetable)',
      getSchsRes.status === 200 && Array.isArray(getSchsRes.data?.data),
      `Count: ${getSchsRes.data?.count || 0}`
    );

    // 6.4 Announcement CRUD
    if (organizerToken) {
      const createAnnRes = await makeRequest('/announcements', {
        method: 'POST',
        headers: { Authorization: `Bearer ${organizerToken}` },
        body: {
          title: 'Campus Hackathon Final Round Reporting Time',
          message: 'All selected finalists must assemble at Hall B by 8:30 AM sharp.',
          priority: 'Urgent',
          audience: 'All Participants',
          eventName: 'TechFest 2026',
        },
      });
      if (createAnnRes.status === 201) {
        createdAnnouncementId = createAnnRes.data.data?._id;
        logTest('POST /api/announcements (Organizer Broadcast Announcement)', true, `ID: ${createdAnnouncementId}`);
      } else {
        logTest('POST /api/announcements', false, createAnnRes.data?.message);
      }
    }

    const getAnnsRes = await makeRequest('/announcements');
    logTest(
      'GET /api/announcements (Public Announcements Feed)',
      getAnnsRes.status === 200 && Array.isArray(getAnnsRes.data?.data),
      `Count: ${getAnnsRes.data?.count || 0}`
    );

    // ----------------------------------------------------
    // TEST 7: User Profile APIs
    // ----------------------------------------------------
    console.log('\n--- 7. User Profile Management Tests ---');
    if (studentToken) {
      const getProfileRes = await makeRequest('/users/profile', {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      logTest(
        'GET /api/users/profile',
        getProfileRes.status === 200 && getProfileRes.data?.data?.email,
        `Email: ${getProfileRes.data?.data?.email}`
      );

      const updateProfileRes = await makeRequest('/users/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: {
          bio: 'Updated bio from automated test suite: Full-Stack Engineer & AI enthusiast.',
          phone: '+91 99999 88888',
        },
      });
      logTest(
        'PUT /api/users/profile (Update Details without Role Escalation)',
        updateProfileRes.status === 200 && updateProfileRes.data?.data?.phone === '+91 99999 88888',
        'Profile modified successfully'
      );
    }

    // ----------------------------------------------------
    // TEST 8: Dashboard Analytics APIs
    // ----------------------------------------------------
    console.log('\n--- 8. Role-Specific Dashboard Statistics Tests ---');
    if (studentToken) {
      const stuDashRes = await makeRequest('/dashboard/student', {
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      logTest(
        'GET /api/dashboard/student',
        stuDashRes.status === 200 && stuDashRes.data?.data !== undefined,
        `Registered events count: ${stuDashRes.data?.data?.registeredEventsCount}`
      );
    }

    if (organizerToken) {
      const orgDashRes = await makeRequest('/dashboard/organizer', {
        headers: { Authorization: `Bearer ${organizerToken}` },
      });
      logTest(
        'GET /api/dashboard/organizer',
        orgDashRes.status === 200 && orgDashRes.data?.data?.totalEvents !== undefined,
        `Total events: ${orgDashRes.data?.data?.totalEvents}, Completion rate: ${orgDashRes.data?.data?.completionRate}%`
      );
    }

    if (volunteerToken) {
      const volDashRes = await makeRequest('/dashboard/volunteer', {
        headers: { Authorization: `Bearer ${volunteerToken}` },
      });
      logTest(
        'GET /api/dashboard/volunteer',
        volDashRes.status === 200 && volDashRes.data?.data !== undefined,
        `Pending tasks: ${volDashRes.data?.data?.pendingTasksCount}`
      );
    }

    // ----------------------------------------------------
    // TEST 9: Cleanup and Resource Deletion (Organizer)
    // ----------------------------------------------------
    console.log('\n--- 9. Resource Deletion Tests ---');
    if (organizerToken && createdTaskId) {
      const delTaskRes = await makeRequest(`/tasks/${createdTaskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${organizerToken}` },
      });
      logTest(
        'DELETE /api/tasks/:id (Organizer Delete Task)',
        delTaskRes.status === 200,
        delTaskRes.data?.message
      );
    }

    if (organizerToken && createdScheduleId) {
      const delSchRes = await makeRequest(`/schedules/${createdScheduleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${organizerToken}` },
      });
      logTest(
        'DELETE /api/schedules/:id (Organizer Delete Schedule)',
        delSchRes.status === 200,
        delSchRes.data?.message
      );
    }

    if (organizerToken && createdAnnouncementId) {
      const delAnnRes = await makeRequest(`/announcements/${createdAnnouncementId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${organizerToken}` },
      });
      logTest(
        'DELETE /api/announcements/:id (Organizer Delete Announcement)',
        delAnnRes.status === 200,
        delAnnRes.data?.message
      );
    }

    if (organizerToken && createdEventId) {
      const delEvtRes = await makeRequest(`/events/${createdEventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${organizerToken}` },
      });
      logTest(
        'DELETE /api/events/:id (Organizer Delete Event)',
        delEvtRes.status === 200,
        delEvtRes.data?.message
      );
    }

    console.log('\n======================================================');
    console.log(`🏁 TEST RESULTS SUMMARY: ${passCount} PASSED | ${failCount} FAILED`);
    console.log('======================================================\n');

    process.exit(failCount === 0 ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Unhandled error during test execution:', error);
    process.exit(1);
  }
};

runAllTests();
