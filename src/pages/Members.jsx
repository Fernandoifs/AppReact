import { useState } from 'react'
import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import SearchBar from '../components/members/SearchBar'
import MemberCard from '../components/members/MemberCard'
import MemberForm from '../components/members/MemberForm'

const Members = () => {
  const [members, setMembers] = useState([
    // Sample data - replace with your actual data source
    {
      id: 1,
      name: 'João Silva',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      role: 'Membro',
    },
    // Add more sample members...
  ])
  const [filteredMembers, setFilteredMembers] = useState(members)
  const [editingMember, setEditingMember] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSearch = (searchTerm) => {
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMembers(filtered)
  }

  const handleSubmit = (data) => {
    if (editingMember) {
      setMembers(members.map(m => 
        m.id === editingMember.id ? { ...m, ...data } : m
      ))
    } else {
      setMembers([...members, { id: Date.now(), ...data }])
    }
    setEditingMember(null)
    setFilteredMembers(members)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    onOpen()
  }

  const handleDelete = (id) => {
    setMembers(members.filter(m => m.id !== id))
    setFilteredMembers(members.filter(m => m.id !== id))
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Membros</Heading>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          onClick={() => {
            setEditingMember(null)
            onOpen()
          }}
        >
          Novo Membro
        </Button>
      </Flex>

      <SearchBar onSearch={handleSearch} />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {filteredMembers.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </SimpleGrid>

      <MemberForm
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setEditingMember(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingMember}
      />
    </Box>
  )
}

export default Members