import { Box, SimpleGrid, Card, CardBody, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { format } from 'date-fns';
import { useDisclosure } from '@chakra-ui/react';
import AttendanceList from '../components/services/AttendanceList';
import { useState } from 'react';
import BottomNavigation from '../components/shared/BottomNavigation';

const Services = () => {
  const { events } = useEvents();
  const bgColor = useColorModeValue('facebook.bg', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter only events with category "Culto"
  const serviceEvents = events.filter(event => event.category === "Culto");

  const handleAttendanceClick = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  return (
    <Box bg={bgColor} minH="100vh" p={4}>
      <Heading mb={6}>Cultos Cadastrados</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {serviceEvents.map((event) => (
          <Card
            key={event.id}
            bg={cardBg}
            _hover={{ transform: 'translateY(-5px)' }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">{event.category}</Heading>
                <Text>
                  {format(new Date(`${event.date}T${event.time}`), "dd/MM/yyyy 'às' HH:mm")}
                </Text>
                <Button 
                  colorScheme="blue" 
                  mt={4}
                  onClick={() => handleAttendanceClick(event)}
                >
                  Ver Lista de Presença
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <AttendanceList 
        isOpen={isOpen} 
        onClose={onClose} 
        event={selectedEvent}
      />
      <BottomNavigation />
    </Box>
  );
};

export default Services;