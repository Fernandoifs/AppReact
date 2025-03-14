import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E8F1FF',
      100: '#C4D9FF',
      200: '#85B2FF',
      300: '#4785F5',
      400: '#1877F2', // Facebook primary blue
      500: '#1464D9',
      600: '#0E51BF',
      700: '#0A3D99',
      800: '#062C73',
      900: '#041B4D',
    },
    primary: {
      bg: '#F7FAFC',
      text: '#2D3748',
      secondaryText: '#718096',
      hover: '#E2E8F0',
      active: '#CBD5E0',
    }
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: '12px',
        transition: 'all 0.2s ease-in-out',
      },
      variants: {
        solid: (props) => ({
          bg: mode('brand.400', 'brand.300')(props),
          color: 'white',
          _hover: {
            bg: mode('brand.500', 'brand.400')(props),
            transform: 'scale(1.05)',
          },
        }),
        outline: (props) => ({
          borderColor: mode('brand.400', 'brand.300')(props),
          color: mode('brand.400', 'brand.300')(props),
          _hover: {
            bg: mode('primary.hover', 'whiteAlpha.200')(props),
          },
        }),
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: mode('white', 'gray.800')(props),
          borderRadius: '12px',
          boxShadow: mode('0 6px 12px rgba(0, 0, 0, 0.15)', '0 4px 6px rgba(0, 0, 0, 0.1)')(props),
          transition: 'all 0.3s ease-in-out',
          _hover: {
            boxShadow: mode('0 12px 24px rgba(0, 0, 0, 0.2)', '0 6px 12px rgba(0, 0, 0, 0.15)')(props),
          },
        },
      }),
    },
    Heading: {
      baseStyle: {
        fontFamily: '"Poppins", sans-serif',
        fontWeight: '700',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('primary.bg', 'gray.900')(props),
        color: mode('primary.text', 'whiteAlpha.900')(props),
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default theme;
