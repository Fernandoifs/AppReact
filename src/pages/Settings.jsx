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
  useToast,
} from '@chakra-ui/react';
import { FaCog, FaBell, FaUser, FaPalette, FaLanguage, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/shared/BottomNavigation';

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation('settings');
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('chakra-ui-color-mode', colorMode);
  }, [colorMode]);

  // Load notification preferences
  useEffect(() => {
    const savedEmailPref = localStorage.getItem('email-notifications') === 'true';
    const savedPushPref = localStorage.getItem('push-notifications') === 'true';
    setEmailNotifications(savedEmailPref);
    setPushNotifications(savedPushPref);
  }, []);

  // Handle language change
  const handleLanguageChange = (e) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  // Handle email notifications toggle
  const handleEmailNotifications = () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    localStorage.setItem('email-notifications', newValue);
  };

  // Handle push notifications toggle
  const handlePushNotifications = () => {
    const newValue = !pushNotifications;
    setPushNotifications(newValue);
    localStorage.setItem('push-notifications', newValue);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    navigate('/login');
    toast({
      title: 'Deslogado com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Simulate saving settings
  const handleSaveSettings = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: t('settings.settingsSaved'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

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
                    <Text fontWeight="medium">{t('settings.darkTheme')}</Text>
                  </HStack>
                  <Switch
                    isChecked={colorMode === 'dark'}
                    onChange={toggleColorMode}
                    aria-label="Alternar tema escuro"
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
                  <Text fontWeight="medium">{t('settings.language')}</Text>
                </HStack>
                <FormControl>
                  <Select
                    defaultValue={i18n.language}
                    onChange={handleLanguageChange}
                  >
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
                  <Text fontWeight="medium">{t('settings.notifications')}</Text>
                </HStack>
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor="email-notifications" mb={0}>
                    {t('settings.emailNotifications')}
                  </FormLabel>
                  <Switch
                    id="email-notifications"
                    isChecked={emailNotifications}
                    onChange={handleEmailNotifications}
                    aria-label="Ativar notificações por email"
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor="push-notifications" mb={0}>
                    {t('settings.pushNotifications')}
                  </FormLabel>
                  <Switch
                    id="push-notifications"
                    isChecked={pushNotifications}
                    onChange={handlePushNotifications}
                    aria-label="Ativar notificações push"
                  />
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
                <Button colorScheme="red" variant="outline" onClick={handleLogout}>
                  Sair da Conta
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Save Settings Button */}
          <Button
            colorScheme="blue"
            onClick={handleSaveSettings}
            isLoading={isLoading}
            loadingText="Salvando..."
          >
            Salvar Configurações
          </Button>
        </Stack>
      </Container>
      <BottomNavigation />
    </Box>
  );
};

export default Settings;