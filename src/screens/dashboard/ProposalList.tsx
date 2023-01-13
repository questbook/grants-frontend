// This renders the list of proposals that show up as the first column

import { useContext, useMemo, useState } from 'react'
import { Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import SearchField from 'src/libraries/ui/SearchBox'
import { GrantsProgramContext } from 'src/pages/_app'
import Empty from 'src/screens/dashboard/_components/ProposalList/Empty'
import ProposalCard from 'src/screens/dashboard/_components/ProposalList/ProposalCard'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

function ProposalList() {
	const buildComponent = () => (
		<Flex
			w='25%'
			h='100%'
			bg='white'
			direction='column'
			boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
			py={4}>
			<Flex
				justifyContent='space-between'
				// px={4}
				align='center'
				w='100%'
			>
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
				{
					(role === 'community') && (
						<Button
							variant='secondaryV2'
							// w='103px'
							// h='32px'
							mr={4}
							fontSize='14px'
							onClick={
								() => {
									const href = window.location.href.split('/')
									const protocol = href[0]
									const domain = href[2]
									const chainId = getSupportedChainIdFromSupportedNetwork(grant?.workspace.supportedNetworks[0])

									const URL = `${protocol}//${domain}/proposal_form/?grantId=${grant?.id}&chainId=${chainId}`

									window.open(URL, '_blank')
								}
							}
						>
							Submit new
						</Button>
					)
				}
			</Flex>


			<Flex
				mx={5}
				mt={4}>
				<SearchField
					placeholder='Search'
					value={searchText}
					onChange={
						(e) => {
							setSearchText(e.target.value)
						}
					} />
			</Flex>

			<Box mt={4} />

			{
				(role === 'admin' && selectedProposals?.size > 0) && (
					<Flex
						mb={2}
						pl={5}>
						<Checkbox
							isChecked={selectedProposals?.size !== undefined && proposals.every((_) => selectedProposals?.has(_.id))}
							onChange={
								(e) => {
									logger.info({ value: e.target.checked }, '(Proposal List) Select All Checkbox')
									if(e.target.checked) {
										setSelectedProposals(new Set<string>(proposals.map((_) => _.id)))
									} else {
										setSelectedProposals(new Set<string>([proposals?.[0]?.id]))
									}

									logger.info({ size: selectedProposals.size, proposalsLength: proposals.length, selectedProposals }, '(Proposal List) Select All Checkbox {size, proposalsLength, selectedProposals')
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

	const { role, grant } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals, setSelectedProposals } = useContext(DashboardContext)!

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