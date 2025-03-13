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
  Box,
  Text,
  HStack,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { useMembers } from '../../contexts/MembersContext';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaSearch, FaUserPlus, FaLock, FaLockOpen } from 'react-icons/fa';
import AddParticipantModal from './AddParticipantModal';
import { useAttendance } from '../../contexts/AttendanceContext';

const AttendanceList = ({ isOpen, onClose, event }) => {
  const { members } = useMembers();
  const { saveAttendance, getServiceAttendance, isSaving } = useAttendance();
  const [attendance, setAttendance] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [temporaryParticipants, setTemporaryParticipants] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalAttendance, setOriginalAttendance] = useState(null);

  useEffect(() => {
    if (isOpen && event?.id) {
      const savedAttendance = getServiceAttendance(event.id);
      if (savedAttendance?.attendanceList) {
        setAttendance(savedAttendance.attendanceList);
      } else {
        setAttendance({});
      }
      setIsLocked(false);
      setSelectedMember(null);
      setIsEditing(false);
    }
  }, [isOpen, event?.id, getServiceAttendance]);

  const handleCheckboxChange = (memberId, field, value) => {
    if (isEditing && selectedMember?.id !== memberId) return;
    
    setAttendance((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: value,
        memberName: members.find((m) => m.id === memberId)?.name,
      },
    }));
  };

  const handleEdit = (member) => {
    // If already editing another member, save changes first
    if (selectedMember && selectedMember.id !== member.id) {
      handleSaveEdit();
    }
    
    // Salva o estado original da linha selecionada
    setOriginalAttendance(attendance[member.id]);
    setSelectedMember(member);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    setSelectedMember(null);
    setOriginalAttendance(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    
    // Restaura o estado original da linha selecionada
    if (selectedMember && originalAttendance) {
      setAttendance((prev) => ({
        ...prev,
        [selectedMember.id]: originalAttendance,
      }));
    }
    
    setSelectedMember(null);
    setOriginalAttendance(null);
  };

  const handleSave = async () => {
    if (isLocked) return; // Impede o salvamento se a lista estiver bloqueada
    const attendanceData = {
      eventId: event.id,
      eventDate: event.date,
      eventTitle: event.category,
      attendanceList: attendance,
    };
    const success = await saveAttendance(attendanceData);
    if (success) {
      onClose();
    }
  };

  const handleAddParticipant = () => {
    setIsAddingParticipant(true);
  };

  const handleParticipantAdd = (participant) => {
    setTemporaryParticipants([...temporaryParticipants, participant]);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const filteredAndSortedMembers = [...members, ...temporaryParticipants]
    .filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.role && member.role.toLowerCase().includes(searchQuery.toLowerCase()))
    )
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
    <Modal isOpen={isOpen} onClose={isLocked ? undefined : onClose} size={{ base: "full", md: "xl" }}>
      <ModalOverlay />
      <ModalContent maxW={{ base: "100%", md: "900px" }} minH={{ base: "100vh", md: "auto" }} m={{ base: 0, md: 4 }}>
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <Box>
              <Text>{event?.category}</Text>
              <Text fontSize="sm" color="gray.500">
                {event?.date && format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm")}
              </Text>
            </Box>
            <Tooltip label={isLocked ? "Desbloquear Lista" : "Bloquear Lista"}>
              <IconButton
                icon={isLocked ? <FaLock /> : <FaLockOpen />}
                onClick={toggleLock}
                variant="ghost"
                colorScheme={isLocked ? "red" : "gray"}
                aria-label={isLocked ? "Desbloquear Lista" : "Bloquear Lista"}
              />
            </Tooltip>
          </Flex>
        </ModalHeader>
        <ModalBody pb={{ base: 20, md: 6 }}>
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
              {filteredAndSortedMembers.map((member) => {
                const hasValues = attendance[member.id]?.present || attendance[member.id]?.communion || attendance[member.id]?.visitor;
                const isSelected = selectedMember?.id === member.id;

                return (
                  <Tr 
                    key={member.id}
                    bg={
                      isSelected
                        ? 'blue.50' // Linha selecionada para edição (sempre azul)
                        : hasValues
                        ? 'gray.100' // Linha com valores selecionados
                        : 'transparent' // Linha sem valores selecionados
                    }
                    _hover={{ bg: isEditing ? 'default' : 'gray.50' }}
                    onClick={() => !isEditing && handleEdit(member)}
                    cursor={isEditing ? 'default' : 'pointer'}
                  >
                    <Td color={isSelected ? 'inherit' : hasValues ? 'gray.500' : 'inherit'}>
                      {member.name}
                    </Td>
                    <Td textAlign="center">
                      <Checkbox
                        isChecked={attendance[member.id]?.present || false}
                        onChange={(e) => handleCheckboxChange(member.id, 'present', e.target.checked)}
                        isDisabled={isEditing && !isSelected}
                      />
                    </Td>
                    <Td textAlign="center">
                      <Checkbox
                        isChecked={attendance[member.id]?.communion || false}
                        onChange={(e) => handleCheckboxChange(member.id, 'communion', e.target.checked)}
                        isDisabled={isEditing && !isSelected}
                      />
                    </Td>
                    <Td textAlign="center">
                      <Checkbox
                        isChecked={attendance[member.id]?.visitor || false}
                        onChange={(e) => handleCheckboxChange(member.id, 'visitor', e.target.checked)}
                        isDisabled={isEditing && !isSelected}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            {isEditing && (
              <>
                <Button
                  colorScheme="blue"
                  onClick={handleSaveEdit}
                >
                  Salvar Edição
                </Button>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
              </>
            )}
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isDisabled={isLocked || isSaving} // Desabilita o botão de salvar se a lista estiver bloqueada
              isLoading={isSaving}
            >
              Salvar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>

      <AddParticipantModal
        isOpen={isAddingParticipant}
        onClose={() => setIsAddingParticipant(false)}
        onAdd={handleParticipantAdd}
      />
    </Modal>
  );
};

export default AttendanceList;