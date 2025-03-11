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
    facebook: {
      bg: '#F0F2F5',
      text: '#050505',
      secondaryText: '#65676B',
      hover: '#E4E6E9',
      active: '#BCC0C4',
    }
  },
  fonts: {
    heading: '"-apple-system", "system-ui", BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    body: '"-apple-system", "system-ui", BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '6px',
        transition: 'all 0.2s',
      },
      variants: {
        solid: (props) => ({
          bg: mode('brand.400', 'brand.300')(props),
          color: 'white',
          _hover: {
            bg: mode('brand.500', 'brand.400')(props),
            transform: 'translateY(-1px)',
          },
        }),
        outline: (props) => ({
          borderColor: mode('brand.400', 'brand.300')(props),
          color: mode('brand.400', 'brand.300')(props),
          _hover: {
            bg: mode('facebook.hover', 'whiteAlpha.200')(props),
          },
        }),
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: mode('white', 'gray.800')(props),
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s',
          _hover: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      }),
    },
    Heading: {
      baseStyle: {
        fontFamily: '"-apple-system", "system-ui", BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontWeight: '600',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('facebook.bg', 'gray.900')(props),
        color: mode('facebook.text', 'whiteAlpha.900')(props),
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default theme;