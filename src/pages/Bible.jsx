import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';
import { debounce } from 'lodash';
import { FaSearch, FaBook } from 'react-icons/fa';
import BottomNavigation from '../components/shared/BottomNavigation';

const Bible = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [verses, setVerses] = useState([]);

  const fetchBibleVerse = async (reference) => {
    if (!reference) return;
    setLoading(true);
    setError(null);
    try {
      // Using the API.Bible endpoint instead
      const encodedReference = encodeURIComponent(reference);
      const response = await fetch(`https://api.scripture.api.bible/v1/bibles/b645d7facf5a5fa5-02/search?query=${encodedReference}`, {
        headers: {
          'api-key': 'e0cd5e3e2c9b5b3c8e7d5f5c5b3c8e7d',
        }
      });
      
      if (!response.ok) {
        throw new Error('Não foi possível encontrar o versículo. Por favor, verifique a referência.');
      }
      
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('Versículo não encontrado. Por favor, tente uma referência diferente.');
      }
      
      // Format the verses data from the new API response
      const formattedVerses = data.data.verses.map(verse => ({
        book: verse.reference.split(' ')[0],
        chapter: verse.chapterNumber,
        verse: verse.verseNumber,
        text: verse.text
      }));

      setVerses(formattedVerses);
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Erro',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial verse
    fetchBibleVerse('john 3:16');
  }, []);

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim()) {
        fetchBibleVerse(term);
      }
    }, 500),
    []
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectionChange = () => {
    if (selectedBook && selectedChapter && selectedVerse) {
      const reference = `${selectedBook} ${selectedChapter}:${selectedVerse}`;
      fetchBibleVerse(reference);
    }
  };

  useEffect(() => {
    handleSelectionChange();
  }, [selectedBook, selectedChapter, selectedVerse]);

  return (
    <Box bg={bgColor} minH="100vh" p={4}>
      <Container maxW="container.xl">
        <Heading mb={6} display="flex" alignItems="center" gap={2}>
          <FaBook />
          Bíblia Sagrada
        </Heading>

        {error && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Erro!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <VStack spacing={4} mb={6}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar na Bíblia (ex: joão 3:16)..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              bg={useColorModeValue('white', 'gray.800')}
            />
          </InputGroup>

          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} width="100%">
            <Select
              placeholder="Livro"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              bg={useColorModeValue('white', 'gray.800')}
            >
              <option value="genesis">Gênesis</option>
              <option value="exodus">Êxodo</option>
              <option value="leviticus">Levítico</option>
              <option value="numbers">Números</option>
              <option value="deuteronomy">Deuteronômio</option>
              <option value="psalms">Salmos</option>
              <option value="proverbs">Provérbios</option>
              <option value="isaiah">Isaías</option>
              <option value="matthew">Mateus</option>
              <option value="mark">Marcos</option>
              <option value="luke">Lucas</option>
              <option value="john">João</option>
              <option value="acts">Atos</option>
              <option value="romans">Romanos</option>
              <option value="revelation">Apocalipse</option>
            </Select>
            <Select
              placeholder="Capítulo"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              {[...Array(50)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </Select>
            <Select
              placeholder="Versículo"
              value={selectedVerse}
              onChange={(e) => setSelectedVerse(e.target.value)}
            >
              {[...Array(30)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </Select>
          </SimpleGrid>
        </VStack>

        {/* Loading State */}
        {loading && (
          <Center py={8}>
            <Spinner size="xl" color="blue.500" />
          </Center>
        )}

        {/* Bible Verses */}
        {!loading && (
          <SimpleGrid spacing={4}>
            {verses.map((verse, index) => (
              <Card key={index} bg={cardBg} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
                <CardBody>
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </Text>
                    <Text>{verse.text}</Text>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>

      <BottomNavigation />
    </Box>
  );
};

export default Bible;