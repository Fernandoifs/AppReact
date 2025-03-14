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
  useToast,VStack
} from '@chakra-ui/react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaSearch, FaPlus } from 'react-icons/fa';
import { useEvents } from '../contexts/EventsContext';
import eventsData from '../mocks/events.json';
import BottomNavigation from '../components/shared/BottomNavigation';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const locales = { 'pt-BR': ptBR };

const extractBibleReference = (verseRef) => {
  const match = verseRef.match(/(.+)\s(\d+):(\d+)/);
  if (match) {
    return {
      bookName: match[1],
      chapter: match[2],
      verse: match[3]
    };
  }
  return null;
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const Events = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isNewEventOpen, onOpen: onNewEventOpen, onClose: onNewEventClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  const { events, setEvents } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState(eventsData.events);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Carregar eventos no estado global
  useEffect(() => {
    if (events.length === 0) {
      setEvents(eventsData.events);
    }
    setFilteredEvents(events.length > 0 ? events : eventsData.events);
  }, [events, setEvents]);

  // Carregar dados da Bíblia apenas uma vez
  const [bibleData, setBibleData] = useState({ books: [] });

  useEffect(() => {
    const loadBibleData = async () => {
      try {
        const response = await import('../mocks/biblev1.json');
        const books = response.biblia.livros.map((book) => ({
          id: book.id,
          name: book.nome,
          chapters: book.capitulos.map((cap) => ({
            number: cap.numero,
            verses: cap.versiculos.map((verse) => verse.numero),
          })),
        }));
        setBibleData({ books });
      } catch (error) {
        console.error('Erro ao carregar dados da Bíblia:', error);
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
  // Novo evento
  const [newEvent, setNewEvent] = useState({
    category: 'Culto',
    date: '',
    time: '',
    verses: [],
    selectedBook: '',
    selectedChapter: '',
    selectedVerse: '',
  });

  // Filtro de busca com debounce
  const handleSearch = debounce((searchTerm) => {
    const dataSource = events.length > 0 ? events : eventsData.events;
    filterEvents(dataSource, searchTerm, categoryFilter);
  }, 300);

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    filterEvents(events, '', category);
  };

  const filterEvents = (dataSource, searchTerm, category) => {
    let filtered = dataSource;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== 'all') {
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

    const eventData = {
      id: Date.now(),
      category: newEvent.category,
      date: newEvent.date,
      time: newEvent.time,
      verses: newEvent.verses,
    };

    setEvents((prevEvents) => [...prevEvents, eventData]);
    
    // Reset form
    setNewEvent({
      category: "Culto",
      date: "",
      time: "",
      verses: [],
      selectedBook: "",
      selectedChapter: "",
      selectedVerse: "",
    });

    // Close modal
    onNewEventClose();

    // Show success message
    toast({
      title: 'Sucesso',
      description: 'Evento criado com sucesso!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const dayTextColor = useColorModeValue('gray.800', 'gray');
  return (
    <Box bg={bgColor} p={4}>
      <Container maxW="container.xl">
        <Stack spacing={6}>
          <Flex justify="space-between" align="center">
            <Heading size="lg">Eventos</Heading>
            <Button leftIcon={<FaCalendarPlus />} colorScheme="blue" onClick={onNewEventOpen}>
              Novo Evento
            </Button>
          </Flex>

          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <InputGroup maxW={{ base: 'full', md: '400px' }}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Buscar eventos..." onChange={(e) => handleSearch(e.target.value)} />
            </InputGroup>
            <Select maxW={{ base: 'full', md: '200px' }} onChange={(e) => handleCategoryFilter(e.target.value)} value={categoryFilter}>
              <option value="all">Todas</option>
              <option value="Culto">Cultos</option>
              <option value="Grupo">Grupos</option>
              <option value="Conferência">Conferências</option>
            </Select>
          </Stack>

          <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="sm" height={{ base: "400px", md: "500px" }} className="custom-calendar" sx={{
            '.rbc-calendar': {
              backgroundColor: useColorModeValue('white', 'gray.700'),
              color: dayTextColor,
              '.rbc-month-view': {
                backgroundColor: useColorModeValue('white', 'gray.700'),
              },
              '.rbc-header': {
                backgroundColor: useColorModeValue('gray.50', 'gray.600'),
              },
              '.rbc-day-bg': {
                backgroundColor: useColorModeValue('white', 'gray.700'),
              },
              '.rbc-off-range-bg': {
                backgroundColor: useColorModeValue('gray.50', 'gray.600'),
              },
              '.rbc-today': {
                backgroundColor: useColorModeValue('blue.50', 'blue.900'),
              }
            }
          }}>
            <Calendar
              localizer={localizer}
              events={filteredEvents.map((event) => ({
                ...event,
                start: event.date && event.time ? new Date(`${event.date}T${event.time}`) : new Date(),
                end: event.date && event.time ? new Date(`${event.date}T${event.time}`) : new Date(),
                title: event.category,
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%', color: dayTextColor }}
              views={['month', 'week', 'day']}
              defaultView="month"
              onSelectSlot={(slotInfo) => {
                const selectedDate = format(slotInfo.start, 'yyyy-MM-dd');
                setNewEvent(prev => ({
                  ...prev,
                  date: selectedDate,
                  time: '19:00'
                }));
                onNewEventOpen();
              }}
              selectable={true}
              messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                allDay: "Dia inteiro",
                noEventsInRange: "Não há eventos neste período.",
                showMore: (total) => `+${total} mais`
              }}
              culture="pt-BR"
              popup
            />
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {filteredEvents.map((event) => (
              <Card key={event.id} bg={cardBg} cursor="pointer" _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s" onClick={() => {
                setSelectedEvent(event);
                onDetailsOpen();
              }}>
                <CardBody>
                  <Stack spacing={3}>
                    <Box w="fit-content">
                      <Tag size="sm" colorScheme="blue">{event.category}</Tag>
                    </Box>
                    <Heading size="md">{event.category}</Heading>
                    <Text color="gray.500">{format(new Date(event.date + ' ' + event.time), "dd/MM/yyyy 'às' HH:mm")}</Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
      <BottomNavigation />

      <Modal isOpen={isNewEventOpen} onClose={onNewEventClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Evento</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleNewEvent}>
            <ModalBody>
              <VStack spacing={4}>


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
                  <FormLabel>Hora</FormLabel>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  {newEvent.category === 'Culto' && (
                    <>
                    <FormLabel>Leituras</FormLabel>
                      <HStack spacing={4} mb={2}>
                        <Select
                          placeholder="Livro"
                          value={newEvent.selectedBook}
                          onChange={(e) => handleBookChange(e.target.value)}
                        >
                          {bibleData.books.map((book) => (
                            <option key={book.id} value={book.id}>
                              {book.name}
                            </option>
                          ))}
                        </Select>
                        <Select
                          placeholder="Capítulo"
                          value={newEvent.selectedChapter}
                          onChange={(e) => handleChapterChange(e.target.value)}
                          isDisabled={!newEvent.selectedBook}
                        >
                          {bibleData.chapters?.map((chapter) => (
                            <option key={chapter} value={chapter}>
                              {chapter}
                            </option>
                          ))}
                        </Select>
                        <Select
                          placeholder="Versículo"
                          value={newEvent.selectedVerse}
                          onChange={(e) => handleVerseChange(e.target.value)}
                          isDisabled={!newEvent.selectedChapter}
                        >
                          {bibleData.verses?.map((verse) => (
                            <option key={verse} value={verse}>
                              {verse}
                            </option>
                          ))}
                        </Select>
                        <IconButton
                          icon={<FaPlus />}
                          onClick={handleAddVerse}
                          isDisabled={!newEvent.selectedVerse}
                          aria-label="Adicionar versículo"
                        />
                      </HStack>
                      {newEvent.verses.length > 0 && (
                        <VStack align="start" spacing={2}>
                          {newEvent.verses.map((verse, index) => (
                            <Tag
                              key={index}
                              size="md"
                              variant="subtle"
                              colorScheme="blue"
                              onClose={() => {
                                setNewEvent((prev) => ({
                                  ...prev,
                                  verses: prev.verses.filter((_, i) => i !== index),
                                }));
                              }}
                            >
                              {verse}
                            </Tag>
                          ))}
                        </VStack>
                      )}
                    </>
                  )}
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onNewEventClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" type="submit">
                Salvar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEvent?.category}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text fontWeight="bold">Data: {selectedEvent && format(new Date(`${selectedEvent.date}T${selectedEvent.time}`), "dd/MM/yyyy 'às' HH:mm")}</Text>
              {selectedEvent?.verses && selectedEvent.verses.length > 0 && (
                <Box>
                  <Text fontWeight="bold" mb={2}>Leituras Bíblicas:</Text>
                  <VStack align="start" spacing={2}>
                    {selectedEvent.verses.map((verse, index) => {
                      const bibleRef = extractBibleReference(verse);
                      return (
                        <Tag
                          key={index}
                          size="md"
                          variant="subtle"
                          colorScheme="blue"
                          cursor="pointer"
                          onClick={() => {
                            if (bibleRef) {
                              const bookData = bibleData.books.find(b => b.name === bibleRef.bookName);
                              if (bookData) {
                                navigate('/biblev1', {
                                  state: {
                                    bookId: bookData.id,
                                    chapter: bibleRef.chapter,
                                    verse: bibleRef.verse
                                  }
                                });
                              }
                            }
                          }}
                          _hover={{ transform: 'scale(1.05)' }}
                        >
                          {verse}
                        </Tag>
                      );
                    })}
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onDetailsClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Events;
