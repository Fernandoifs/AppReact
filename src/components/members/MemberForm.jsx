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
  Select,
  ModalFooter,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const MemberForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD for the date input
      if (initialData.birthDate) {
        const formattedDate = new Date(initialData.birthDate).toISOString().split('T')[0];
        setValue('birthDate', formattedDate);
      }
      setValue('name', initialData.name);
      setValue('phone', initialData.phone);
      setValue('role', initialData.role);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? 'Editar Membro' : 'Adicionar Membro'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input {...register('name', { required: true })} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Data de Nascimento</FormLabel>
                <Input 
                  type="date" 
                  {...register('birthDate', { required: true })} 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Telefone</FormLabel>
                <Input 
                  type="tel"
                  {...register('phone', { required: true })} 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Função</FormLabel>
                <Select {...register('role', { required: true })}>
                  <option value="Membro">Membro</option>
                  <option value="Líder">Líder</option>
                  <option value="Pastor">Pastor</option>
                  <option value="Diácono">Diácono</option>
                  <option value="Ministro de Louvor">Ministro de Louvor</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              {initialData ? 'Salvar' : 'Adicionar'}
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default MemberForm;