import React, {
	ReactElement,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Container } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Breadcrumbs from 'src/components/ui/breadcrumbs'
import Form from 'src/components/your_grants/edit_grant/form'
import Sidebar from 'src/components/your_grants/edit_grant/sidebar'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import { useGetGrantDetailsQuery } from 'src/generated/graphql'
import useEditGrant from 'src/hooks/useEditGrant'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import NavbarLayout from 'src/layout/navbarLayout'
import { formatAmount } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function EditGrant() {
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!

	const router = useRouter()

	const grantInfoRef = useRef(null)
	const detailsRef = useRef(null)
	const applicationDetailsRef = useRef(null)
	const grantRewardsRef = useRef(null)

	const [currentStep, setCurrentStep] = useState(0)
	const [grantID, setGrantID] = useState<string>()

	const [formData, setFormData] = useState<any>(null)

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) || defaultChainId
      ].client,
	})

	useEffect(() => {
		if(!workspace) {
			return
		}

		setQueryParams({
			client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: { grantID },
		})

	}, [grantID, workspace])

	const {
		data,
		error,
		loading: queryLoading,
	} = useGetGrantDetailsQuery(queryParams)

	const getDecodedDetails = async(detailsHash: string, grant: any) => {
		// console.log(detailsHash)
		const d = await getFromIPFS(detailsHash)
		let reward
		let rewardCurrency
		let rewardCurrencyAddress
		// console.log('grant token while editing grant', grant)
		if(grant.reward.token) {
			reward = ethers.utils.formatUnits(
				grant.reward.committed,
				grant.reward.token.decimal,
			).toString()
			rewardCurrency = grant.reward.token.label
			rewardCurrencyAddress = grant.reward.token.address
		} else {
			reward = formatAmount(
				grant.reward.committed,
				CHAIN_INFO[
					getSupportedChainIdFromSupportedNetwork(
						grant.workspace.supportedNetworks[0],
					)
				]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
					?.decimals || 18,
				true,
			)
			rewardCurrency = CHAIN_INFO[
				getSupportedChainIdFromSupportedNetwork(
					grant.workspace.supportedNetworks[0],
				)
			]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.label || 'LOL'
			rewardCurrencyAddress = CHAIN_INFO[
				getSupportedChainIdFromSupportedNetwork(
					grant.workspace.supportedNetworks[0],
				)
			]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.address
		}

		const fd = {
			title: grant.title,
			summary: grant.summary,
			details: d,
			applicantName:
        grant.fields.find((field: any) => field.id.includes('applicantName')) !== undefined,
			applicantEmail:
        grant.fields.find((field: any) => field.id.includes('applicantEmail')) !== undefined,
			applicantAddress: grant.fields.find((field: any) => field.id.includes('applicantAddress')) !== undefined,
			teamMembers:
        grant.fields.find((field: any) => field.id.includes('teamMembers')) !== undefined,
			projectName:
        grant.fields.find((field: any) => field.id.includes('projectName')) !== undefined,
			projectGoals:
        grant.fields.find((field: any) => field.id.includes('projectGoals')) !== undefined,
			projectDetails:
        grant.fields.find((field: any) => field.id.includes('projectDetails')) !== undefined,
			projectLink:
        grant.fields.find((field: any) => field.id.includes('projectLink')) !== undefined,
			isMultipleMilestones:
        grant.fields.find((field: any) => field.id.includes('isMultipleMilestones')) !== undefined,
			fundingBreakdown:
        grant.fields.find((field: any) => field.id.includes('fundingBreakdown')) !== undefined,
			extraField:
        grant.fields.find((field: any) => field.id.includes('extraField'))
        !== undefined,
			reward,
			rewardCurrency,
			rewardCurrencyAddress,
			date: grant.deadline,
			rubric: grant.rubric,
			isPii: grant.fields.some((field: any) => field.isPii),
		} as any
		grant.fields
			.filter((field: any) => field.id.split('.')[1]
				.startsWith('customField'))
			.forEach((field: any) => {
				const fieldId = field.id.split('.')[1]
				fd[fieldId] = fieldId
			})

		grant.fields
			.filter((field: any) => field.id.split('.')[1]
				.startsWith('defaultMilestone'))
			.forEach((field: any) => {
				const fieldId = field.id.split('.')[1]
				fd[fieldId] = fieldId
			})

		setFormData(fd)
	}

	useEffect(() => {
		if(data && data.grants && data.grants.length > 0) {
			const grant = data.grants[0]
			if(grant.details.startsWith('Qm') && grant.details.length < 64) {
				getDecodedDetails(grant.details, grant)
				return
			}

			let reward
			let rewardCurrency
			let rewardCurrencyAddress
			// console.log('grant token while editing grant', grant)
			if(grant.reward.token) {
				// console.log('grant token while editing grant', grant)
				reward = ethers.utils.formatUnits(
					grant.reward.committed,
					grant.reward.token.decimal,
				).toString()
				rewardCurrency = grant.reward.token.label
				rewardCurrencyAddress = grant.reward.token.address
			} else {
				reward = formatAmount(
					grant.reward.committed,
					CHAIN_INFO[
						getSupportedChainIdFromSupportedNetwork(
							grant.workspace.supportedNetworks[0],
						)
					]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
						?.decimals || 18,
				)
				rewardCurrency = CHAIN_INFO[
					getSupportedChainIdFromSupportedNetwork(
						grant.workspace.supportedNetworks[0],
					)
				]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.label || 'LOL'
				rewardCurrencyAddress = CHAIN_INFO[
					getSupportedChainIdFromSupportedNetwork(
						grant.workspace.supportedNetworks[0],
					)
				]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.address
			}

			const fd = {
				title: grant.title,
				summary: grant.summary,
				details: grant.details,
				applicantName:
          grant.fields.find((field: any) => field.id.includes('applicantName')) !== undefined,
				applicantEmail:
          grant.fields.find((field: any) => field.id.includes('applicantEmail')) !== undefined,
		  applicantAddress: grant.fields.find((field: any) => field.id.includes('applicantAddress')) !== undefined,
				teamMembers:
          grant.fields.find((field: any) => field.id.includes('teamMembers')) !== undefined,
				projectName:
          grant.fields.find((field: any) => field.id.includes('projectName')) !== undefined,
				projectGoals:
          grant.fields.find((field: any) => field.id.includes('projectGoals')) !== undefined,
				projectDetails:
          grant.fields.find((field: any) => field.id.includes('projectDetails')) !== undefined,
				projectLink:
          grant.fields.find((field: any) => field.id.includes('projectLink')) !== undefined,
				isMultipleMilestones:
          grant.fields.find((field: any) => field.id.includes('isMultipleMilestones')) !== undefined,
				fundingBreakdown:
          grant.fields.find((field: any) => field.id.includes('fundingBreakdown')) !== undefined,
				extraField:
          grant.fields.find((field: any) => field.id.includes('extraField'))
          !== undefined,
				reward,
				rewardCurrency,
				rewardCurrencyAddress,
				date: grant.deadline,
				rubric: grant.rubric,
				isPii: grant.fields.some((field: any) => field.isPii),
			} as any
			grant.fields
				.filter((field) => field.id.split('.')[1]
					.startsWith('customField'))
				.forEach((field) => {
					const fieldId = field.id.split('.')[1]
					fd[fieldId] = fieldId
				})

			grant.fields
				.filter((field: any) => field.id.split('.')[1]
					.startsWith('defaultMilestone'))
				.forEach((field: any) => {
					const fieldId = field.id.split('.')[1]
					fd[fieldId] = fieldId
				})

			setFormData(fd)
		}

	}, [data, error, queryLoading])

	const sideBarDetails = [
		['Grant Intro', 'Grant title, and summary', grantInfoRef],
		[
			'Grant Details',
			'Requirements, expected deliverables, and milestones',
			detailsRef,
		],
		[
			'Applicant Details',
			'About team, project, and funding breakdown.',
			applicationDetailsRef,
		],
		[
			'Reward and Deadline',
			'Amount, type of payout & submission deadline',
			grantRewardsRef,
		],
	]

	const scroll = (ref: any, step: number) => {
		if(!ref.current) {
			return
		}

		ref.current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
		setCurrentStep(step)
	}

	const [editData, setEditData] = useState<any>()
	const [transactionData, txnLink, loading] = useEditGrant(editData, grantID)

	const { setRefresh } = useCustomToast(txnLink)
	useEffect(() => {
		// // console.log(transactionData);
		if(transactionData) {
			router.replace({ pathname: '/your_grants', query: { done: 'yes' } })
			setRefresh(true)
		}

	}, [transactionData, router])

	useEffect(() => {
		setGrantID(router?.query?.grantId?.toString())
	}, [router])

	return (
		<Container
			maxW='100%'
			display='flex'
			px='70px'>
			<Container
				flex={1}
				display='flex'
				flexDirection='column'
				maxW='682px'
				alignItems='stretch'
				pb={8}
				px={10}
			>
				<Breadcrumbs path={['Your Grants', 'Edit grant']} />
				{
					formData && (
						<Form
							hasClicked={loading}
							formData={formData}
							onSubmit={
								(editdata: any) => {
									// console.log('editdata', editdata)
									setEditData(editdata)
								}
							}
							refs={sideBarDetails.map((detail) => detail[2])}
						/>
					)
				}
			</Container>

			<Sidebar
				sidebarDetails={sideBarDetails}
				currentStep={currentStep}
				scrollTo={scroll}
			/>
		</Container>
	)
}

EditGrant.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default EditGrant
