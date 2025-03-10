import {
  Box,
  Container,
  Heading,
  Button,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Card,
  CardBody,
  Text,
  HStack,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  useColorModeValue,
  Flex,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import { FaCalendarPlus, FaSearch, FaShare, FaCheck } from 'react-icons/fa';
import { useEvents } from '../contexts/EventsContext';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Events = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isNewEventOpen,
    onOpen: onNewEventOpen,
    onClose: onNewEventClose,
  } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const { events, setEvents } = useEvents();
  const [newEvent, setNewEvent] = useState({
    category: 'Culto',
    date: '',
    time: '',
    description: '',
  });

  const handleAddEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: Date.now() }]);
  };

  const handleNewEvent = (e) => {
    e.preventDefault();
    const eventToAdd = {
      id: Date.now(),
      ...newEvent,
    };
    setEvents([...events, eventToAdd]);
    onNewEventClose();
    setNewEvent({
      category: 'Culto',
      date: '',
      time: '',
      description: '',
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = new Date(slotInfo.start);
    setNewEvent({
      category: 'Culto',
      date: selectedDate.toISOString().split('T')[0],
      time: '19:00',
      description: '',
    });
    onNewEventOpen();
  };

  return (
    <Box bg={bgColor} minH="100vh" p={4}>
      <Container maxW="container.xl">
        <Stack spacing={6}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Heading size="lg">Eventos</Heading>
            <Button
              leftIcon={<FaCalendarPlus />}
              colorScheme="blue"
              onClick={onNewEventOpen}
            >
              Novo Evento
            </Button>
          </Flex>

          {/* Search and Filters */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <InputGroup maxW={{ base: 'full', md: '400px' }}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Buscar eventos..." />
            </InputGroup>
            <Select placeholder="Categoria" maxW={{ base: 'full', md: '200px' }}>
              <option value="culto">Cultos</option>
              <option value="grupo">Grupos</option>
              <option value="conferencia">Conferências</option>
            </Select>
          </Stack>

          {/* Calendar */}
          <Box
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            height="500px"
          > 
            <Calendar
              localizer={localizer}
              events={events.map((event) => ({
                ...event,
                start: new Date(`${event.date}T${event.time}`),
                end: new Date(`${event.date}T${event.time}`),
                style: { backgroundColor: '#4299E1', color: '#fff' }, // Estilo dos eventos
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{
                height: '100%',
                color: '#333', // Cor da fonte
                '.rbc-header': { // Estilo para os cabeçalhos (dias da semana)
                  backgroundColor: '#f7fafc', // Cinza claro
                  color: '#333',
                  padding: '10px',
                },
                '.rbc-today': { // Estilo para o dia atual
                  backgroundColor: '#ebf8ff', // Azul claro
                },
              }}
              onSelectEvent={handleEventClick}
              selectable={true}
              onSelectSlot={handleSelectSlot}
              messages={{
                next: 'Próximo',
                previous: 'Anterior',
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
              }}
            />
          </Box>

          {/* Events List */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {events.map((event) => (
              <Card
                key={event.id}
                bg={cardBg}
                onClick={() => handleEventClick(event)}
                cursor="pointer"
                _hover={{ transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <CardBody>
                  <Stack spacing={3}>
                    <Tag size="sm" colorScheme="blue" alignSelf="flex-start">
                      {event.category}
                    </Tag>
                    <Heading size="md">{event.category}</Heading>
                    <Text color="gray.500">
                      {format(new Date(`${event.date}T${event.time}`), "dd/MM/yyyy 'às' HH:mm")}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Event Details Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedEvent?.category}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                {selectedEvent && (
                  <Stack spacing={4}>
                    <Text>{selectedEvent.description}</Text>
                    <HStack>
                      <Text fontWeight="bold">Data:</Text>
                      <Text>
                        {format(new Date(`${selectedEvent.date}T${selectedEvent.time}`), "dd/MM/yyyy 'às' HH:mm")}
                      </Text>
                    </HStack>
                  </Stack>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* New Event Modal */}
          <Modal isOpen={isNewEventOpen} onClose={onNewEventClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Novo Culto</ModalHeader>
              <ModalCloseButton />
              <form onSubmit={handleNewEvent}>
                <ModalBody pb={6}>
                  <Stack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={newEvent.category}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, category: e.target.value })
                        }
                      >
                        <option value="Culto">Culto</option>
                        <option value="Grupo">Grupo</option>
                        <option value="Conferência">Conferência</option>
                      </Select>
                    </FormControl>

                    <HStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Data</FormLabel>
                        <Input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, date: e.target.value })
                          }
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Horário</FormLabel>
                        <Input
                          type="time"
                          value={newEvent.time}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, time: e.target.value })
                          }
                        />
                      </FormControl>
                    </HStack>

                    <FormControl>
                      <FormLabel>Descrição</FormLabel>
                      <Textarea
                        value={newEvent.description}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, description: e.target.value })
                        }
                      />
                    </FormControl>
                  </Stack>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} type="submit">
                    Salvar
                  </Button>
                  <Button onClick={onNewEventClose}>Cancelar</Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Stack>
      </Container>
    </Box>
  );
};

export default Events;