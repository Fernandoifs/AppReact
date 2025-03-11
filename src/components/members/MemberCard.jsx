import { Box, Text, Button, VStack, HStack, Avatar, Badge, Flex, useColorModeValue } from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MemberCard = ({ member, onEdit, onDelete }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getRoleColor = (role) => {
    switch (role) {
      case 'Pastor':
        return 'red';
      case 'Líder':
        return 'green';
      case 'Diácono':
        return 'purple';
      case 'Ministro de Louvor':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      borderColor={borderColor}
      bg={cardBg}
      boxShadow="sm"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={4}>
        <Flex align="center" justify="space-between">
          <HStack spacing={3}>
            <Avatar
              name={member.name}
              size="md"
              bg={getRoleColor(member.role)}
              color="white"
            />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg">
                {member.name}
              </Text>
              <Badge colorScheme={getRoleColor(member.role)} px={2} py={0.5}>
                {member.role}
              </Badge>
            </VStack>
          </HStack>
        </Flex>

        <VStack align="start" spacing={2}>
          <Text color="gray.600">
            <Text as="span" fontWeight="medium">Nascimento:</Text> {member.birthDate}
          </Text>
          <Text color="gray.600">
            <Text as="span" fontWeight="medium">Telefone:</Text> {member.phone}
          </Text>
        </VStack>

        <HStack spacing={2} pt={2}>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            leftIcon={<FaEdit />}
            onClick={() => onEdit(member)}
            flex={1}
          >
            Editar
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            leftIcon={<FaTrash />}
            onClick={() => onDelete(member.id)}
            flex={1}
          >
            Excluir
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MemberCard;