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
  Avatar,
} from '@chakra-ui/react';
import { FaChurch, FaCalendarAlt, FaPray, FaHandHoldingHeart, FaHome, FaBook } from 'react-icons/fa';
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
    display={{ base: 'flex', md: 'none' }}
  >
    <IconButton as={RouterLink} to="/" aria-label="Início" icon={<FaHome />} variant="ghost" />
    <IconButton as={RouterLink} to="/events" aria-label="Eventos" icon={<FaCalendarAlt />} variant="ghost" />
    <IconButton as={RouterLink} to="/bible" aria-label="Bíblia" icon={<FaBook />} variant="ghost" />
    <IconButton as={RouterLink} to="/donate" aria-label="Doações" icon={<FaHandHoldingHeart />} variant="ghost" />
  </HStack>
);

const Home = () => {
  const { events = [] } = useEvents();
  const bgColor = 'gray.50';
  const cardBg = 'white';

  const newsEvents = events
    ? events
        .slice(0, 3)
        .map((event) => ({
          title: event.category,
          description: format(new Date(`${event.date}T${event.time}`), "dd/MM/yyyy 'às' HH:mm"),
          image: cultoImage,
        }))
    : [];

  const quickAccessItems = [
    { icon: <FaChurch size="2.5em" />, title: 'Visitas Pastorais', path: '/visits', color: 'blue.500' },
    { icon: <FaCalendarAlt size="2.5em" />, title: 'Eventos', path: '/events', color: 'green.500' },
    { icon: <FaPray size="2.5em" />, title: 'Pedidos de Oração', path: '/prayer', color: 'purple.500' },
    { icon: <FaHandHoldingHeart size="2.5em" />, title: 'Dízimos e Ofertas', path: '/donate', color: 'red.500' },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Banner Aprimorado */}
      <Box
        bg="blue.600"
        color="white"
        py={12}
        px={4}
        textAlign="center"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'blue.700',
          opacity: 0.3,
          transform: 'skewY(-6deg)',
          transformOrigin: 'top left',
        }}
      >
        <Container maxW="container.xl" position="relative">
          <VStack spacing={4}>
            <Heading
              size="2xl"
              fontFamily="'Playfair Display', serif"
              fontWeight="bold"
              textShadow="2px 2px 4px rgba(0,0,0,0.3)"
            >
              Igreja Cristã
            </Heading>
            <Text
              fontSize="xl"
              fontStyle="italic"
              maxW="container.md"
              lineHeight="tall"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
            >
              "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
            </Text>
            <Text fontSize="lg" fontWeight="medium">
              João 3:16
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
      <Container maxW="container.xl" py={12} pb={20}>
        {/* Cartões de Acesso Rápido */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={12}>
          {quickAccessItems.map((item, index) => (
            <Card
              key={index}
              as={RouterLink}
              to={item.path}
              bg={cardBg}
              _hover={{
                transform: 'translateY(-8px)',
                boxShadow: 'xl',
                textDecoration: 'none',
              }}
              transition="all 0.3s"
              overflow="hidden"
              borderRadius="xl"
            >
              <CardBody>
                <VStack spacing={4} textAlign="center">
                  <Flex
                    align="center"
                    justify="center"
                    w={16}
                    h={16}
                    bg={item.color}
                    color="white"
                    borderRadius="full"
                    mb={2}
                  >
                    {item.icon}
                  </Flex>
                  <Heading size="md" color="gray.700">
                    {item.title}
                  </Heading>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Seção de Eventos */}
        <Box mb={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg">Próximos Eventos</Heading>
            <Badge colorScheme="blue" fontSize="md" p={2} borderRadius="full">
              {newsEvents.length} Eventos
            </Badge>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {newsEvents.map((item, index) => (
              <Card
                key={index}
                bg={cardBg}
                as={RouterLink}
                to="/events"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  textDecoration: 'none',
                }}
                transition="all 0.2s"
                overflow="hidden"
                borderRadius="xl"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  height="200px"
                  objectFit="cover"
                  transition="transform 0.3s"
                  _hover={{ transform: 'scale(1.05)' }}
                />
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="md" color="gray.700">
                      {item.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {item.description}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
          {newsEvents.length === 0 && (
            <Box
              textAlign="center"
              p={8}
              bg="gray.50"
              borderRadius="xl"
              border="1px dashed"
              borderColor="gray.200"
            >
              <Text fontSize="lg" color="gray.500">
                Nenhum evento programado
              </Text>
            </Box>
          )}
        </Box>
      </Container>

      <BottomNavigation />
    </Box>
  );
};

export default Home;