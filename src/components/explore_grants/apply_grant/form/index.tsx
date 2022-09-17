/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext } from 'react'
import {
	Box,
	Button,
	Container,
	Flex,
	Image,
	Text,
} from '@chakra-ui/react'
import { GrantApplicationRequest } from '@questbook/service-validator-client'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'
import { WebwalletContext } from 'pages/_app'
import ApplicantDetails from 'src/components/explore_grants/apply_grant/form/1_applicantDetails'
import AboutTeam from 'src/components/explore_grants/apply_grant/form/2_aboutTeam'
import AboutProject from 'src/components/explore_grants/apply_grant/form/3_aboutProject'
import Funding from 'src/components/explore_grants/apply_grant/form/4_funding'
import CustomFields from 'src/components/explore_grants/apply_grant/form/5_customFields'
import Loader from 'src/components/ui/loader'
import VerifiedBadge from 'src/components/ui/verified_badge'
import { SupportedChainId } from 'src/constants/chains'
import strings from 'src/constants/strings.json'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useSubmitApplication from 'src/hooks/useSubmitApplication'
import { GrantApplicationFieldsSubgraph } from 'src/types/application'
import { parseAmount } from 'src/utils/formattingUtils'
import { addAuthorizedUser } from 'src/utils/gaslessUtils'
import { useEncryptPiiForApplication } from 'src/utils/pii'
import { isValidEmail } from 'src/utils/validationUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

interface Props {
  // onSubmit: (data: any) => void;
  chainId: SupportedChainId | undefined
  title: string
  grantId: string
  daoLogo: string
  workspaceId: string
  isGrantVerified: boolean
  funding: string
  rewardAmount: string
  rewardCurrency: string
  rewardDecimal: number | undefined
  rewardCurrencyCoin: string
  rewardCurrencyAddress: string | undefined
  grantRequiredFields: string[]
  piiFields: string[]
  acceptingApplications: boolean
  shouldShowButton: boolean
  defaultMilestoneFields: any[]
}

// const MINIMUM_ALLOWED_LENGTH = 250

