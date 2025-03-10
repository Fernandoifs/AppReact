import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  useDisclosure,
  Flex,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  IconButton,
  useToast,
  Select,
} from '@chakra-ui/react';
import { FaPlus, FaList, FaTh,FaSort } from 'react-icons/fa';
import SearchBar from '../components/members/SearchBar';
import MemberCard from '../components/members/MemberCard';
import MemberForm from '../components/members/MemberForm';
import { useMembers } from '../contexts/MembersContext';
// Add this import at the top with other imports
import BottomNavigation from '../components/shared/BottomNavigation';

// Remove these unnecessary imports as they're now handled in the BottomNavigation component
// import { HStack } from '@chakra-ui/react';
// import { FaHome, FaCalendarAlt, FaPray, FaHandHoldingHeart } from 'react-icons/fa';
// import { Link as RouterLink } from 'react-router-dom';

const Members = () => {
  const { members, addMember, updateMember, deleteMember } = useMembers();
  const [filteredMembers, setFilteredMembers] = useState(members);
  const [editingMember, setEditingMember] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('name');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
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

  // Update the table to use sortedMembers instead of filteredMembers
  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  const handleSearch = (searchTerm) => {
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const handleSubmit = (data) => {
    if (editingMember) {
      updateMember({ ...editingMember, ...data }); // Atualiza o membro
      toast({
        title: 'Membro atualizado.',
        description: 'As informações do membro foram atualizadas com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      addMember({ id: Date.now(), ...data }); // Adiciona um novo membro
      toast({
        title: 'Membro adicionado.',
        description: 'O novo membro foi adicionado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setEditingMember(null);
    onClose();
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    onOpen();
  };

  const handleDelete = (id) => {
    deleteMember(id); // Remove o membro
    toast({
      title: 'Membro excluído.',
      description: 'O membro foi removido com sucesso.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'grid' : 'table');
  };

  return (
    <Box bg={bgColor} minH="100vh" p={4}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading>Membros</Heading>
          <Flex align="center">
            <IconButton
              icon={viewMode === 'table' ? <FaTh /> : <FaList />}
              onClick={toggleViewMode}
              aria-label="Alternar visualização"
              mr={2}
            />
            <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
              Adicionar Membro
            </Button>
          </Flex>
        </Flex>

        <SearchBar onSearch={handleSearch} />

        <Flex justify="flex-end" mb={4}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            width="200px"
            size="md"
            bg={bgColor}
            borderColor="gray.200"
            _hover={{ borderColor: 'gray.300' }}
            placeholder="Ordenar por..."
            icon={<FaSort />}
          >
            <option value="name">Nome</option>
            <option value="lastName">Sobrenome</option>
            <option value="role">Função</option>
          </Select>
        </Flex>

        {viewMode === 'table' ? (
          <Box bg={cardBg} borderRadius="lg" overflow="hidden" boxShadow="sm">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Data de Nascimento</Th>
                  <Th>Telefone</Th>
                  <Th>Função</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedMembers.map((member) => (
                  <Tr key={member.id}>
                    <Td>{member.name}</Td>
                    <Td>{member.birthDate}</Td>
                    <Td>{member.phone}</Td>
                    <Td>{member.role}</Td>
                    <Td>
                      <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleEdit(member)}>
                        Editar
                      </Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleDelete(member.id)}>
                        Excluir
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>

      <MemberForm
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setEditingMember(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingMember}
      />
      <BottomNavigation />

    </Box>
  );
};

export default Members;