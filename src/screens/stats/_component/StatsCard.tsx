import { Flex, Text } from '@chakra-ui/react'

interface CardProps{
    cardTitle: string
}


function StatsCard({ cardTitle }: CardProps) {
	return (
		<Flex
			direction='column'
			bg='white'
			gap={6}
			px={6}
			py={7}
			boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
			borderRadius='0px 4px 4px 0px'
			// h='33%'
		>
			<Text
				variant='v2_subheading'
				fontWeight='500'>
				{cardTitle}
			</Text>
			<Flex
				justifyContent='center'
				gap={6}>
				<Flex
					direction='column'
					alignItems='center'
					gap={2}
				>
					<Text
						variant='v2_subheading'
						fontWeight='500'
					>
						150
					</Text>
					<Text>
						Total
					</Text>
				</Flex>

				<Flex
					direction='column'
					alignItems='center'
					gap={2}
				>
					<Text
						variant='v2_subheading'
						fontWeight='500'
					>
						140
					</Text>
					<Text>
						Accepted
					</Text>
				</Flex>

			</Flex>
		</Flex>
	)
}

export default StatsCard