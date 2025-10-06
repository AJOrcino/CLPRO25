import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface SystemStatusContextType {
  isSystemActive: boolean;
  lastUpdate: Date;
  updateStatus: (status: boolean) => void;
}

const SystemStatusContext = createContext<SystemStatusContextType | undefined>(undefined);

export const useSystemStatus = () => {
  const context = useContext(SystemStatusContext);
  if (!context) {
    throw new Error('useSystemStatus must be used within a SystemStatusProvider');
  }
  return context;
};

interface SystemStatusProviderProps {
  children: ReactNode;
}

export const SystemStatusProvider: React.FC<SystemStatusProviderProps> = ({ children }) => {
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time system status monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real application, this would check actual system status
      // For now, we'll simulate a 99.9% uptime system
      const isActive = Math.random() > 0.001; // 99.9% chance of being active
      setIsSystemActive(isActive);
      setLastUpdate(new Date());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen for visibility changes to update status when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLastUpdate(new Date());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const updateStatus = (status: boolean) => {
    setIsSystemActive(status);
    setLastUpdate(new Date());
  };

  const value: SystemStatusContextType = {
    isSystemActive,
    lastUpdate,
    updateStatus,
  };

  return (
    <SystemStatusContext.Provider value={value}>
      {children}
    </SystemStatusContext.Provider>
  );
};
