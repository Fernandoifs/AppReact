import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react'

const MemberForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    onSubmit(data)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? 'Editar' : 'Novo'} Membro</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  name="name"
                  defaultValue={initialData?.name}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  name="phone"
                  defaultValue={initialData?.phone}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  defaultValue={initialData?.email}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Função</FormLabel>
                <Input
                  name="role"
                  defaultValue={initialData?.role}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" w="full">
                {initialData ? 'Salvar' : 'Adicionar'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default MemberForm