// eslint-disable-next-line max-len
function Form({
	// onSubmit,
	chainId,
	title,
	grantId,
	daoLogo,
	workspaceId,
	isGrantVerified,
	funding,
	rewardAmount,
	rewardCurrency,
	rewardDecimal,
	rewardCurrencyCoin,
	rewardCurrencyAddress,
	grantRequiredFields,
	piiFields,
	acceptingApplications,
	shouldShowButton,
	defaultMilestoneFields
}: Props) {
	const CACHE_KEY = strings.cache.apply_grant
	const getKey = `${chainId}-${CACHE_KEY}-${grantId}`

	const { webwallet: signer } = useContext(WebwalletContext)!
	const { encrypt } = useEncryptPiiForApplication(grantId, signer?.publicKey, chainId!)

	const [shouldRefreshNonce, setShouldRefreshNonce] = React.useState<boolean>()
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = React.useState<number | undefined>()

	const { data: accountData, nonce } = useQuestbookAccount(shouldRefreshNonce)

	const [applicantName, setApplicantName] = React.useState('')
	const [applicantNameError, setApplicantNameError] = React.useState(false)

	const [applicantEmail, setApplicantEmail] = React.useState('')
	const [applicantEmailError, setApplicantEmailError] = React.useState(false)

	const [applicantAddress, setApplicantAddress] = React.useState('')
	const [applicantAddressError, setApplicantAddressError] = React.useState(false)

	const [teamMembers, setTeamMembers] = React.useState<number | null>(1)
	const [teamMembersError, setTeamMembersError] = React.useState(false)

	const [membersDescription, setMembersDescription] = React.useState([
		{
			description: '',
			isError: false,
		},
	])

	const [projectName, setProjectName] = React.useState('')
	const [projectNameError, setProjectNameError] = React.useState(false)

	const [projectLinks, setProjectLinks] = React.useState([
		{
			link: '',
			isError: false,
		},
	])

	const [projectDetails, setProjectDetails] = React.useState(
		EditorState.createWithContent(
			convertFromRaw({
				entityMap: {},
				blocks: [
          {
          	text: '',
          	key: 'foo',
          	type: 'unstyled',
          	entityRanges: [],
          } as any,
				],
			}),
		),
	)
	const [projectDetailsError, setProjectDetailsError] = React.useState(false)

	const [projectGoal, setProjectGoal] = React.useState('')
	const [projectGoalError, setProjectGoalError] = React.useState(false)

	const [projectMilestones, setProjectMilestones] = React.useState([
		{
			milestone: '',
			milestoneReward: '',
			milestoneIsError: false,
			milestoneRewardIsError: false,
		},
	])

	React.useEffect(() => {
		if(defaultMilestoneFields && defaultMilestoneFields.length > 0) {
			setProjectMilestones(
				defaultMilestoneFields.map((defaultMilestone) => ({
					milestone: defaultMilestone.detail,
					milestoneReward: '',
					milestoneIsError: false,
					milestoneRewardIsError: false,
				})),
			)
		}
	}, [defaultMilestoneFields])

	const [fundingAsk, setFundingAsk] = React.useState('')
	const [fundingAskError, setFundingAskError] = React.useState(false)

	const [fundingBreakdown, setFundingBreakdown] = React.useState('')
	const [fundingBreakdownError, setFundingBreakdownError] = React.useState(false)

	const [customFields, setCustomFields] = React.useState<any[]>([])
	React.useEffect(() => {
		if(customFields.length > 0) {
			return
		}

		setCustomFields(
			grantRequiredFields
				.filter((field) => field.startsWith('customField'))
				.map((title) => ({
					title,
					value: '',
					isError: false,
				})),
		)

	}, [grantRequiredFields])

	const router = useRouter()

	const [formData, setFormData] = React.useState<GrantApplicationRequest>()
	const [, txnLink, loading, isBiconomyInitialised] = useSubmitApplication(
		formData!,
		setNetworkTransactionModalStep,
		chainId,
		grantId,
		workspaceId,
	)

	React.useEffect(() => {
		if(nonce && nonce !== 'Token expired') {
			return
		}

		if(signer) {
			addAuthorizedUser(signer?.address)
				.then(() => {
					setShouldRefreshNonce(true)
					// console.log('Added authorized user', signer.address)
				})
				// .catch((err) => console.log("Couldn't add authorized user", err))
		}
	}, [signer, nonce])

	const handleOnSubmit = async() => {
		// console.log(grantRequiredFields)
		let error = false
		if(applicantName === '' && grantRequiredFields.includes('applicantName')) {
			setApplicantNameError(true)
			// console.log('Error name')
			error = true
		}

		if(
			(applicantEmail === '' || !isValidEmail(applicantEmail))
      && grantRequiredFields.includes('applicantEmail')
		) {

			setApplicantEmailError(true)
			// console.log('Error email')
			error = true
		}

		if(applicantAddress === '' && grantRequiredFields.includes('applicantAddress')) {
			setApplicantAddressError(true)
			error = true
		}

		if(
			(!teamMembers || teamMembers <= 0)
      && grantRequiredFields.includes('teamMembers')
		) {
			setTeamMembersError(true)
			// console.log('Error teamMembers')
			error = true
		}

		let membersDescriptionError = false
		const newMembersDescriptionArray = [...membersDescription]
		membersDescription.forEach((member, index) => {
			if(
				member.description === ''
        && grantRequiredFields.includes('memberDetails')
			) {
				newMembersDescriptionArray[index].isError = true
				// console.log('Error memberDetails')

				membersDescriptionError = true
			}
		})

		if(membersDescriptionError) {
			setMembersDescription(newMembersDescriptionArray)
			error = true
		}

		if(projectName === '' && grantRequiredFields.includes('projectName')) {
			setProjectNameError(true)
			// console.log('Error projectName')

			error = true
		}

		let projectLinksError = false
		const newProjectLinks = [...projectLinks]
		projectLinks.forEach((project, index) => {
			if(project.link === '' && grantRequiredFields.includes('projectLink')) {
				newProjectLinks[index].isError = true
				projectLinksError = true
			}
		})

		if(projectLinksError) {
			setProjectLinks(newProjectLinks)
			error = true
		}

		// if(projectDetails.getCurrentContent().getPlainText('').length < MINIMUM_ALLOWED_LENGTH) {
		// 	setProjectDetailsError(true)
		// 	error = true
		// }

		if(!projectDetails.getCurrentContent().hasText()) {
			setProjectDetailsError(true)
			error = true
		}

		if(projectGoal === '' && grantRequiredFields.includes('projectGoals')) {
			setProjectGoalError(true)
			error = true
		}

		let projectMilestonesError = false
		const newProjectMilestones = [...projectMilestones]
		projectMilestones.forEach((project, index) => {
			if(project.milestone === '') {
				newProjectMilestones[index].milestoneIsError = true
				projectMilestonesError = true
			}

			if(project.milestoneReward === '') {
				newProjectMilestones[index].milestoneRewardIsError = true
				projectMilestonesError = true
			}
		})

		if(projectMilestonesError) {
			setProjectMilestones(newProjectMilestones)
			error = true
		}

		if(fundingAsk === '' && grantRequiredFields.includes('fundingAsk')) {
			setFundingAskError(true)
			error = true
		}

		if(
			fundingBreakdown === ''
      && grantRequiredFields.includes('fundingBreakdown')
		) {
			setFundingBreakdownError(true)
			error = true
		}

		if(customFields.length > 0) {
			const errorCheckedCustomFields = customFields.map((customField: any) => {
				const errorCheckedCustomField = { ...customField }
				if(customField.value.length <= 0) {
					errorCheckedCustomField.isError = true
					error = true
				}

				return errorCheckedCustomField
			})
			setCustomFields(errorCheckedCustomFields)
		}


		if(error) {
			return
		}

		const projectDetailsString = JSON.stringify(
			convertToRaw(projectDetails.getCurrentContent()),
		)
		const links = projectLinks.map((pl) => pl.link)
		// console.log('Signer', signer)
		if(!signer || !signer) {
			return
		}

		// console.log('Funding asked: ', fundingAsk)

		const data: GrantApplicationRequest = {
			grantId,
			applicantId: await signer?.getAddress(),
			applicantPublicKey: signer?.publicKey,
			fields: {
				applicantName: [{ value: applicantName }],
				applicantEmail: [{ value: applicantEmail }],
				applicantAddress: [{ value: applicantAddress }],
				projectName: [{ value: projectName }],
				projectDetails: [{ value: projectDetailsString }],
				fundingAsk: fundingAsk !== '' ? [
					{
						value: parseAmount(
							fundingAsk,
							rewardCurrencyAddress,
							rewardDecimal,
						),
					},
				] : [],
				fundingBreakdown: [{ value: fundingBreakdown }],
				teamMembers: [{ value: Number(teamMembers).toString() }],
				memberDetails: membersDescription.map((md) => ({
					value: md.description,
				})),
				projectLink: links.map((value) => ({ value })),
				projectGoals: [{ value: projectGoal }],
				isMultipleMilestones: [
					{
						value: grantRequiredFields
							.includes('isMultipleMilestones')
							.toString(),
					},
				],
			},
			milestones: projectMilestones.map((pm) => ({
				title: pm.milestone,
				amount: parseAmount(
					pm.milestoneReward,
					rewardCurrencyAddress,
					rewardDecimal,
				),
			})),
		}
		Object.keys(data.fields).forEach((field) => {
			if(!grantRequiredFields.includes(field)) {
				delete data.fields[field as keyof GrantApplicationFieldsSubgraph]
			}
		})
		customFields.forEach((customField) => {
			data.fields[customField.title] = [{ value: customField.value }]
		})

		if(piiFields.length) {
			await encrypt(data, piiFields)
		}

		setFormData(data)
	}

	React.useEffect(() => {
		// console.log('Key: ', getKey)
		if(getKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const data = localStorage.getItem(getKey)
		if(data === 'undefined') {
			return
		}

		const formDataLocal = typeof window !== 'undefined' ? JSON.parse(data || '{}') : {}
		if(formDataLocal?.applicantName) {
			setApplicantName(formDataLocal?.applicantName)
		}

		if(formDataLocal?.applicantEmail) {
			setApplicantEmail(formDataLocal?.applicantEmail)
		}

		if(formDataLocal?.applicantAddress) {
			setApplicantAddress(formDataLocal?.applicantAddress)
		}

		if(formDataLocal?.teamMembers) {
			setTeamMembers(formDataLocal?.teamMembers)
		}

		if(formDataLocal?.membersDescription) {
			setMembersDescription(formDataLocal?.membersDescription)
		}

		if(formDataLocal?.projectName) {
			setProjectName(formDataLocal?.projectName)
		}

		if(formDataLocal?.projectLinks) {
			setProjectLinks(formDataLocal?.projectLinks)
		}

		// console.log('projecttt', formDataLocal.projectDetails)
		if(formDataLocal?.projectDetails) {
			setProjectDetails(
				EditorState.createWithContent(
					convertFromRaw(formDataLocal?.projectDetails),
				),
			)
		}

		if(formDataLocal?.projectGoal) {
			setProjectGoal(formDataLocal?.projectGoal)
		}

		if(formDataLocal?.projectMilestones) {
			setProjectMilestones(formDataLocal?.projectMilestones)
		}

		if(formDataLocal?.fundingAsk) {
			setFundingAsk(formDataLocal?.fundingAsk)
		}

		if(formDataLocal?.fundingBreakdown) {
			setFundingBreakdown(formDataLocal?.fundingBreakdown)
		}

		if(formDataLocal?.customFields) {
			setCustomFields(formDataLocal?.customFields)
		}

		// console.log('Data from cache: ', formDataLocal)
	}, [getKey])

	React.useEffect(() => {
		if(getKey.includes('undefined')) {
			return
		}

		const formDataLocal = {
			applicantName,
			applicantEmail,
			applicantAddress,
			teamMembers,
			membersDescription,
			projectName,
			projectLinks,
			projectDetails: convertToRaw(projectDetails.getCurrentContent()),
			projectGoal,
			projectMilestones,
			fundingAsk,
			fundingBreakdown,
			customFields,
		}
		// console.log(JSON.stringify(formDataLocal))
		if(typeof window !== 'undefined') {
			localStorage.setItem(getKey, JSON.stringify(formDataLocal))
		}

	}, [
		applicantName,
		applicantEmail,
		applicantAddress,
		teamMembers,
		membersDescription,
		projectName,
		projectLinks,
		projectDetails,
		projectGoal,
		projectMilestones,
		fundingAsk,
		fundingBreakdown,
		customFields,
	])

	return (
		<Flex
			my='30px'
			flexDirection='column'
			alignItems='center'
			w='100%'
			px='44px'
		>
			{
				!acceptingApplications && (
					<Flex
						w='100%'
						bg='#F3F4F4'
						direction='row'
						align='center'
						px={8}
						py={6}
						mt={6}
						mb={8}
						border='1px solid #E8E9E9'
						borderRadius='6px'
					>
						<Image
							src='/toast/warning.svg'
							w='42px'
							h='36px' />
						<Flex
							direction='column'
							ml={6}>
							<Text
								variant='tableHeader'
								color='#414E50'>
								{
									shouldShowButton && accountData?.address
										? 'Grant is archived and cannot be discovered on the Home page.'
										: 'Grant is archived and closed for new applications.'
								}
							</Text>
							<Text
								variant='tableBody'
								color='#717A7C'
								fontWeight='400'
								mt={2}>
								New applicants cannot apply to an archived grant.
							</Text>
						</Flex>
					</Flex>
				)
			}
			<Image
				objectFit='cover'
				h='96px'
				w='96px'
				src={daoLogo}
				alt='Polygon DAO'
			/>
			<Text
				mt={6}
				variant='heading'>
				{title}
				{
					isGrantVerified && (
						<VerifiedBadge
							grantAmount={funding}
							grantCurrency={rewardCurrency}
							lineHeight='44px'
						/>
					)
				}
			</Text>
			<Text
				zIndex='1'
				px={9}
				bgColor='white'
				mt='33px'
				lineHeight='26px'
				fontSize='18px'
				fontWeight='500'
			>
				Your Application Form
			</Text>
			<Container
				mt='-12px'
				p={10}
				border='2px solid #E8E9E9'
				borderRadius='12px'
			>
				<ApplicantDetails
					applicantName={applicantName}
					applicantNameError={applicantNameError}
					applicantEmail={applicantEmail}
					applicantEmailError={applicantEmailError}
					applicantAddress={applicantAddress}
					applicantAddressError={applicantAddressError}
					setApplicantName={setApplicantName}
					setApplicantNameError={setApplicantNameError}
					setApplicantEmail={setApplicantEmail}
					setApplicantEmailError={setApplicantEmailError}
					setApplicantAddress={setApplicantAddress}
					setApplicantAddressError={setApplicantAddressError}
					grantRequiredFields={grantRequiredFields}
				/>

				<Box mt='43px' />
				<AboutTeam
					teamMembers={teamMembers}
					teamMembersError={teamMembersError}
					setTeamMembers={setTeamMembers}
					setTeamMembersError={setTeamMembersError}
					membersDescription={membersDescription}
					setMembersDescription={setMembersDescription}
					grantRequiredFields={grantRequiredFields}
				/>

				<Box mt='19px' />
				<AboutProject
					projectName={projectName}
					setProjectName={setProjectName}
					projectNameError={projectNameError}
					setProjectNameError={setProjectNameError}
					projectLinks={projectLinks}
					setProjectLinks={setProjectLinks}
					projectDetails={projectDetails}
					setProjectDetails={setProjectDetails}
					projectDetailsError={projectDetailsError}
					setProjectDetailsError={setProjectDetailsError}
					projectGoal={projectGoal}
					setProjectGoal={setProjectGoal}
					projectGoalError={projectGoalError}
					setProjectGoalError={setProjectGoalError}
					projectMilestones={projectMilestones}
					setProjectMilestones={setProjectMilestones}
					rewardCurrency={rewardCurrency}
					rewardCurrencyCoin={rewardCurrencyCoin}
					grantRequiredFields={grantRequiredFields}
				/>

				<Box mt='43px' />
				{
					grantRequiredFields.includes('fundingBreakdown') && (
						<Funding
							fundingAsk={fundingAsk}
							setFundingAsk={setFundingAsk}
							fundingAskError={fundingAskError}
							setFundingAskError={setFundingAskError}
							fundingBreakdown={fundingBreakdown}
							setFundingBreakdown={setFundingBreakdown}
							fundingBreakdownError={fundingBreakdownError}
							setFundingBreakdownError={setFundingBreakdownError}
							rewardAmount={rewardAmount}
							rewardCurrency={rewardCurrency}
							rewardCurrencyCoin={rewardCurrencyCoin}
							grantRequiredFields={grantRequiredFields}
						/>
					)
				}

				{
					customFields && customFields.length > 0 && (
						<>
							<Box mt='43px' />
							<CustomFields
								customFields={customFields}
								setCustomFields={setCustomFields}
							/>
						</>
					)
				}
			</Container>

			<Box mt={5} />

			{
				acceptingApplications && (
					<Button
						mt={10}
						disabled={!isBiconomyInitialised}
						onClick={loading ? () => {} : handleOnSubmit}
						mx={10}
						alignSelf='stretch'
						variant='primary'
						py={loading ? 2 : 0}
					>
						{loading ? <Loader /> : 'Submit Application'}
					</Button>
				)
			}

			<NetworkTransactionModal
				isOpen={networkTransactionModalStep !== undefined}
				subtitle='Submitting Application'
				description={
					<Flex direction='column'>
						<Text
							variant='v2_title'
							fontWeight='500'
						>
							{title}
						</Text>
						<Text
							variant='v2_body'
						>
							{applicantAddress}
						</Text>
					</Flex>
				}
				currentStepIndex={networkTransactionModalStep || 0}
				steps={
					[
						'Uploading data to IPFS',
						'Sign transaction',
						'Waiting for transaction to complete',
						'Waiting for transaction to be indexed',
						'Application submitted on-chain',
					]
				}
				viewLink={txnLink}
				onClose={
					async() => {
						router.push({ pathname: '/your_applications' })
					}
				} />
		</Flex>
	)
}

export default Form
