import { createContext, useContext, useState } from 'react';
import { useToast } from '@chakra-ui/react';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const saveAttendance = async (attendanceData) => {
    setIsSaving(true);
    try {
      // Here you would typically make an API call to save the data
      // For now, we'll simulate saving by storing in localStorage
      const key = `attendance_${attendanceData.eventId}`;
      localStorage.setItem(key, JSON.stringify(attendanceData));

      toast({
        title: 'Lista de presença salva',
        description: 'Os dados foram salvos com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Update the attendance state
      setAttendance(prev => ({
        ...prev,
        [attendanceData.eventId]: attendanceData
      }));

      return true;
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a lista de presença',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getServiceAttendance = (serviceId) => {
    // Try to get from state first
    if (attendance[serviceId]) {
      return attendance[serviceId];
    }

    // Try to get from localStorage
    try {
      const savedData = localStorage.getItem(`attendance_${serviceId}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Update the state with the loaded data
        setAttendance(prev => ({
          ...prev,
          [serviceId]: parsedData
        }));
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading attendance data:', error);
    }

    return {};
  };

  return (
    <AttendanceContext.Provider value={{ 
      attendance, 
      saveAttendance, 
      getServiceAttendance,
      isSaving 
    }}>
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