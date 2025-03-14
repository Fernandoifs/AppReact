import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: {
          // Navigation
          "home": "Início",
          "events": "Eventos",
          "bible": "Bíblia",
          "services": "Serviços",
          "settings": "Configurações",
          "members": "Membros",

          // Settings
          "darkTheme": "Tema Escuro",
          "language": "Idioma",
          "notifications": "Notificações",
          "emailNotifications": "Notificações por Email",
          "pushNotifications": "Notificações Push",
          "account": "Conta",
          "changePassword": "Alterar Senha",
          "logout": "Sair da Conta",
          "saveSettings": "Salvar Configurações",
          "back": "Voltar",

          // Messages
          "settingsSaved": "Configurações salvas com sucesso!",
          "logoutSuccess": "Deslogado com sucesso"
        }
      },
      en: {
        translation: {
          // Navigation
          "home": "Home",
          "events": "Events",
          "bible": "Bible",
          "services": "Services",
          "settings": "Settings",
          "members": "Members",

          // Settings
          "darkTheme": "Dark Theme",
          "language": "Language",
          "notifications": "Notifications",
          "emailNotifications": "Email Notifications",
          "pushNotifications": "Push Notifications",
          "account": "Account",
          "changePassword": "Change Password",
          "logout": "Logout",
          "saveSettings": "Save Settings",
          "back": "Back",

          // Messages
          "settingsSaved": "Settings saved successfully!",
          "logoutSuccess": "Logged out successfully"
        }
      },
      es: {
        translation: {
          // Navigation
          "home": "Inicio",
          "events": "Eventos",
          "bible": "Biblia",
          "services": "Servicios",
          "settings": "Configuración",
          "members": "Miembros",

          // Settings
          "darkTheme": "Tema Oscuro",
          "language": "Idioma",
          "notifications": "Notificaciones",
          "emailNotifications": "Notificaciones por Correo",
          "pushNotifications": "Notificaciones Push",
          "account": "Cuenta",
          "changePassword": "Cambiar Contraseña",
          "logout": "Cerrar Sesión",
          "saveSettings": "Guardar Configuración",
          "back": "Volver",

          // Messages
          "settingsSaved": "¡Configuración guardada exitosamente!",
          "logoutSuccess": "Sesión cerrada exitosamente"
        }
      }
    },
    lng: localStorage.getItem('language') || 'pt-BR', // Get saved language or use default
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;