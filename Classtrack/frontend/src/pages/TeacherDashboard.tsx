import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Class {
  id: number;
  name: string;
  code: string;
  teacher_id: number | null;
}

interface Assignment {
  id: number;
  name: string;
  description: string | null;
  class_id: number;
  creator_id: number;
  created_at: string;
}

interface EngagementInsight {
  id: number;
  class_name: string;
  assignment_name: string;
  total_submissions: number;
  average_time_spent: number;
  engagement_score: number;
  last_updated: string;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [engagementInsights, setEngagementInsights] = useState<EngagementInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'teacher') {
      navigate('/login');
      return;
    }

    // Simulate fetching user data (you can replace with actual API call)
    setUser({
      username: 'teacher@classtrack.edu',
      role: 'teacher'
    });

    // Simulate fetching classes and assignments
    loadTeacherData();
  }, [navigate]);

  const loadTeacherData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API calls - replace with actual API endpoints
      // const classesResponse = await fetch('/api/teacher/classes');
      // const assignmentsResponse = await fetch('/api/teacher/assignments');
      // const insightsResponse = await fetch('/api/teacher/engagement-insights');
      
      // Mock data for demonstration
      setClasses([
        { id: 1, name: 'Mathematics 101', code: 'MATH101', teacher_id: 1 },
        { id: 2, name: 'Physics 201', code: 'PHYS201', teacher_id: 1 },
        { id: 3, name: 'Chemistry 101', code: 'CHEM101', teacher_id: 1 }
      ]);

      setAssignments([
        { id: 1, name: 'Algebra Fundamentals', description: 'Basic algebra concepts and practice problems', class_id: 1, creator_id: 1, created_at: '2024-10-01T10:00:00Z' },
        { id: 2, name: 'Mechanics Lab Report', description: 'Lab report on Newton\'s laws of motion', class_id: 2, creator_id: 1, created_at: '2024-10-02T14:30:00Z' },
        { id: 3, name: 'Chemical Bonding Quiz', description: 'Quiz on ionic and covalent bonds', class_id: 3, creator_id: 1, created_at: '2024-10-03T09:15:00Z' }
      ]);

      setEngagementInsights([
        { id: 1, class_name: 'Mathematics 101', assignment_name: 'Algebra Fundamentals', total_submissions: 25, average_time_spent: 45, engagement_score: 8.5, last_updated: '2024-10-06T16:30:00Z' },
        { id: 2, class_name: 'Physics 201', assignment_name: 'Mechanics Lab Report', total_submissions: 18, average_time_spent: 62, engagement_score: 7.8, last_updated: '2024-10-06T15:45:00Z' },
        { id: 3, class_name: 'Chemistry 101', assignment_name: 'Chemical Bonding Quiz', total_submissions: 22, average_time_spent: 38, engagement_score: 9.1, last_updated: '2024-10-06T17:00:00Z' }
      ]);

    } catch (error) {
      console.error('Error loading teacher data:', error);
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


  const getEngagementBadge = (score: number) => {
    if (score >= 8.5) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 7.0) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>
                <p className="text-sm text-gray-400">ClassTrack Management System</p>
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
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, Teacher! 👨‍🏫
                </h2>
                <p className="text-gray-300">
                  Manage your classes, assignments, and gain insights into student engagement with AI-powered analytics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Classes & Assignments */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>My Classes & Assignments</span>
                </h3>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-200">
                  Create New
                </button>
              </div>

              {/* Classes List */}
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{classItem.name}</h4>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        {classItem.code}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {assignments.filter(a => a.class_id === classItem.id).length} assignments
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Assignments */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Recent Assignments</h4>
                <div className="space-y-3">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="bg-gray-700/20 rounded-lg p-3 border border-gray-600/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-white text-sm">{assignment.name}</h5>
                          <p className="text-xs text-gray-400">{formatDate(assignment.created_at)}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                          Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Student Engagement Insights */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Student Engagement Insights</span>
                </h3>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                  AI Powered
                </span>
              </div>

              {/* Engagement Metrics */}
              <div className="space-y-4">
                {engagementInsights.map((insight) => (
                  <div key={insight.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{insight.assignment_name}</h4>
                        <p className="text-xs text-gray-400">{insight.class_name}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getEngagementBadge(insight.engagement_score)}`}>
                        {insight.engagement_score}/10
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-gray-600/20 rounded-lg p-2">
                        <div className="text-gray-400">Submissions</div>
                        <div className="text-white font-semibold">{insight.total_submissions}</div>
                      </div>
                      <div className="bg-gray-600/20 rounded-lg p-2">
                        <div className="text-gray-400">Avg. Time</div>
                        <div className="text-white font-semibold">{insight.average_time_spent}m</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-400">
                      Last updated: {formatDate(insight.last_updated)}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Insights Summary */}
              <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h4 className="font-semibold text-white">AI Insights Summary</h4>
                </div>
                <p className="text-sm text-gray-300">
                  Your students show strong engagement in Chemistry assignments. Consider creating more interactive content for Mathematics to boost participation.
                </p>
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
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-white">Create Assignment</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/20 transition-colors duration-200">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-white">View Reports</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg border border-gray-600/20 transition-colors duration-200">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-white">Manage Students</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
