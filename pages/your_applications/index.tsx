import React, {
	ReactElement, useCallback, useContext, useEffect, useRef,
} from 'react'
import {
	Container, Flex,
} from '@chakra-ui/react'
import BN from 'bn.js'
import { useRouter } from 'next/router'
import Empty from 'src/components/ui/empty'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import { GrantApplication, useGetMyApplicationsLazyQuery } from 'src/generated/graphql'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'
import Heading from '../../src/components/ui/heading'
import YourApplicationCard from '../../src/components/your_applications/yourApplicationCard'
import NavbarLayout from '../../src/layout/navbarLayout'
import { formatAmount, getChainIdFromResponse, getFormattedDateFromUnixTimestamp } from '../../src/utils/formattingUtils'
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils'
import { ApiClientsContext } from '../_app'

const PAGE_SIZE = 20

function YourApplications() {
	const router = useRouter()
	// const [applicantID, setApplicantId] = React.useState<any>('');
	// const subgraphClient = useContext(ApiClientsContext)?.subgraphClient;
	const { subgraphClients } = useContext(ApiClientsContext)!
	const [myApplications, setMyApplications] = React.useState<any>([])

	const containerRef = useRef(null)
	const { data: accountData } = useAccount()
	const [currentPage, setCurrentPage] = React.useState(0)
	// modified for testing
	const allNetworkApplications = Object.keys(subgraphClients)!.map((key) => (

		useGetMyApplicationsLazyQuery({ client: subgraphClients[key].client })
	))


	const getMyApplicationsData = async() => {
		try {
			const promises = allNetworkApplications.map((allApplications) => (
				// eslint-disable-next-line no-async-promise-executor
				new Promise(async(resolve) => {
					try {
						const { data } = await allApplications[0]({
							variables: {
								first: PAGE_SIZE,
								skip: currentPage * PAGE_SIZE,
								applicantID: accountData?.address || '',
							},
						})
						if(data && data.grantApplications) {
							resolve(data.grantApplications)
						} else {
							resolve([])
						}
					} catch(err) {
						resolve([])
					}
				})
			))
			Promise.all(promises).then((values: any[]) => {
				const allApplicationsData = [].concat(...values)
				allApplicationsData
					.sort((a: GrantApplication, b: GrantApplication) => b.createdAtS - a.createdAtS)
				setMyApplications([...myApplications, ...allApplicationsData])
				setCurrentPage(currentPage + 1)
			})
		} catch(e) {
			// console.log('error in fetching my applications ', e);
		}
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
			getMyApplicationsData()
		}
	}, [containerRef, getMyApplicationsData])

	useEffect(() => {
		if(!accountData) {
			return
		}

		getMyApplicationsData()

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

	return (
		<Container
			ref={containerRef}
			maxW="100%"
			display="flex"
			px="70px">
			<Container
				flex={1}
				display="flex"
				flexDirection="column"
				maxW="834px"
				alignItems="stretch"
				pb={8}
				px={10}
			>
				<Heading title="My Applications" />

				{
					myApplications.length > 0
          && myApplications.map((application: any) => (
          	(
          		<YourApplicationCard
          			key={application.id}
          			grantTitle={application.grant.title}
          			daoName={application.grant.workspace.title}
          			daoIcon={getUrlForIPFSHash(application.grant.workspace.logoIpfsHash)}
          			isGrantVerified={(new BN(application.grant.funding)).gt(new BN(0))}
          			funding={
          				formatAmount(
          				application.grant.funding,
          				CHAIN_INFO[
          					getSupportedChainIdFromSupportedNetwork(
          						application.grant.workspace.supportedNetworks[0],
          					)
          				]?.supportedCurrencies[application.grant.reward.asset.toLowerCase()]
          					?.decimals ?? 18,
          			)
          			}
          			currency={
          				CHAIN_INFO[
          				getSupportedChainIdFromSupportedNetwork(
          					application.grant.workspace.supportedNetworks[0],
          				)
          			]?.supportedCurrencies[application.grant.reward.asset.toLowerCase()]
          				?.label ?? 'LOL'
          			}
          			isDaoVerified={false}
          			status={application.state}
          			sentDate={getFormattedDateFromUnixTimestamp(application?.createdAtS)}
          			updatedDate={getFormattedDateFromUnixTimestamp(application?.updatedAtS)}
          			onViewGrantClick={
          				() => router.push({
          				pathname: '/explore_grants/about_grant',
          				query: {
          					grantId: application.grant.id,
          					chainId: getChainIdFromResponse(
          						application.grant.workspace.supportedNetworks[0],
          					),
          				},
          			})
          			}
          			onViewApplicationClick={
          				() => router.push({
          				pathname: '/your_applications/grant_application',
          				query: {
          					applicationId: application.id,
          					chainId: getChainIdFromResponse(
          						application.grant.workspace.supportedNetworks[0],
          					),
          				},
          			})
          			}
          			onManageGrantClick={
          				() => router.push({
          				pathname: '/your_applications/manage_grant',
          				query: {
          					applicationId: application.id,
          					chainId: getChainIdFromResponse(
          						application.grant.workspace.supportedNetworks[0],
          					),
          				},
          			})
          			}
          		/>
          	)
          ))
				}

				{
					myApplications.length === 0 && (
						<Flex
							direction="column"
							mt={14}
							align="center">
							<Empty
								src="/illustrations/empty_states/no_applications.svg"
								imgHeight="134px"
								imgWidth="147px"
								title="No applications"
								subtitle="All your grant applications are shown here. Discover grants on our home page."
							/>
						</Flex>
					)
				}

			</Container>
		</Container>
	)
}

YourApplications.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default YourApplications
