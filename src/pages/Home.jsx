import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Image,
  VStack,
  IconButton,
  HStack,
  Flex,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaChurch, FaCalendarAlt, FaPray, FaHandHoldingHeart, FaHome, FaBook } from 'react-icons/fa';
import { useEvents } from '../contexts/EventsContext';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import cultoImage from '../assets/culto.png';

const BottomNavigation = () => {
  const navBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <HStack
      justify="space-around"
      bg={navBg}
      borderTop="1px solid"
      borderColor={borderColor}
      py={2}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      display={{ base: 'flex', md: 'none' }}
    >
      <IconButton as={RouterLink} to="/" aria-label="Início" icon={<FaHome />} variant="ghost" />
      <IconButton as={RouterLink} to="/events" aria-label="Eventos" icon={<FaCalendarAlt />} variant="ghost" />
      <IconButton as={RouterLink} to="/bible" aria-label="Bíblia" icon={<FaBook />} variant="ghost" />
      <IconButton as={RouterLink} to="/donate" aria-label="Doações" icon={<FaHandHoldingHeart />} variant="ghost" />
    </HStack>
  );
};

const Home = () => {
  const { events = [] } = useEvents();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const bannerBg = useColorModeValue('blue.600', 'blue.800');

  const newsEvents = events.slice(0, 3).map((event) => ({
    title: event.title,
    description: format(new Date(`${event.date}T${event.time}`), "dd/MM/yyyy 'às' HH:mm"),
    image: cultoImage,
  }));

  const quickAccessItems = [
    { icon: <FaChurch size="2.5em" />, title: 'Visitas Pastorais', path: '/visits', color: 'blue.500' },
    { icon: <FaCalendarAlt size="2.5em" />, title: 'Eventos', path: '/events', color: 'green.500' },
    { icon: <FaPray size="2.5em" />, title: 'Pedidos de Oração', path: '/prayer', color: 'purple.500' },
    { icon: <FaHandHoldingHeart size="2.5em" />, title: 'Dízimos e Ofertas', path: '/donate', color: 'red.500' },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Banner Principal */}
      <Box bg={bannerBg} color="white" py={12} px={4} textAlign="center">
        <Container maxW="container.xl">
          <VStack spacing={4}>
            <Heading size="2xl" fontWeight="bold">Igreja Cristã</Heading>
            <Text fontSize="xl" maxW="2xl">Bem-vindo à nossa comunidade de fé, esperança e amor.</Text>
          </VStack>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxW="container.xl" py={8}>
        {/* Acesso Rápido */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={12}>
          {quickAccessItems.map((item, index) => (
            <Card
              key={index}
              as={RouterLink}
              to={item.path}
              bg={cardBg}
              _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
              transition="all 0.2s"
              p={4}
              borderRadius="md"
              textAlign="center"
            >
              <CardBody>
                <VStack spacing={3}>
                  <Box color={item.color}>{item.icon}</Box>
                  <Text fontWeight="medium" textAlign="center" color={textColor}>
                    {item.title}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Próximos Eventos */}
        <Box mb={12}>
          <Heading size="lg" mb={6} color={textColor}>Próximos Eventos</Heading>
          {newsEvents.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {newsEvents.map((event, index) => (
                <Card key={index} bg={cardBg} borderRadius="md" overflow="hidden" boxShadow="md" transition="all 0.2s">
                  <Image src={event.image} alt={event.title} objectFit="cover" height="180px" width="100%" />
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <Badge colorScheme="blue">Evento</Badge>
                      <Heading size="md" color={textColor}>{event.title}</Heading>
                      <Text color="gray.500">{event.description}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text color={textColor}>Nenhum evento próximo.</Text>
          )}
        </Box>
      </Container>

      {/* Navegação Inferior */}
      <BottomNavigation />
    </Box>
  );
};

export default Home;
