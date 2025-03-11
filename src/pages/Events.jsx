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
import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaSearch, FaShare, FaCheck } from 'react-icons/fa';
import { useEvents } from '../contexts/EventsContext';
import eventsData from '../mocks/events.json';

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
  const { isOpen: isNewEventOpen, onOpen: onNewEventOpen, onClose: onNewEventClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const { events, setEvents } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState(eventsData.events);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Culto',
    date: '',
    time: '',
    description: '',
  });

  useEffect(() => {
    if (events.length === 0) {
      setEvents(eventsData.events);
    }
    setFilteredEvents(events.length > 0 ? events : eventsData.events);
  }, [events, setEvents]);

  const handleSearch = (searchTerm) => {
    const dataSource = events.length > 0 ? events : eventsData.events;
    const filtered = dataSource.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleNewEvent = (e) => {
    e.preventDefault();
    setEvents([...events, newEvent]);
    setNewEvent({ title: '', category: 'Culto', date: '', time: '', description: '' });
    onNewEventClose();
  };

  return (
    <Box bg={bgColor} p={4}>
      <Container maxW="container.xl">
        <Stack spacing={6}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Heading size="lg">Eventos</Heading>
            <Button leftIcon={<FaCalendarPlus />} colorScheme="blue" onClick={onNewEventOpen}>
              Novo Evento
            </Button>
          </Flex>

          {/* Search and Filters */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <InputGroup maxW={{ base: 'full', md: '400px' }}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Buscar eventos..." 
                onChange={(e) => handleSearch(e.target.value)}
              />
            </InputGroup>
            <Select placeholder="Categoria" maxW={{ base: 'full', md: '200px' }}>
              <option value="Culto">Cultos</option>
              <option value="Grupo">Grupos</option>
              <option value="Conferência">Conferências</option>
            </Select>
          </Stack>

          {/* Calendar */}
          <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" height="500px">
            <Calendar
              localizer={localizer}
              events={filteredEvents.map((event) => ({
                ...event,
                start: new Date(`${event.date}T${event.time}`),
                end: new Date(`${event.date}T${event.time}`),
                title: event.title,
                style: { backgroundColor: '#4299E1', color: '#fff' },
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={(event) => {
                setSelectedEvent(event);
                onOpen();
              }}
              selectable={true}
              onSelectSlot={(slotInfo) => {
                const selectedDate = new Date(slotInfo.start);
                setNewEvent({
                  ...newEvent,
                  date: selectedDate.toISOString().split('T')[0],
                  time: '19:00',
                });
                onNewEventOpen();
              }}
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
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                bg={cardBg}
                onClick={() => {
                  setSelectedEvent(event);
                  onOpen();
                }}
                cursor="pointer"
                _hover={{ transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <CardBody>
                  <Stack spacing={3}>
                    <Tag size="sm" colorScheme="blue" alignSelf="flex-start">
                      {event.category}
                    </Tag>
                    <Heading size="md">{event.title}</Heading>
                    <Text color="gray.500">
                      {format(new Date(`${event.date}T${event.time}`), "dd/MM/yyyy 'às' HH:mm")}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Existing modals remain the same */}
          {/* ... */}
        </Stack>
      </Container>
    </Box>
  );
};

export default Events;