import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'
import { useSidebar } from '../contexts/SidebarContext'

const MainLayout = ({ children }) => {
  const showSidebar = useBreakpointValue({ base: false, lg: true })
  const { isCollapsed } = useSidebar()

  // Extract the resetToInitialState function from the Bible component
  const handleBibleReset = () => {
    // Find the Bible component instance and call its resetToInitialState
    const bibleComponent = document.querySelector('[data-testid="bible-component"]');
    if (bibleComponent && bibleComponent.__reactFiber$) {
      const bibleInstance = bibleComponent.__reactFiber$.return;
      if (bibleInstance && bibleInstance.stateNode && bibleInstance.stateNode.resetToInitialState) {
        bibleInstance.stateNode.resetToInitialState();
      }
    }
  };

  return (
    <Flex h="100vh">
      {/* Sidebar - Only shown on desktop */}
      {showSidebar && (
        <Box position="fixed" h="100vh" zIndex={1}>
          <Sidebar onBibleClick={handleBibleReset} />
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