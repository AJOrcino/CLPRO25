import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScheduleItem {
  id: number;
  title: string;
  time: string;
  location: string;
  type: 'class' | 'exam' | 'assignment_due';
  status: 'upcoming' | 'in_progress' | 'completed';
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  class_name: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
  max_points: number;
  time_spent_minutes?: number;
  submission_required: boolean;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'student') {
      navigate('/login');
      return;
    }

    // Simulate fetching user data (you can replace with actual API call)
    setUser({
      username: 'student@classtrack.edu',
      role: 'student'
    });

    // Simulate fetching student data
    loadStudentData();
  }, [navigate]);

  const loadStudentData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data for demonstration - replace with actual API calls
      setSchedule([
        { id: 1, title: 'Mathematics 101', time: '09:00 AM', location: 'Room 201', type: 'class', status: 'upcoming' },
        { id: 2, title: 'Physics Lab', time: '11:30 AM', location: 'Lab 3', type: 'class', status: 'upcoming' },
        { id: 3, title: 'Chemistry Quiz', time: '02:00 PM', location: 'Room 105', type: 'exam', status: 'upcoming' },
        { id: 4, title: 'English Essay Due', time: '11:59 PM', location: 'Online', type: 'assignment_due', status: 'upcoming' }
      ]);

      setAnnouncements([
        { id: 1, title: 'Midterm Exam Schedule Released', content: 'The midterm exam schedule for all courses has been published. Please check your course pages for specific dates and times.', author: 'Academic Office', timestamp: '2024-10-06T10:00:00Z', priority: 'high', isRead: false },
        { id: 2, title: 'Library Extended Hours', content: 'The library will be open until 11 PM during exam week to support student study needs.', author: 'Library Services', timestamp: '2024-10-05T15:30:00Z', priority: 'medium', isRead: true },
        { id: 3, title: 'New Study Group Formed', content: 'A new study group for Mathematics 101 has been formed. Contact Sarah Johnson if interested in joining.', author: 'Student Council', timestamp: '2024-10-04T14:20:00Z', priority: 'low', isRead: true }
      ]);

      setAssignments([
        { id: 1, title: 'Algebra Problem Set 5', description: 'Complete problems 1-20 from Chapter 7', class_name: 'Mathematics 101', due_date: '2024-10-08T23:59:00Z', status: 'pending', max_points: 100, submission_required: true },
        { id: 2, title: 'Physics Lab Report', description: 'Write a comprehensive report on the pendulum experiment', class_name: 'Physics 201', due_date: '2024-10-10T17:00:00Z', status: 'submitted', max_points: 50, time_spent_minutes: 45, submission_required: true },
        { id: 3, title: 'Chemistry Quiz', description: 'Online quiz covering chemical bonding concepts', class_name: 'Chemistry 101', due_date: '2024-10-07T14:00:00Z', status: 'graded', grade: 85, max_points: 100, time_spent_minutes: 30, submission_required: false },
        { id: 4, title: 'English Essay', description: 'Write a 1000-word essay on climate change', class_name: 'English 101', due_date: '2024-10-06T23:59:00Z', status: 'pending', max_points: 100, submission_required: true }
      ]);

    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Overdue';
    if (diffHours < 24) return `${diffHours}h left`;
    const diffDays = Math.ceil(diffHours / 24);
    return `${diffDays}d left`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'submitted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'graded': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return '📚';
      case 'exam': return '📝';
      case 'assignment_due': return '⏰';
      default: return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Student Dashboard</h1>
                <p className="text-sm text-gray-400">ClassTrack Student Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, Student! 🎓
                </h2>
                <p className="text-gray-300">
                  Stay organized with your schedule, announcements, and assignments. Track your progress and never miss important deadlines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-Time Schedule & Announcements */}
          <div className="space-y-6">
            {/* Schedule Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Real-Time Schedule</span>
                </h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                  Live
                </span>
              </div>

              <div className="space-y-3">
                {schedule.map((item) => (
                  <div key={item.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(item.type)}</span>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-400">{item.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{item.time}</p>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <span>Announcements</span>
                </h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  {announcements.filter(a => !a.isRead).length} New
                </span>
              </div>

              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={`bg-gray-700/30 rounded-lg p-4 border border-gray-600/20 ${!announcement.isRead ? 'ring-2 ring-blue-500/30' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-white text-sm">{announcement.title}</h4>
                          {!announcement.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <p className="text-xs text-gray-400">By {announcement.author}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500">{formatDate(announcement.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Assignments & Submissions */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Assignments & Submissions</span>
                </h3>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                  Grading Support
                </span>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm mb-1">{assignment.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{assignment.class_name}</p>
                        <p className="text-sm text-gray-300">{assignment.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">
                          Due: {formatDate(assignment.due_date)}
                        </span>
                        {assignment.status === 'pending' && (
                          <span className="text-orange-400 font-medium">
                            {getTimeUntilDue(assignment.due_date)}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        {assignment.grade !== undefined ? (
                          <span className="text-green-400 font-semibold">
                            {assignment.grade}/{assignment.max_points}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            {assignment.max_points} pts
                          </span>
                        )}
                      </div>
                    </div>

                    {assignment.time_spent_minutes && (
                      <div className="mt-2 text-xs text-blue-400">
                        Time spent: {assignment.time_spent_minutes} minutes
                      </div>
                    )}

                    {assignment.status === 'pending' && assignment.submission_required && (
                      <div className="mt-3">
                        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200">
                          Submit Assignment
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {assignments.filter(a => a.status === 'pending').length}
                    </p>
                    <p className="text-xs text-gray-400">Pending</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {assignments.filter(a => a.status === 'submitted').length}
                    </p>
                    <p className="text-xs text-gray-400">Submitted</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {assignments.filter(a => a.status === 'graded').length}
                    </p>
                    <p className="text-xs text-gray-400">Graded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/20 transition-colors duration-200">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-white">Submit Assignment</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/20 transition-colors duration-200">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-white">View Grades</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/20 transition-colors duration-200">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white">View Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
