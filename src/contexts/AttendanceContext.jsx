import { createContext, useContext, useState } from 'react';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState({});

  const markAttendance = (serviceId, memberId, isPresent) => {
    setAttendance(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [memberId]: isPresent
      }
    }));
  };

  const getServiceAttendance = (serviceId) => {
    return attendance[serviceId] || {};
  };

  return (
    <AttendanceContext.Provider value={{ attendance, markAttendance, getServiceAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};