import { Box, Flex, VStack, Link, Icon } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaHome, FaUsers, FaCalendarAlt, FaPray, FaMoneyBillWave } from 'react-icons/fa'

const MainLayout = ({ children }) => {
  const menuItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'Membros', icon: FaUsers, path: '/members' },
    { name: 'Programações', icon: FaCalendarAlt, path: '/events' },
    { name: 'Cultos', icon: FaPray, path: '/services' },
    { name: 'Finanças', icon: FaMoneyBillWave, path: '/finance' }
  ]

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box w="250px" bg="gray.800" color="white" p={4}>
        <VStack spacing={4} align="stretch">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              as={RouterLink}
              to={item.path}
              p={2}
              borderRadius="md"
              _hover={{ bg: 'gray.700' }}
              display="flex"
              alignItems="center"
            >
              <Icon as={item.icon} mr={3} />
              {item.name}
            </Link>
          ))}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4} bg="gray.100">
        {children}
      </Box>
    </Flex>
  )
}

export default MainLayout