/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react'
import {
	Box, Text, } from '@chakra-ui/react'
import {
	Token,
	WorkspaceUpdateRequest,
} from '@questbook/service-validator-client'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { ApiClientsContext } from 'pages/_app'
import { CHAIN_INFO } from 'src/constants/chains'
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey'
import useUpdateWorkspacePublicKeys from 'src/hooks/useUpdateWorkspacePublicKeys'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { supportedNetworks } from 'src/v2/components/Onboarding/SupportedNetworksData'
import { useAccount } from 'wagmi'
import applicantDetailsList from '../../../../constants/newApplicantDetailsList'
import strings from '../../../../constants/strings.json'
import Title from './1_title'
import Details from './2_details'
import ApplicantDetails from './3_applicantDetails'
import EvaluationDetails from './4_evaluation'
import GrantRewardsInput from './5_rewards'
import ReviewGrant from './6_review_grant'
import CreateGrantsModal from './CreateGrantModal'

function NewForm({
	refs,
	onSubmit,
	currentStep,
	hasClicked,
	currentState,
	setCurrentState
}: {
  refs: any[];
  onSubmit: (data: any) => void;
  currentStep: number;
  hasClicked: boolean;
  currentState: number;
  setCurrentState: (data: any) => void;
}) {
	const CACHE_KEY = strings.cache.create_grant
	const { workspace } = React.useContext(ApiClientsContext)!

	const [currentChain, setCurrentChain] = React.useState(
    getSupportedChainIdFromWorkspace(workspace)!,
	)

	const [getKey, setGetKey] = React.useState(`${currentChain}-${CACHE_KEY}-${workspace?.id}`)

	React.useEffect(() => {
		setCurrentChain(getSupportedChainIdFromWorkspace(workspace)!)
		setGetKey(`${currentChain}-${CACHE_KEY}-${workspace?.id}`)

	}, [workspace, currentChain])

	const { data: accountData } = useAccount()
	const maxDescriptionLength = 300
	const [title, setTitle] = useState('')
	const [summary, setSummary] = useState('New grants')

	const [pk, setPk] = React.useState<string>('*')
	const {
		RenderModal,
		setHiddenModalOpen: setHiddenPkModalOpen,
		transactionData: newPkTransactionData,
		publicKey: newPublicKey,
	} = useSubmitPublicKey()

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

	const [titleError, setTitleError] = useState(false)
	const [summaryError, setSummaryError] = useState(false)

	const [details, setDetails] = useState(EditorState.createWithContent(convertFromRaw({
		entityMap: {},
		blocks: [{
			text: '',
			key: 'foo',
			type: 'unstyled',
			entityRanges: [],
		} as any],
	})))
	const [detailsError, setDetailsError] = useState(false)

	const [shouldEncrypt, setShouldEncrypt] = useState(false)
	const [hasOwnerPublicKey, setHasOwnerPublicKey] = useState(false)
	const [keySubmitted, setKeySubmitted] = useState(false)
	const [publicKey] = React.useState<WorkspaceUpdateRequest>({
		publicKey: '',
	})
	const [transactionData, transactionLink, loading] = useUpdateWorkspacePublicKeys(publicKey)

	const { setRefresh } = useCustomToast(transactionLink)
	const [admins, setAdmins] = React.useState<any[]>([])
	const [maximumPoints, setMaximumPoints] = React.useState(5)

	// [TODO] : if different grantManagers are required for different grants
	// const [grantManagers, setGrantManagers] = useState<any[]>([accountData?.address]);
	// const toggleGrantManager = (address: string) => {
	//   const newGrantManagers = grantManagers.includes(address)
	//     ? grantManagers.filter((grantManager) => grantManager !== address)
	//     : [...grantManagers, address];
	//   setGrantManagers(newGrantManagers);
	// };

	React.useEffect(() => {
		if(transactionData) {
			setKeySubmitted(true)
			console.log('transactionData-----', transactionData)
			setRefresh(true)
		}
	}, [transactionData])

	React.useEffect(() => {
		if(workspace && workspace.members && accountData && accountData.address) {
			const hasPubKey = workspace.members.some(
				(member) => member.actorId.toLowerCase() === accountData?.address?.toLowerCase()
          && member.publicKey
          && member.publicKey !== '',
			)
			console.log('Workspace', workspace)
			setHasOwnerPublicKey(hasPubKey)
		}
	}, [accountData, workspace])

	React.useEffect(() => {
		if(workspace && workspace.members) {
			const adminAddresses = workspace.members
				.filter((member) => member.publicKey && member.publicKey !== '')
				.map((member) => member.actorId)
			setAdmins(adminAddresses)
		}
	}, [workspace])

	const applicantDetails = applicantDetailsList
		.map(({
			title, id, inputType, isRequired, mandatory
		}, index) => {

			return {
				title,
				required: isRequired ?? false,
				mandatory: mandatory ?? false,
				id,
				index,
				inputType,
			}
		})
		.filter((obj) => obj !== null)
	const [detailsRequired, setDetailsRequired] = React.useState(applicantDetails)
	// const [extraField, setExtraField] = useState(false);

	const [customFieldsOptionIsVisible, setCustomFieldsOptionIsVisible] = React.useState(false)
	const [customFields, setCustomFields] = React.useState<any[]>([
		{
			value: '',
			isError: false,
		},
	])
	const [multipleMilestones, setMultipleMilestones] = React.useState(false)
	const [milestoneSelectOptionIsVisible, setMilestoneSelectOptionIsVisible] = React.useState(false)
	const [defaultMilestoneFields, setDefaultMilestoneFields] = React.useState<
  any[]
  >([])

	const toggleDetailsRequired = (index: number) => {
		const newDetailsRequired = [...detailsRequired];
		// TODO: create interface for detailsRequired
		(newDetailsRequired[index] as any).required = !(
      newDetailsRequired[index] as any
		).required
		setDetailsRequired(newDetailsRequired)
	}

	const [rubricRequired, setRubricRequired] = React.useState(false)
	const [rubrics, setRubrics] = React.useState<any>([
		{
			name: '',
			nameError: false,
			description: '',
			descriptionError: false,
		},
	])

	const [shouldEncryptReviews, setShouldEncryptReviews] = React.useState(false)

	// const [extraFieldDetails, setExtraFieldDetails] = useState('');
	// const [extraFieldError, setExtraFieldError] = useState(false);

	// Grant Rewards and Deadline
	const [reward, setReward] = React.useState('')
	const [rewardToken, setRewardToken] = React.useState<Token>({
		label: '',
		address: '',
		decimal: '18',
		iconHash: '',
	})
	const [rewardError, setRewardError] = React.useState(false)

	// const [supportCurrencies, setsupportCurrencies] = useState([{}]);

	const supportedCurrencies = Object.keys(
		CHAIN_INFO[currentChain]?.supportedCurrencies ?? [],
	)
		.map((address) => CHAIN_INFO[currentChain]?.supportedCurrencies[address])
		.map((currency) => ({ ...currency, id: currency.address }))


	const [rewardCurrency, setRewardCurrency] = React.useState('')
	const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
		supportedCurrencies.length > 0 ? supportedCurrencies[0].id : '',
	)
	/**
   * checks if the workspace already has custom tokens added
   * if custom tokens found, append it to supportedCurrencies
   */
	if(workspace?.tokens) {
		for(let i = 0; i < workspace.tokens.length; i += 1) {
			supportedCurrencies.push({
				id: workspace.tokens[i].address,
				address: workspace.tokens[i].address,
				decimals: workspace.tokens[i].decimal,
				label: workspace.tokens[i].label,
				icon: getUrlForIPFSHash(workspace.tokens[i].iconHash),
			})
		}
	}

	React.useEffect(() => {
		// console.log(currentChain);
		if(currentChain) {
			const supportedCurrencies = Object.keys(
				CHAIN_INFO[currentChain].supportedCurrencies,
			)
				.map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
				.map((currency) => ({ ...currency, id: currency.address }))
			setRewardCurrency(supportedCurrencies[0].label)
			setRewardCurrencyAddress(supportedCurrencies[0].address)
		}

	}, [currentChain])

	const [date, setDate] = React.useState('')
	const [dateError, setDateError] = React.useState(false)

	const handleOnSubmit = () => {
		console.log('handleOnSubmit called')
		let error = false
		if(title.length <= 0) {
			setTitleError(true)
			error = true
			console.log('error found in title')
		}

		if(!details.getCurrentContent().hasText()) {
			setDetailsError(true)
			error = true
			console.log('error found in details')
		}

		if(reward.length <= 0) {
			setRewardError(true)
			error = true
			console.log('error found in rewards')
		}

		if(date.length <= 0) {
			setDateError(true)
			error = true
			console.log('error found in date')
		}

		if(customFieldsOptionIsVisible) {
			const errorCheckedCustomFields = customFields.map((customField: any) => {
				const errorCheckedCustomField = { ...customField }
				if(customField.value.length <= 0) {
					errorCheckedCustomField.isError = true
					error = true
					console.log('error found in custom fields')
				}

				return errorCheckedCustomField
			})
			setCustomFields(errorCheckedCustomFields)
		}

		if(defaultMilestoneFields.length > 0) {
			const errorCheckedDefaultMilestoneFields = defaultMilestoneFields.map(
				(defaultMilestoneField: any) => {
					const errorCheckedDefaultMilestoneField = {
						...defaultMilestoneField,
					}
					if(defaultMilestoneField.value.length <= 0) {
						errorCheckedDefaultMilestoneField.isError = true
						error = true
						console.log('error found in milestones')
					}

					return errorCheckedDefaultMilestoneField
				},
			)
			setDefaultMilestoneFields(errorCheckedDefaultMilestoneFields)
		}

		if(rubricRequired) {
			const errorCheckedRubrics = rubrics.map((rubric: any) => {
				const errorCheckedRubric = { ...rubric }
				if(rubric.name.length <= 0) {
					errorCheckedRubric.nameError = true
					error = true
					console.log('error found in rubric name')
				}

				if(rubric.description.length <= 0) {
					errorCheckedRubric.descriptionError = true
					error = true
					console.log('error found in rubric description')
				}

				return errorCheckedRubric
			})
			setRubrics(errorCheckedRubrics)
		}

		if(!error) {
			console.log('no error found')
			const detailsString = JSON.stringify(
				convertToRaw(details.getCurrentContent()),
			)

			const requiredDetails = {} as any
			detailsRequired.forEach((detail) => {
				if(detail && detail.required) {
					requiredDetails[detail.id] = {
						title: detail.title,
						inputType: detail.inputType,
					}
				}
			})
			const fields = { ...requiredDetails }

			const rubric = {} as any

			if(rubricRequired) {
				rubrics.forEach((r: any, index: number) => {
					rubric[index.toString()] = {
						title: r.name,
						details: r.description,
						maximumPoints,
					}
				})
			}

			if(multipleMilestones) {
				fields.isMultipleMilestones = {
					title: 'Milestones',
					inputType: 'array',
				}
			}

			if(fields.teamMembers) {
				fields.memberDetails = {
					title: 'Member Details',
					inputType: 'array',
				}
			}

			if(fields.fundingBreakdown) {
				fields.fundingAsk = {
					title: 'Funding Ask',
					inputType: 'short-form',
				}
			}

			if(shouldEncrypt && (keySubmitted || hasOwnerPublicKey)) {
				if(fields.applicantEmail) {
					fields.applicantEmail = { ...fields.applicantEmail, pii: true }
				}

				if(fields.memberDetails) {
					fields.memberDetails = { ...fields.memberDetails, pii: true }
				}
			}

			if(customFieldsOptionIsVisible && customFields.length > 0) {
				customFields.forEach((customField: any, index: number) => {
					const santizedCustomFieldValue = customField.value
						.split(' ')
						.join('\\s')
					fields[`customField${index}-${santizedCustomFieldValue}`] = {
						title: customField.value,
						inputType: 'short-form',
					}
				})
			}

			if(defaultMilestoneFields.length > 0) {
				defaultMilestoneFields.forEach(
					(defaultMilestoneField: any, index: number) => {
						const santizedDefaultMilestoneFieldValue = defaultMilestoneField.value.split(' ').join('\\s')
						fields[
							`defaultMilestone${index}-${santizedDefaultMilestoneFieldValue}`
						] = {
							title: defaultMilestoneField.value,
							inputType: 'short-form',
						}
					},
				)
			}

			const s = {
				title,
				summary,
				details: detailsString,
				fields,
				reward,
				rewardCurrencyAddress,
				rewardToken,
				date,
				grantManagers: admins,
				rubric: {
					isPrivate: shouldEncryptReviews,
					rubric,
				},
			}

			if((shouldEncrypt || shouldEncryptReviews) && (!pk || pk === '*')) {
				setHiddenPkModalOpen(true)
				return
			}

			onSubmit(s)
		}
	}

	useEffect(() => {
		console.log('currentStep', currentStep)
	}, [currentStep])

	useEffect(() => {
		if(newPkTransactionData && newPublicKey && newPublicKey.publicKey) {
			// console.log(newPublicKey);
			setPk(newPublicKey.publicKey)
			const detailsString = JSON.stringify(
				convertToRaw(details.getCurrentContent()),
			)

			const requiredDetails = {} as any
			detailsRequired.forEach((detail) => {
				if(detail && detail.required) {
					requiredDetails[detail.id] = {
						title: detail.title,
						inputType: detail.inputType,
					}
				}
			})
			const fields = { ...requiredDetails }

			const rubric = {} as any

			if(rubricRequired) {
				rubrics.forEach((r: any, index: number) => {
					rubric[index.toString()] = {
						title: r.name,
						details: r.description,
						maximumPoints,
					}
				})
			}

			if(multipleMilestones) {
				fields.isMultipleMilestones = {
					title: 'Milestones',
					inputType: 'array',
				}
			}

			if(fields.teamMembers) {
				fields.memberDetails = {
					title: 'Member Details',
					inputType: 'array',
				}
			}

			if(fields.fundingBreakdown) {
				fields.fundingAsk = {
					title: 'Funding Ask',
					inputType: 'short-form',
				}
			}

			if(shouldEncrypt && (keySubmitted || hasOwnerPublicKey)) {
				if(fields.applicantEmail) {
					fields.applicantEmail = { ...fields.applicantEmail, pii: true }
				}

				if(fields.memberDetails) {
					fields.memberDetails = { ...fields.memberDetails, pii: true }
				}
			}

			if(customFieldsOptionIsVisible && customFields.length > 0) {
				customFields.forEach((customField: any, index: number) => {
					const santizedCustomFieldValue = customField.value.split(' ').join('\\s')
					fields[`customField${index}-${santizedCustomFieldValue}`] = {
						title: customField.value,
						inputType: 'short-form',
					}
				})
			}

			if(defaultMilestoneFields.length > 0) {
				defaultMilestoneFields.forEach((defaultMilestoneField: any, index: number) => {
					const santizedDefaultMilestoneFieldValue = defaultMilestoneField.value.split(' ').join('\\s')
					fields[`defaultMilestone${index}-${santizedDefaultMilestoneFieldValue}`] = {
						title: defaultMilestoneField.value,
						inputType: 'short-form',
					}
				})
			}

			const s = {
				title,
				summary,
				details: detailsString,
				fields,
				reward,
				rewardCurrencyAddress,
				rewardToken,
				date,
				grantManagers: admins,
				rubric: {
					isPrivate: shouldEncryptReviews,
					rubric,
				},
			}

			onSubmit(s)
		}

	}, [newPkTransactionData, newPublicKey])
	React.useEffect(() => {
		console.log('Key: ', getKey)
		if(getKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const data = localStorage.getItem(getKey)
		if(data === 'undefined') {
			return
		}

		const formData = typeof window !== 'undefined' ? JSON.parse(data ?? '{}') : {}
		console.log('Data from cache: ', formData)

		setTitle(formData?.title)
		// setSummary(formData?.summary)
		if(formData?.details) {
			setDetails(
				EditorState.createWithContent(convertFromRaw(formData?.details)),
			)
		}

		if(formData?.detailsRequired) {
			setDetailsRequired(formData?.detailsRequired)
		}

		if(formData?.rubricRequired) {
			setRubricRequired(formData?.rubricRequired)
		}

		if(formData?.customFieldsOptionIsVisible) {
			setCustomFieldsOptionIsVisible(formData?.customFieldsOptionIsVisible)
		}

		if(formData?.customFields) {
			setCustomFields(formData?.customFields)
		}

		if(formData?.milestoneSelectOptionIsVisible) {
			setMilestoneSelectOptionIsVisible(formData?.milestoneSelectOptionIsVisible)
		}

		if(formData?.multipleMilestones) {
			setMultipleMilestones(formData?.multipleMilestones)
		}

		if(formData?.rubrics) {
			setRubrics(formData?.rubrics)
		}

		if(formData?.maximumPoints) {
			setMaximumPoints(formData?.maximumPoints)
		}

		if(formData?.reward) {
			setReward(formData?.reward)
		}

		if(formData?.rewardToken) {
			setRewardToken(formData?.rewardToken)
		}

		if(formData?.rewardCurrency) {
			setRewardCurrency(formData?.rewardCurrency)
		}

		if(formData?.rewardCurrencyAddress) {
			setRewardCurrencyAddress(formData?.rewardCurrencyAddress)
		}

		if(formData?.date) {
			setDate(formData?.date)
		}

		if(formData?.shouldEncrypt) {
			setShouldEncrypt(formData?.shouldEncrypt)
		}

		if(formData?.shouldEncryptReviews) {
			setShouldEncryptReviews(formData?.shouldEncryptReviews)
		}

	}, [getKey])

	React.useEffect(() => {
		if(getKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const formData = {
			title,
			summary,
			details: convertToRaw(details.getCurrentContent()),
			detailsRequired,
			rubricRequired,
			customFieldsOptionIsVisible,
			customFields,
			multipleMilestones,
			milestoneSelectOptionIsVisible,
			rubrics,
			maximumPoints,
			reward,
			rewardToken,
			rewardCurrency,
			rewardCurrencyAddress,
			date,
			shouldEncrypt,
			shouldEncryptReviews,
		}
		console.log(JSON.stringify(formData))
		// localStorage.setItem(getKey, JSON.stringify(formData))

	}, [
		details,
		reward,
		rewardCurrencyAddress,
		rewardToken,
		summary,
		detailsRequired,
		rubricRequired,
		rubrics,
		maximumPoints,
		customFieldsOptionIsVisible,
		customFields,
		title,
		shouldEncrypt,
		shouldEncryptReviews,
		date,
		multipleMilestones,
		milestoneSelectOptionIsVisible,
	])

	return (
		<>
			{
				currentState === 0 ? (
					<Box>
						<Box mt="20px" />
						<Title
							title={title}
							setTitle={setTitle}
							titleError={titleError}
							setTitleError={setTitleError}
							maxDescriptionLength={maxDescriptionLength}
						/>
					</Box>
				) : null
			}

			{
				currentState === 1 ? (
					<Box>
						<Box mt="20px" />
						<Details
							details={details}
							setDetails={setDetails}
							detailsError={detailsError}
							setDetailsError={setDetailsError}
							currentState={currentState}
							setCurrentState={setCurrentState}
						/>
					</Box>
				) : null
			}

			{
				currentState === 2 ? (
					<Box>
						<Box mt="20px" />
						<ApplicantDetails
							detailsRequired={detailsRequired}
							toggleDetailsRequired={toggleDetailsRequired}
							customFields={customFields}
							setCustomFields={setCustomFields}
							customFieldsOptionIsVisible={customFieldsOptionIsVisible}
							setCustomFieldsOptionIsVisible={setCustomFieldsOptionIsVisible}
							multipleMilestones={multipleMilestones}
							setMultipleMilestones={setMultipleMilestones}
							milestoneSelectOptionIsVisible={milestoneSelectOptionIsVisible}
							setMilestoneSelectOptionIsVisible={setMilestoneSelectOptionIsVisible}
							defaultMilestoneFields={defaultMilestoneFields}
							setDefaultMilestoneFields={setDefaultMilestoneFields}
							shouldEncrypt={shouldEncrypt}
							setShouldEncrypt={setShouldEncrypt}
							setMaximumPoints={setMaximumPoints}
						/>
					</Box>
				) : null
			}

			{
				currentState === 3 ? (
					<Box>
						<EvaluationDetails
							rubricRequired={rubricRequired}
							setRubricRequired={setRubricRequired}
							rubrics={rubrics}
							setRubrics={setRubrics}
						/>
					</Box>
				) : null
			}

			{
				currentState === 4 ? (
					<Box>
						<GrantRewardsInput
							reward={reward}
							setReward={setReward}
							rewardToken={rewardToken}
							setRewardToken={setRewardToken}
							rewardError={rewardError}
							setRewardError={setRewardError}
							rewardCurrency={rewardCurrency}
							setRewardCurrency={setRewardCurrency}
							setRewardCurrencyAddress={setRewardCurrencyAddress}
							date={date}
							setDate={setDate}
							dateError={dateError}
							setDateError={setDateError}
							supportedCurrencies={supportedCurrencies}
							shouldEncrypt={shouldEncrypt}
							setShouldEncrypt={setShouldEncrypt}
							shouldEncryptReviews={shouldEncryptReviews}
							setShouldEncryptReviews={setShouldEncryptReviews}
						/>
					</Box>
				) : null
			}

			{
				currentState === 5 ? (
					<>
						<ReviewGrant
							title={title}
							setTitle={setTitle}
							titleError={titleError}
							setTitleError={setTitleError}
							details={details}
							setDetails={setDetails}
							detailsError={detailsError}
							setDetailsError={setDetailsError}
							applicantDetailsList={applicantDetailsList}
							detailsRequired={detailsRequired}
							toggleDetailsRequired={toggleDetailsRequired}
							customFieldsOptionIsVisible={customFieldsOptionIsVisible}
							setCustomFieldsOptionIsVisible={setCustomFieldsOptionIsVisible}
							customFields={customFields}
							setCustomFields={setCustomFields}
							milestoneSelectOptionIsVisible={milestoneSelectOptionIsVisible}
							defaultMilestoneFields={defaultMilestoneFields}
							setDefaultMilestoneFields={setDefaultMilestoneFields}
							setMilestoneSelectOptionIsVisible={setMilestoneSelectOptionIsVisible}
							shouldEncrypt={shouldEncrypt}
							setShouldEncrypt={setShouldEncrypt}
							rubricRequired={rubricRequired}
							setRubricRequired={setRubricRequired}
							rubrics={rubrics}
							setRubrics={setRubrics}
							supportedCurrencies={supportedCurrencies}
							reward={reward}
							setReward={setReward}
							rewardError={rewardError}
							setRewardError={setRewardError}
							rewardCurrency={rewardCurrency}
							setRewardCurrency={setRewardCurrency}
							setRewardCurrencyAddress={setRewardCurrencyAddress}
							setRewardToken={setRewardToken}
							dateError={dateError}
							setDateError={setDateError}
							date={date}
							setDate={setDate} />

						<Box
							width={'100%'}
							as='button'
							borderRadius='sm'
							bg='#1F1F33'
							color='white'
							display={'flex'}
							justifyContent={'center'}
							paddingLeft={'12px'}
							paddingRight={'12px'}
							paddingTop={'6px'}
							paddingBottom={'6px'}
							onClick={
								() => {
									console.log('publish button clicked')
									handleOnSubmit()
								}
							}>
							<Text fontWeight={'500'}>
                                    Publish grant
							</Text>
						</Box>
					</>
				) : null
			}

			<RenderModal />

			<CreateGrantsModal
				isOpen={currentStep !== undefined}
				onClose={() => {}}
				daoName={workspace?.title}
				daoNetwork={supportedNetworks.find((network) => network.id === currentChain)}
				daoImageFile={null}
				steps={
					[
						'Connect your wallet',
						'Uploading data to IPFS',
						'Sign transaction',
						'Waiting for transaction to complete',
						'DAO created on-chain'
					]
				}
				currentStep={currentStep}
			/>
		</>
	)
}

export default NewForm
