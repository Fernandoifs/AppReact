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
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { FaUser, FaPhone, FaCalendarAlt, FaUserTag } from 'react-icons/fa';

const MemberForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
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
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>{initialData ? 'Editar Membro' : 'Adicionar Membro'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.name}>
                <FormLabel>Nome</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaUser} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    {...register('name', {
                      required: 'Nome é obrigatório',
                      minLength: { value: 3, message: 'Nome deve ter no mínimo 3 caracteres' },
                    })}
                    placeholder="Nome completo"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.birthDate}>
                <FormLabel>Data de Nascimento</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaCalendarAlt} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    {...register('birthDate', {
                      required: 'Data de nascimento é obrigatória',
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.birthDate?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.phone}>
                <FormLabel>Telefone</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaPhone} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    {...register('phone', {
                      required: 'Telefone é obrigatório',
                      pattern: {
                        value: /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/,
                        message: 'Formato inválido. Ex: (11) 98765-4321',
                      },
                    })}
                    placeholder="(00) 00000-0000"
                  />
                </InputGroup>
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.role}>
                <FormLabel>Função</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaUserTag} color="gray.500" />
                  </InputLeftElement>
                  <Select
                    {...register('role', { required: 'Função é obrigatória' })}
                    pl={10}
                  >
                    <option value="">Selecione uma função</option>
                    <option value="Membro">Membro</option>
                    <option value="Líder">Líder</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Diácono">Diácono</option>
                    <option value="Ministro de Louvor">Ministro de Louvor</option>
                  </Select>
                </InputGroup>
                <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              {initialData ? 'Salvar' : 'Adicionar'}
            </Button>
            <Button onClick={onClose} variant="ghost">Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default MemberForm;