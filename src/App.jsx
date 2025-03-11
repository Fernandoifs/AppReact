import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Members from './pages/Members'
import Finance from './pages/Finance'
import Events from './pages/Events'
import Services from './pages/Services'
import Attendance from './pages/Attendance'
import Bible from './pages/Bible'
import Settings from './pages/Settings'
import { EventsProvider } from './contexts/EventsContext';
import { SidebarProvider } from './contexts/SidebarContext'
import { AttendanceProvider } from './contexts/AttendanceContext'
import { ServicesProvider } from './contexts/ServicesContext'
import { MembersProvider } from './contexts/MembersContext';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <SidebarProvider>
        <EventsProvider>
          <ServicesProvider>
            <MembersProvider>
              <AttendanceProvider>
                <Router>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/members" element={<Members />} />
                      <Route path="/events" element={<Events />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/services/:serviceId/attendance" element={<Attendance />} />
                      <Route path="/bible" element={<Bible />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </MainLayout>
                </Router>
              </AttendanceProvider>
            </MembersProvider>
          </ServicesProvider>
        </EventsProvider>
      </SidebarProvider>
    </ChakraProvider>
  );
}

export default App
