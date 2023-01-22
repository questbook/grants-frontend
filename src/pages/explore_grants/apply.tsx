import React, {
	ReactElement, useContext, useEffect, useState,
} from 'react'
import { Flex } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { useRouter } from 'next/router'
import Form from 'src/components/explore_grants/apply_grant/form'
import Sidebar from 'src/components/explore_grants/apply_grant/sidebar'
import { defaultChainId } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import config from 'src/constants/config.json'
import { useSafeContext } from 'src/contexts/SafeContext'
import { useGetGrantDetailsQuery } from 'src/generated/graphql'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import getAvatar from 'src/utils/avatarUtils'
import { formatAmount } from 'src/utils/formattingUtils'
import verify from 'src/utils/grantUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import logger from 'src/utils/logger'
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
	// const [safeChainId, setSafeChainId] = useState<string | undefined>(defaultChainId.toString())
	const [grantRequiredFields, setGrantRequiredFields] = useState<any[]>([])
	const [chainId, setChainId] = useState<SupportedChainId>()
	const [acceptingApplications, setAcceptingApplications] = useState(true)
	const [shouldShowButton, setShouldShowButton] = useState(false)
	const { network, switchNetwork } = useNetwork()
	const { safeObj, setSafeObj } = useSafeContext()

	useEffect(() => {
		if(router?.query) {
			const { chainId: cId, grantId: gId } = router.query
			if(typeof cId === 'string' && typeof gId === 'string') {
				setChainId(cId as unknown as SupportedChainId)
				setGrantID(gId)
			}
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
		if(!grantData) {
			return
		}

		const localChainId = getSupportedChainIdFromSupportedNetwork(
			grantData.workspace.supportedNetworks[0],
		)

		if(network !== localChainId) {
			logger.info('SWITCH NETWORK (apply.tsx 1): ', localChainId)
			switchNetwork(localChainId)
		}


	}, [network, grantData])

	useEffect(() => {
		if(data?.grants?.length) {
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
		logger.info({ chainId: grantData?.workspace?.safe?.address, grantData }, 'safe chainid')
		const currentSafe = new SupportedPayouts().getSafe(parseInt(grantData?.workspace?.safe?.chainId!), grantData?.workspace?.safe?.address!)
		setSafeObj(currentSafe)
		setDaoId(grantData?.workspace?.id)
		setDaoLogo(grantData?.workspace?.logoIpfsHash === config.defaultDAOImageHash ?
			getAvatar(true, grantData?.workspace?.title) :
			getUrlForIPFSHash(grantData?.workspace?.logoIpfsHash))
		setRewardAmount(
			grantData?.reward?.committed
				? parseInt(
					formatAmount(
						grantData?.reward?.committed,
						chainInfo?.decimals,
						false, false, false
					)
				).toString()
				: '',
		)

		let supportedCurrencyObj
		if(grantData.reward.token) {
			setRewardCurrency(chainInfo.label)
			setRewardCurrencyCoin(grantData.reward.token.iconHash)
			setRewardDecimal(chainInfo.decimals)
		} else {

			supportedCurrencyObj = getAssetInfo(
				grantData?.reward?.asset?.toLowerCase(),
				chainId,
			)
		}

		// supportedCurrencyObj = getAssetInfo(grantData?.reward?.asset?.toLowerCase(), chainId);
		// // console.log('curr', supportedCurrencyObj);
		if(supportedCurrencyObj) {
			setRewardCurrency(supportedCurrencyObj?.label)
			setRewardCurrencyCoin(supportedCurrencyObj?.icon)
			setRewardCurrencyAddress(grantData?.reward?.asset?.toLowerCase())
		}
		// // console.log(grantData);

		setGrantDetails(grantData?.details)
		setGrantSummary(grantData?.summary)
		setGrantRequiredFields(grantData?.fields)
		setAcceptingApplications(grantData?.acceptingApplications)
		setSafeObj(currentSafe)

	}, [grantData])

	useEffect(() => {
		setShouldShowButton(daoId === workspace?.id)
	}, [daoId, workspace])

	return (
		<Flex
			direction='row'
			w='100%'
			// px="10%"
			justify='space-evenly'>
			<Flex
				direction='column'
				w='50%'
			>
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
					safeNetwork={safeObj?.chainId}
					grantRequiredFields={grantRequiredFields.map((field: any) => field.id.split('.')[1])}
					piiFields={grantRequiredFields.filter((field: any) => field.isPii).map((field: any) => field.id.split('.')[1])}
					acceptingApplications={acceptingApplications}
					shouldShowButton={shouldShowButton}
					defaultMilestoneFields={
						grantData?.fields?.map((field: any) => {
						// // console.log(field);
						// // console.log(field.title.startsWith('defaultMilestone'));
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
				direction='column'
				w='50%'>
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
