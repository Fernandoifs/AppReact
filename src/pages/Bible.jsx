import { useState } from 'react';
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
import bibleData from '../mocks/biblev2.xml';

const Bible = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [view, setView] = useState('books');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBible, setSelectedBible] = useState(bibleData.biblia?.id || 'nlth');
  const [books, setBooks] = useState(() => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(bibleData, 'text/xml');
    const testament = xmlDoc.querySelector('testament');
    const bookElements = testament?.getElementsByTagName('book') || [];
    
    return Array.from(bookElements).map((book, index) => ({
      id: book.getAttribute('number'),
      name: `Livro ${index + 1}`
    })) || [];
  });

  const handleBookSelect = (book) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(bibleData, 'text/xml');
    const testament = xmlDoc.querySelector('testament');
    const bookElement = Array.from(testament?.getElementsByTagName('book') || []).find(
      (b) => b.getAttribute('number') === book.id
    );

    if (!bookElement) {
      setError('Livro não encontrado.');
      return;
    }

    const chapterElements = bookElement.getElementsByTagName('chapter');
    if (!chapterElements.length) {
      setError('Este livro ainda não está disponível.');
      return;
    }

    const bookChapters = Array.from(chapterElements).map((chapter) => ({
      id: `${book.id}${chapter.getAttribute('number')}`,
      number: parseInt(chapter.getAttribute('number'))
    }));

    setChapters(bookChapters);
    setSelectedBook(book);
    setView('chapters');
    setError(null);
  };

  const handleChapterSelect = (chapter) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(bibleData, 'text/xml');
    const testament = xmlDoc.querySelector('testament');
    const bookElement = Array.from(testament?.getElementsByTagName('book') || []).find(
      (b) => b.getAttribute('number') === selectedBook.id
    );

    if (!bookElement) {
      setError('Livro não encontrado.');
      return;
    }

    const chapterElement = Array.from(bookElement.getElementsByTagName('chapter')).find(
      (c) => parseInt(c.getAttribute('number')) === chapter.number
    );

    if (!chapterElement) {
      setError('Este capítulo ainda não está disponível.');
      return;
    }

    const verseElements = chapterElement.getElementsByTagName('verse');
    const chapterVerses = Array.from(verseElements).map((verse) => ({
      id: `${selectedBook.id}${chapter.number}${verse.getAttribute('number')}`,
      number: parseInt(verse.getAttribute('number')),
      content: verse.textContent
    }));

    setVerses(chapterVerses);
    setSelectedChapter(chapter.number);
    setView('verses');
    setError(null);
  };
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerse, setSelectedVerse] = useState(null);

  const handleBookSelect = (book) => {
    const bookData = bibleData.biblia?.livros?.find(b => b.id === book.id);
    if (!bookData) {
      setError('Livro não encontrado.');
      return;
    }
    if (!bookData.capitulos?.length) {
      setError('Este livro ainda não está disponível.');
      return;
    }
    const bookChapters = bookData.capitulos.map(cap => ({
      id: `${book.id}${cap.numero}`,
      number: cap.numero
    }));
    setChapters(bookChapters);
    setSelectedBook(book);
    setView('chapters');
    setError(null);
  };

  const handleChapterSelect = (chapter) => {
    const bookData = bibleData.biblia?.livros?.find(b => b.id === selectedBook.id);
    if (!bookData) {
      setError('Livro não encontrado.');
      return;
    }
    const chapterData = bookData.capitulos.find(cap => cap.numero === chapter.number);
    if (!chapterData || !chapterData.versiculos) {
      setError('Este capítulo ainda não está disponível.');
      return;
    }
    const chapterVerses = chapterData.versiculos.map(verse => ({
      id: `${selectedBook.id}${chapter.number}${verse.numero}`,
      number: verse.numero,
      content: verse.texto
    }));
    setVerses(chapterVerses);
    setSelectedChapter(chapter.number);
    setView('verses');
    setError(null);
  };

  const handleBack = () => {
    if (view === 'verses') {
      setView('chapters');
      setSelectedChapter(null);
    } else if (view === 'chapters') {
      setView('books');
      setSelectedBook(null);
    }
  };

  const resetToInitialState = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
    setView('books');
    setChapters([]);
    setVerses([]);
    setError(null);
    setSearchTerm('');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleTextToSpeech = () => {
    if (!verses.length) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentVerse(null);
      return;
    }

    setIsSpeaking(true);
    const utterances = verses.map((verse) => {
      const utterance = new SpeechSynthesisUtterance(`Versículo ${verse.number}. ${verse.content}`);
      utterance.lang = 'pt-BR';
      utterance.onstart = () => setCurrentVerse(verse.id);
      utterance.onend = () => {
        if (verse === verses[verses.length - 1]) {
          setIsSpeaking(false);
          setCurrentVerse(null);
        }
      };
      return utterance;
    });

    utterances.forEach(utterance => window.speechSynthesis.speak(utterance));
  };

  const handleVerseSelect = (verse) => {
    setSelectedVerse(verse);
  };

  const renderVerses = () => (
    <Box>
      <Box position="fixed" bottom={20} right={4} zIndex={10}>
        <IconButton
          aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
          icon={<FaVolumeUp />}
          colorScheme={isSpeaking ? "red" : "blue"}
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
                onClick={() => handleVerseSelect(verse)}
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

      <BottomNavigation onBibleClick={resetToInitialState} />
    </Box>
  );
};

export default Bible;