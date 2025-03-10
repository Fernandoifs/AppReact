import { Box, Text, Button, VStack, HStack } from '@chakra-ui/react';

const MemberCard = ({ member, onEdit, onDelete }) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <VStack align="stretch" spacing={2}>
        <Text fontWeight="bold">{member.name}</Text>
        <Text>{member.email}</Text>
        <Text>{member.phone}</Text>
        <HStack spacing={2}>
          <Button size="sm" colorScheme="blue" onClick={() => onEdit(member)}>
            Editar
          </Button>
          <Button size="sm" colorScheme="red" onClick={() => onDelete(member.id)}>
            Excluir
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MemberCard;