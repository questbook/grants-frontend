import { ReactElement, useContext } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { WebwalletContext } from 'src/pages/_app'
import Payouts from 'src/screens/create_subgrant/_subscreens/Payouts'
import ProposalSubmission from 'src/screens/create_subgrant/_subscreens/ProposalSubmission'
import { RFPFormProvider } from 'src/screens/create_subgrant/Context'

function RequestProposal() {
	const buildComponent = () => {
		return (
			<Flex
				className='card'
				minWidth='90%'
				bgColor='white'
				padding={4}
				width='1276px'
				justifyContent='center'
				alignItems='center'
				marginTop={[0, 8, 8]}
				margin={[3, 0, 0]}
				marginBottom={4}
				alignSelf='center'
				overflow='scroll'
			>
				{createingProposalStep === 1 ? <ProposalSubmission /> : <Payouts />}
			</Flex>
		)
	}

	const { createingProposalStep } = useContext(WebwalletContext)!

	return buildComponent()
}

RequestProposal.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			requestProposal={true}
		>
			<RFPFormProvider>
				{page}
			</RFPFormProvider>
		</NavbarLayout>
	)
}

export default RequestProposal