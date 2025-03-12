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
  useColorModeValue,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
} from '@chakra-ui/react';
import { FaBook, FaArrowLeft, FaSearch, FaVolumeUp } from 'react-icons/fa';
import BottomNavigation from '../components/shared/BottomNavigation';
import bibleData from '../mocks/bible.json';

const Bible = () => {
  const bgColor = 'black';
  const cardBg = 'gray.800';
  const textColor = 'white';
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [view, setView] = useState('books');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bibles] = useState(bibleData.bibles);
  const [selectedBible, setSelectedBible] = useState(bibleData.bibles[0]?.id);
  const [books, setBooks] = useState(bibleData.books);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBookSelect = (book) => {
    const bookChapters = bibleData.chapters[book.id] || [];
    setChapters(bookChapters);
    setSelectedBook(book);
    setView('chapters');
  };

  const handleChapterSelect = (chapter) => {
    const chapterVerses = bibleData.verses[chapter.id] || [];
    setVerses(chapterVerses);
    setSelectedChapter(chapter.number);
    setView('verses');
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

  const renderVerses = () => (
    <Box>
      <Box position="fixed" bottom={20} right={4} zIndex={10}>
        <IconButton
          aria-label="Read aloud"
          icon={<FaVolumeUp />}
          colorScheme="blue"
          rounded="full"
          size="lg"
        />
      </Box>
      <SimpleGrid columns={1} spacing={4}>
        {verses.map((verse) => (
          <Box key={verse.id} p={4}>
            <Text color={textColor}>
              <Text as="span" fontWeight="bold" color={textColor}>{verse.number}</Text> {verse.content}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );

  return (
    <Box bg={bgColor} minH="100vh" p={4} color={textColor}>
      <Container maxW="container.xl">
        <Grid templateColumns="auto 1fr" gap={4} mb={6} alignItems="center">
          {view !== 'books' && (
            <Button leftIcon={<FaArrowLeft />} onClick={handleBack} variant="ghost">
              Voltar
            </Button>
          )}
          <Heading display="flex" alignItems="center" gap={2}>
            <FaBook />
            {view === 'books' && 'Bíblia Sagrada'}
            {view === 'chapters' && `Livro de ${selectedBook.name}`}
            {view === 'verses' && `${selectedBook.name} Capítulo ${selectedChapter}`}
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