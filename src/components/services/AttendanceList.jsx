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
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
} from '@chakra-ui/react';
import { useMembers } from '../../contexts/MembersContext';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaSearch, FaUserPlus } from 'react-icons/fa';
import AddParticipantModal from './AddParticipantModal'; // Certifique-se de que este componente está definido

const AttendanceList = ({ isOpen, onClose, event }) => {
  const { members } = useMembers();
  const [attendance, setAttendance] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [temporaryParticipants, setTemporaryParticipants] = useState([]);

  useEffect(() => {
    // Reset attendance when modal opens
    if (isOpen) {
      setAttendance({});
    }
  }, [isOpen]);

  const handleCheckboxChange = (memberId, field, value) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
        memberName: members.find((m) => m.id === memberId)?.name,
      },
    }));
  };

  const handleSave = () => {
    const attendanceData = {
      eventId: event.id,
      eventDate: event.date,
      eventTitle: event.category, // Use event.category em vez de event.title
      attendanceList: attendance,
    };
    console.log('Saving attendance:', attendanceData);
    onClose();
  };

  const handleAddParticipant = () => {
    setIsAddingParticipant(true);
  };

  const handleParticipantAdd = (participant) => {
    setTemporaryParticipants([...temporaryParticipants, participant]);
  };

  // Filtra e ordena os membros
  // Fix the syntax error in the filter and sort chain
  const filteredAndSortedMembers = [...members, ...temporaryParticipants]
    .filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.role && member.role.toLowerCase().includes(searchQuery.toLowerCase()))
    ) // Added missing closing parenthesis here
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastName':
          const lastNameA = a.name.split(' ').pop();
          const lastNameB = b.name.split(' ').pop();
          return lastNameA.localeCompare(lastNameB);
        case 'role':
          return (a.role || '').localeCompare(b.role || '');
        default:
          return 0;
      }
    });
     
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>
          <Text>{event?.category}</Text>
          <Text fontSize="sm" color="gray.500">
            {event?.date && format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm")}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Flex gap={2}>
              <InputGroup flex={1}>
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar membros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <Button
                leftIcon={<FaUserPlus />}
                colorScheme="green"
                onClick={handleAddParticipant}
                minW="200px"
                flexShrink={0}
              >
                Adicionar Participante
              </Button>
            </Flex>
          </Box>
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
              {filteredAndSortedMembers.map((member) => (
                <Tr key={member.id}>
                  <Td>{member.name}</Td>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={attendance[member.id]?.present || false}
                      onChange={(e) =>
                        handleCheckboxChange(member.id, 'present', e.target.checked)
                      }
                    />
                  </Td>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={attendance[member.id]?.communion || false}
                      onChange={(e) =>
                        handleCheckboxChange(member.id, 'communion', e.target.checked)
                      }
                    />
                  </Td>
                  <Td textAlign="center">
                    <Checkbox
                      isChecked={attendance[member.id]?.visitor || false}
                      onChange={(e) =>
                        handleCheckboxChange(member.id, 'visitor', e.target.checked)
                      }
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

      {/* Modal para adicionar participantes */}
      <AddParticipantModal
        isOpen={isAddingParticipant}
        onClose={() => setIsAddingParticipant(false)}
        onAdd={handleParticipantAdd}
      />
    </Modal>
  );
};

export default AttendanceList;