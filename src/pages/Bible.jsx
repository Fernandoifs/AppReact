import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  VStack,
  Grid,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaBook, FaArrowLeft, FaSearch, FaVolumeUp } from 'react-icons/fa';
import BottomNavigation from '../components/shared/BottomNavigation';
import bibleData from '../mocks/bibliav2.json';

const Bible = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [view, setView] = useState('books');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerse, setSelectedVerse] = useState(null);

  // Carrega os livros do JSON
  const loadBooks = () => {
    try {
      if (!bibleData?.biblia?.testamentos?.[0]?.livros) {
        setError('Estrutura do JSON inválida: livros não encontrados.');
        return;
      }

      const booksArray = bibleData.biblia.testamentos[0].livros.map((book) => ({
        id: book.numero.toString(),
        name: `Livro ${book.numero}`,
      }));

      console.log('Livros carregados:', booksArray);
      setBooks(booksArray);
    } catch (err) {
      setError('Erro ao carregar os livros: ' + err.message);
    }
  };

  // Carrega os livros ao montar o componente
  useEffect(() => {
    loadBooks();
  }, []);

  // Seleciona um livro e carrega seus capítulos
  const handleBookSelect = (book) => {
    try {
      const selectedBookData = bibleData.biblia.testamentos[0].livros.find(
        (b) => b.numero.toString() === book.id
      );

      if (!selectedBookData) {
        setError('Livro não encontrado.');
        return;
      }

      if (!selectedBookData.capitulos?.length) {
        setError('Este livro ainda não está disponível.');
        return;
      }

      const bookChapters = selectedBookData.capitulos.map((chapter) => ({
        id: `${book.id}${chapter.numero}`,
        number: chapter.numero,
      }));

      console.log('Capítulos carregados:', bookChapters);
      setChapters(bookChapters);
      setSelectedBook(book);
      setView('chapters');
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os capítulos: ' + err.message);
    }
  };

  // Seleciona um capítulo e carrega seus versículos
  const handleChapterSelect = (chapter) => {
    try {
      const selectedBookData = bibleData.biblia.testamentos[0].livros.find(
        (b) => b.numero.toString() === selectedBook.id
      );

      if (!selectedBookData) {
        setError('Livro não encontrado.');
        return;
      }

      const selectedChapterData = selectedBookData.capitulos.find(
        (c) => c.numero === chapter.number
      );

      if (!selectedChapterData) {
        setError('Este capítulo ainda não está disponível.');
        return;
      }

      const chapterVerses = selectedChapterData.versiculos.map((verse) => ({
        id: `${selectedBook.id}${chapter.number}${verse.numero}`,
        number: verse.numero,
        content: verse.texto
      }));

      console.log('Versículos carregados:', chapterVerses);
      setVerses(chapterVerses);
      setSelectedChapter(chapter.number);
      setView('verses');
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os versículos: ' + err.message);
    }
  };

  // Volta para a visualização anterior
  const handleBack = () => {
    if (view === 'verses') {
      setView('chapters');
      setSelectedChapter(null);
    } else if (view === 'chapters') {
      setView('books');
      setSelectedBook(null);
    }
  };

  // Filtra os livros com base no termo de pesquisa
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderiza a lista de livros
  const renderBooks = () => (
    <Box>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Pesquisar"
          color={textColor}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </InputGroup>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            bg={cardBg}
            onClick={() => handleBookSelect(book)}
            cursor="pointer"
            _hover={{ transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack spacing={2}>
                <Text fontWeight="bold" textAlign="center" color={textColor}>
                  {book.name}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );

  // Renderiza a lista de capítulos
  const renderChapters = () => (
    <SimpleGrid columns={{ base: 6, md: 8, lg: 12 }} spacing={4}>
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          bg={cardBg}
          onClick={() => handleChapterSelect(chapter)}
          cursor="pointer"
          _hover={{ transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          <CardBody>
            <Text fontWeight="bold" textAlign="center" color={textColor}>
              {chapter.number}
            </Text>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );

  // Renderiza os versículos
  const renderVerses = () => (
    <Box>
      <Box position="fixed" bottom={20} right={4} zIndex={10}>
        <IconButton
          aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
          icon={<FaVolumeUp />}
          colorScheme={isSpeaking ? 'red' : 'blue'}
          rounded="full"
          size="lg"
          onClick={handleTextToSpeech}
        />
      </Box>
      <VStack spacing={4} align="stretch" bg={bgColor} minH="100vh">
        <Box p={4}>
          <Heading size="lg" color={textColor} mb={6}>
            {selectedBook?.name}
          </Heading>
          <Heading size="xl" color={textColor} mb={8} textAlign="center">
            {selectedChapter}
          </Heading>
          <Box>
            {verses.map((verse) => (
              <Text
                key={verse.id}
                fontSize="lg"
                color={textColor}
                mb={4}
                onClick={() => setSelectedVerse(verse)}
                cursor="pointer"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                p={2}
                borderRadius="md"
              >
                <Text as="sup" fontSize="sm" mr={2} color={useColorModeValue('gray.600', 'gray.400')}>
                  {verse.number}
                </Text>
                {verse.content}
              </Text>
            ))}
          </Box>
        </Box>
      </VStack>
      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      {loading && (
        <Box textAlign="center" mt={4}>
          <Spinner size="lg" />
        </Box>
      )}
    </Box>
  );

  return (
    <Box data-testid="bible-component" bg={bgColor} minH="100vh" p={4} color={textColor}>
      <Container maxW="container.xl">
        <Grid templateColumns="auto 1fr" gap={4} mb={6} alignItems="center">
          {view !== 'books' && (
            <Button leftIcon={<FaArrowLeft />} onClick={handleBack} variant="ghost">
              Voltar
            </Button>
          )}
          <Heading display="flex" alignItems="center" gap={2}>
            {view === 'books' && 'Bíblia Sagrada'}
            {view === 'chapters' && `${selectedBook.name}`}
          </Heading>
        </Grid>

        {view === 'books' && renderBooks()}
        {view === 'chapters' && renderChapters()}
        {view === 'verses' && renderVerses()}
      </Container>

      <BottomNavigation />
    </Box>
  );
};

export default Bible;


  const handleTextToSpeech = () => {
    if (!selectedVerse && verses.length === 0) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentVerse(null);
      return;
    }

    const versesToRead = selectedVerse ? [selectedVerse] : verses;
    let currentIndex = 0;

    const speakVerse = () => {
      if (currentIndex >= versesToRead.length) {
        setIsSpeaking(false);
        setCurrentVerse(null);
        return;
      }

      const verse = versesToRead[currentIndex];
      const utterance = new SpeechSynthesisUtterance(
        `Versículo ${verse.number}. ${verse.content}`
      );
      utterance.lang = 'pt-BR';

      utterance.onend = () => {
        currentIndex++;
        speakVerse();
      };

      setCurrentVerse(verse);
      window.speechSynthesis.speak(utterance);
    };

    setIsSpeaking(true);
    speakVerse();
  };