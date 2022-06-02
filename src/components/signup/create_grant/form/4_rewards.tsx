import React, { useContext, useEffect, useState } from 'react'
import {
	Box, Button, Flex, Image, Link, Switch,
	Text, } from '@chakra-ui/react'
import {
	Token,
	WorkspaceUpdateRequest,
} from '@questbook/service-validator-client'
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import CustomTokenModal from 'src/components/ui/submitCustomTokenModal'
import Tooltip from 'src/components/ui/tooltip'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import { DefaultSupportedChainId } from 'src/constants/chains'
import useUpdateWorkspacePublicKeys from 'src/hooks/useUpdateWorkspacePublicKeys'
import useChainId from 'src/hooks/utils/useChainId'
import useEncryption from 'src/hooks/utils/useEncryption'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useNetwork } from 'wagmi'
import 'react-datepicker/dist/react-datepicker.css'
import Datepicker from '../../../ui/forms/datepicker'
import Dropdown from '../../../ui/forms/dropdown'
import SingleLineInput from '../../../ui/forms/singleLineInput'

interface Props {
  onSubmit: (data: any) => void;
  constructCache: (data: any) => void;
  cacheKey: string;
  hasClicked: boolean;
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

	const addERC = true

	const currentChain = useChainId() ?? DefaultSupportedChainId

	const supportedCurrencies = Object.keys(
		CHAIN_INFO[currentChain].supportedCurrencies,
	)
		.map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
		.map((currency) => ({ ...currency, id: currency.address }))

	const [rewardCurrency, setRewardCurrency] = React.useState(
		supportedCurrencies[0].label,
	)

