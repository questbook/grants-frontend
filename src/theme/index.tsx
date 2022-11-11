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
		heading: 'Neue-Haas-Grotesk-Display, sans-serif',
		body: 'Neue-Haas-Grotesk-Display, sans-serif',
		buttons: 'Neue-Haas-Grotesk-Display, sans-serif',
	},
	// fonts: {
	// 	body: 'nhg, sans-serif',
	// 	heading: 'nhg, sans-serif',
	// 	buttons: 'nhg, sans-serif',
	// },
	colors,
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