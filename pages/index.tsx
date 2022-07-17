import React, {
	ReactElement,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Flex, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import GrantCard from 'src/components/browse_grants/grantCard'
import Sidebar from 'src/components/browse_grants/sidebar'
import Heading from 'src/components/ui/heading'
import Loader from 'src/components/ui/loader'
import {
	GetAllGrantsQuery,
	useGetAllGrantsLazyQuery,
} from 'src/generated/graphql'
import NavbarLayout from 'src/layout/navbarLayout'
import { formatAmount } from 'src/utils/formattingUtils'
import { unixTimestampSeconds } from 'src/utils/generics'
import verify from 'src/utils/grantUtils'
import { extractInviteInfo, InviteInfo } from 'src/utils/invite'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getChainInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import AcceptInviteModal from 'src/v2/components/AcceptInviteModal'
import { useAccount, useConnect } from 'wagmi'

const PAGE_SIZE = 40

function BrowseGrants() {
	const containerRef = useRef(null)
	const { data: accountData } = useAccount()
	const { isDisconnected } = useConnect()
	const router = useRouter()
	const { subgraphClients, connected } = useContext(ApiClientsContext)!

	const allNetworkGrants = Object.keys(subgraphClients)!.map((key) => useGetAllGrantsLazyQuery({ client: subgraphClients[key].client }))

	const toast = useToast()
	const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([])
	const [loading, setLoading] = useState<Boolean>(false)
	const [allDataFetched, setAllDataFectched] = useState<Boolean>(false)

	const [currentPage, setCurrentPage] = useState(0)

	const [inviteInfo, setInviteInfo] = useState<InviteInfo>()

	const getGrantData = async(firstTime: boolean = false) => {
		setLoading(true)
		try {
			const currentPageLocal = firstTime ? 0 : currentPage
			const promises = allNetworkGrants.map(
				// eslint-disable-next-line no-async-promise-executor
				(allGrants) => new Promise(async(resolve) => {
					// console.log('calling grants');
					try {
						const { data } = await allGrants[0]({
							variables: {
								first: PAGE_SIZE,
								skip: currentPageLocal * PAGE_SIZE,
								applicantId: accountData?.address || '',
								minDeadline: unixTimestampSeconds(),
							},
						})
						if(data && data.grants) {
							const filteredGrants = data.grants.filter(
								(grant) => grant.applications.length === 0
							)
							resolve(filteredGrants)
						} else {
							resolve([])
						}
					} catch(err) {
						resolve([])
					}
				})
			)
			Promise.all(promises).then((values: any[]) => {
				const allGrantsData = [].concat(
					...values
				) as GetAllGrantsQuery['grants']
				if(allGrantsData.length < PAGE_SIZE) {
					setAllDataFectched(true)
				}

				if(firstTime) {
					setGrants(
						allGrantsData.sort((a: any, b: any) => b.createdAtS - a.createdAtS)
					)

					setLoading(false)
				} else {
					setGrants(
						[...grants, ...allGrantsData].sort(
							(a: any, b: any) => b.createdAtS - a.createdAtS
						)
					)
					setLoading(false)
				}

				setCurrentPage(firstTime ? 1 : currentPage + 1)
				// @TODO: Handle the case where a lot of the grants are filtered out.
			})
		} catch(e) {
			// console.log(e);
			toast({
				title: 'Error loading grants',
				status: 'error',
			})
		}
	}

	const handleScroll = useCallback(() => {
		const { current } = containerRef
		if(!current) {
			return
		}

		const parentElement = (current as HTMLElement)?.parentNode as HTMLElement
		const reachedBottom = Math.abs(
			parentElement.scrollHeight -
			parentElement.clientHeight -
			parentElement.scrollTop
		) < 10
		if(reachedBottom) {
			getGrantData()
		}
	}, [containerRef, getGrantData])

	useEffect(() => {
		// setCurrentPage(0);
		getGrantData(true)
	}, [accountData?.address])

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

	useEffect(() => {
		try {
			const inviteInfo = extractInviteInfo()
			console.log('invite ', inviteInfo)
			if(inviteInfo) {
				setInviteInfo(inviteInfo)
			}
		} catch(error: any) {
			console.error('invalid invite ', error)
			toast({
				title: `Invalid invite "${error.message}"`,
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
		}
	}, [])

	return (
		<Flex
			w="100%"
			ref={containerRef}
			direction="row"
			justify="center"
		>
			<Flex
				p="0"
				paddingInline="0"
				direction="column"
				w="55%"
				alignItems="stretch"
				pb={8}
			>
				<Flex
					borderX="1px solid #E8E9E9"
					p="1.5rem"
				>
					<Heading
						dontRenderDivider
						title="Browse grants"
						mt="0"
					/>
				</Flex>

				{
					<>
						{
							grants.length > 0 &&
              grants.map((grant) => {
              	const chainId = getSupportedChainIdFromSupportedNetwork(
              		grant.workspace.supportedNetworks[0]
              	)
              	const chainInfo = getChainInfo(grant, chainId)

              	const [isGrantVerified, funding] = verify(
              		grant.funding,
              		chainInfo?.decimals
              	)

              	return (
              		<GrantCard
              			daoID={grant.workspace.id}
              			key={grant.id}
              			grantID={grant.id}
              			daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
              			daoName={grant.workspace.title}
              			isDaoVerified={false}
              			grantTitle={grant.title}
              			grantDesc={grant.summary}
              			numOfApplicants={grant.numberOfApplications}
              			endTimestamp={new Date(grant.deadline!).getTime()}
              			createdAt={grant.createdAtS}
              			grantAmount={
              				formatAmount(
              					grant.reward.committed,
              					chainInfo?.decimals || 18
              				)
              			}
              			disbursedAmount={
              				formatAmount(
              					grant.funding,
              					chainInfo?.decimals || 18
              				)
              			}
              			grantCurrency={chainInfo?.label || 'LOL'}
              			grantCurrencyIcon={chainInfo?.icon || '/images/dummy/Ethereum Icon.svg'}
              			grantCurrencyPair={chainInfo?.pair!}
              			isGrantVerified={isGrantVerified}
              			funding={funding}
              			chainId={chainId}
              			onClick={
              				() => {
              					if(!(accountData && accountData.address)) {
              						router.push({
              							pathname: '/connect_wallet',
              							query: {
              								flow: '/',
              								grantId: grant.id,
              								chainId,
              							},
              						})
              						return
              					}

              				router.push({
              						pathname: '/explore_grants/about_grant',
              						query: {
              							grantId: grant.id,
              							chainId,
              						},
              					})
              				}
              			}
              			onTitleClick={
              				() => {
              					router.push({
              						pathname: '/explore_grants/about_grant',
              						query: {
              							grantId: grant.id,
              							chainId,
              						},
              					})
              				}
              			}
              		/>
              	)
              })
						}
						{loading ? <Loader /> : allDataFetched || <></>}
					</>
				}
			</Flex>
			{
				!connected && isDisconnected && (
					<Flex
						w="26%"
						pos="sticky"
						top={0}>
						<Sidebar />
					</Flex>
				)
			}
			<AcceptInviteModal
				inviteInfo={inviteInfo}
				onClose={
					() => {
						setInviteInfo(undefined)
						window.history.pushState(undefined, '', '/')
					}
				} />
		</Flex>
	)
}

BrowseGrants.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout renderGetStarted>
			{page}
		</NavbarLayout>
	)
}

export default BrowseGrants
