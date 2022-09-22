/* eslint-disable @typescript-eslint/no-shadow */
import React, {
	useContext, useEffect, useMemo, useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box, Button, Flex,
	Image, Link, Text, } from '@chakra-ui/react'
import { Token, WorkspaceUpdateRequest } from '@questbook/service-validator-client'
import axios from 'axios'
import {
	ContentState, convertFromRaw, convertToRaw, EditorState,
} from 'draft-js'
import Heading from 'src/components/ui/heading'
import Loader from 'src/components/ui/loader'
import Title from 'src/components/your_grants/edit_grant/form/1_title'
import Details from 'src/components/your_grants/edit_grant/form/2_details'
import ApplicantDetails from 'src/components/your_grants/edit_grant/form/3_applicantDetails'
import GrantRewardsInput from 'src/components/your_grants/edit_grant/form/4_rewards'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import SAFES_ENDPOINTS_MAINNETS from 'src/constants/safesEndpoints.json'
import SAFES_ENDPOINTS_TESTNETS from 'src/constants/safesEndpointsTest.json'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey'
import useUpdateWorkspacePublicKeys from 'src/hooks/useUpdateWorkspacePublicKeys'
import useChainId from 'src/hooks/utils/useChainId'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { ApiClientsContext } from 'src/pages/_app'
import { SafeToken } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

const SAFES_ENDPOINTS = { ...SAFES_ENDPOINTS_MAINNETS, ...SAFES_ENDPOINTS_TESTNETS }
type ValidChainID = keyof typeof SAFES_ENDPOINTS;

