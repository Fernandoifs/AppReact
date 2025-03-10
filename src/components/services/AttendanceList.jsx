import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  ModalFooter,
  Select,
  Box,
  Text,
  HStack,
} from '@chakra-ui/react';
import { useMembers } from '../../contexts/MembersContext';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const AttendanceList = ({ isOpen, onClose, event }) => {
  const { members } = useMembers();
  const [attendance, setAttendance] = useState({});
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    // Reset attendance when modal opens
    if (isOpen) {
      setAttendance({});
    }
  }, [isOpen]);

  const sortedMembers = [...members].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'lastName':
        const lastNameA = a.name.split(' ').pop();
        const lastNameB = b.name.split(' ').pop();
        return lastNameA.localeCompare(lastNameB);
      case 'role':
        return a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });

  const handleCheckboxChange = (memberId, field, value) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
        memberName: members.find(m => m.id === memberId)?.name
      }
    }));
  };

  const handleSave = () => {
    const attendanceData = {
      eventId: event.id,
      eventDate: event.date,
      eventTitle: event.title,
      attendanceList: attendance
    };
    console.log('Saving attendance:', attendanceData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>
          <Text>{event?.title}</Text>
          <Text fontSize="sm" color="gray.500">
            {event?.date && format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm")}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th textAlign="center">Presente</Th>
                <Th textAlign="center">Santa Ceia</Th>
                <Th textAlign="center">Visitante</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedMembers.map((member) => (
                <Tr key={member.id}>
                  <Td>{member.name}</Td>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={attendance[member.id]?.present || false}
                      onChange={(e) => handleCheckboxChange(member.id, 'present', e.target.checked)}
                    />
                  </Td>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={attendance[member.id]?.communion || false}
                      onChange={(e) => handleCheckboxChange(member.id, 'communion', e.target.checked)}
                    />
                  </Td>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={attendance[member.id]?.visitor || false}
                      onChange={(e) => handleCheckboxChange(member.id, 'visitor', e.target.checked)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AttendanceList;