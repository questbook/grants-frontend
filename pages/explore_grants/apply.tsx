import React, {
	ReactElement, useContext, useEffect, useState,
} from 'react'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Form from 'src/components/explore_grants/apply_grant/form'
import Sidebar from 'src/components/explore_grants/apply_grant/sidebar'
import { defaultChainId } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import { useGetGrantDetailsQuery } from 'src/generated/graphql'
import NavbarLayout from 'src/layout/navbarLayout'
import { formatAmount } from 'src/utils/formattingUtils'
import verify from 'src/utils/grantUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getAssetInfo, getChainInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

function ApplyGrant() {
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const router = useRouter()
	const [grantData, setGrantData] = useState<any>(null)
	const [grantID, setGrantID] = useState<any>('')
	const [title, setTitle] = useState('')
	const [daoId, setDaoId] = useState('')
	const [daoLogo, setDaoLogo] = useState('')
	const [isGrantVerified, setIsGrantVerified] = useState(false)
	const [funding, setFunding] = useState('')
	const [rewardAmount, setRewardAmount] = useState('')
	const [rewardCurrency, setRewardCurrency] = useState('')
	const [rewardDecimal, setRewardDecimal] = useState<number | undefined>(undefined)
	const [rewardCurrencyCoin, setRewardCurrencyCoin] = useState('')
	const [rewardCurrencyAddress, setRewardCurrencyAddress] = useState()
	const [grantDetails, setGrantDetails] = useState('')
	const [grantSummary, setGrantSummary] = useState('')
	const [workspaceId, setWorkspaceId] = useState('')
	const [grantRequiredFields, setGrantRequiredFields] = useState<any[]>([])
	const [chainId, setChainId] = useState<SupportedChainId>()
	const [acceptingApplications, setAcceptingApplications] = useState(true)
	const [shouldShowButton, setShouldShowButton] = useState(false)

	useEffect(() => {
		if(router && router.query) {
			const { chainId: cId, grantId: gId } = router.query
			setChainId(cId as unknown as SupportedChainId)
			setGrantID(gId)
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	chainId || defaultChainId
      ].client,
	})

	useEffect(() => {
		if(!grantID) {
			return
		}

		if(!chainId) {
			return
		}

		setQueryParams({
			client:
        subgraphClients[chainId].client,
			variables: {
				grantID,
			},
		})

	}, [chainId, grantID])

	const { data, error, loading } = useGetGrantDetailsQuery(queryParams)

	useEffect(() => {
		if(data && data.grants && data.grants.length > 0) {
			setGrantData(data.grants[0])
		}

	}, [data, error, loading])

	useEffect(() => {
		if(!grantData) {
			return
		}

		const localChainId = getSupportedChainIdFromSupportedNetwork(
			grantData.workspace.supportedNetworks[0],
		)
		const chainInfo = getChainInfo(grantData, localChainId)

		// const chainInfo = CHAIN_INFO[localChainId]
		//   ?.supportedCurrencies[grantData?.reward.asset.toLowerCase()];
		const [localIsGrantVerified, localFunding] = verify(grantData?.funding, chainInfo.decimals)

		setIsGrantVerified(localIsGrantVerified)
		setFunding(localFunding)
		setChainId(localChainId)
		setTitle(grantData?.title)
		setWorkspaceId(grantData?.workspace?.id)
		setDaoId(grantData?.workspace?.id)
		setDaoLogo(getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash))
		setRewardAmount(
			grantData?.reward?.committed
				? formatAmount(
					grantData?.reward?.committed,
					chainInfo?.decimals || 18,
				)
				: '',
		)

		let supportedCurrencyObj
		if(grantData.reward.token) {
			setRewardCurrency(chainInfo.label)
			setRewardCurrencyCoin(chainInfo.icon)
			setRewardDecimal(chainInfo.decimals)
		} else {
			supportedCurrencyObj = getAssetInfo(
				grantData?.reward?.asset?.toLowerCase(),
				chainId,
			)
		}

		// supportedCurrencyObj = getAssetInfo(grantData?.reward?.asset?.toLowerCase(), chainId);
		// console.log('curr', supportedCurrencyObj);
		if(supportedCurrencyObj) {
			setRewardCurrency(supportedCurrencyObj?.label)
			setRewardCurrencyCoin(supportedCurrencyObj?.icon)
			setRewardCurrencyAddress(grantData?.reward?.asset?.toLowerCase())
		}
		// console.log(grantData);

		setGrantDetails(grantData?.details)
		setGrantSummary(grantData?.summary)
		setGrantRequiredFields(grantData?.fields)
		setAcceptingApplications(grantData?.acceptingApplications)

	}, [grantData])

	useEffect(() => {
		setShouldShowButton(daoId === workspace?.id)
	}, [daoId, workspace])

	return (
		<Flex
			direction="row"
			w="100%"
			// px="10%"
			justify="space-evenly">
			<Flex
				direction="column"
				w="50%"
				h="100%">
				<Form
					chainId={chainId}
					title={title}
					grantId={grantID}
					daoLogo={daoLogo}
					isGrantVerified={isGrantVerified}
					funding={funding}
					rewardAmount={rewardAmount}
					rewardCurrency={rewardCurrency}
					rewardDecimal={rewardDecimal}
					rewardCurrencyCoin={rewardCurrencyCoin}
					rewardCurrencyAddress={rewardCurrencyAddress}
					workspaceId={workspaceId}
					grantRequiredFields={grantRequiredFields.map((field: any) => field.id.split('.')[1])}
					piiFields={grantRequiredFields.filter((field: any) => field.isPii).map((field: any) => field.id.split('.')[1])}
					members={grantData?.workspace?.members}
					acceptingApplications={acceptingApplications}
					shouldShowButton={shouldShowButton}
					defaultMilestoneFields={
						grantData?.fields?.map((field: any) => {
						// console.log(field);
						// console.log(field.title.startsWith('defaultMilestone'));
							if(field.title.startsWith('defaultMilestone')) {
								const i = field.title.indexOf('-')
								if(i !== -1) {
									return (
										{
											detail: field.title.substring(i + 1).split('\\s').join(' '),
										}
									)
								}
							}

							return null
						}).filter((field: any) => field !== null)
					}
				/>
			</Flex>

			<Flex
				direction="column"
				w="50%">
				<Sidebar
					grantSummary={grantSummary}
					grantDetails={grantDetails} />
			</Flex>

		</Flex>
	)
}

ApplyGrant.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ApplyGrant
