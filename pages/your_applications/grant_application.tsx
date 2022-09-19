import React, {
	ReactElement,
	useContext,
	useEffect,
	useState,
} from 'react'
import { Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import Form from 'src/components/your_applications/grant_application/form'
import { CHAIN_INFO, defaultChainId, USD_ASSET, USD_ICON } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import {
	GetApplicationDetailsQuery,
	useGetApplicationDetailsQuery,
} from 'src/generated/graphql'
import NavbarLayout from 'src/layout/navbarLayout'
import { GrantApplicationProps } from 'src/types/application'
import { formatAmount, getFieldString } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { useEncryptPiiForApplication } from 'src/utils/pii'
import { getAssetInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

function ViewApplication() {
	const apiClients = useContext(ApiClientsContext)!
	const { webwallet, scwAddress } = useContext(WebwalletContext)!
	const { subgraphClients } = apiClients

	const router = useRouter()
	const [applicationID, setApplicationId] = React.useState<any>('')
	const [application, setApplication] = React.useState<GetApplicationDetailsQuery['grantApplication']>()

	const [formData, setFormData] = useState<GrantApplicationProps | null>(null)
	const [chainId, setChainId] = useState<SupportedChainId>()

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	chainId || defaultChainId
      ].client,
	})

	const {
		data: data,
		refetch: refetchApplicationDetails,
	} = useGetApplicationDetailsQuery({
		client:
        subgraphClients[
        	chainId || defaultChainId
        ].client,
		variables: {
			applicationID,
		},
	})
	const grantId = data?.grantApplication?.grant?.id
	const applicantPublicKey = scwAddress?.toLowerCase() === data?.grantApplication?.applicantId?.toLowerCase()
		? webwallet?.publicKey
		: data?.grantApplication?.applicantPublicKey || undefined

	const { decrypt } = useEncryptPiiForApplication(
		grantId,
		applicantPublicKey,
		chainId || defaultChainId
	)

	useEffect(() => {
		if(router?.query) {
			const { chainId: cId, applicationId: aId } = router.query
			setChainId(cId as unknown as SupportedChainId)
			setApplicationId(aId)
		}
	}, [router])

	useEffect(() => {
		if(!applicationID) {
			return
		}

		if(!chainId) {
			return
		}

		setQueryParams({
			client: subgraphClients[chainId].client,
			variables: {
				applicationID,
			},
		})

	}, [chainId, applicationID])

	useEffect(() => {
		// decrypt grant application if required and set it
		decrypt(data?.grantApplication)
			.then(setApplication)
	}, [data, decrypt])

	useEffect(() => {
		if(!application || !application?.fields?.length) {
			return
		}
		console.log('application data', application)
		let decimals: number
		if(application.grant.reward.token) {
			// console.log('Application milestone ', application.milestones[0])
			decimals = application.grant.reward.token.decimal
			// console.log('decimals', decimals)
		} else {
			decimals = CHAIN_INFO[
				getSupportedChainIdFromSupportedNetwork(
					application.grant.workspace.supportedNetworks[0],
				)
			]?.supportedCurrencies[application.grant.reward.asset.toLowerCase()]
				?.decimals
		}

		const fields = application?.fields
		const fd: GrantApplicationProps = {
			applicantName: getFieldString(application, 'applicantName'),
			applicantEmail: getFieldString(application, 'applicantEmail'),
			applicantAddress: getFieldString(application, 'applicantAddress'),
			teamMembers: +(getFieldString(application, 'teamMembers') || '1'),
			membersDescription:
        fields
        	.find((f: any) => f.id.split('.')[1] === 'memberDetails')
        	?.values.map((val) => ({ description: val.value })) || [],
			projectName: getFieldString(application, 'projectName'),
			projectLinks:
        fields
        	.find((f: any) => f.id.split('.')[1] === 'projectLink')
        	?.values.map((val) => ({ link: val.value })) || [],
			projectDetails: getFieldString(application, 'projectDetails'),
			projectGoal: getFieldString(application, 'projectGoals'),
			projectMilestones:
        application.milestones.map((ms: any) => {
        	return (
        		{
        			milestone: ms.title,
        			// milestoneReward: ethers.utils.formatEther(ms.amount || '0'),
        			milestoneReward:
                application ? formatAmount(
                	ms.amount,
                	decimals,
                	true,
                ) : '1'
        			,
        		})
        }) || [],
			// fundingAsk: ethers.utils.formatEther(getStringField('fundingAsk') || '0'),
			fundingAsk:
        application && getFieldString(application, 'fundingAsk') ? formatAmount(
        	getFieldString(application, 'fundingAsk'),
        	decimals,
        	true,
        ) : '1',
			fundingBreakdown: getFieldString(application, 'fundingBreakdown'),
		}

		if(application?.grant?.fields?.find((field: any) => field.title === 'memberDetails') && !fd.membersDescription.length) {
			fd.membersDescription = [...Array(fd.teamMembers)].map(() => ({ description: '' }))
		}

		setFormData(fd)
	}, [application])

	let label
	let icon
	let decimals
	if(application?.grant.reward.asset === USD_ASSET){
		label = 'USD'
		icon = USD_ICON
	}
	if(application?.grant.reward.token) {
		decimals = application.grant.reward.token.decimal
		label = application.grant.reward.token.label
		icon = getUrlForIPFSHash(application.grant.reward.token.iconHash)
	} else {
		decimals = CHAIN_INFO[
			getSupportedChainIdFromSupportedNetwork(
        application?.grant.workspace.supportedNetworks[0]!,
			)
		]?.supportedCurrencies[application?.grant.reward.asset.toLowerCase()!]
			?.decimals
		label = getAssetInfo(application?.grant?.reward?.asset || '', chainId)?.label
		icon = getAssetInfo(application?.grant?.reward?.asset || '', chainId)?.icon
	}

	return (
		<Container
			maxW='100%'
			display='flex'
			px='70px'>
			<Container
				flex={1}
				display='flex'
				flexDirection='column'
				maxW='834px'
				alignItems='stretch'
				pb={8}
				px={10}
			>
				<Form
					grantID={application?.grant.id}
					chainId={
						application ? getSupportedChainIdFromSupportedNetwork(
            application!.grant.workspace.supportedNetworks[0],
						) : undefined
					}
					onSubmit={
						application && application?.state !== 'resubmit'
							? null
						// eslint-disable-next-line @typescript-eslint/no-shadow
							: ({ data }) => {
								router.push({
									pathname: '/your_applications',
									query: {
										applicantID: data[0].applicantId,
										account: true,
									},
								})
							}
					}
					rewardAmount={
						application ? formatAmount(
							application.grant.reward.committed,
							decimals,
						) : '1'
					}
					rewardCurrency={label}
					rewardCurrencyCoin={icon}
					rewardCurrencyAddress={application?.grant?.reward?.asset}
					formData={formData}
					application={application}
					grantTitle={application?.grant?.title || ''}
					sentDate={
						application?.createdAtS.toString()
            || ''
					}
					daoLogo={
						getUrlForIPFSHash(
							application?.grant?.workspace?.logoIpfsHash || '',
						)
					}
					state={application?.state || ''}
					feedback={application?.feedbackDao || ''}
					grantRequiredFields={
						application?.grant?.fields?.map((field: any) => field.id.split('.')[1])
            || []
					}
					piiFields={
						application?.grant?.fields?.filter((field: any) => field.isPii).map((field: any) => field.id.split('.')[1])
            || []
					}
					applicationID={applicationID}
					workspace={application?.grant?.workspace}
				/>
			</Container>
		</Container>
	)
}

ViewApplication.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ViewApplication
