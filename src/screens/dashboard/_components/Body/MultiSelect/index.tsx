import { useContext, useMemo } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { getAvatar } from 'src/libraries/utils'
import { getFieldString } from 'src/libraries/utils/formatting'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'


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
					variant='heading3'
					fontWeight='500'>
					Proposals Selected
					<Text
						ml={1}
						display='inline-block'
						color='black.300'>
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
					variant='body'
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
						borderColor='black.100'
						borderRadius='3xl'
						src={getAvatar(false, proposal.applicantId)}
						boxSize='16px' />
					<Text
						ml={2}
						variant='metadata'>
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
			if(selectedProposals.has(proposals[i].id)) {
				p.push(proposals[i])
			}
		}

		return p
	}, [proposals, selectedProposals])

	return buildComponent()
}

export default MultiSelect