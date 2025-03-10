import { createContext, useContext, useState } from 'react';

const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [members, setMembers] = useState([]);

  const addMember = (newMember) => {
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (updatedMember) => {
    setMembers(prev => prev.map(member => 
      member.id === updatedMember.id ? updatedMember : member
    ));
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  return (
    <MembersContext.Provider value={{
      members,
      addMember,
      updateMember,
      deleteMember
    }}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
};