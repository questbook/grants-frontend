import { FaExclamationCircle } from 'react-icons/fa'
import { Flex, Icon, Text } from '@chakra-ui/react'

const OptimismWarning = () => {
	return (
		<Flex
			align='center'
			justify='center'
			bg='red.200'
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
				We are facing an issue with our subgraph node, we are actively working on it
			</Text>
		</Flex>
	)
}

export default OptimismWarning