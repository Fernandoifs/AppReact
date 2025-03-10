import {
  Box,
  VStack,
  IconButton,
  Text,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt, FaHandHoldingHeart, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSidebar } from '../contexts/SidebarContext';

const Sidebar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const bgColor = useColorModeValue('white', 'gray.800');

  const menuItems = [
    { icon: <FaHome size="20" />, label: 'Home', path: '/' },
    { icon: <FaUsers size="20" />, label: 'Membros', path: '/members' },
    { icon: <FaCalendarAlt size="20" />, label: 'Eventos', path: '/events' },
    { icon: <FaHandHoldingHeart size="20" />, label: 'Serviços', path: '/services' },
    { icon: <FaCog size="20" />, label: 'Configurações', path: '/settings' },
  ];

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      bg={bgColor}
      boxShadow="lg"
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
              _hover={{ bg: 'gray.100' }}
              color="gray.700"
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