import {
  Box,
  Flex,
  Avatar,
  Text,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useRef } from 'react'

const MemberCard = ({ member, onEdit, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        shadow="sm"
        bg="white"
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Avatar name={member.name} src={member.avatar} mr={4} />
            <Box>
              <Text fontWeight="bold">{member.name}</Text>
              <Text color="gray.600">{member.phone}</Text>
              <Text color="gray.500" fontSize="sm">{member.role}</Text>
            </Box>
          </Flex>
          <Flex>
            <IconButton
              icon={<FaEdit />}
              aria-label="Edit"
              mr={2}
              onClick={() => onEdit(member)}
            />
            <IconButton
              icon={<FaTrash />}
              aria-label="Delete"
              colorScheme="red"
              onClick={onOpen}
            />
          </Flex>
        </Flex>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Excluir Membro</AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza? Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onDelete(member.id)
                  onClose()
                }}
                ml={3}
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default MemberCard