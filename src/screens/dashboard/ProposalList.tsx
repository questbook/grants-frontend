// This renders the list of proposals that show up as the first column

import { useContext, useMemo, useState } from 'react'
import { Checkbox, Flex, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import SearchField from 'src/libraries/ui/SearchBox'
import { ApiClientsContext } from 'src/pages/_app'
import Empty from 'src/screens/dashboard/_components/ProposalList/Empty'
import ProposalCard from 'src/screens/dashboard/_components/ProposalList/ProposalCard'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'

function ProposalList() {
	const buildComponent = () => (
		<Flex
			w='25%'
			h='100%'
			bg='white'
			direction='column'
			boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
			py={4}>
			<Text
				pl={5}
				fontWeight='700'
				color='black.1'>
				Proposals
				<Text
					ml={1}
					display='inline-block'
					color='black.3'>
					{`(${proposalCount})`}
				</Text>
			</Text>

			<Flex
				mx={5}
				my={4}>
				<SearchField
					placeholder='Search'
					value={searchText}
					onChange={
						(e) => {
							setSearchText(e.target.value)
						}
					} />
			</Flex>


			{
				(role === 'admin' && selectedProposals?.size > 0) && (
					<Flex
						mt={4}
						pl={5}>
						<Checkbox
							isChecked={selectedProposals?.size !== undefined && proposals.every((_) => selectedProposals?.has(_.id))}
							onChange={
								(e) => {
									logger.info({ value: e.target.checked }, '(Proposal List) Select All Checkbox')
									for(const proposal of proposals) {
										updateSelectedProposal(proposal.id, e.target.checked ? 'add' : 'remove')
									}

									logger.info({ size: selectedProposals.size, proposalsLength: proposals.length, selectedProposals }, '(Proposal List) Select All Checkbox {size, proposalsLength, selectedProposals')
									if(selectedProposals.size === 0 && proposals.length > 0) {
										updateSelectedProposal(proposals[0].id, 'add')
									}
								}
							}>
							<Text
								variant='v2_body'
								fontWeight='400'>
								Select All
							</Text>
						</Checkbox>
					</Flex>
				)
			}

			<Flex
				w='100%'
				h='100%'
				direction='column'
				overflowY='auto'>
				{
					proposalCount > 0 && filteredProposals?.map(proposal => {
						return (
							<ProposalCard
								key={proposal.id}
								proposal={proposal}
							/>
						)
					})
				}
				{proposalCount === 0 && <Empty />}
			</Flex>
		</Flex>
	)

	const [searchText, setSearchText] = useState<string>('')

	const { role } = useContext(ApiClientsContext)!
	const { proposals, selectedProposals, updateSelectedProposal } = useContext(DashboardContext)!

	const filteredProposals = useMemo(() => {
		if(searchText === '') {
			return proposals
		}

		return proposals.filter((proposal) => {
			const projectName = getFieldString(proposal, 'projectName') as string | undefined
			if(!projectName) {
				return false
			}

			return (projectName?.toLowerCase().includes(searchText.toLowerCase()))
		})
	}, [proposals, searchText])

	const proposalCount = useMemo(() => {
		return filteredProposals.filter((_) => _).length
	}, [filteredProposals])

	return buildComponent()
}

export default ProposalList