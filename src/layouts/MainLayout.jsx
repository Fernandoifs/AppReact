import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import { useSidebar } from '../contexts/SidebarContext'

const MainLayout = ({ children }) => {
  const showSidebar = useBreakpointValue({ base: false, lg: true })
  const { isCollapsed } = useSidebar()

  return (
    <Flex h="100vh">
      {/* Sidebar - Only shown on desktop */}
      {showSidebar && (
        <Box position="fixed" h="100vh" zIndex={1}>
          <Sidebar />
        </Box>
      )}

      {/* Main Content */}
      <Box
        flex={1}
        p={4}
        bg="facebook.bg"
        ml={showSidebar ? (isCollapsed ? "60px" : "280px") : 0}
        transition="margin-left 0.3s"
        w="100%"
      >
        {children}
      </Box>
    </Flex>
  )
}

export default MainLayout