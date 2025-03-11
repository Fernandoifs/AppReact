import {
  Box,
  Container,
  Heading,
  Stack,
  Card,
  CardBody,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Button,
  useColorMode,
  useColorModeValue,
  Divider,
  Icon,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { FaCog, FaBell, FaUser, FaPalette, FaLanguage } from 'react-icons/fa';
import BottomNavigation from '../components/shared/BottomNavigation';

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh" p={4}>
      <Container maxW="container.xl">
        <Stack spacing={6}>
          <Heading size="lg" display="flex" alignItems="center" gap={2}>
            <FaCog />
            Configurações
          </Heading>

          {/* Theme Settings */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Icon as={FaPalette} boxSize={5} />
                    <Text fontWeight="medium">Tema Escuro</Text>
                  </HStack>
                  <Switch
                    isChecked={colorMode === 'dark'}
                    onChange={toggleColorMode}
                  />
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Language Settings */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FaLanguage} boxSize={5} />
                  <Text fontWeight="medium">Idioma</Text>
                </HStack>
                <FormControl>
                  <Select defaultValue="pt-BR">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </Select>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Notification Settings */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FaBell} boxSize={5} />
                  <Text fontWeight="medium">Notificações</Text>
                </HStack>
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor="email-notifications" mb={0}>
                    Notificações por Email
                  </FormLabel>
                  <Switch id="email-notifications" />
                </FormControl>
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor="push-notifications" mb={0}>
                    Notificações Push
                  </FormLabel>
                  <Switch id="push-notifications" />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Account Settings */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FaUser} boxSize={5} />
                  <Text fontWeight="medium">Conta</Text>
                </HStack>
                <Button colorScheme="blue" variant="outline">
                  Alterar Senha
                </Button>
                <Button colorScheme="red" variant="outline">
                  Sair da Conta
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Stack>
      </Container>
      <BottomNavigation />
    </Box>
  );
};

export default Settings;