import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Button,
  Image,
  VStack,
  useColorModeValue,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { FaChurch, FaCalendarAlt, FaPray, FaHandHoldingHeart, FaHome } from 'react-icons/fa';
import { useEvents } from '../contexts/EventsContext';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import cultoImage from '../assets/culto.png'; 

const BottomNavigation = () => (
  <HStack
    justify="space-around"
    bg="white"
    borderTop="1px solid"
    borderColor="gray.200"
    py={2}
    position="fixed"
    bottom={0}
    left={0}
    right={0}
    zIndex={10}
    boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
  >
    <IconButton as={RouterLink} to="/" aria-label="Início" icon={<FaHome />} variant="ghost" />
    <IconButton as={RouterLink} to="/events" aria-label="Eventos" icon={<FaCalendarAlt />} variant="ghost" />
    <IconButton as={RouterLink} to="/prayer" aria-label="Oração" icon={<FaPray />} variant="ghost" />
    <IconButton as={RouterLink} to="/donate" aria-label="Doações" icon={<FaHandHoldingHeart />} variant="ghost" />
  </HStack>
);



const Home = () => {
  const { events = [] } = useEvents();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const newsEvents = events
    ? events
        .slice(0, 3) // Show only the first 3 events
        .map((event) => ({
          title: event.category,
          description: format(new Date(`${event.date}T${event.time}`), "dd/MM/yyyy 'às' HH:mm"),
          image: cultoImage,

        }))
    : [];

  const quickAccessItems = [
    { icon: <FaChurch size="2.5em" />, title: 'Visitas Pastorais', path: '/visits' },
    { icon: <FaCalendarAlt size="2.5em" />, title: 'Eventos', path: '/events' },
    { icon: <FaPray size="2.5em" />, title: 'Pedidos de Oração', path: '/prayer' },
    { icon: <FaHandHoldingHeart size="2.5em" />, title: 'Dízimos e Ofertas', path: '/donate' },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Banner Estático */}
      <Box bg="blue.600" color="white" py={8} px={4} textAlign="center">
        <Heading size="xl" fontFamily="'Playfair Display', serif" mb={4}>
          Igreja Cristã
        </Heading>
        <Text fontSize="lg" fontStyle="italic" mb={2}>
          "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
        </Text>
        <Text fontWeight="bold">João 3:16</Text>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxW="container.xl" py={8} pb={16}>
        {/* Cartões de Acesso Rápido */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
          {quickAccessItems.map((item, index) => (
            <Card
              key={index}
              as={RouterLink}
              to={item.path}
              bg={cardBg}
              _hover={{ transform: 'translateY(-5px)', textDecoration: 'none' }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack spacing={3} textAlign="center">
                  <Box color="blue.500">{item.icon}</Box>
                  <Heading size="sm">{item.title}</Heading>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Box mb={8}>
          <Heading size="lg" mb={4}>Próximos Eventos</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {newsEvents.map((item, index) => (
              <Card 
                key={index} 
                bg={cardBg}
                as={RouterLink}
                to="/events"
                _hover={{ transform: 'translateY(-3px)', textDecoration: 'none' }}
                transition="all 0.2s"
              >
                <Image src={item.image} alt={item.title} height="200px" objectFit="cover" />
                <CardBody>
                  <Stack spacing={2}>
                    <Heading size="md">{item.title}</Heading>
                    <Text fontSize="sm">{item.description}</Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
          {newsEvents.length === 0 && (
            <Text textAlign="center" color="gray.500" py={4}>
              Nenhum evento programado
            </Text>
          )}
        </Box>
      </Container>

      <BottomNavigation />

    </Box>
  );
};

export default Home;