	const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
		supportedCurrencies[0].address,
	)

	// eslint-disable-next-line max-len
	const [supportedCurrenciesList, setSupportedCurrenciesList] = React.useState<
  any[]
  >([supportedCurrencies])

	useEffect(() => {
		if(supportedCurrencies && supportedCurrencies.length > 0) {
			console.log('Supported Currencies', supportedCurrencies)
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
			console.log(' (CREATE_GRANT) Switch Network: ', workspace, chainId)
			switchNetwork(chainId!)
		}
	}, [switchNetwork, workspace])

	useEffect(() => {
		console.log(currentChain)
		if(currentChain) {
			const currencies = Object.keys(
				CHAIN_INFO[currentChain].supportedCurrencies,
			)
				.map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
				.map((currency) => ({ ...currency, id: currency.address }))
			// console.log('Reward Currency', rewardCurrency);
			setSupportedCurrenciesList(currencies)
			setRewardCurrency(currencies[0].label)
			setRewardCurrencyAddress(currencies[0].address)
		}

	}, [currentChain])

	useEffect(() => {
		console.log(rewardCurrencyAddress)
	}, [rewardCurrencyAddress])

	const [date, setDate] = React.useState('')
	const [dateError, setDateError] = React.useState(false)

	const [keySubmitted, setKeySubmitted] = useState(false)
	const [shouldEncrypt, setShouldEncrypt] = useState(false)
	const [publicKey, setPublicKey] = React.useState<WorkspaceUpdateRequest>({
		publicKey: '',
	})
	const [transactionData] = useUpdateWorkspacePublicKeys(publicKey)

	const [shouldEncryptReviews, setShouldEncryptReviews] = useState(false)

	useEffect(() => {
		if(transactionData) {
			setKeySubmitted(true)
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

		console.log(reward)
		console.log(rewardCurrencyAddress)

		if(!error) {
			let pk
			if((shouldEncrypt || shouldEncryptReviews) && !keySubmitted) {
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

		const formData = JSON.parse(data ?? '{}')
		console.log('Data from cache: ', formData)

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

	return (
		<>
			<Flex
				py={12}
				direction="column">
				<Text
					variant="heading"
					fontSize="36px"
					lineHeight="48px">
          What&apos;s the reward and deadline for the grant?
				</Text>

				<Flex
					direction="row"
					mt={12}>
					<Box
						minW="160px"
						flex={1}>
						<SingleLineInput
							label="Grant Reward"
							placeholder="100"
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
							errorText="Required"
							type="number"
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
					<Box
						mt={5}
						ml={4}
						minW="132px"
						flex={0}>
						<Dropdown
							listItemsMinWidth="132px"
							listItems={supportedCurrenciesList}
							value={rewardCurrency}
							onChange={
								(data: any) => {
								// console.log('data while signing up:', data);
									if(data === 'addERCToken') {
										setIsModalOpen(true)
									}

									setRewardCurrency(data.label)
									setRewardCurrencyAddress(data.id)
									if(
										data !== 'addERCToken'
                  && !isJustAddedToken
                  && data.icon.lastIndexOf('ui_icons') === -1
									) {
									// console.log('custom token', data);
										setRewardToken({
											iconHash: data.icon.substring(
												data.icon.lastIndexOf('=') + 1,
											),
											address: data.address,
											label: data.label,
											decimal: data.decimals.toString(),
										})
									}
								}
							}
							addERC={addERC}
						/>
					</Box>
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
					errorText="Required"
					label="Grant Deadline"
					tooltip="This is the last date on/before which grantees can apply"
				/>

				<Flex
					direction="column"
					mt={12}>
					<Text
						fontSize="18px"
						fontWeight="700"
						lineHeight="26px"
						letterSpacing={0}
					>
            Grant privacy
					</Text>
				</Flex>

				<Flex
					mt={8}
					gap="2">
					<Flex
						direction="column"
						flex={1}>
						<Text
							color="#122224"
							fontWeight="bold"
							fontSize="16px"
							lineHeight="20px"
						>
              Hide applicant personal data (email, and about team)
						</Text>
						<Flex>
							<Text
								color="#717A7C"
								fontSize="14px"
								lineHeight="20px">
                You will be using your public key to access this data.
								<Tooltip
									icon="/ui_icons/tooltip_questionmark.svg"
									label="Public key linked to your wallet will allow you to see the hidden data."
									placement="bottom-start"
								/>
							</Text>
						</Flex>
					</Flex>
					<Flex
						justifyContent="center"
						gap={2}
						alignItems="center">
						<Switch
							id="encrypt"
							onChange={
								(e) => {
									setShouldEncrypt(e.target.checked)
								}
							}
						/>
						<Text
							fontSize="12px"
							fontWeight="bold"
							lineHeight="16px">
							{`${shouldEncrypt ? 'YES' : 'NO'}`}
						</Text>
					</Flex>
				</Flex>

				<Flex
					mt={8}
					gap="2"
					justifyContent="space-between">
					<Flex
						direction="column"
						flex={1}>
						<Text
							color="#122224"
							fontWeight="bold"
							fontSize="16px"
							lineHeight="20px"
						>
              Keep applicant reviews private
						</Text>
						<Flex>
							<Text
								color="#717A7C"
								fontSize="14px"
								lineHeight="20px">
                Private review is only visible to reviewers, DAO members.
							</Text>
						</Flex>
					</Flex>
					<Flex
						ml="auto"
						justifyContent="center"
						gap={2}
						alignItems="center">
						<Switch
							id="encrypt"
							onChange={
								(e) => {
									setShouldEncryptReviews(e.target.checked)
								}
							}
						/>
						<Text
							fontSize="12px"
							fontWeight="bold"
							lineHeight="16px">
							{`${shouldEncryptReviews ? 'YES' : 'NO'}`}
						</Text>
					</Flex>
				</Flex>

				<Text
					variant="footer"
					mt={8}
					mb={7}
					maxW="400">
					<Image
						display="inline-block"
						h="10px"
						w="10px"
						src="/ui_icons/info_brand.svg"
					/>
					{' '}
          By clicking Publish Grant you&apos;ll have to approve this transaction
          in your wallet.
					{' '}
					<Link
						href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
						isExternal
					>
            Learn more
					</Link>
					{' '}
					<Image
						display="inline-block"
						h="10px"
						w="10px"
						src="/ui_icons/link.svg"
					/>
				</Text>
			</Flex>

			<Button
				ref={buttonRef}
				mt="auto"
				variant="primary"
				onClick={hasClicked ? () => {} : handleOnSubmit}
				py={hasClicked ? 2 : 0}
				w={hasClicked ? buttonRef.current?.offsetWidth : 'auto'}
			>
				{hasClicked ? <Loader /> : 'Continue'}
			</Button>
		</>
	)
}

export default GrantRewardsInput
