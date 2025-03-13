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
  useToast,
} from '@chakra-ui/react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaSearch, FaShare, FaCheck, FaPlus } from 'react-icons/fa';
import { useEvents } from '../contexts/EventsContext';
import eventsData from '../mocks/events.json';
import BottomNavigation from '../components/shared/BottomNavigation';

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
  const toast = useToast();

  const { events, setEvents } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState(eventsData.events);
  const [bibleData, setBibleData] = useState({
    books: [],
    chapters: [],
    verses: [],
  });
  const [newEvent, setNewEvent] = useState({
    category: 'Culto',
    date: '',
    time: '',
    verses: [],
    selectedBook: '',
    selectedChapter: '',
    selectedVerse: '',
  });
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (events.length === 0) {
      setEvents(eventsData.events);
    }
    setFilteredEvents(events.length > 0 ? events : eventsData.events);
  }, [events, setEvents]);

  useEffect(() => {
    // Load Bible data when component mounts
    const loadBibleData = async () => {
      try {
        const response = await import('../mocks/biblev1.json');
        const books = response.biblia.livros.map((book) => ({
          id: book.id,
          name: book.nome,
        }));
        setBibleData((prev) => ({ ...prev, books }));
      } catch (error) {
        console.error('Error loading Bible data:', error);
      }
    };
    loadBibleData();
  }, []);

  const handleBookChange = async (bookId) => {
    try {
      const response = await import('../mocks/biblev1.json');
      const selectedBook = response.biblia.livros.find((book) => book.id === bookId);
      if (selectedBook) {
        const chapters = selectedBook.capitulos.map((cap) => cap.numero);
        setBibleData((prev) => ({ ...prev, chapters, verses: [] }));
        setNewEvent((prev) => ({ ...prev, selectedBook: bookId, selectedChapter: '', selectedVerse: '' }));
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const handleChapterChange = async (chapter) => {
    try {
      const response = await import('../mocks/biblev1.json');
      const selectedBook = response.biblia.livros.find((book) => book.id === newEvent.selectedBook);
      if (selectedBook) {
        const selectedChapter = selectedBook.capitulos.find((cap) => cap.numero === parseInt(chapter));
        if (selectedChapter) {
          const verses = selectedChapter.versiculos.map((verse) => verse.numero);
          setBibleData((prev) => ({ ...prev, verses }));
          setNewEvent((prev) => ({ ...prev, selectedChapter: chapter, selectedVerse: '' }));
        }
      }
    } catch (error) {
      console.error('Error loading verses:', error);
    }
  };

  const handleVerseChange = (verse) => {
    setNewEvent((prev) => ({ ...prev, selectedVerse: verse }));
  };

  const handleAddVerse = () => {
    if (newEvent.selectedBook && newEvent.selectedChapter && newEvent.selectedVerse) {
      const bookName = bibleData.books.find((book) => book.id === newEvent.selectedBook)?.name;
      if (bookName) {
        const verseReference = `${bookName} ${newEvent.selectedChapter}:${newEvent.selectedVerse}`;
        if (!newEvent.verses.includes(verseReference)) {
          setNewEvent((prev) => ({
            ...prev,
            verses: [...prev.verses, verseReference],
            selectedBook: '',
            selectedChapter: '',
            selectedVerse: '',
          }));
          // Clear chapters and verses arrays
          setBibleData((prev) => ({ ...prev, chapters: [], verses: [] }));
        }
      }
    }
  };

  const handleSearch = (searchTerm) => {
    const dataSource = events.length > 0 ? events : eventsData.events;
    filterEvents(dataSource, searchTerm, categoryFilter);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    const dataSource = events.length > 0 ? events : eventsData.events;
    filterEvents(dataSource, '', category);
  };

  const filterEvents = (dataSource, searchTerm, category) => {
    let filtered = dataSource;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((event) => event.category === category);
    }

    setFilteredEvents(filtered);
  };

  const handleNewEvent = (e) => {
    e.preventDefault();
    if (!newEvent.date || !newEvent.time) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventId = Date.now();
    const eventWithId = { ...newEvent, id: eventId };
    setEvents([...events, eventWithId]);
    setNewEvent({ category: 'Culto', date: '', time: '', verses: [], selectedBook: '', selectedChapter: '', selectedVerse: '' });
    onNewEventClose();

    toast({
      title: 'Sucesso',
      description: 'Evento criado com sucesso!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setSelectedEvent(null);
    onClose();

    toast({
      title: 'Sucesso',
      description: 'Evento excluído com sucesso!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
            <Select
              placeholder="Categoria"
              maxW={{ base: 'full', md: '200px' }}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              value={categoryFilter}
            >
              <option value="all">Todas</option>
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
                style: { backgroundColor: '#4299E1', color: '#fff', borderRadius: '4px' },
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
              views={['month', 'week', 'day']}
              defaultView="month"
              popup
              tooltipAccessor={(event) => event.title} // Exibe o título no tooltip
            />
          </Box>

          {/* Event Details Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedEvent?.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <Tag size="md" colorScheme="blue" alignSelf="flex-start">
                    {selectedEvent?.category}
                  </Tag>
                  <Text fontWeight="bold">
                    {selectedEvent &&
                      format(new Date(`${selectedEvent.date}T${selectedEvent.time}`), "dd/MM/yyyy 'às' HH:mm")}
                  </Text>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={() => handleDeleteEvent(selectedEvent?.id)}>
                  Excluir
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Fechar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

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

          {/* New Event Modal */}
          <Modal isOpen={isNewEventOpen} onClose={onNewEventClose} size="md">
            <ModalOverlay />
            <ModalContent>
              <form onSubmit={handleNewEvent}>
                <ModalHeader>Novo Evento</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      >
                        <option value="Culto">Culto</option>
                        <option value="Grupo">Grupo</option>
                        <option value="Conferência">Conferência</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Data</FormLabel>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Horário</FormLabel>
                      <Input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </FormControl>
                    {newEvent.category === 'Culto' && (
                      <>
                        <FormControl>
                          <FormLabel>Leituras</FormLabel>
                          <Text>{newEvent.verses.join(', ')}</Text>
                        </FormControl>
                        <HStack spacing={4} align="flex-end">
                          <FormControl flex={2}>
                            <FormLabel>Livro</FormLabel>
                            <Select
                              value={newEvent.selectedBook}
                              onChange={(e) => handleBookChange(e.target.value)}
                              placeholder="Selecione o livro"
                            >
                              {bibleData.books.map((book) => (
                                <option key={book.id} value={book.id}>
                                  {book.name}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl flex={1}>
                            <FormLabel>Capítulo</FormLabel>
                            <Select
                              value={newEvent.selectedChapter}
                              onChange={(e) => handleChapterChange(e.target.value)}
                              placeholder="Cap"
                              isDisabled={!newEvent.selectedBook}
                            >
                              {bibleData.chapters.map((chapter) => (
                                <option key={chapter} value={chapter}>
                                  {chapter}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl flex={1}>
                            <FormLabel>Versículo</FormLabel>
                            <Select
                              value={newEvent.selectedVerse}
                              onChange={(e) => handleVerseChange(e.target.value)}
                              placeholder="Ver"
                              isDisabled={!newEvent.selectedChapter}
                            >
                              {bibleData.verses.map((verse) => (
                                <option key={verse} value={verse}>
                                  {verse}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                          <IconButton
                            icon={<FaPlus />}
                            colorScheme="blue"
                            aria-label="Adicionar leitura"
                            onClick={handleAddVerse}
                            isDisabled={!newEvent.selectedVerse}
                          />
                        </HStack>
                      </>
                    )}
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" colorScheme="blue" mr={3}>
                    Salvar
                  </Button>
                  <Button onClick={onNewEventClose}>Cancelar</Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Stack>
      </Container>
      <BottomNavigation />
    </Box>
  );
};

export default Events;