import { FaExclamationCircle } from 'react-icons/fa'
import { Flex, Icon, Link, Text } from '@chakra-ui/react'

const OptimismWarning = () => {
	return (
		<Flex
			align='center'
			justify='center'
			bg='#C2E7DA'
			color='white'
			p={4}
			paddingLeft={6}
			paddingRight={6}>
			<Icon
				as={FaExclamationCircle}
				boxSize={6}
				color='#1D1919'
				mr={2} />
			<Text
				fontSize='14px'
				fontWeight='500'
				textAlign='center'
				flexWrap='wrap'
			>
				Optimism mainnet is undergoing a network upgrade. As a result, you
				will not be able to perform any on-chain transactions on Questbook
				until June 6, 20:00 UTC
				<Link
					ml={2}
					color='#0A84FF'
					target='_blank'
					rel='noopener noreferrer'
					href='https://oplabs.notion.site/Bedrock-Mission-Control-EXTERNAL-fca344b1f799447cb1bcf3aae62157c5'>
					Learn More
				</Link>
			</Text>
		</Flex>
	)
}

export default OptimismWarning