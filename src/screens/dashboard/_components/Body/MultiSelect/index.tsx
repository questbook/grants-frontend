import { useContext, useMemo } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { getFieldString } from 'src/utils/formattingUtils'


function MultiSelect() {
	const buildComponent = () => {
		return (
			<Flex
				bg='white'
				py={6}
				px={5}
				w='100%'
				h='100%'
				direction='column'>
				<Text
					variant='v2_heading_3'
					fontWeight='500'>
					Proposals Selected
					<Text
						ml={1}
						display='inline-block'
						color='black.3'>
						{`(${selectedProposalsData?.length})`}
					</Text>
				</Text>

				{selectedProposalsData?.map(proposalCard)}
			</Flex>
		)
	}

	const proposalCard = (proposal: ProposalType, index: number) => {
		return (
			<Flex
				key={index}
				mt={4}
				py={4}
				px={5}
				border='1px solid #E7E4DD'
				borderRadius='2px'
				direction='column'>
				<Text
					variant='v2_body'
					fontWeight='500'
					cursor='pointer'
					_hover={{ textDecoration: 'underline' }}
				>
					{getFieldString(proposal, 'projectName')}
				</Text>
				<Flex
					align='center'
					mt={1}>
					<Image
						borderWidth='1px'
						borderColor='black.1'
						borderRadius='3xl'
						src={getAvatar(false, proposal.applicantId)}
						boxSize='16px' />
					<Text
						ml={2}
						variant='v2_metadata'>
						{getFieldString(proposal, 'applicantName')}
					</Text>
				</Flex>
			</Flex>
		)
	}

	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const selectedProposalsData = useMemo(() => {
		if(!proposals || !selectedProposals) {
			return []
		}

		const p: ProposalType[] = []
		for(let i = 0; i < proposals.length; i++) {
			if(selectedProposals[i]) {
				p.push(proposals[i])
			}
		}

		return p
	}, [proposals, selectedProposals])

	return buildComponent()
}

export default MultiSelect