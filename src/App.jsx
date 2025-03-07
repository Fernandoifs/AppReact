import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Members from './pages/Members'
import Finance from './pages/Finance'
import Events from './pages/Events'
import Services from './pages/Services'

function App() {
  return (
    <ChakraProvider resetCSS>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/events" element={<Events />} />
            <Route path="/services" element={<Services />} />
            <Route path="/finance" element={<Finance />} />
          </Routes>
        </MainLayout>
      </Router>
    </ChakraProvider>
  )
}

export default App
