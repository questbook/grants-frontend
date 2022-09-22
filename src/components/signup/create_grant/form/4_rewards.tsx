import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box, Button, Flex, Image, Link, Switch,
	Text,
} from '@chakra-ui/react'
import {
	Token,
	WorkspaceUpdateRequest,
} from '@questbook/service-validator-client'
import Datepicker from 'src/components/ui/forms/datepicker'
import Dropdown from 'src/components/ui/forms/dropdown'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import Loader from 'src/components/ui/loader'
import CustomTokenModal from 'src/components/ui/submitCustomTokenModal'
import SAFES_ENDPOINTS_MAINNETS from 'src/constants/safesEndpoints.json'
import SAFES_ENDPOINTS_TESTNETS from 'src/constants/safesEndpointsTest.json'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import useUpdateWorkspacePublicKeys from 'src/hooks/useUpdateWorkspacePublicKeys'
import useChainId from 'src/hooks/utils/useChainId'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import useEncryption from 'src/hooks/utils/useEncryption'
import { ApiClientsContext } from 'src/pages/_app'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import 'react-datepicker/dist/react-datepicker.css'

const SAFES_ENDPOINTS = { ...SAFES_ENDPOINTS_MAINNETS, ...SAFES_ENDPOINTS_TESTNETS }
type ValidChainID = keyof typeof SAFES_ENDPOINTS;

interface Props {
	onSubmit: (data: any) => void
	constructCache: (data: any) => void
	cacheKey: string
	hasClicked: boolean
}

