import { useContext, useMemo } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'

function ToChoose() {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				align='center'
				borderBottom='1px solid #E7E4DD'>
				<Text
					minW='20%'
					color='gray.6'>
					To
				</Text>
				<FlushedInput
					value={getFieldString(proposal, 'applicantAddress') ?? ''}
					fontSize='16px'
					fontWeight='400'
					lineHeight='20px'
					borderBottom={undefined}
					variant='unstyled'
					w='100%'
					textAlign='left'
					flexProps={
						{
							w: '100%',
						}
					} />

			</Flex>
		)
	}

	const { proposals, selectedProposals } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	return buildComponent()
}

export default ToChoose