function Form({
	onSubmit,
	formData,
	hasClicked
}: {
  onSubmit: (data: any) => void
  formData: any
  hasClicked: boolean
}) {
	const { workspace } = useContext(ApiClientsContext)!
	const maxDescriptionLength = 300
	const { data: accountData } = useQuestbookAccount()
	const [title, setTitle] = useState(formData.title || '')
	const [summary, setSummary] = useState(formData.summary || '')

	const [pk, setPk] = React.useState<string>('*')
	const {
		RenderModal,
		setHiddenModalOpen: setHiddenPkModalOpen,
		transactionData: newPkTransactionData,
		publicKey: newPublicKey,
	} = useSubmitPublicKey()

	const { t } = useTranslation()

	useEffect(() => {
		/// // console.log(pk);
		if(!accountData?.address) {
			return
		}

		if(!workspace) {
			return
		}

		const k = workspace?.members?.find(
			(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
		)?.publicKey?.toString()
		// // console.log(k);
		if(k && k.length > 0) {
			setPk(k)
		} else {
			setPk('')
		}

	}, [workspace, accountData])

	const [titleError, setTitleError] = useState(false)
	const [summaryError, setSummaryError] = useState(false)

	const [details, setDetails] = useState(useMemo(() => {
		try {
			const o = JSON.parse(formData.details)
			return EditorState.createWithContent(convertFromRaw(o))
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			if(formData.details) {
				return EditorState.createWithContent(ContentState.createFromText(formData.details))
			}

			return EditorState.createEmpty()
		}
	}, [formData.details]))
	const [detailsError, setDetailsError] = useState(false)

	const [shouldEncrypt, setShouldEncrypt] = useState(false)
	const [hasOwnerPublicKey, setHasOwnerPublicKey] = useState(false)
	const [keySubmitted, setKeySubmitted] = useState(false)
	const [publicKey] = React.useState<WorkspaceUpdateRequest>({
		publicKey: '',
	})
	const [transactionData, transactionLink, , isBiconomyInitialised] = useUpdateWorkspacePublicKeys(publicKey)

	const { setRefresh } = useCustomToast(transactionLink)
	const [admins, setAdmins] = useState<any[]>([])
	const [maximumPoints, setMaximumPoints] = useState(5)

	useEffect(() => {
		if(transactionData) {
			setKeySubmitted(true)
			// console.log('transactionData-----', transactionData)
			setRefresh(true)
		}
	}, [transactionData])

	useEffect(() => {
		if(workspace && workspace.members && accountData && accountData.address) {
			const hasPubKey = workspace.members.some(
				(member) => member.actorId.toLowerCase() === accountData?.address?.toLowerCase()
          && member.publicKey
          && member.publicKey !== '',
			)
			// console.log('Workspace', workspace)
			setHasOwnerPublicKey(hasPubKey)
		}
	}, [accountData, workspace])

	useEffect(() => {
		if(workspace && workspace.members) {
			const adminAddresses = workspace.members
				.filter((member) => member.publicKey && member.publicKey !== '')
				.map((member) => member.actorId)
			setAdmins(adminAddresses)
		}
	}, [workspace])

	const applicantDetails = applicantDetailsList.map(
		({
			title, tooltip, id, inputType, isRequired,
		}, index) => {
			if(index === applicantDetailsList.length - 1) {
				return null
			}

			if(index === applicantDetailsList.length - 2) {
				return null
			}

			return {
				title,
				required: formData[id] || (isRequired || false),
				id,
				tooltip,
				index,
				inputType,
			}
		},
	).filter((obj) => obj !== null)
	const [detailsRequired, setDetailsRequired] = useState(applicantDetails)
	// const [extraField, setExtraField] = useState(
	//   formData.extraField,
	// );
	const [multipleMilestones, setMultipleMilestones] = useState(
		formData.isMultipleMilestones,
	)
	const [defaultMilestoneFields, setDefaultMilestoneFields] = useState<any[]>(
		Object.keys(formData).filter((key) => key.startsWith('defaultMilestone'))
			.map((key) => {
				const i = key.indexOf('-')
				return ({
					value: key.substring(i + 1).split('\\s').join(' '),
					isError: false,
				})
			}),
	)

	const toggleDetailsRequired = (index: number) => {
		const newDetailsRequired = [...detailsRequired];
		// TODO: create interface for detailsRequired

		// // console.log(newDetailsRequired, index);

		(newDetailsRequired[index] as any).required = !(
      newDetailsRequired[index] as any
		).required
		setDetailsRequired(newDetailsRequired)
	}

	const [rubricRequired, setRubricRequired] = useState(false)
	const [rubrics, setRubrics] = useState<any>([
		{
			name: '',
			nameError: false,
			description: '',
			descriptionError: false,
		},
	])

	const [shouldEncryptReviews, setShouldEncryptReviews] = useState(false)

	useEffect(() => {
		if(!formData) {
			return
		}

		if(formData.isPii) {
			setShouldEncrypt(true)
		}

		const initialRubrics = formData?.rubric
		const newRubrics = [] as any[]
		// console.log('initialRubrics', initialRubrics)
		initialRubrics?.items?.forEach((initalRubric: any) => {
			newRubrics.push({
				name: initalRubric?.title,
				nameError: false,
				description: initalRubric?.details,
				descriptionError: false,
			})
		})
		if(newRubrics.length === 0) {
			return
		}

		setRubrics(newRubrics)
		setRubricRequired(true)
		if(formData?.rubric?.isPrivate) {
			setShouldEncryptReviews(true)
		}

		if(initialRubrics?.items[0]?.maximumPoints) {
			setMaximumPoints(initialRubrics?.items[0]?.maximumPoints)
		}
	}, [formData])

	// const [extraFieldDetails, setExtraFieldDetails] = useState(formData.extra_field || '');
	// const [extraFieldError, setExtraFieldError] = useState(false);

	const [reward, setReward] = React.useState(formData.reward || '')
	const [rewardError, setRewardError] = React.useState(false)
	const [rewardToken, setRewardToken] = React.useState<Token>({
		label: '', address: '', decimal: '18', iconHash: '',
	})

	useEffect(() => {
		// console.log('formData', formData)
	}, [formData])
	const [customFieldsOptionIsVisible, setCustomFieldsOptionIsVisible] = React.useState(
		Object.keys(formData).filter((key) => key.startsWith('customField')).length > 0,
	)
	const [customFields, setCustomFields] = useState<any[]>(
		Object.keys(formData).filter((key) => key.startsWith('customField'))
			.map((key) => {
				const i = key.indexOf('-')
				return ({
					value: key.substring(i + 1).split('\\s').join(' '),
					isError: false,
				})
			}),
	)

	const currentChain = useChainId() || defaultChainId

	const safeAddress = workspace?.safe?.address
	const safeNetwork = workspace?.safe?.chainId as ValidChainID
	const isEVM = parseInt(safeNetwork) !== 900001
	let transactionServiceURL
	// let supportedCurrencies: [] = []
	const [supportedCurrencies, setSupportedCurrencies] = useState([])

	const [rewardCurrency, setRewardCurrency] = React.useState('')
	const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState('')


	// const supportedCurrencies = Object.keys(
	// 	CHAIN_INFO[currentChain].supportedCurrencies,
	// ).map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
	// 	.map((currency) => ({ ...currency, id: currency.address }))
	// const [rewardCurrency, setRewardCurrency] = React.useState(
	// 	formData.rewardCurrency || supportedCurrencies[0].label,
	// )
	// const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
	// 	formData.rewardCurrencyAddress || supportedCurrencies[0].id,
	// )

	/**
   * checks if the workspace already has custom tokens added
   * if custom tokens found, append it to supportedCurrencies
   */
	// if(workspace?.tokens) {
	// 	for(let i = 0; i < workspace.tokens.length; i += 1) {
	// 		supportedCurrencies.push(
	// 			{
	// 				id: workspace.tokens[i].address,
	// 				address: workspace.tokens[i].address,
	// 				decimals: workspace.tokens[i].decimal,
	// 				pair: '',
	// 				label: workspace.tokens[i].label,
	// 				icon: getUrlForIPFSHash(workspace.tokens[i].iconHash),
	// 			},
	// 		)
	// 	}
	// }

	React.useEffect(() => {
		// console.log(currentChain);
		// if(currentChain) {
		// 	const supportedCurrencies = Object.keys(
		// 		CHAIN_INFO[currentChain].supportedCurrencies,
		// 	)
		// 		.map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
		// 		.map((currency) => ({ ...currency, id: currency.address }))
		if(safeNetwork && formData.rewardCurrency) {
			// console.log('form data', formData)
			transactionServiceURL = SAFES_ENDPOINTS[safeNetwork]
			// console.log('transaction service url', safeNetwork, transactionServiceURL)
			const gnosisUrl = `${transactionServiceURL}/v1/safes/${safeAddress}/balances/`
			axios.get(gnosisUrl).then(res => {
				// console.log(res.data)
				let tokens
				if(safeNetwork === '42220') {
					console.log('reward currency', tokens)
					let localTokenData: {icon: string, label: string, address: string, decimals: number, pair?: string}

					tokens = res.data.filter((token: SafeToken) => token.tokenAddress).map((token: SafeToken) => {
						if(token.tokenAddress) {
							if(CHAIN_INFO[safeNetwork].supportedCurrencies.hasOwnProperty(token.tokenAddress.toLowerCase())) {
								localTokenData = CHAIN_INFO[safeNetwork].supportedCurrencies[token.tokenAddress.toLowerCase()]
							}

							console.log('currency', localTokenData)
							const currency = {
								'id': token.tokenAddress,
								'address': token.tokenAddress,
								'decimals': token.token.decimals,
								'icon': localTokenData ? localTokenData.icon : token.token.logoUri,
								'label': token.token.symbol,
								'pair': ''
							}
							return currency
						}
					})


				} else {
					tokens = res.data.filter((token: SafeToken) => token.tokenAddress).map((token: SafeToken) => {
						if(token.tokenAddress) {
							const currency = {
								'id': token.tokenAddress,
								'address': token.tokenAddress,
								'decimals': token.token.decimals,
								'icon': token.token.logoUri,
								'label': token.token.symbol,
								'pair': ''
							}
							return currency
						}
					})
					setRewardToken({ address: tokens[0]?.address, decimal: tokens[0]?.decimals.toString(), label: tokens[0]?.label, iconHash: tokens[0]?.icon })
				}

				setSupportedCurrencies(tokens)
				// console.log('balances', supportedCurrencies)
				setRewardCurrency(tokens[0]?.label)

				setRewardCurrencyAddress(tokens[0]?.address)
			})
		}


	}, [currentChain])

	const [date, setDate] = React.useState(formData.date || '')
	const [dateError, setDateError] = React.useState(false)

	const handleOnSubmit = () => {
		let error = false
		if(title.length <= 0) {
			setTitleError(true)
			error = true
		}

		if(summary.length <= 0) {
			setSummaryError(true)
			error = true
		}

		if(!details.getCurrentContent().hasText()) {
			setDetailsError(true)
			error = true
		}

		// if (extraField && extraFieldDetails.length <= 0) {
		//   setExtraFieldError(true);
		//   error = true;
		// }
		if(reward.length <= 0) {
			setRewardError(true)
			error = true
		}

		if(date.length <= 0) {
			setDateError(true)
			error = true
		}

		if(customFieldsOptionIsVisible) {
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

		if(defaultMilestoneFields.length > 0) {
			const errorCheckedDefaultMilestoneFields = defaultMilestoneFields
				.map((defaultMilestoneField: any) => {
					const errorCheckedDefaultMilestoneField = { ...defaultMilestoneField }
					if(defaultMilestoneField.value.length <= 0) {
						errorCheckedDefaultMilestoneField.isError = true
						error = true
					}

					return errorCheckedDefaultMilestoneField
				})
			setDefaultMilestoneFields(errorCheckedDefaultMilestoneFields)
		}

		if(rubricRequired) {
			const errorCheckedRubrics = rubrics.map((rubric: any) => {
				const errorCheckedRubric = { ...rubric }
				if(rubric.name.length <= 0) {
					errorCheckedRubric.nameError = true
					error = true
				}

				if(rubric.description.length <= 0) {
					errorCheckedRubric.descriptionError = true
					error = true
				}

				return errorCheckedRubric
			})
			setRubrics(errorCheckedRubrics)
		}

		if(!error) {
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

			let s
			if(rewardCurrencyAddress) {
				s = {
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
			} else {
				console.log('USD asset')
				s = {
					title,
					summary,
					details: detailsString,
					fields,
					reward,
					date,
					grantManagers: admins,
					rubric: {
						isPrivate: shouldEncryptReviews,
						rubric,
					},
				}
			}

			if((shouldEncrypt || shouldEncryptReviews) && (!pk || pk === '*')) {
				setHiddenPkModalOpen(true)
				return
			}

			onSubmit(s)
		}
	}

	useEffect(() => {
		if(newPkTransactionData && newPublicKey && newPublicKey.publicKey) {
			// // console.log(newPublicKey);
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

	const buttonRef = React.useRef<HTMLButtonElement>(null)
	return (
		<>
			<Heading
				mt='18px'
				title='Edit Grant' />

			<Flex
				mt='-73px'
				justifyContent='flex-end'>
				<Button
					disabled={!isBiconomyInitialised}
					ref={buttonRef}
					w={hasClicked ? buttonRef.current?.offsetWidth : 'auto'}
					onClick={hasClicked ? () => { } : handleOnSubmit}
					py={hasClicked ? 2 : 0}
					variant='primary'
				>
					{hasClicked ? <Loader /> : 'Save'}
				</Button>
			</Flex>

			<Title
				title={title}
				setTitle={setTitle}
				titleError={titleError}
				setTitleError={setTitleError}
				summary={summary}
				setSummary={setSummary}
				summaryError={summaryError}
				setSummaryError={setSummaryError}
				maxDescriptionLength={maxDescriptionLength}
			/>

			<Details
				details={details}
				setDetails={setDetails}
				detailsError={detailsError}
				setDetailsError={setDetailsError}
			/>

			<Text
				fontSize='18px'
				fontWeight='700'
				lineHeight='26px'
				letterSpacing={0}
				mt='40px'
			>
				{t('/create-grant.proposal_form.title')}
			</Text>
			<Box mt='20px' />
			<ApplicantDetails
				detailsRequired={detailsRequired}
				toggleDetailsRequired={toggleDetailsRequired}
				// extraField={extraField}
				// setExtraField={setExtraField}
				// extraFieldDetails={extraFieldDetails}
				// setExtraFieldDetails={setExtraFieldDetails}
				// extraFieldError={extraFieldError}
				// setExtraFieldError={setExtraFieldError}
				customFields={customFields}
				setCustomFields={setCustomFields}
				customFieldsOptionIsVisible={customFieldsOptionIsVisible}
				setCustomFieldsOptionIsVisible={setCustomFieldsOptionIsVisible}
				multipleMilestones={multipleMilestones}
				setMultipleMilestones={setMultipleMilestones}
				defaultMilestoneFields={defaultMilestoneFields}
				setDefaultMilestoneFields={setDefaultMilestoneFields}
				defaultMilestoneFieldsOptionIsVisible={Object.keys(formData).filter((key) => key.startsWith('defaultMilestone')).length > 0}
				rubricRequired={rubricRequired}
				setRubricRequired={setRubricRequired}
				rubrics={rubrics}
				setRubrics={setRubrics}
				// setMaximumPoints={setMaximumPoints}
				defaultRubricsPresent={formData?.rubric.items.length > 0}
			/>

			<GrantRewardsInput
				reward={reward}
				setReward={setReward}
				rewardError={rewardError}
				setRewardError={setRewardError}
				setRewardToken={setRewardToken}
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
				defaultShouldEncrypt={formData.isPii}
				defaultShouldEncryptReviews={formData?.rubric.isPrivate}
				shouldEncryptReviews={shouldEncryptReviews}
				setShouldEncryptReviews={setShouldEncryptReviews}
				isEVM={isEVM}
			/>

			{/* <Flex
				alignItems='flex-start'
				mt={8}
				mb={10}
				maxW='400'>
				<Image
					display='inline-block'
					h='10px'
					w='10px'
					src='/ui_icons/info_brand.svg'
					mt={1}
					mr={2}
				/>
				{' '}
				<Text variant='footer'>
					By clicking Publish Grant you&apos;ll have to approve this transaction
					in your wallet.
					{' '}
					<Link
						href='https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46'
						isExternal>
						Learn more
					</Link>
					{' '}
					<Image
						display='inline-block'
						h='10px'
						w='10px'
						src='/ui_icons/link.svg'
					/>
				</Text>
			</Flex> */}

			<Button
				mt={8}
				disabled={!isBiconomyInitialised}
				onClick={hasClicked ? () => { } : handleOnSubmit}
				variant='primary'>
				{hasClicked ? <Loader /> : 'Save Changes'}
			</Button>

			<RenderModal />
		</>
	)
}

export default Form