function GrantRewardsInput({
	onSubmit,
	constructCache,
	cacheKey,
	hasClicked,
}: Props) {
	const { getPublicEncryptionKey } = useEncryption()
	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const [reward, setReward] = React.useState('')
	const [rewardToken, setRewardToken] = React.useState<Token>({
		label: '',
		address: '',
		decimal: '18',
		iconHash: '',
	})
	const [rewardError, setRewardError] = React.useState(false)
	const { switchNetwork } = useNetwork()
	const [isModalOpen, setIsModalOpen] = React.useState(false)
	const [isJustAddedToken, setIsJustAddedToken] = React.useState<boolean>(false)
	// const [supportedCurrencies, setSupportedCurrencies] = React.useState([]);

	const addERC = false


	// const supportedCurrencies = Object.keys(
	// 	CHAIN_INFO[currentChain].supportedCurrencies,
	// )
	// 	.map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
	// 	.map((currency) => ({ ...currency, id: currency.address }))

	// const [rewardCurrency, setRewardCurrency] = React.useState(
	// 	supportedCurrencies[0].label,
	// )

	// const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
	// 	supportedCurrencies[0].address,
	// )

	const safeAddress = workspace?.safe?.address
	const safeNetwork = workspace?.safe?.chainId as ValidChainID
	const isEVM = parseInt(safeNetwork) !== 900001
	let transactionServiceURL
	// let supportedCurrencies: [] = []
	const [supportedCurrencies, setSupportedCurrencies] = useState([])

	const [rewardCurrency, setRewardCurrency] = React.useState('')
	const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState('')


	// eslint-disable-next-line max-len
	const [supportedCurrenciesList, setSupportedCurrenciesList] = React.useState<
		any[]
	>([supportedCurrencies])

	const { t } = useTranslation()

	useEffect(() => {
		if(supportedCurrencies && supportedCurrencies.length > 0) {
			// console.log('Supported Currencies', supportedCurrencies)
			// setSupportedCurrenciesList(supportedCurrencies);
		}
	}, [supportedCurrencies])

	// if (workspace?.tokens) {
	//   for (let i = 0; i < workspace.tokens.length; i += 1) {
	//     supportedCurrencies.push(
	//       {
	//         id: workspace.tokens[i].address,
	//         address: workspace.tokens[i].address,
	//         decimals: workspace.tokens[i].decimal,
	//         label: workspace.tokens[i].label,
	//         icon: getUrlForIPFSHash(workspace.tokens[i].iconHash),
	//       },
	//     );
	//   }
	// }

	useEffect(() => {
		if(workspace && switchNetwork) {
			const chainId = getSupportedChainIdFromWorkspace(workspace)
			// console.log(' (CREATE_GRANT) Switch Network: ', workspace, chainId)
			logger.info('SWITCH NETWORK (create-dao.tsx 1): ', chainId!)
			switchNetwork(chainId!)
		}
	}, [switchNetwork, workspace])


	useEffect(() => {
		// console.log(rewardCurrencyAddress)
	}, [rewardCurrencyAddress])

	const [date, setDate] = React.useState('')
	const [dateError, setDateError] = React.useState(false)

	const [keySubmitted, setKeySubmitted] = useState(false)
	const [shouldEncrypt, setShouldEncrypt] = useState(false)
	const [publicKey, setPublicKey] = React.useState<WorkspaceUpdateRequest>({
		publicKey: '',
	})
	const [transactionData, transactionLink, loading, isBiconomyInitialised] = useUpdateWorkspacePublicKeys(publicKey)

	const { setRefresh } = useCustomToast(transactionLink)
	const [shouldEncryptReviews, setShouldEncryptReviews] = useState(false)
	const [showDropdown, setShowDropdown] = useState(false)

	useEffect(() => {
		if(transactionData) {
			setKeySubmitted(true)
			setRefresh(true)
		}
	}, [transactionData])

	const buttonRef = React.useRef<HTMLButtonElement>(null)

	const handleOnSubmit = async() => {
		let error = false
		if(reward.length <= 0) {
			setRewardError(true)
			error = true
		}

		if(date.length <= 0) {
			setDateError(true)
			error = true
		}

		// console.log(reward)
		// console.log(rewardCurrencyAddress)

		if(!error) {
			let pk
			if(shouldEncrypt && !keySubmitted) {
				pk = await getPublicEncryptionKey()
				if(!pk) {
					return
				}

				setPublicKey({ publicKey: pk })
			}

			let pii = false
			if(shouldEncrypt && keySubmitted) {
				pii = true
			}

			onSubmit({
				reward, rewardToken, rewardCurrencyAddress, date, pii, shouldEncryptReviews, publicKey: pk,
			})
		}
	}

	React.useEffect(() => {
		if(cacheKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const data = localStorage.getItem(cacheKey)
		if(data === 'undefined') {
			return
		}

		const formData = JSON.parse(data || '{}')
		// console.log('Data from cache: ', formData)

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
	}, [cacheKey])

	React.useEffect(() => {
		const formData = {
			reward,
			rewardToken,
			rewardCurrency,
			rewardCurrencyAddress,
			date,
			shouldEncrypt,
			shouldEncryptReviews,
		}
		constructCache(formData)

	}, [
		date,
		reward,
		rewardCurrency,
		rewardCurrencyAddress,
		rewardToken,
		shouldEncrypt,
		shouldEncryptReviews,
	])

	useEffect(() => {
		const CurrenciesList = supportedCurrenciesList.filter((currencyItem) => currencyItem.length > 0)
		setShowDropdown(CurrenciesList.length > 0)
	}, [supportedCurrenciesList])

	return (
		<>
			<Flex
				py={12}
				direction='column'>
				<Flex
					direction='row'
					mt={12}>
					<Box
						minW='160px'
						flex={1}>
						<SingleLineInput
							label={t('/create-grant.amount')}
							placeholder='100'
							value={reward}
							onChange={
								(e) => {
									if(rewardError) {
										setRewardError(false)
									}

									setReward(e.target.value)
								}
							}
							isError={rewardError}
							errorText='Required'
							type='number'
						/>
					</Box>
					<CustomTokenModal
						isModalOpen={isModalOpen}
						setIsModalOpen={setIsModalOpen}
						setRewardCurrency={setRewardCurrency}
						setRewardCurrencyAddress={setRewardCurrencyAddress}
						setRewardToken={setRewardToken}
						supportedCurrenciesList={supportedCurrencies}
						setSupportedCurrenciesList={setSupportedCurrenciesList}
						setIsJustAddedToken={setIsJustAddedToken}
					/>

				</Flex>

				<Box mt={12} />

				<Datepicker
					onChange={
						(e) => {
							if(dateError) {
								setDateError(false)
							}

							setDate(e.target.value)
						}
					}
					value={date}
					isError={dateError}
					errorText='Required'
					label='Proposal Deadline'
				/>


				{/* <Flex
					mt={8}
					gap='2'>
					<Flex
						direction='column'
						flex={1}>
						<Text
							color='#122224'
							fontWeight='bold'
							fontSize='16px'
							lineHeight='20px'
						>
							Hide applicant personal data (email, and about team)
						</Text>
						<Flex>
							<Text
								color='#717A7C'
								fontSize='14px'
								lineHeight='20px'>
								You will be using your public key to access this data.
								<Tooltip
									icon='/ui_icons/tooltip_questionmark.svg'
									label='Public key linked to your wallet will allow you to see the hidden data.'
									placement='bottom-start'
								/>
							</Text>
						</Flex>
					</Flex>
					<Flex
						justifyContent='center'
						gap={2}
						alignItems='center'>
						<Switch
							id='encrypt'
							onChange={
								(e) => {
									setShouldEncrypt(e.target.checked)
								}
							}
						/>
						<Text
							fontSize='12px'
							fontWeight='bold'
							lineHeight='16px'>
							{`${shouldEncrypt ? 'YES' : 'NO'}`}
						</Text>
					</Flex>
				</Flex> */}

				<Flex
					mt={8}
					gap='2'
					justifyContent='space-between'>
					<Flex
						direction='column'
						flex={1}>
						<Text
							color='#122224'
							fontWeight='bold'
							fontSize='16px'
							lineHeight='20px'
						>
							{t('/create-grant.private_review')}
						</Text>
						<Flex>
							<Text
								color='#717A7C'
								fontSize='14px'
								lineHeight='20px'>
								{t('/create-grant.private_review_desc')}
							</Text>
						</Flex>
					</Flex>
					<Flex
						ml='auto'
						justifyContent='center'
						gap={2}
						alignItems='center'>
						<Switch
							id='encrypt'
							onChange={
								(e) => {
									setShouldEncryptReviews(e.target.checked)
								}
							}
						/>
						<Text
							fontSize='12px'
							fontWeight='bold'
							lineHeight='16px'>
							{`${shouldEncryptReviews ? 'YES' : 'NO'}`}
						</Text>
					</Flex>
				</Flex>

				{/* <Text
					variant='footer'
					mt={8}
					mb={7}
					maxW='400'>
					<Image
						display='inline-block'
						h='10px'
						w='10px'
						src='/ui_icons/info_brand.svg'
					/>
					{' '}
					By clicking Publish Grant you&apos;ll have to approve this transaction
					in your wallet.
					{' '}
					<Link
						href='https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46'
						isExternal
					>
						Learn more
					</Link>
					{' '}
					<Image
						display='inline-block'
						h='10px'
						w='10px'
						src='/ui_icons/link.svg'
					/>
				</Text> */}
			</Flex>

			<Button
				disabled={!isBiconomyInitialised}
				ref={buttonRef}
				mt='auto'
				variant='primary'
				onClick={hasClicked ? () => { } : handleOnSubmit}
				w={hasClicked ? buttonRef.current?.offsetWidth : 'auto'}
			>
				{hasClicked ? <Loader /> : 'Continue'}
			</Button>
		</>
	)
}

export default GrantRewardsInput