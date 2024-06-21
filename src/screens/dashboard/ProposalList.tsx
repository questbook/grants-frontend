// This renders the list of proposals that show up as the first column

import { createRef, useContext, useEffect, useMemo, useState } from 'react'
import { Button, Checkbox, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useRouter } from 'next/router'
import { ApplicationState } from 'src/generated/graphql'
import { Filter } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import SearchField from 'src/libraries/ui/SearchField'
import { getFieldString } from 'src/libraries/utils/formatting'
import { getSupportedChainIdFromSupportedNetwork } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import FilterTag from 'src/screens/dashboard/_components/FilterTag'
import Empty from 'src/screens/dashboard/_components/ProposalList/Empty'
import ProposalCard from 'src/screens/dashboard/_components/ProposalList/ProposalCard'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { disabledGrants, disabledSubmissions, disabledTonGrants, ensGrants } from 'src/screens/proposal_form/_utils/constants'

function ProposalList({ step, setStep }: { step?: boolean, setStep?: (value: boolean) => void }) {
	const buildComponent = () => (
		<Flex
			w={['100%', '100%', '100%', '25%']}
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
					color='black.100'
					fontSize={['14px', '14px', '16px', '16px']}>
					Proposals
					<Text
						ml={1}
						display='inline-block'
						color='black.300'>
						{`(${proposalCount})`}
					</Text>
				</Text>
				{
					(role === 'community' || role === 'builder') && (
						<Button
							variant='secondaryV2'
							// w='103px'
							// h='32px'
							mr={4}
							isDisabled={disabledTonGrants?.includes(grant?.id as string) || disabledGrants?.includes(grant?.id as string) || disabledSubmissions?.includes(grant?.id as string)}
							fontSize={['10px', '10px', '12px', '12px']}
							onClick={
								() => {
									const href = window.location.href.split('/')
									const protocol = href[0]
									const domain = href[2]
									const chainId = getSupportedChainIdFromSupportedNetwork(grant?.workspace.supportedNetworks[0])

									const URL =
									grant?.id === ensGrants ? `https://ens.questbook.app/proposal_form/?grantId=${grant?.id}&chainId=${chainId}&newTab=true` :
										`${protocol}//${domain}/proposal_form/?grantId=${grant?.id}&chainId=${chainId}&newTab=true`

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

			<Flex
				my={4}
				align='center'
				gap={2}
				px={5}>
				{
					(role === 'admin' && selectedProposals?.size > 0) && (
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
								variant='body'
								fontWeight='400'>
								Select All
							</Text>
						</Checkbox>
					)
				}
				<Flex
					ml='auto'
					gap={2}
				>
					<Select
						isSearchable={false}
						variant='unstyled'
						useBasicStyles
						value={
							{
								label: 'Sort By',
								value: sortBy
							}
						}
						options={
							[
								{
									label: 'Submission Date',
									value: 'createdAtS'
								},
								{
									label: 'Modified Date',
									value: 'updatedAtS'
								}
							]
						}
						onChange={(item) => setSortBy(item?.value as 'createdAtS' | 'updatedAtS')}
						chakraStyles={
							{
								container: (provided) => ({
									...provided,
									fontSize: '12px',
									fontWeight: '400',
									color: 'black.100',
									borderRadius: '2px',
								}),
								valueContainer: (provided) => ({
									...provided,

									fontSize: '12px',
								}),
								menu: (provided) => ({
									...provided,
									fontSize: '12px',
									fontWeight: '400',
									borderRadius: '2px',
								}),
								option: (provided) => ({
									...provided,
									borderRadius: '2px',
									padding: '5px 10px',
									fontSize: '12px',
									fontWeight: '400',
								}),

							}
						}
					/>

					<Button
						ml='auto'
						variant='link'
						rightIcon={isFilterClicked ? <Flex /> : <Filter />}
						onClick={
							() => {
								setIsFilterClicked(!isFilterClicked)
							}
						}>
						<Text>
							{isFilterClicked ? 'Done' : 'Filter'}
						</Text>
					</Button>
				</Flex>

			</Flex>


			<Grid
				display={isFilterClicked ? 'grid' : 'none'}
				minH='120px'
				px={3}
				m={2}
				overflowX='scroll'
				sx={
					{
						'::-webkit-scrollbar': {
							display: 'none'
						}
					}
				}
				templateColumns='repeat(2, 0fr)'
				gap={1}>
				{
					(['approved', 'submitted', 'rejected', 'resubmit', 'review', 'completed'] as ApplicationState[]).map(state => {
						return (
							<GridItem
								// colSpan={index > 1 ? 2 : 1}
								key={state}>
								<FilterTag
									id={state}
									state={state}
									isSelected={filterState === state}
									onClick={
										() => {
											if(filterState === state) {
												setFilterState(undefined)
											} else {
												setFilterState(state)
											}
										}
									} />
							</GridItem>

						)
					})
				}
			</Grid>

			<Flex
				w='100%'
				h='100%'
				direction='column'
				overflowY='auto'
				sx={
					{
						'::-webkit-scrollbar': {
							display: 'none'
						}
					}
				}>
				{
					proposalCount > 0 && filteredProposals?.map((proposal, index) => {
						return (
							<ProposalCard
								key={proposal.id}
								ref={cardRefs[index]}
								proposal={proposal}
								step={step}
								setStep={setStep}
								type={sortBy}
							/>
						)
					})
				}
				{proposalCount === 0 && <Empty />}
				{
					isProposalListLoading && (
						<Button
							my={4}
							isLoading={true}
							loadingText='Loading Proposals, please wait.'
							variant='link'
							cursor='default'
						/>
					)
				}

			</Flex>
		</Flex>
	)

	const router = useRouter()
	const { proposalId } = router.query

	const { role, grant } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals, setSelectedProposals, filterState, setFilterState, sortBy, setSortBy, isProposalListLoading } = useContext(DashboardContext)!

	const [isFilterClicked, setIsFilterClicked] = useState<boolean>(false)

	const [searchText, setSearchText] = useState<string>('')
	const filteredProposals = useMemo(() => {
		let allProposals = [...proposals]

		if(searchText !== '') {
			allProposals = allProposals.filter((proposal) => {
				const projectName = getFieldString(proposal, 'projectName') as string | undefined
				if(!projectName) {
					return false
				}

				return (projectName?.toLowerCase().includes(searchText.toLowerCase()))
			})
		}

		if(filterState !== undefined && filterState !== 'completed') {
			allProposals = allProposals.filter(proposal => proposal.state === filterState)
		}

		if(filterState === 'completed') {
			allProposals = allProposals.filter(proposals => proposals.milestones.filter((milestone) => parseFloat(milestone.amountPaid) >= parseFloat(milestone.amount)).length === proposals.milestones.length)
		}

		if(sortBy === 'createdAtS') {
			allProposals = allProposals.sort((a, b) => a.createdAtS - b.createdAtS)
		}

		return allProposals
	}, [proposals, searchText, filterState, sortBy])

	const proposalCount = useMemo(() => {
		return grant?.numberOfApplications || 0
	}, [grant])

	const cardRefs = useMemo(() => {
		return proposals.map(() => createRef<HTMLDivElement>())
	}, [proposals])

	useEffect(() => {
		logger.info({ proposalId }, '(Proposal List) useEffect {proposalId}')
		if(!proposals) {
			return
		}

		if(proposalId && typeof proposalId === 'string') {
			// Scroll to the proposal
			const proposalIndex = filteredProposals.findIndex((_) => _.id === proposalId)
			if(proposalIndex !== -1) {
				cardRefs[proposalIndex].current?.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}, [proposals, proposalId, filteredProposals])

	return buildComponent()
}

export default ProposalList