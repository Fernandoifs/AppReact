import { Box, SimpleGrid, Card, CardBody, Heading, Text, Button, VStack, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from '@chakra-ui/react';
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
  const { isOpen: isAttendanceOpen, onOpen: onAttendanceOpen, onClose: onAttendanceClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter only events with category "Culto"
  const serviceEvents = events.filter(event => event.category === "Culto");

  const handleAttendanceClick = (event) => {
    setSelectedEvent(event);
    onAttendanceOpen();
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    onDetailsOpen();
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
            onClick={() => handleCardClick(event)}
            cursor="pointer"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAttendanceClick(event);
                  }}
                >
                  Ver Lista de Presença
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <AttendanceList 
        isOpen={isAttendanceOpen} 
        onClose={onAttendanceClose} 
        event={selectedEvent}
      />

      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEvent?.category}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                <strong>Data e Hora:</strong>{' '}
                {selectedEvent && format(new Date(`${selectedEvent.date}T${selectedEvent.time}`), "dd/MM/yyyy 'às' HH:mm")}
              </Text>
              {selectedEvent?.description && (
                <Text>
                  <strong>Descrição:</strong> {selectedEvent.description}
                </Text>
              )}
              {selectedEvent?.location && (
                <Text>
                  <strong>Local:</strong> {selectedEvent.location}
                </Text>
              )}
              {selectedEvent?.status && (
                <Text>
                  <strong>Status:</strong> {selectedEvent.status}
                </Text>
              )}
              {selectedEvent?.verses && selectedEvent.verses.length > 0 && (
                <Text>
                  <strong>Leitura Bíblica:</strong>
                  <VStack align="start" spacing={2} mt={2}>
                    {selectedEvent.verses.map((verse, index) => (
                      <Text
                        key={index}
                        as={RouterLink}
                        to={`/biblev1`}
                        color="blue.500"
                        _hover={{ textDecoration: 'underline' }}
                        cursor="pointer"
                      >
                        {verse}
                      </Text>
                    ))}
                  </VStack>
                </Text>
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
      <BottomNavigation />
    </Box>
  );
};

export default Services;