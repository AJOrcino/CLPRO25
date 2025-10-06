import React, { useState, useEffect } from 'react';
import DynamicHeader from '../components/DynamicHeader';
import Sidebar from '../components/Sidebar';
import plmunLogo from '../assets/images/PLMUNLOGO.png';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Force center alignment on mount and resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render to ensure proper centering
      window.dispatchEvent(new Event('resize'));
      
      // Force scroll to top and center
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    const handleLoad = () => {
      // Ensure proper centering on page load
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        handleResize();
      }, 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleLoad);
    
    // Initial centering
    handleLoad();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div 
      className="dashboard-container fixed inset-0 w-screen h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-inter" 
      style={{ 
        minWidth: '100vw', 
        minHeight: '100vh',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 p-4 shadow-xl flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
            <img 
              src={plmunLogo} 
              alt="PLMun Logo" 
              className="relative w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">Welcome to your administrative control panel</p>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="dashboard-main flex-1 flex flex-col min-w-0 lg:ml-0" style={{ minHeight: '100vh' }}>
        {/* Dynamic Header */}
        <div className="hidden lg:block">
          <DynamicHeader 
            title="Admin Dashboard"
            subtitle="Welcome to your administrative control panel"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8 min-h-0" style={{ minHeight: 'calc(100vh - 80px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="dashboard-content w-full max-w-7xl mx-auto px-4 lg:px-8">
            {/* Welcome Section */}
            <div className="dashboard-welcome mb-6 sm:mb-8 lg:mb-10 text-center">
              <div className="relative inline-block">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 tracking-tight">
                  <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Welcome to the Admin Portal
                  </span>
                </h1>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full"></div>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-slate-400 font-medium max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
                Manage your system and users from this central dashboard with powerful insights and controls.
              </p>
            </div>

            {/* Stats Widgets - 4 Column Responsive Grid */}
            <div className="dashboard-stats dashboard-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10 w-full">
              {/* Total Users Card */}
              <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full backdrop-blur-sm">+12%</span>
                  </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-2 tracking-wide uppercase">Total Users</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">1,247</p>
                  <p className="text-xs text-slate-500 font-medium">Active members</p>
                </div>
              </div>

              {/* Active Classes Card */}
              <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">+5%</span>
                  </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-3 tracking-wide uppercase">Active Classes</p>
                  <p className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">89</p>
                  <p className="text-sm text-slate-500 font-medium">Currently running</p>
                </div>
              </div>

              {/* System Health Card */}
              <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">+2%</span>
                  </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-3 tracking-wide uppercase">System Health</p>
                  <p className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">98%</p>
                  <p className="text-sm text-slate-500 font-medium">Optimal performance</p>
                </div>
              </div>

              {/* Storage Used Card */}
              <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm font-bold bg-slate-500/10 border border-slate-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm">+0.8GB</span>
                  </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-3 tracking-wide uppercase">Storage Used</p>
                  <p className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">2.4GB</p>
                  <p className="text-sm text-slate-500 font-medium">Of 10GB total</p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity - Two Column Layout */}
            <div className="dashboard-grid grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
              {/* Quick Actions - 1/3 Width */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-2 sm:mr-3">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Quick Actions</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <button className="group w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/50 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-xs sm:text-sm font-bold text-white">Add New User</p>
                        <p className="text-xs text-blue-100 font-medium">Create a new user account</p>
                      </div>
                    </button>

                    <button className="group w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer">
                      <div className="w-12 h-12 bg-emerald-600/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold text-white">Create Class</p>
                        <p className="text-xs text-emerald-100 font-medium">Set up a new class</p>
                      </div>
                    </button>

                    <button className="group w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer">
                      <div className="w-12 h-12 bg-purple-600/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold text-white">Generate Report</p>
                        <p className="text-xs text-purple-100 font-medium">Create system reports</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity - 2/3 Width */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg mr-2 sm:mr-3">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Recent Activity</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-lg border border-slate-600/30 cursor-pointer">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl sm:rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-white mb-1">New user registered</p>
                        <p className="text-xs text-slate-400 font-medium truncate">John Doe joined the system</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-slate-500 font-medium bg-slate-800/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">2 min ago</span>
                  </div>
                    </div>

                    <div className="group flex items-center space-x-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-2xl transition-all duration-300 hover:shadow-lg border border-slate-600/30 cursor-pointer">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white mb-1">Class created</p>
                        <p className="text-xs text-slate-400 font-medium truncate">Dr. Smith created "Advanced Mathematics"</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1.5 rounded-full">15 min ago</span>
                  </div>
                    </div>

                    <div className="group flex items-center space-x-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-2xl transition-all duration-300 hover:shadow-lg border border-slate-600/30 cursor-pointer">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                  </div>
                </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white mb-1">Report generated</p>
                        <p className="text-xs text-slate-400 font-medium truncate">Monthly system report created</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1.5 rounded-full">1 hour ago</span>
                </div>
              </div>

                    <div className="group flex items-center space-x-4 p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-2xl transition-all duration-300 hover:shadow-lg border border-slate-600/30 cursor-pointer">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white mb-1">System backup completed</p>
                        <p className="text-xs text-slate-400 font-medium truncate">Daily backup process finished</p>
                  </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-slate-500 font-medium bg-slate-800/50 px-3 py-1.5 rounded-full">2 hours ago</span>
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
