import { extendTheme } from '@chakra-ui/react';
import button from './components/button';
import container from './components/container';
import divider from './components/divider';
import header from './components/header';
import link from './components/link';
import progress from './components/progress';
import text from './components/text';

const theme = extendTheme({
  fonts: {
    heading: 'DM Sans, sans-serif',
    body: 'DM Sans, sans-serif',
    buttons: 'DM Sans, sans-serif',
  },
  colors: {
    brand: {
      100: '#9580FF1A',
      500: '#8850EA',
      600: '#AA82F0',
      700: '#6200EE',
    },
    brandDisabled: {
      500: '#69CACA',
      600: '#656c6c',
    },
    backgrounds: {
      sidebar: '#F6F9FB',
      card: '#F3F4F4',
      floatingSidebar: '#F3F4F4',
    },
    brandGreen: {
      500: '#01C37E',
      600: '#01C37E',
    },
    brandRed: {
      500: '#EE7979',
      600: '#EE7979',
    },
  },
  components: {
    ...container,
    ...button,
    ...link,
    ...header,
    ...divider,
    ...text,
    ...progress,
    Menu: {
      variants: {
        form: {
          fontSize: '14px',
          fontWeight: '400',
          color: 'red',
        },
      },
    },
  },
});

export default theme;
