import React, {
	ReactElement,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Button, Flex } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { useRouter } from 'next/router'
import ArchivedGrantEmptyState from 'src/components/your_grants/empty_states/archived_grant'
import ExpiredGrantEmptyState from 'src/components/your_grants/empty_states/expired_grant'
import FirstGrantEmptyState from 'src/components/your_grants/empty_states/first_grant'
import LiveGrantEmptyState from 'src/components/your_grants/empty_states/live_grants'
import Sidebar from 'src/components/your_grants/sidebar/sidebar'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import {
	GetAllGrantsForCreatorQuery,
	GetAllGrantsForReviewerQuery,
	useGetAllGrantsCountForCreatorQuery,
	useGetAllGrantsForCreatorQuery,
	useGetAllGrantsForReviewerQuery,
} from 'src/generated/graphql'
import { UNIX_TIMESTAMP_MAX, unixTimestampSeconds } from 'src/utils/generics'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromSupportedNetwork,
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'
import AddFunds from '../../src/components/funds/add_funds_modal'
import Heading from '../../src/components/ui/heading'
import YourGrantCard from '../../src/components/your_grants/yourGrantCard'
import NavbarLayout from '../../src/layout/navbarLayout'
import { formatAmount } from '../../src/utils/formattingUtils'
import { ApiClientsContext } from '../_app'

const PAGE_SIZE = 5

const TABS = [
	{
		index: 0,
		query: {
			// fetch all grants,
			// currently accepting applications
			// & those that haven't expired yet
			acceptingApplications: true,
			minDeadline: unixTimestampSeconds(),
			maxDeadline: UNIX_TIMESTAMP_MAX
		},
		label: 'Live Grants',
		emptyState: () => <LiveGrantEmptyState />,
	},
	{
		index: 1,
		query: {
			// fetch all archived grants regardless of "acceptingApplications" state
			acceptingApplications: false,
			minDeadline: 0,
			maxDeadline: UNIX_TIMESTAMP_MAX
		},
		label: 'Archived',
		emptyState: () => <ArchivedGrantEmptyState />,
	},
	{
		index: 2,
		acceptingApplications: true,
		query: {
			// fetch all expired (not archived) grants
			acceptingApplications: true,
			minDeadline: 0,
			maxDeadline: unixTimestampSeconds(),
		},
		label: 'Expired Grants',
		emptyState: () => <ExpiredGrantEmptyState />
	},
]

function removeDuplicates(array: any) {
	const uniq: any = {}
	// eslint-disable-next-line no-return-assign
	return array.filter((obj: any) => !uniq[obj.grant.id] && (uniq[obj.grant.id] = true))
}

