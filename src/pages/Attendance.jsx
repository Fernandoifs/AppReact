import { useParams } from 'react-router-dom';
import { Box, Container, Heading, VStack, Checkbox, Button, Text } from '@chakra-ui/react';
import BottomNavigation from '../components/shared/BottomNavigation';
import { useEvents } from '../contexts/EventsContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { format } from 'date-fns';

const Attendance = () => {
  const { serviceId } = useParams();
  const { events } = useEvents();
  const { markAttendance, getServiceAttendance } = useAttendance();
  
  const service = events.find(event => event.id === serviceId);
  const attendance = getServiceAttendance(serviceId);

  if (!service) {
    return (
      <Container maxW="container.md" py={8}>
        <Text fontSize="lg" color="red.500">Culto não encontrado</Text>
        <BottomNavigation />
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">{service.title} - Lista de Presença</Heading>
        <Text>{format(new Date(`${service.date}T${service.time}`), "dd/MM/yyyy 'às' HH:mm")}</Text>
        
        {/* Add your member list with checkboxes here */}
        <Box>
          {/* Example: */}
          <Checkbox
            onChange={(e) => markAttendance(serviceId, 'member1', e.target.checked)}
            isChecked={attendance['member1']}
          >
            Nome do Membro
          </Checkbox>
        </Box>

        <Button colorScheme="blue">Salvar Lista</Button>
      </VStack>
      <BottomNavigation />
    </Container>
  );
};

export default Attendance;