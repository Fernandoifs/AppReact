import { useParams } from 'react-router-dom';
import { Box, Container, Heading, VStack, Checkbox, Button, Text } from '@chakra-ui/react';
import { useEvents } from '../contexts/EventsContext';
import { useAttendance } from '../contexts/AttendanceContext';

const Attendance = () => {
  const { serviceId } = useParams();
  const { events } = useEvents();
  const { markAttendance, getServiceAttendance } = useAttendance();
  
  const service = events.find(event => event.id === serviceId);
  const attendance = getServiceAttendance(serviceId);

  if (!service) {
    return (
      <Container>
        <Text>Culto não encontrado</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">{service.title} - Lista de Presença</Heading>
        <Text>{format(new Date(service.start), "dd/MM/yyyy 'às' HH:mm")}</Text>
        
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
    </Container>
  );
};

export default Attendance;