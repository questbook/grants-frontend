import { extendTheme } from '@chakra-ui/react'
import button from './components/button'
import container from './components/container'
import divider from './components/divider'
import header from './components/header'
import input from './components/input'
import link from './components/link'
import progress from './components/progress'
import text from './components/text'

const theme = extendTheme({
	fonts: {
		heading: 'DM Sans, sans-serif',
		body: 'DM Sans, sans-serif',
		buttons: 'DM Sans, sans-serif',
	},
	// fonts: {
	// 	body: 'nhg, sans-serif',
	// 	heading: 'nhg, sans-serif',
	// 	buttons: 'nhg, sans-serif',
	// },
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
		white: {
			'offWhite': '#F0F0F7',
		},
		black: '#1F1F33',
		brandText: '#4E4E6B',
		brandSubtext: '#7D7DA0',
		blue: {
			100: '#AFAFCC',
			500: '#2B67F6',
		},
		greenTextBackground: '#79F2C0',
		greenTextDark: '#36B37E',
		brandGrey:{
			500: '#F0F0F7',
			600: '#EBEBF3',
			700: '#DCDCE6',
		},
		red: '#F25A5A',
		brandv2: {
			500: '#1F1F33',
			600: '#3F3F53',
			700: '#5F5F72',
		},
		yellow: '#FFCE00',
		bannerGrey: '#F0F0F7',
		v2Grey: '#555570',
		primary: '#745FE8',
		v2LightGrey: '#D2D2E3'
	},
	sizes: {
		connectWallet: '41.5rem',
	},
	space: {
		4.5: '1.125rem',
		12.5: '3.125rem',
		25: '6.25rem',
	},
	styles: {
		sizes: {
			container: {
				content: '1128px'
			}
		}
	},
	components: {
		...container,
		...button,
		...link,
		...header,
		...divider,
		...text,
		...progress,
		...input,
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
})

export default theme
