import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import plmunLogo from '../assets/images/PLMUNLOGO.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      activeColors: 'from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 hover:shadow-blue-500/10',
      iconColors: 'from-blue-500 to-blue-600'
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: (
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      activeColors: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 hover:from-emerald-500/20 hover:to-emerald-600/20 hover:shadow-emerald-500/10',
      iconColors: 'from-emerald-500 to-emerald-600'
    },
    {
      path: '/admin/classes',
      label: 'Classes',
      icon: (
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      activeColors: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:from-purple-500/20 hover:to-purple-600/20 hover:shadow-purple-500/10',
      iconColors: 'from-purple-500 to-purple-600'
    },
    {
      path: '/admin/reports',
      label: 'Reports',
      icon: (
        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      activeColors: 'from-orange-500/10 to-orange-600/10 border-orange-500/20 hover:from-orange-500/20 hover:to-orange-600/20 hover:shadow-orange-500/10',
      iconColors: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${sidebarOpen ? 'open translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 w-64 lg:w-64 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col flex-shrink-0 shadow-2xl z-30 lg:z-10 dashboard-transition`} style={{ minHeight: '100vh' }}>
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-slate-600/50">
                <img 
                  src={plmunLogo} 
                  alt="PLMun Logo" 
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">PLMun Admin</h1>
              <p className="text-xs text-slate-400 font-medium">Management System</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              
              const linkClasses = active 
                ? `flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-white bg-gradient-to-r ${item.activeColors} rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg group`
                : `flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg group`;
              
              const iconClasses = active 
                ? `w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br ${item.iconColors} rounded-md sm:rounded-lg flex items-center justify-center shadow-lg`
                : `w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-slate-600 to-slate-700 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg group-hover:${item.iconColors.replace('from-', 'from-').replace('to-', 'to-')} transition-all duration-300`;
              
              const textClasses = active 
                ? 'ml-2 sm:ml-3 text-xs sm:text-sm font-semibold'
                : 'ml-2 sm:ml-3 text-xs sm:text-sm font-medium';

              return (
                <Link key={item.path} to={item.path} className={linkClasses}>
                  <div className={iconClasses}>
                    {item.icon}
                  </div>
                  <span className={textClasses}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-2 sm:p-3 border-t border-slate-700/50">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs sm:text-sm">A</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-slate-400 font-medium">Administrator</p>
            </div>
          </div>
          <button className="w-full flex items-center px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-lg group">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-slate-600 to-slate-700 rounded-md sm:rounded-lg flex items-center justify-center shadow-lg group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="ml-2 sm:ml-3 text-xs sm:text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
