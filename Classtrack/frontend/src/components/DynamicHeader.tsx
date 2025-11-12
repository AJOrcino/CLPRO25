import React from 'react';
import { Link } from 'react-router-dom';
import plmunLogo from "../assets/images/PLMUNLOGO.png";
import { useSystemStatus } from '../contexts/SystemStatusContext';
import { useUser } from '../contexts/UserContext';

interface DynamicHeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
  showMenuToggle?: boolean;
}

const DynamicHeader: React.FC<DynamicHeaderProps> = ({ 
  title, 
  subtitle, 
  showBackButton = false,
  backTo = "/admin/dashboard", 
  backLabel = "Back to Dashboard",
  onMenuToggle,
  sidebarOpen = false,
  showMenuToggle = false
}) => {
  const { isSystemActive, lastUpdate } = useSystemStatus();
  const { user } = useUser();

  // Helper function to construct full image URL
  const getProfileImageUrl = (url: string | null): string => {
    if (!url || url.trim() === "") {
      return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    const baseUrl = "http://localhost:8000";
    let constructedUrl = "";

    if (url.startsWith("/")) {
      constructedUrl = `${baseUrl}${url}`;
    } else if (
      url.startsWith("uploads/") ||
      url.startsWith("photos/") ||
      url.startsWith("static/")
    ) {
      constructedUrl = `${baseUrl}/${url}`;
    } else {
      constructedUrl = `${baseUrl}/uploads/${url}`;
    }

    return constructedUrl;
  };

  // Helper function to get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "teacher":
        return (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        );
      case "student":
        return (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
    }
  };

  const getStatusText = () => {
    return isSystemActive ? "System Active" : "System Inactive";
  };

  const getStatusColor = () => {
    return isSystemActive ? "emerald" : "red";
  };

  const getTimeAgo = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get role-specific user display information
  const getUserDisplayInfo = () => {
    if (!user) {
      return {
        name: 'User',
        role: 'User',
        avatar: 'U',
        avatarGradient: 'from-gray-500 to-gray-600'
      };
    }

    const fullName = user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}` 
      : user.username || 'User';

    switch (user.role) {
      case 'admin':
        return {
          name: 'Admin User',
          role: 'Administrator',
          avatar: 'A',
          avatarGradient: 'from-purple-500 to-pink-500'
        };
      case 'teacher':
        return {
          name: fullName,
          role: 'Teacher',
          avatar: 'T',
          avatarGradient: 'from-red-500 to-red-600'
        };
      case 'student':
        return {
          name: fullName,
          role: 'Student',
          avatar: 'S',
          avatarGradient: 'from-blue-500 to-blue-600'
        };
      default:
        return {
          name: fullName,
          role: 'User',
          avatar: 'U',
          avatarGradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const userInfo = getUserDisplayInfo();

  // Get role-specific avatar gradient
  const getRoleAvatarGradient = () => {
    let userRole = user?.role || localStorage.getItem("userRole") || "student";

    // Strict role validation - only allow valid roles
    const validRoles = ["admin", "teacher", "student"];
    if (!validRoles.includes(userRole)) {
      console.warn(
        `Invalid user role detected in avatar gradient: ${userRole}. Defaulting to student.`
      );
      userRole = "student";
    }

    switch (userRole) {
      case "admin":
        return "from-blue-500 to-purple-600";
      case "teacher":
        return "from-red-500 to-red-600";
      case "student":
        return "from-blue-500 to-blue-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-700/50 shadow-2xl sticky top-0 z-40 h-16 lg:h-20">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-full">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-3 lg:py-4 space-y-2 lg:space-y-0 h-full">
          {/* Left Section - Hamburger Menu, Logo and Title */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Hamburger Menu Button for Mobile */}
            {showMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/50"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  // Close icon (X)
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Menu icon (Hamburger)
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}

            <div className="relative group/logo">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl blur-lg opacity-30 group-hover/logo:opacity-50 transition-opacity duration-300"></div>
              <img src={plmunLogo} alt="PLMUN Logo" className="relative h-8 w-auto sm:h-10 lg:h-12 group-hover/logo:scale-105 transition-transform duration-300" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-medium">{subtitle}</p>
            </div>
          </div>

          {/* Right Section - Dynamic Status and User Profile */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Dynamic Status Indicator */}
            <div className={`flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-full px-3 py-2 border border-slate-600/50 transition-all duration-300`}>
              <div className="relative">
                <div className={`w-2 h-2 bg-${getStatusColor()}-400 rounded-full ${isSystemActive ? 'animate-pulse' : 'animate-pulse'}`}></div>
                {isSystemActive && (
                  <div className={`absolute inset-0 w-2 h-2 bg-${getStatusColor()}-400 rounded-full animate-ping opacity-75`}></div>
                )}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm text-${getStatusColor()}-300 font-medium`}>
                  {getStatusText()}
                </span>
                <span className="text-xs text-slate-400">
                  {getTimeAgo()}
                </span>
              </div>
            </div>
            
            {/* Enhanced User Profile - Role-based display */}
            <div className="flex items-center space-x-3 lg:space-x-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-300 group">
              <div className="text-right space-y-1">
                <p className="text-sm lg:text-base font-semibold text-white group-hover:text-blue-100 transition-colors">{userInfo.name}</p>
                <p className="text-xs lg:text-sm text-slate-300 group-hover:text-slate-200 transition-colors">{userInfo.role}</p>
              </div>
              <div className="relative group/avatar">
                <div className={`absolute inset-0 bg-gradient-to-r ${getRoleAvatarGradient()} rounded-full blur-md opacity-50 group-hover/avatar:opacity-75 transition-opacity duration-300`}></div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg">
                  {user?.profile_picture_url &&
                  user.profile_picture_url.trim() !== "" ? (
                    <img
                      src={getProfileImageUrl(user.profile_picture_url)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        console.log(
                          "🖼️ Profile image loaded successfully in header"
                        );
                      }}
                      onError={(e) => {
                        console.error(
                          "🖼️ Profile image failed to load in header:",
                          e.currentTarget.src
                        );
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                  ) : null}

                  <div
                    className={`w-full h-full bg-gradient-to-br ${getRoleAvatarGradient()} flex items-center justify-center ${
                      !user?.profile_picture_url ||
                      user.profile_picture_url.trim() === ""
                        ? ""
                        : "hidden"
                    }`}
                  >
                    {getRoleIcon(user?.role || "teacher")}
                  </div>
                </div>
                {/* Dynamic status indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-${getStatusColor()}-400 rounded-full border-2 border-slate-900 ${isSystemActive ? 'animate-pulse' : 'animate-pulse'}`}></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default DynamicHeader;