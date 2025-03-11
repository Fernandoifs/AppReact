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
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Badge,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { FaPlus, FaList, FaTh, FaSort, FaSearch, FaFilter } from 'react-icons/fa';
import MemberCard from '../components/members/MemberCard';
import MemberForm from '../components/members/MemberForm';
import BottomNavigation from '../components/shared/BottomNavigation';
import membersData from '../mocks/members.json';
import { useMembers } from '../contexts/MembersContext';

const Members = () => {
  const { members, addMember, updateMember, deleteMember } = useMembers();
  const [filteredMembers, setFilteredMembers] = useState(membersData.members);
  const [editingMember, setEditingMember] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const initialMembers = members.length > 0 ? members : membersData.members;
    setFilteredMembers(initialMembers);
  }, [members]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterMembers(value, roleFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    filterMembers(searchTerm, role);
  };

  const filterMembers = (search, role) => {
    const dataSource = members.length > 0 ? members : membersData.members;
    let filtered = dataSource;

    if (search) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(search.toLowerCase()) ||
          member.role.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role && role !== 'all') {
      filtered = filtered.filter((member) => member.role === role);
    }

    const sorted = [...filtered].sort((a, b) => {
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

    setFilteredMembers(sorted);
  };

  const handleSubmit = (data) => {
    if (editingMember) {
      updateMember({ ...editingMember, ...data });
      toast({
        title: 'Membro atualizado.',
        description: 'As informações do membro foram atualizadas com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      addMember({ id: Date.now(), ...data });
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
    deleteMember(id);
    toast({
      title: 'Membro excluído.',
      description: 'O membro foi removido com sucesso.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box bg={bgColor} minH="100vh" p={4}>
      <Container maxW="container.xl">
        <Stack spacing={6}>
          <Flex justify="space-between" align="center">
            <Heading size="lg">Membros</Heading>
            <Flex gap={2}>
              <IconButton
                icon={viewMode === 'table' ? <FaTh /> : <FaList />}
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                aria-label="Alternar visualização"
                variant="outline"
              />
              <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={onOpen}>
                Adicionar Membro
              </Button>
            </Flex>
          </Flex>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <InputGroup maxW={{ base: 'full', md: '400px' }}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Buscar membros..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>

            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaFilter />}
                variant="outline"
                maxW={{ base: 'full', md: '200px' }}
              >
                {roleFilter === 'all' ? 'Todas as funções' : roleFilter}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleRoleFilter('all')}>Todas as funções</MenuItem>
                <MenuItem onClick={() => handleRoleFilter('Membro')}>Membro</MenuItem>
                <MenuItem onClick={() => handleRoleFilter('Líder')}>Líder</MenuItem>
                <MenuItem onClick={() => handleRoleFilter('Pastor')}>Pastor</MenuItem>
                <MenuItem onClick={() => handleRoleFilter('Diácono')}>Diácono</MenuItem>
                <MenuItem onClick={() => handleRoleFilter('Ministro de Louvor')}>Ministro de Louvor</MenuItem>
              </MenuList>
            </Menu>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              maxW={{ base: 'full', md: '200px' }}
              variant="outline"
            >
              <option value="name">Nome</option>
              <option value="lastName">Sobrenome</option>
              <option value="role">Função</option>
            </Select>
          </Stack>

          <Box>
            <Flex justify="space-between" align="center" mb={4}>
              <Text color="gray.600">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'membro' : 'membros'}
              </Text>
              {roleFilter !== 'all' && (
                <Badge colorScheme="blue" fontSize="sm">
                  Filtrado por: {roleFilter}
                </Badge>
              )}
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
                    {filteredMembers.map((member) => (
                      <Tr key={member.id}>
                        <Td>{member.name}</Td>
                        <Td>{member.birthDate}</Td>
                        <Td>{member.phone}</Td>
                        <Td>
                          <Badge
                            colorScheme={member.role === 'Pastor' ? 'red' : 
                              member.role === 'Líder' ? 'green' : 
                              member.role === 'Diácono' ? 'purple' : 
                              member.role === 'Ministro de Louvor' ? 'blue' : 'gray'}
                          >
                            {member.role}
                          </Badge>
                        </Td>
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
          </Box>
        </Stack>
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