import { HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaHome, FaCalendarAlt, FaBook, FaHandHoldingHeart } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const BottomNavigation = ({ onBibleClick }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const navigate = useNavigate();

  const handleBibleClick = () => {
    if (onBibleClick) {
      onBibleClick(); // Chama a função para resetar o estado
    }
    navigate('/bible'); // Navega para a página da Bíblia
  };

  return (
    <HStack
      justify="space-around"
      bg={bgColor}
      borderTop="1px solid"
      borderColor={borderColor}
      py={2}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      display={{ base: 'flex', md: 'none' }} // Show on mobile, hide on desktop
    >
      <IconButton as={RouterLink} to="/" aria-label="Início" icon={<FaHome />} variant="ghost" />
      <IconButton as={RouterLink} to="/events" aria-label="Eventos" icon={<FaCalendarAlt />} variant="ghost" />
      <IconButton
        aria-label="Bíblia"
        icon={<FaBook />}
        variant="ghost"
        onClick={handleBibleClick}
      />
      <IconButton as={RouterLink} to="/services" aria-label="Serviços" icon={<FaHandHoldingHeart />} variant="ghost" />
    </HStack>
  );
};

export default BottomNavigation;