import { extendTheme } from '@chakra-ui/react'
import colors from 'src/theme/colors'
import button from 'src/theme/components/button'
import container from 'src/theme/components/container'
import divider from 'src/theme/components/divider'
import header from 'src/theme/components/header'
import input from 'src/theme/components/input'
import link from 'src/theme/components/link'
import progress from 'src/theme/components/progress'
import text from 'src/theme/components/text'

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
		brandText: '#4E4E6B',
		brandSubtext: '#7D7DA0',
		greenTextBackground: '#79F2C0',
		greenTextDark: '#36B37E',
		brandGrey: {
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
		bannerGrey: '#F0F0F7',
		v2Grey: '#555570',
		primary: '#745FE8',
		v2LightGrey: '#D2D2E3',
		...colors
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
				content: '1128px',
			},
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