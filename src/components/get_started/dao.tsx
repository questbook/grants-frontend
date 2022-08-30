import React from 'react'
import {
	Button,
	Container,
	Flex,
	Image,
	Link,
	Text,
	useTheme,
} from '@chakra-ui/react'

const TABS = [
	{
		icon: '/illustrations/create_grant.svg',
		title: 'Create a Grant',
		text: 'Create a grant application under 2 minutes and post it on Questbook',
	},
	{
		icon: '/illustrations/attract_applications.svg',
		title: 'Attract applicants',
		text: 'Share your grants. Receive applications submitted by a pool of applicants.',
	},
	{
		icon: '/illustrations/disburse_grants.svg',
		title: 'Disburse grants',
		text: 'Review applications by tracking milestones, and pay for each milestone. ',
	},
]

function Dao({ onClick }: { onClick: () => void }) {
	const theme = useTheme()

	return (
		<Container
			h='100vh'
			maxW='100%'
			display='flex'
			px='70px'
			flexDirection='column'
			alignItems='center'
		>
			<Text
				mt='46px'
				variant='heading'>
				So, you want to create grants? It&apos;s pretty simple. 🚀
			</Text>
			<Flex mt='88px'>
				{
					TABS.map(({ icon, title, text }, index) => (
						<Container
							key={title}
							display='flex'
							flexDirection='column'
							alignItems='center'
							maxW='300px'
							ml={index === 0 ? 0 : '70px'}
						>
							<Image
								h='158px'
								w='128px'
								src={icon} />
							<Text
								mt={9}
								fontFamily='Spartan, sans-serif'
								fontSize='20px'
								lineHeight='25px'
								fontWeight='700'
								textAlign='center'
							>
								{title}
							</Text>
							<Text
								mt={3}
								fontWeight='400'
								textAlign='center'>
								{text}
							</Text>
						</Container>
					))
				}
			</Flex>

			<Button
				onClick={() => onClick()}
				variant='primary'
				my={16}>
				Continue
			</Button>

			<Container
				bgColor={theme.colors.backgrounds.card}
				p={0}
				maxW='100vw'
				w='auto'
				m={0}
				position='absolute'
				bottom={0}
				display='flex'
				justifyContent='center'
				py={3}
			>
				<Text
					w='100vw'
					textAlign='center'
					variant='footer'
					fontSize='12px'>
					Each grant can be seen on-chain.
					{' '}
					<Link
						href='https://www.notion.so/questbook/Contracts-7cea3bdfb6be47e68f165b4a719c662f'
						isExternal
					>
						Learn more
						<Image
							mx={1}
							boxSize='10px'
							src='/ui_icons/link.svg'
							alt='open link'
							display='inline-block'
						/>
					</Link>
				</Text>
			</Container>
		</Container>
	)
}

export default Dao
