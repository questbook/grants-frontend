// components/Footer.tsx
import { Box, Flex, Grid, Link, Stack, Text } from '@chakra-ui/react'
import { Questbook } from 'src/generated/icons'

const Footer = () => {
	return (
		<Box
			as='footer'
			bg='#1f1f33'
			color='white'
			py={10}
			pb={10}>
			<Flex
				px={{ base: 4, md: 8 }}
				justify='space-between'
				direction={{ base: 'column', md: 'row' }}
				align='center'
				w='full'

			>
				<Stack
					spacing={6}
				>
					<Link
						href='/'
						aria-current='page'>
						<Questbook
							width='340px'
							height='auto' />
					</Link>
					<Text
						fontSize={{ base: 'sm', md: 'md' }}
						color='#b7f72b'>
						Transparent and Fast Grants
						{' '}
						{' '}
						for builders in web3
					</Text>
				</Stack>

				<Grid
					templateColumns='repeat(2, 1fr)'
					gap={12}
					mt={{ base: 12, md: 0 }}
					justifyContent={{ base: 'flex-start', md: 'flex-end' }}

				>
					<Stack
						minW='160px'
						p={2}
					>
						<Text
							color='#b7f72b'
							fontWeight='bold'>
							COMPANY
						</Text>
						<Link
							href='https://questbook.xyz/about'
							target='_blank' >
							About us
						</Link>
						<Link
							href='https://www.figma.com/file/HE49uUjY5YnzhDukt45nMW/Questbook---Brand-Book-(Master)?node-id=129%3A786'
							target='_blank' >
							Brand toolkit
						</Link>
						<Link
							href='https://questbook.substack.com/'
							target='_blank'>
							Newsletter
						</Link>
						<Link
							href='https://questbook.app/termsofservice.html'
							target='_blank' >
							Terms of Service
						</Link>
						<Link
							href='https://questbook.app/privacypolicy.html'
							target='_blank' >
							Privacy Policy
						</Link>

					</Stack>

					<Stack
						minW='160px'
						p={2}
					>
						<Text
							color='#b7f72b'
							fontWeight='bold'>
							COMMUNITY
						</Text>
						<Link
							href='https://discord.gg/tWg7Mb7KM7'
							target='_blank'>
							Discord
						</Link>
						<Link
							href='https://twitter.com/questbookapp'
							target='_blank'>
							Twitter (X)
						</Link>
						<Link
							href='https://warpcast.com/questbook'
							target='_blank'>
							Warpcast
						</Link>
						<Link
							href='https://medium.com/questbook'
							target='_blank'>
							Medium
						</Link>
					</Stack>
				</Grid>


			</Flex>
			<Flex
				justifyContent='flex-start'
				px={{ base: 4, md: 8 }}
			>
				<Text
					mt={8}
					color='white'>

					{' '}
					{new Date().getFullYear()}
					<br />
					{' '}
					Questbook. All rights reserved.
				</Text>
			</Flex>
		</Box>
	)


}

export default Footer
