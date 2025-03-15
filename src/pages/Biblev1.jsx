import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import BottomNavigation from '../components/shared/BottomNavigation';
import bibleData from '../mocks/biblev1.json';

const Biblev1 = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const location = useLocation();
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [view, setView] = useState('books');
  const [books, setBooks] = useState(bibleData.biblia?.livros || []);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (location.state?.bookId && location.state?.chapter) {
      console.log('Received navigation state:', location.state);
      const book = books.find(b => b.id === location.state.bookId);
      if (book) {
        console.log('Found book:', book.nome);
        setSelectedBook(book);
        setChapters(book.capitulos);
        setView('chapters');

        const chapter = book.capitulos.find(c => c.numero === parseInt(location.state.chapter));
        if (chapter) {
          console.log('Found chapter:', chapter.numero);
          setSelectedChapter(chapter.numero);
          setVerses(chapter.versiculos);
          setView('verses');

          if (location.state.verse) {
            console.log('Scrolling to verse:', location.state.verse);
            setSelectedVerse(parseInt(location.state.verse));
            setView('verseContent');
            
            // Ensure DOM is ready before scrolling
            requestAnimationFrame(() => {
              const verseElement = document.getElementById(`verse-${location.state.verse}`);
              if (verseElement) {
                verseElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            });
          }
        }
      }
    }
  }, [location.state, books]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setChapters(book.capitulos);
    setView('chapters');
  };

  const handleChapterSelect = (chapter) => {
    const chapterData = selectedBook.capitulos.find(c => c.numero === chapter);
    if (chapterData) {
      setVerses(chapterData.versiculos);
      setSelectedChapter(chapter);
      setView('verses');
    }
  };

  const handleVerseSelect = (verse) => {
    setSelectedVerse(verse);
    setView('verseContent');
  };

  const handleBack = () => {
    if (view === 'verseContent') {
      setView('verses');
      setSelectedVerse(null);
    } else if (view === 'verses') {
      setView('chapters');
      setSelectedChapter(null);
    } else if (view === 'chapters') {
      setView('books');
      setSelectedBook(null);
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" p={4} color={textColor}>
      <Container maxW="container.xl">
        <Grid templateColumns="auto 1fr" gap={4} mb={6} alignItems="center">
          {view !== 'books' && (
            <Button leftIcon={<FaArrowLeft />} onClick={handleBack} variant="ghost">
              Voltar
            </Button>
          )}
          <Heading>
            {view === 'books' && 'Bíblia Sagrada'}
            {view === 'chapters' && selectedBook?.nome}
            {view === 'verses' && `${selectedBook?.nome} - Capítulo ${selectedChapter}`}
            {view === 'verseContent' && `${selectedBook?.nome} ${selectedChapter}:${selectedVerse}`}
          </Heading>
        </Grid>

        {view === 'books' && (
          <>
            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
              {books.filter(book => book.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((book) => (
                  <Card key={book.id} bg={cardBg} cursor="pointer" onClick={() => handleBookSelect(book)}>
                    <CardBody>
                      <Text fontWeight="bold">{book.nome}</Text>
                    </CardBody>
                  </Card>
                ))}
            </SimpleGrid>
          </>
        )}

        {view === 'chapters' && (
          <SimpleGrid columns={{ base: 6, md: 8, lg: 12 }} spacing={4}>
            {chapters.map((chapter) => (
              <Card key={chapter.numero} bg={cardBg} cursor="pointer" onClick={() => handleChapterSelect(chapter.numero)}>
                <CardBody>
                  <Text fontWeight="bold">{chapter.numero}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {view === 'verses' && (
          <SimpleGrid columns={{ base: 6, md: 8, lg: 12 }} spacing={4}>
            {verses.map((verse) => (
              <Card key={verse.numero} bg={cardBg} cursor="pointer" onClick={() => handleVerseSelect(verse.numero)}>
                <CardBody>
                  <Text fontWeight="bold">{verse.numero}</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {view === 'verseContent' && (
          <Box p={4}>
            <VStack spacing={4} align="stretch">
              <Heading size="lg" color="white" mb={6}>
                {selectedBook?.nome}
              </Heading>
              <Heading size="xl" color="white" mb={8} textAlign="center">
                Capítulo {selectedChapter}
              </Heading>
              <Text
                id={`verse-${selectedVerse}`}
                fontSize="xl"
                color="white"
                p={4}
                bg="gray.800"
                borderRadius="md"
              >
                <Text as="sup" fontSize="md" mr={2} color="gray.400">
                  {selectedVerse}
                </Text>
                {verses.find(v => v.numero === selectedVerse)?.texto}
              </Text>
            </VStack>
          </Box>
        )}
      </Container>
      <BottomNavigation />
    </Box>
  );
};

export default Biblev1;
