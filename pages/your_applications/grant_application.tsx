import React, {
	ReactElement,
	useContext,
	useEffect,
	useState,
} from 'react'
import { Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { CHAIN_INFO } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import {
	GetApplicationDetailsQuery,
	useGetApplicationDetailsQuery,
} from 'src/generated/graphql'
import { formatAmount } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import Breadcrumbs from '../../src/components/ui/breadcrumbs'
import Form from '../../src/components/your_applications/grant_application/form'
import NavbarLayout from '../../src/layout/navbarLayout'
import { GrantApplicationProps } from '../../src/types/application'
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils'
import { getAssetInfo } from '../../src/utils/tokenUtils'

function ViewApplication() {
	const apiClients = useContext(ApiClientsContext)!
	const { subgraphClients } = apiClients

	const router = useRouter()
	const [applicationID, setApplicationId] = React.useState<any>('')
	const [application, setApplication] = React.useState<GetApplicationDetailsQuery['grantApplication']>()

	const [formData, setFormData] = useState<GrantApplicationProps | null>(null)
	const [chainId, setChainId] = useState<SupportedChainId>()

	useEffect(() => {
		if(router && router.query) {
			const { chainId: cId, applicationId: aId } = router.query
			setChainId(cId as unknown as SupportedChainId)
			setApplicationId(aId)
		}
	}, [router])

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	chainId ?? SupportedChainId.RINKEBY
      ].client,
	})

	useEffect(() => {
		if(!applicationID) {
			return
		}

		if(!chainId) {
			return
		}

		setQueryParams({
			client:
        subgraphClients[chainId].client,
			variables: {
				applicationID,
			},
		})

	}, [chainId, applicationID])

	const { data, error, loading } = useGetApplicationDetailsQuery(queryParams)

	useEffect(() => {
		if(data) {
			console.log('data', data)
			setApplication(data.grantApplication)
		}

	}, [data, error, loading])

	useEffect(() => {
		if(!application || !application?.fields?.length) {
			return
		}

		const getStringField = (fieldName: string) => (
			application?.fields
				?.find(({ id }) => id.split('.')[1] === fieldName)
				?.values[0]?.value ?? ''
		)
		let decimals: number
		if(application.grant.reward.token) {
			console.log('Application milestone ', application.milestones[0])
			decimals = application.grant.reward.token.decimal
			console.log('decimals', decimals)
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
			applicantName: getStringField('applicantName'),
			applicantEmail: getStringField('applicantEmail'),
			teamMembers: +(getStringField('teamMembers') || '1'),
			membersDescription:
        fields
        	.find((f: any) => f.id.split('.')[1] === 'memberDetails')
        	?.values.map((val) => ({ description: val.value })) ?? [],
			projectName: getStringField('projectName'),
			projectLinks:
        fields
        	.find((f: any) => f.id.split('.')[1] === 'projectLink')
        	?.values.map((val) => ({ link: val.value })) ?? [],
			projectDetails: getStringField('projectDetails'),
			projectGoal: getStringField('projectGoals'),
			projectMilestones:
        application.milestones.map((ms: any) => {
        	console.log('milestone', ms.amount)
        	return (
        		{
        			milestone: ms.title,
        			// milestoneReward: ethers.utils.formatEther(ms.amount ?? '0'),
        			milestoneReward:
                application ? formatAmount(
                	ms.amount,
                	decimals ?? 18,
                	true,
                ) : '1'
        			,
        		})
        }) ?? [],
			// fundingAsk: ethers.utils.formatEther(getStringField('fundingAsk') ?? '0'),
			fundingAsk:
        application ? formatAmount(
        	getStringField('fundingAsk'),
        	decimals ?? 18,
        	true,
        ) : '1',
			fundingBreakdown: getStringField('fundingBreakdown'),
		}

		console.log('fd', fd.projectMilestones[0].milestoneReward)
		if(application?.grant?.fields?.find((field: any) => field.title === 'memberDetails') && !fd.membersDescription.length) {
			fd.membersDescription = [...Array(fd.teamMembers)].map(() => ({ description: '' }))
		}

		setFormData(fd)
	}, [application])

	let label
	let icon
	let decimals
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
		label = getAssetInfo(application?.grant?.reward?.asset ?? '', chainId)?.label
		icon = getAssetInfo(application?.grant?.reward?.asset ?? '', chainId)?.icon
	}

	return (
		<Container
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
				<Breadcrumbs path={['My Applications', 'Grant Application']} />
				<Form
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
							decimals ?? 18,
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
            ?? ''
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
            ?? []
					}
					piiFields={
						application?.grant?.fields?.filter((field: any) => field.isPii).map((field: any) => field.id.split('.')[1])
            ?? []
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
