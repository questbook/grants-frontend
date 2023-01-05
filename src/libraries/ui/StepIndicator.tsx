import { Container, Flex } from '@chakra-ui/react'
import { RFPFormType } from 'src/screens/request_proposal/_utils/types'

interface Props {
    step: number
	formType: RFPFormType
}

function StepIndicator({ step, formType }: Props) {
	return (
		<Flex
			gap={1}
			alignSelf='stretch'
			width='100%'
		>
			{/* <Flex
				width='100%'
				flexDirection='row'> */}

			<Container
				width='100%'
				className='firstStep'
				borderRadius='1px'
				bgColor={step > 0 ? 'accent.azure' : 'gray.2'}
				height={1}
				maxW='100%'
			/>
			{/* <Container borderRadius='1px' bgColor={step>0 ? 'azure.1' : 'gray.2'} height={5} width={1} alignSelf='flex-end'></Container> */}
			{/* </Flex> */}

			{/* {
				formType !== 'edit' && (
					<Container
						width='100%'
						borderRadius='1px'
						bgColor={step > 1 ? 'accent.azure' : 'gray.2'}
						height={1}
					/>
				)
			} */}
			<Container
				width='100%'
				borderRadius='1px'
				bgColor={step > 1 ? 'accent.azure' : 'gray.2'}
				height={1}
			/>
			<Container
				width='100%'
				borderRadius='1px'
				bgColor={step > 2 ? 'accent.azure' : 'gray.2'}
				height={1}
				maxW='100%'
			/>
		</Flex>
	)
}

export default StepIndicator