import {
	ReactElement,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import * as Apollo from '@apollo/client'
import { Button, Center, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import ArchivedGrantEmptyState from 'src/components/your_grants/empty_states/archived_grant'
import AssignedGrantEmptyState from 'src/components/your_grants/empty_states/assigned_grant'
import ExpiredGrantEmptyState from 'src/components/your_grants/empty_states/expired_grant'
import FirstGrantEmptyState from 'src/components/your_grants/empty_states/first_grant'
import LiveGrantEmptyState from 'src/components/your_grants/empty_states/live_grants'
import YourGrantCard from 'src/components/your_grants/yourGrantCard'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import {
	GetAllGrantsCountForCreatorQuery, GetAllGrantsCountForCreatorQueryVariables,
	GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables,
	GetAllGrantsForReviewerQuery, GetAllGrantsForReviewerQueryVariables, Rubric,
	useGetAllGrantsCountForCreatorQuery,
	useGetAllGrantsForCreatorQuery,
	useGetAllGrantsForReviewerQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import NavbarLayout from 'src/layout/navbarLayout'
import { formatAmount } from 'src/utils/formattingUtils'
import { UNIX_TIMESTAMP_MAX, unixTimestampSeconds } from 'src/utils/generics'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ReviewerDashboard from 'src/v2/components/Dashboard/ReviewerDashboard'

const PAGE_SIZE = 5

const TABS = [
	{
		index: 0,
		query: {
			// fetch all grants,
			// currently accepting applications
			// & those that haven't expired yet
			acceptingApplications: [true],
			minDeadline: unixTimestampSeconds(),
			maxDeadline: UNIX_TIMESTAMP_MAX,
		},
		label: 'Live',
		emptyState: () => <LiveGrantEmptyState />,
	},
	{
		index: 1,
		query: {
			// fetch all expired (including archived) grants
			acceptingApplications: [true, false],
			minDeadline: 0,
			maxDeadline: unixTimestampSeconds(),
		},
		label: 'Past Deadline',
		emptyState: () => <ExpiredGrantEmptyState />,
	},
	{
		index: 2,
		query: {
			// fetch all non-expired archived grants
			acceptingApplications: [false],
			minDeadline: unixTimestampSeconds(),
			maxDeadline: UNIX_TIMESTAMP_MAX,
		},
		label: 'Archived',
		emptyState: () => <ArchivedGrantEmptyState />,
	},

]

function removeDuplicates<T extends { grant: { id: string } }>(array: Array<T>) {
	const uniq: { [key in string]: boolean } = {}
	return array.filter(
		(obj) => !uniq[obj.grant.id] && (uniq[obj.grant.id] = true),
	)
}

function YourGrants() {
	const [isAdmin, setIsAdmin] = useState<boolean>()
	const [isReviewer, setIsReviewer] = useState<boolean>()
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const { workspace } = useContext(ApiClientsContext)!
	const { data: accountData } = useQuestbookAccount()

	const { t } = useTranslation()

	useEffect(() => {
		if(
			workspace?.members &&
			workspace.members.length > 0 &&
			accountData &&
			accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			setIsAdmin(
				tempMember?.accessLevel === 'admin' ||
				tempMember?.accessLevel === 'owner',
			)
			setIsReviewer(tempMember?.accessLevel === 'reviewer')
			const user: string | undefined = tempMember?.id
			if(user !== undefined) {
				localStorage.setItem('id', user)
			}

			setIsLoading(false)
		}
	}, [accountData, workspace])


	if(isLoading || isAdmin === undefined || isReviewer === undefined) {
		return (
			<Center w='100%'>
				<Loader />
			</Center>
		)
	}

	if(isReviewer) {
		return (
			<Flex
				w='100%'
				h='100vh'
				bg='#F5F5FA'
				padding='40px'
				direction='column'
			>
				<Text
					fontWeight='700'
					fontSize='30px'
					lineHeight='44px'
					letterSpacing={-1}>
					Grants & Bounties
				</Text>
				<ReviewerDashboard />
			</Flex>
		)
	} else {
		return (
			<YourGrantsAdminView
				isAdmin={isAdmin}
				isReviewer={isReviewer} />
		)
	}
}

function YourGrantsAdminView({ isAdmin, isReviewer }: { isAdmin: boolean, isReviewer: boolean }) {
	const router = useRouter()
	// const [pk, setPk] = useState<string>('*')

	const { data: accountData } = useQuestbookAccount()
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const containerRef = useRef(null)
	const [currentPage, setCurrentPage] = useState(0)

	const [grants, setGrants] = useState<GetAllGrantsForCreatorQuery['grants']>([])

	const [grantsReviewer, setGrantsReviewer] = useState<GetAllGrantsForReviewerQuery['grantApplications']>([])

	const [queryParams, setQueryParams] = useState<Apollo.QueryHookOptions<GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables>>({
		client: subgraphClients[
			getSupportedChainIdFromWorkspace(workspace) || defaultChainId
		].client,
	})

	const [queryReviewerParams, setQueryReviewerParams] = useState<Apollo.QueryHookOptions<GetAllGrantsForReviewerQuery, GetAllGrantsForReviewerQueryVariables>>({
		client:
		subgraphClients[
			getSupportedChainIdFromWorkspace(workspace) || defaultChainId
		].client,
	})

	const [countQueryParams, setCountQueryParams] = useState<Apollo.QueryHookOptions<GetAllGrantsCountForCreatorQuery, GetAllGrantsCountForCreatorQueryVariables>>({
		client:
		subgraphClients[
			getSupportedChainIdFromWorkspace(workspace) || defaultChainId
		].client,
	})

	const [selectedTab, setSelectedTab] = useState(0)
	const [grantCount, setGrantCount] = useState([true, true])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setSelectedTab(
			parseInt(localStorage.getItem('yourGrantsTabSelected') || '0'),
		)
	}, [])

	useEffect(() => {
		if(!workspace) {
			return
		}

		if(!accountData) {
			return
		}

		setCountQueryParams({
			client:
			subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: {
				first: PAGE_SIZE,
				skip: PAGE_SIZE * currentPage,
				workspaceId: workspace?.id,
			},
			fetchPolicy: 'network-only',
		})
		setIsLoading(false)
	}, [currentPage, workspace, accountData?.address])

	useEffect(() => {
		if(!workspace) {
			return
		}

		if(!accountData) {
			return
		}

		const { query } = TABS[selectedTab]

		setQueryParams({
			client:
			subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: {
				first: PAGE_SIZE,
				skip: PAGE_SIZE * currentPage,
				workspaceId: workspace?.id,
				...query,
			},
			fetchPolicy: 'network-only',
		})
		setQueryReviewerParams({
			client:
			subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: {
				first: PAGE_SIZE,
				skip: PAGE_SIZE * currentPage,
				reviewerIDs: [localStorage.getItem('id')!],
			},
			fetchPolicy: 'network-only',
		})
		setIsLoading(false)
	}, [currentPage, workspace, accountData?.address, selectedTab])

	// useEffect(() => {
	// 	/// // console.log(pk);
	// 	if(!accountData?.address) {
	// 		return
	// 	}

	// 	if(!workspace) {
	// 		return
	// 	}

	// 	const k = workspace?.members
	// 		?.find(
	// 			(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
	// 		)
	// 		?.publicKey?.toString()
	// 	// // console.log(k);
	// 	if(k && k.length > 0) {
	// 		setPk(k)
	// 	} else {
	// 		setPk('')
	// 	}
	// }, [workspace, accountData])

	const {
		data: allGrantsCountData,
		error: allGrantsCountError,
		loading: allGrantsCountLoading,
	} = useGetAllGrantsCountForCreatorQuery(countQueryParams)

	useEffect(() => {
		if(allGrantsCountData) {
			setGrantCount([
				allGrantsCountData.liveGrants.length > 0,
				allGrantsCountData.archived.length > 0,
			])
		}
	}, [allGrantsCountData, allGrantsCountError, allGrantsCountLoading])

	const data = useGetAllGrantsForCreatorQuery(queryParams)
	useEffect(() => {
		if(!workspace) {
			return
		}

		setGrants([])
		setCurrentPage(0)
	}, [workspace, selectedTab])

	useEffect(() => {
		if(data.data && data.data.grants && data.data.grants.length > 0) {
			// console.log('data.grants', data.data.grants)
			if(
				grants.length > 0 &&
				grants[0].workspace.id === data.data.grants[0].workspace.id &&
				grants[0].id !== data.data.grants[0].id
			) {
				setGrants([...grants, ...data.data.grants])
			} else {
				setGrants(data.data.grants)
			}
		}
	}, [data])

	const allGrantsReviewerData =
		useGetAllGrantsForReviewerQuery(queryReviewerParams)
	useEffect(() => {
		if(!workspace) {
			return
		}

		setGrantsReviewer([])
		setCurrentPage(0)
	}, [workspace, selectedTab])

	useEffect(() => {
		if(
			allGrantsReviewerData.data &&
			allGrantsReviewerData.data.grantApplications &&
			allGrantsReviewerData.data.grantApplications.length > 0
		) {
			// console.log(
			//	'data.grantsReviewer.raw',
			//	allGrantsReviewerData.data.grantApplications,
			// )
			// eslint-disable-next-line max-len
			const newReviewerData = removeDuplicates(
				allGrantsReviewerData.data.grantApplications,
			)

			// console.log('data.grantsReviewer', newReviewerData)

			setGrantsReviewer(newReviewerData)
		}
	}, [allGrantsReviewerData])

	const { t } = useTranslation()

	const handleScroll = useCallback(() => {
		const { current } = containerRef
		if(!current) {
			return
		}

		const parentElement = (current as HTMLElement)?.parentNode as HTMLElement
		const reachedBottom =
			Math.abs(
				parentElement.scrollTop -
				(parentElement.scrollHeight - parentElement.clientHeight),
			) < 10
		if(reachedBottom) {
			setCurrentPage(currentPage + 1)
		}
	}, [containerRef, currentPage])

	const getEmptyStateForSelectedTab = () => TABS[selectedTab]?.emptyState()

	useEffect(() => {
		const { current } = containerRef
		if(!current) {
			return
		}

		const parentElement = (current as HTMLElement)?.parentNode as HTMLElement
		parentElement.addEventListener('scroll', handleScroll)

		// eslint-disable-next-line consistent-return
		return () => parentElement.removeEventListener('scroll', handleScroll)
	}, [handleScroll])

	if(isLoading || isReviewer === undefined) {
		return <Loader />
	}

	if(isReviewer) {
		return (
			<Flex
				w='100%'
				h='100vh'
				bg='#F5F5FA'
				padding='40px'
				direction='column'
			>
				<Text
					fontWeight='700'
					fontSize='30px'
					lineHeight='44px'
					letterSpacing={-1}>
					Grants & Bounties
				</Text>
				<ReviewerDashboard />
			</Flex>
		)
	}

	return (
		<>
			<Flex
				w='100%'
				ref={containerRef}
				direction='row'
				justify='center'>
				<Flex
					direction='column'
					w='65%'
					alignItems='stretch'
					pb={8}
					px={10}>
					<>
						<Flex
							mt='18px'
							align='center'
							justify='space-between'>
							<Text variant='heading'>
								{isReviewer ? 'Assigned Grants' : 'Your grants'}
							</Text>
							{
								isAdmin && grants.length > 0 && (
									<Button
										variant='primaryV2'
										onClick={
											() => {
												// console.log('Create a grant!')
												router.push({
													pathname: '/your_grants/create_grant/',
												})

											}
										}>
										{t('/your-grant.post_grant')}
									</Button>
								)
							}
						</Flex>
						<Flex
							direction='row'
							mt={4}
							mb={4}>
							{
								isAdmin && TABS.map((tab) => (
									<Button
										padding='8px 24px'
										borderRadius='52px'
										minH='40px'
										bg={selectedTab === tab.index ? 'brand.500' : 'white'}
										color={selectedTab === tab.index ? 'white' : 'black'}
										onClick={
											() => {
												setSelectedTab(tab.index)
												localStorage.setItem(
													'yourGrantsTabSelected',
													tab.index.toString(),
												)
											}
										}
										_hover={{}}
										fontWeight='700'
										fontSize='16px'
										lineHeight='24px'
										mr={3}
										border={selectedTab === tab.index ? 'none' : '1px solid #A0A7A7'}
										key={tab.index}
									>
										{tab.label}
									</Button>
								))
							}
						</Flex>
					</>
					{
						isAdmin &&
						grants.length > 0 &&
						grants.map((grant) => {
							const grantAmount = grant.reward.committed
							let decimals
							let icon
							let label
							if(grant.reward.token) {
								// console.log('Reward has token')
								decimals = grant.reward.token.decimal
								label = grant.reward.token.label
								icon = grant.reward.token.iconHash
							} else {
								decimals =
									CHAIN_INFO[
										getSupportedChainIdFromSupportedNetwork(
											grant.workspace.supportedNetworks[0],
										)
									]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
										?.decimals
								label =
									CHAIN_INFO[
										getSupportedChainIdFromSupportedNetwork(
											grant.workspace.supportedNetworks[0],
										)
									]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
										?.label || 'LOL'
								icon =
									CHAIN_INFO[
										getSupportedChainIdFromSupportedNetwork(
											grant.workspace.supportedNetworks[0],
										)
									]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
										?.icon || '/images/dummy/Ethereum Icon.svg'
							}

							return (
								<YourGrantCard
									grantID={grant.id}
									key={grant.id}
									daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
									grantTitle={grant.title}
									grantDesc={grant.summary}
									numOfApplicants={grant.numberOfApplications}
									endTimestamp={new Date(grant.deadline!).getTime()}
									grantAmount={formatAmount(grantAmount, decimals)}
									grantCurrency={label || 'LOL'}
									grantCurrencyIcon={icon}
									state='done'
									chainId={
										getSupportedChainIdFromSupportedNetwork(
											grant.workspace.supportedNetworks[0],
										)
									}
									onEditClick={
										() => router.push({
											pathname: '/your_grants/edit_grant/',
											query: {
												grantId: grant.id,
											},
										})
									}
									onViewApplicantsClick={
										() => router.push({
											pathname: '/v2/your_grants/view_applicants/',
											query: {
												grantId: grant.id,
											},
										})
									}
									acceptingApplications={grant.acceptingApplications}
									isAdmin={isAdmin}
									initialRubrics={grant?.rubric as Rubric}
									workspaceId={grant.workspace.id}
								/>
							)
						})
					}

					{
						isReviewer &&
						grantsReviewer.length > 0 &&
						grantsReviewer.map((grant) => {
							const grantAmount = grant.grant.reward.committed
							let decimals
							let icon
							let label
							if(grant.grant.reward.token) {
								decimals = grant.grant.reward.token.decimal
								label = grant.grant.reward.token.label
								icon = getUrlForIPFSHash(grant.grant.reward.token.iconHash)
							} else {
								decimals =
									CHAIN_INFO[
										getSupportedChainIdFromSupportedNetwork(
											grant.grant.workspace.supportedNetworks[0],
										)
									]?.supportedCurrencies[grant.grant.reward.asset.toLowerCase()]
										?.decimals
								label =
									CHAIN_INFO[
										getSupportedChainIdFromSupportedNetwork(
											grant.grant.workspace.supportedNetworks[0],
										)
									]?.supportedCurrencies[grant.grant.reward.asset.toLowerCase()]
										?.label || 'LOL'
								icon =
									CHAIN_INFO[
										getSupportedChainIdFromSupportedNetwork(
											grant.grant.workspace.supportedNetworks[0],
										)
									]?.supportedCurrencies[grant.grant.reward.asset.toLowerCase()]
										?.icon || '/images/dummy/Ethereum Icon.svg'
							}

            	return (
	<YourGrantCard
            			grantID={grant.grant.id}
            			key={grant.grant.id}
            			daoIcon={
            				getUrlForIPFSHash(
            					grant.grant.workspace.logoIpfsHash,
            				)
            			}
            			grantTitle={grant.grant.title}
            			grantDesc={grant.grant.summary}
            			numOfApplicants={grant.grant.numberOfApplications}
            			endTimestamp={new Date(grant.grant.deadline!).getTime()}
            			grantAmount={formatAmount(grantAmount, decimals)}
            			grantCurrency={label || 'LOL'}
            			grantCurrencyIcon={icon}
            			state='done'
            			chainId={
            				getSupportedChainIdFromSupportedNetwork(
            					grant.grant.workspace.supportedNetworks[0],
            				)
            			}
            			onViewApplicantsClick={
            				() => router.push({
            					pathname: '/v2/your_grants/view_applicants/',
            					query: {
            						grantId: grant.grant.id,
            					},
            				})
            			}
            			acceptingApplications={grant.grant.acceptingApplications}
            			isAdmin={isAdmin}
            			initialRubrics={grant.grant?.rubric as Rubric}
            			workspaceId={grant.grant.workspace.id}
            		/>
            	)
						})
					}
					{
						grants.length === 0 &&
						isAdmin &&
						!grantCount[0] &&
						!grantCount[1] &&
						router.query.done && <FirstGrantEmptyState />
					}
					{
						grants.length === 0 &&
						isAdmin &&
						!router.query.done &&
						getEmptyStateForSelectedTab()
					}

					{
						grantsReviewer.length === 0 &&
						isReviewer &&
						!grantCount[0] &&
						!grantCount[1] &&
						router.query.done && <AssignedGrantEmptyState />
					}
					{
						grantsReviewer.length === 0 &&
						isReviewer &&
						!router.query.done &&
						<AssignedGrantEmptyState />
					}
				</Flex>
				{/* <Flex
					w='26%'
					pos='sticky'
					minH='calc(100vh - 64px)'
					// display={isAdmin ? undefined : 'none'}
				>
					<Sidebar
						isReviewer={isReviewer}
						showCreateGrantItem={!grantCount[0] && !grantCount[1]}
					/>
				</Flex> */}
			</Flex>
		</>
	)
}

YourGrants.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout renderGetStarted>
			{page}
		</NavbarLayout>
	)
}

export default YourGrants
