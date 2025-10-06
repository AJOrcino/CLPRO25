import React from 'react';
import LoginForm from '../components/LoginForm';
import loginBg from '../assets/images/PLMUNBG.jpg?url';
import plmunLogo from '../assets/images/PLMUNlogo.png?url';

const LoginPage: React.FC = () => {
  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gray-900"
      role="main"
      aria-label="PLMUN Login Page"
      style={{ 
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100dvh',
        width: '100vw',
        height: '100dvh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Enhanced gradient overlay for better contrast and visual appeal */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-900/70 to-black/90 sm:from-black/70 sm:via-gray-900/60 sm:to-black/80"
        aria-hidden="true"
      ></div>
      
      {/* Additional subtle overlay for better text contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        aria-hidden="true"
      ></div>
      
      {/* Enhanced responsive animated background particles effect */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:-top-40 sm:-right-40 sm:w-80 sm:h-80 bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:-bottom-40 sm:-left-40 sm:w-80 sm:h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-purple-500/8 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/4 w-28 h-28 sm:w-56 sm:h-56 bg-green-500/8 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>
      
      {/* Main content container with enhanced centering and responsive behavior */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
        {/* Enhanced login card with modern styling and professional responsive design */}
        <div 
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 border border-gray-600/50 transform transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] sm:hover:scale-[1.02]"
          role="region"
          aria-labelledby="login-heading"
          aria-describedby="login-description"
          aria-label="PLMun Login Form"
        >
          {/* Enhanced logo section with responsive glow effect */}
          <header className="flex justify-center mb-6 sm:mb-8 md:mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl scale-110"></div>
              <img 
                src={plmunLogo} 
                alt="Pamantasan ng Lungsod ng Muntinlupa Official Logo" 
                className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl"
                role="img"
                aria-label="PLMUN University Logo"
              />
            </div>
          </header>
          
          {/* Enhanced welcome section with responsive typography */}
          <section className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="mb-4 sm:mb-6">
              <h1 
                id="login-heading"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight"
              >
                Welcome to PLMun
              </h1>
              <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-red-600 to-red-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <p 
                id="login-description"
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 font-medium leading-relaxed"
              >
                Pamantasan ng Lungsod ng Muntinlupa
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
                Student Information Management System
              </p>
            </div>
          </section>
          
          {/* Enhanced form section */}
          <section 
            role="form"
            aria-label="User Authentication Form"
            className="mb-8"
          >
        <LoginForm />
          </section>
          
          {/* Enhanced footer with PLMun branding and responsive styling */}
          <footer className="text-center space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">Secure Connection</span>
            </div>
            <div className="border-t border-gray-700 pt-3 sm:pt-4">
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                © 2024 Pamantasan ng Lungsod ng Muntinlupa. All rights reserved.
              </p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Student Information Management System
              </p>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Enhanced skip link */}
      <a 
        href="#login-heading" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-red-700 text-white px-4 py-2 rounded-lg z-50 shadow-lg hover:bg-red-800 transition-colors"
        aria-label="Skip to main login form"
      >
        Skip to Login Form
      </a>
    </div>
  );
};

export default LoginPage;