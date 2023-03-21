import { useContext } from 'react'
import { Container, Flex } from '@chakra-ui/react'
import { WebwalletContext } from 'src/pages/_app'

function StepIndicator() {
	const buildComponent = () => (
		<Flex
			gap={1}
			alignSelf='stretch'
			width='100%'
		>
			<Container
				width='100%'
				className='firstStep'
				borderRadius='1px'
				bgColor={createingProposalStep > 0 ? 'accent.azure' : 'gray.200'}
				height={1}
				maxW='100%'
			/>
			<Container
				width='100%'
				borderRadius='1px'
				bgColor={createingProposalStep > 1 ? 'accent.azure' : 'gray.200'}
				height={1}
			/>
			<Container
				width='100%'
				borderRadius='1px'
				bgColor={createingProposalStep > 2 ? 'accent.azure' : 'gray.200'}
				height={1}
				maxW='100%'
			/>
		</Flex>
	)

	const { createingProposalStep } = useContext(WebwalletContext)!

	return buildComponent()
}

export default StepIndicator