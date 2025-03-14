import {
  Box,
  VStack,
  IconButton,
  Text,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt, FaHandHoldingHeart, FaCog, FaChevronLeft, FaChevronRight, FaBook } from 'react-icons/fa';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = ({ onBibleClick }) => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const navigate = useNavigate();

  const handleBibleClick = () => {
    if (onBibleClick) {
      onBibleClick(); // Chama a função para resetar o estado
    }
    navigate('/bible'); // Navega para a página da Bíblia
  };

  const menuItems = [
    { icon: <FaHome size="20" />, label: 'Home', path: '/', onClick: null },
    { icon: <FaUsers size="20" />, label: 'Membros', path: '/members', onClick: null },
    { icon: <FaCalendarAlt size="20" />, label: 'Eventos', path: '/events', onClick: null },
    { icon: <FaHandHoldingHeart size="20" />, label: 'Serviços', path: '/services', onClick: null },
    { icon: <FaBook size="20" />, label: 'Bíblia', path: '/bible', onClick: handleBibleClick }, // Adiciona o manipulador de clique
    { icon: <FaCog size="20" />, label: 'Configurações', path: '/settings', onClick: null },
  ];

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      bg={bgColor}
      boxShadow="lg"
      borderRight="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      width={isCollapsed ? "60px" : "280px"}
      transition="all 0.3s"
      zIndex={1000}
    >
      <IconButton
        aria-label="Toggle Sidebar"
        icon={isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        position="absolute"
        right={2}
        top={2}
        onClick={() => setIsCollapsed(!isCollapsed)}
        size="sm"
        variant="ghost"
      />

      <VStack spacing={4} align="stretch" pt={16} px={2}>
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            label={isCollapsed ? item.label : ""}
            placement="right"
            isDisabled={!isCollapsed}
          >
            <Box
              as={Link}
              to={item.path}
              p={3}
              display="flex"
              alignItems="center"
              borderRadius="md"
              _hover={{ bg: hoverBg }}
              color={textColor}
              onClick={item.onClick} // Adiciona o manipulador de clique
            >
              {item.icon}
              {!isCollapsed && (
                <Text ml={3} fontSize="md">
                  {item.label}
                </Text>
              )}
            </Box>
          </Tooltip>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;