function YourGrants() {
	const router = useRouter()
	const [pk, setPk] = useState<string>('*')
	const [ignorePkModal, setIgnorePkModal] = useState(false)

	const { data: accountData } = useAccount()
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
	const [isReviewer, setIsReviewer] = React.useState<boolean>(false)

	const containerRef = useRef(null)
	const [currentPage, setCurrentPage] = React.useState(0)

	const [grants, setGrants] = React.useState<
  GetAllGrantsForCreatorQuery['grants']
  >([])

	const [grantsReviewer, setGrantsReviewer] = React.useState<
  GetAllGrantsForReviewerQuery['grantApplications']
  >([])

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
      ].client,
	})

	const [queryReviewerParams, setQueryReviewerParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
      ].client,
	})

	const [countQueryParams, setCountQueryParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
      ].client,
	})

	const [selectedTab, setSelectedTab] = useState(0)
	const [grantCount, setGrantCount] = useState([true, true])

	useEffect(() => {
		setSelectedTab(parseInt(localStorage.getItem('yourGrantsTabSelected') ?? '0'))
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

	}, [currentPage, workspace, accountData?.address])

	useEffect(() => {
		if(
			workspace
      && workspace.members
      && workspace.members.length > 0
      && accountData
      && accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			setIsAdmin(
				tempMember?.accessLevel === 'admin'
        || tempMember?.accessLevel === 'owner',
			)
			setIsReviewer(tempMember?.accessLevel === 'reviewer')
			const user: any = tempMember?.id
			localStorage.setItem('id', user)
		}
	}, [accountData, workspace])

	useEffect(() => {
		if(!workspace) {
			return
		}

		if(!accountData) {
			return
		}

		const { query } = TABS[selectedTab]

		setQueryParams({
			client: subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
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
				reviewerIDs: [localStorage.getItem('id')],
			},
			fetchPolicy: 'network-only',
		})

	}, [currentPage, workspace, accountData?.address, selectedTab])

	useEffect(() => {
		/// console.log(pk);
		if(!accountData?.address) {
			return
		}

		if(!workspace) {
			return
		}

		const k = workspace?.members?.find(
			(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
		)?.publicKey?.toString()
		// console.log(k);
		if(k && k.length > 0) {
			setPk(k)
		} else {
			setPk('')
		}

	}, [workspace, accountData])

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
			console.log('data.grants', data.data.grants)
			if(
				grants.length > 0
        && grants[0].workspace.id === data.data.grants[0].workspace.id
        && grants[0].id !== data.data.grants[0].id
			) {
				setGrants([...grants, ...data.data.grants])
			} else {
				setGrants(data.data.grants)
			}
		}

	}, [data])

	const allGrantsReviewerData = useGetAllGrantsForReviewerQuery(queryReviewerParams)
	useEffect(() => {
		if(!workspace) {
			return
		}

		setGrantsReviewer([])
		setCurrentPage(0)

	}, [workspace, selectedTab])

	useEffect(() => {
		if(allGrantsReviewerData.data && allGrantsReviewerData.data.grantApplications
       && allGrantsReviewerData.data.grantApplications.length > 0) {
			console.log('data.grantsReviewer.raw', allGrantsReviewerData.data.grantApplications)
			// eslint-disable-next-line max-len
			const newReviewerData = removeDuplicates(allGrantsReviewerData.data.grantApplications)

			console.log('data.grantsReviewer', newReviewerData)

			setGrantsReviewer(newReviewerData)
		}

	}, [allGrantsReviewerData])

	const [addFundsIsOpen, setAddFundsIsOpen] = React.useState(false)
	const [grantForFunding, setGrantForFunding] = React.useState(null)
	const [grantRewardAsset, setGrantRewardAsset] = React.useState<any>(null)

	const initialiseFundModal = async(grant: any) => {
		setAddFundsIsOpen(true)
		setGrantForFunding(grant.id)
		let chainInfo
		let tokenIcon
		if(grant.reward.token) {
			tokenIcon = getUrlForIPFSHash(grant.reward.token?.iconHash)
			chainInfo = {
				address: grant.reward.token.address,
				label: grant.reward.token.label,
				decimals: grant.reward.token.decimal,
				icon: tokenIcon,
			}
		} else {
			chainInfo = CHAIN_INFO[
				getSupportedChainIdFromSupportedNetwork(
					grant.workspace.supportedNetworks[0],
				)
			]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
		}

		// const chainInfo = CHAIN_INFO[
		//   getSupportedChainIdFromSupportedNetwork(
		//     grant.workspace.supportedNetworks[0],
		//   )
		// ]?.supportedCurrencies[grant.reward.asset.toLowerCase()];
		setGrantRewardAsset({
			address: grant.reward.asset,
			committed: BigNumber.from(grant.reward.committed),
			label: chainInfo?.label ?? 'LOL',
			icon: chainInfo?.icon ?? '/images/dummy/Ethereum Icon.svg',
		})
	}

	const handleScroll = useCallback(() => {
		const { current } = containerRef
		if(!current) {
			return
		}

		const parentElement = (current as HTMLElement)?.parentNode as HTMLElement
		const reachedBottom = Math.abs(
			parentElement.scrollTop
      - (parentElement.scrollHeight - parentElement.clientHeight),
		) < 10
		if(reachedBottom) {
			setCurrentPage(currentPage + 1)
		}
	}, [containerRef, currentPage])

	const getEmptyStateForSelectedTab = () => (
		TABS[selectedTab]?.emptyState()
	)

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

	return (
		<>
			<Flex
				ref={containerRef}
				direction="row"
				justify="center">
				<Flex
					direction="column"
					w="55%"
					alignItems="stretch"
					pb={8}
					px={10}>
					{
						isReviewer ? <Flex mt={4} /> : (
							<>
								<Heading title="Your grants" />
								<Flex
									direction="row"
									mt={4}
									mb={4}>
									{
										TABS.map((tab) => (
											<Button
												padding="8px 24px"
												borderRadius="52px"
												minH="40px"
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
												fontWeight="700"
												fontSize="16px"
												lineHeight="24px"
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
						)
					}
					{
						isAdmin && grants.length > 0
            && grants.map((grant: any) => {
            	const grantAmount = grant.reward.committed
            	let decimals
            	let icon
            	let label
            	if(grant.reward.token) {
            		// console.log('Reward has token')
            		decimals = grant.reward.token.decimal
            		label = grant.reward.token.label
            		icon = getUrlForIPFSHash(grant.reward.token.iconHash)
            	} else {
            		decimals = CHAIN_INFO[
            			getSupportedChainIdFromSupportedNetwork(
            				grant.workspace.supportedNetworks[0],
            			)
            		]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
            			?.decimals
            		label = CHAIN_INFO[
            			getSupportedChainIdFromSupportedNetwork(
            				grant.workspace.supportedNetworks[0],
            			)
            		]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
            			?.label ?? 'LOL'
            		icon = CHAIN_INFO[
            			getSupportedChainIdFromSupportedNetwork(
            				grant.workspace.supportedNetworks[0],
            			)
            		]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
            			?.icon ?? '/images/dummy/Ethereum Icon.svg'
            	}

            	return (
            		<YourGrantCard
            			grantID={grant.id}
            			key={grant.id}
            			daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
            			grantTitle={grant.title}
            			grantDesc={grant.summary}
            			numOfApplicants={grant.numberOfApplications}
            			endTimestamp={new Date(grant.deadline).getTime()}
            			grantAmount={
            				formatAmount(
            				grantAmount,
            				decimals ?? 18,
            			)
            			}
            			grantCurrency={label ?? 'LOL'}
            			grantCurrencyIcon={icon}
            			state="done"
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
            			onAddFundsClick={() => initialiseFundModal(grant)}
            			onViewApplicantsClick={
            				() => router.push({
            				pathname: '/your_grants/view_applicants/',
            				query: {
            					grantId: grant.id,
            				},
            			})
            			}
            			acceptingApplications={grant.acceptingApplications}
            			isAdmin={isAdmin}
            			initialRubrics={grant.rubric}
            			workspaceId={grant.workspace.id}
            		/>
            	)
            })
					}

					{
						isReviewer && grantsReviewer.length > 0
              && grantsReviewer.map((grant: any) => {
              	const grantAmount = grant.grant.reward.committed
              	let decimals
              	let icon
              	let label
              	if(grant.grant.reward.token) {
              		decimals = grant.grant.reward.token.decimal
              		label = grant.grant.reward.token.label
              		icon = getUrlForIPFSHash(grant.grant.reward.token.iconHash)
              	} else {
              		decimals = CHAIN_INFO[
              			getSupportedChainIdFromSupportedNetwork(
              				grant.grant.workspace.supportedNetworks[0],
              			)
              		]?.supportedCurrencies[grant.grant.reward.asset.toLowerCase()]
              			?.decimals
              		label = CHAIN_INFO[
              			getSupportedChainIdFromSupportedNetwork(
              				grant.grant.workspace.supportedNetworks[0],
              			)
              		]?.supportedCurrencies[grant.grant.reward.asset.toLowerCase()]
              			?.label ?? 'LOL'
              		icon = CHAIN_INFO[
              			getSupportedChainIdFromSupportedNetwork(
              				grant.grant.workspace.supportedNetworks[0],
              			)
              		]?.supportedCurrencies[grant.grant.reward.asset.toLowerCase()]
              			?.icon ?? '/images/dummy/Ethereum Icon.svg'
              	}

              	return (
              		<YourGrantCard
              			grantID={grant.grant.id}
              			key={grant.grant.id}
              			daoIcon={getUrlForIPFSHash(grant.grant.workspace.logoIpfsHash)}
              			grantTitle={grant.grant.title}
              			grantDesc={grant.grant.summary}
              			numOfApplicants={grant.grant.numberOfApplications}
              			endTimestamp={new Date(grant.grant.deadline).getTime()}
              			grantAmount={
              				formatAmount(
              				grantAmount,
              				decimals ?? 18,
              			)
              			}
              			grantCurrency={label ?? 'LOL'}
              			grantCurrencyIcon={icon}
              			state="done"
              			chainId={
              				getSupportedChainIdFromSupportedNetwork(
              				grant.grant.workspace.supportedNetworks[0],
              			)
              			}
              			onAddFundsClick={() => initialiseFundModal(grant.grant)}
              			onViewApplicantsClick={
              				() => router.push({
              				pathname: '/your_grants/view_applicants/',
              				query: {
              					grantId: grant.grant.id,
              				},
              			})
              			}
              			acceptingApplications={grant.grant.acceptingApplications}
              			isAdmin={isAdmin}
              			initialRubrics={grant.grant.rubric}
              			workspaceId={grant.grant.workspace.id}
              		/>
              	)
              })
					}
					{
						grants.length === 0
							&& isAdmin
							&& !grantCount[0]
							&& !grantCount[1]
							&& router.query.done
							&& <FirstGrantEmptyState />
					}
					{
						grants.length === 0
						&& isAdmin
						&& !router.query.done
						&& getEmptyStateForSelectedTab()
					}

					{
						grantsReviewer.length === 0
						&& isReviewer
						&& !grantCount[0]
						&& !grantCount[1]
						&& router.query.done
						&& <FirstGrantEmptyState />
					}
					{
						grantsReviewer.length === 0
						&& isReviewer
						&& !router.query.done
						&& getEmptyStateForSelectedTab()
					}

				</Flex>
				<Flex
					w="26%"
					pos="sticky"
					minH="calc(100vh - 80px)"
					// display={isAdmin ? undefined : 'none'}
				>
					<Sidebar
						isReviewer={isReviewer}
						showCreateGrantItem={!grantCount[0] && !grantCount[1]} />
				</Flex>
			</Flex>
			{
				grantForFunding && grantRewardAsset && (
					<AddFunds
						isOpen={addFundsIsOpen}
						onClose={() => setAddFundsIsOpen(false)}
						grantAddress={grantForFunding}
						rewardAsset={grantRewardAsset}
					/>
				)
			}

			{/* Removing Public Key Modal Temporarily */}
			{/* <AllowAccessToPublicKeyModal
				hiddenModalOpen={
					(isAdmin && (
						(allGrantsCountData !== undefined && grantCount[0] && grantCount[1])
          && (!ignorePkModal && pk.length === 0)))
          || (!isAdmin && (!ignorePkModal && pk.length === 0))
				}
				isAdmin={isAdmin}
				setIgnorePkModal={
					(val: boolean) => {
						setIgnorePkModal(val)
					}
				}
				setHiddenModalOpen={
					() => {
						window.location.reload()
					}
				}
			/> */}
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
