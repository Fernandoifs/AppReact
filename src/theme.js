import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F2FF',
      100: '#B3D9FF',
      200: '#80BFFF',
      300: '#4DA6FF',
      400: '#1A8CFF',
      500: '#0073E6',
      600: '#0059B3',
      700: '#004080',
      800: '#00264D',
      900: '#000D1A',
    },
    accent: {
      50: '#F0FFF4',
      100: '#C6F6D5',
      200: '#9BE6B4',
      300: '#68D391',
      400: '#48BB78',
      500: '#38A169',
      600: '#2F855A',
      700: '#276749',
      800: '#1C4532',
      900: '#133526',
    },
    highlight: {
      50: '#FFFFF0',
      100: '#FEFCBF',
      200: '#FAF089',
      300: '#F6E05E',
      400: '#ECC94B',
      500: '#D69E2E',
      600: '#B7791F',
      700: '#975A16',
      800: '#744210',
      900: '#5F370E',
    },
  },
  fonts: {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
        transition: 'all 0.2s',
      },
      variants: {
        solid: (props) => ({
          bg: mode('brand.500', 'brand.200')(props),
          color: mode('white', 'gray.800')(props),
          _hover: {
            bg: mode('brand.600', 'brand.300')(props),
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
        }),
        outline: (props) => ({
          borderColor: mode('brand.500', 'brand.200')(props),
          color: mode('brand.500', 'brand.200')(props),
          _hover: {
            bg: mode('brand.50', 'brand.900')(props),
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          },
        }),
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: mode('white', 'gray.800')(props),
          borderRadius: 'lg',
          boxShadow: 'sm',
          transition: 'all 0.2s',
          _hover: {
            boxShadow: 'md',
          },
        },
      }),
    },
    Heading: {
      baseStyle: {
        fontFamily: '"Playfair Display", serif',
        fontWeight: 'bold',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        color: mode('gray.800', 'whiteAlpha.900')(props),
      },
    }),
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default theme;