import React, { useContext, useEffect } from 'react'
import {
	Button,
	Divider,
	Flex,
	Heading,
	IconButton,
	Image,
	ModalBody,
	Text,
	useToast,
} from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { BigNumber, ethers } from 'ethers'
import Lottie from 'lottie-react'
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import config from 'src/constants/config.json'
import useDepositFunds from 'src/hooks/useDepositFunds'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useContract, useNetwork, useSigner } from 'wagmi'
import animationData from '../../../../public/animations/Add_Funds.json'
import ERC20ABI from '../../../contracts/abi/ERC20.json'
import { formatAmount } from '../../../utils/formattingUtils'
import Dropdown from '../../ui/forms/dropdown'
import SingleLineInput from '../../ui/forms/singleLineInput'
import Modal from '../../ui/modal'

interface Props {
  isOpen: boolean;
  onClose: () => void;
  grantAddress: string;
  rewardAsset: {
    address: string;
    committed: BigNumber;
    label: string;
    icon: string;
  };
}

function AddFunds({
	isOpen, onClose, grantAddress, rewardAsset,
}: Props) {
	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const [type, setType] = React.useState(-1)
	const [funding, setFunding] = React.useState('')
	const [error, setError] = React.useState(false)
	const [walletBalance, setWalletBalance] = React.useState(0)
	const [rewardAssetDecimals, setRewardAssetDecimals] = React.useState(0)

	const nextScreenTexts = [
		'Deposit funds from another wallet',
		'Deposit funds from connected wallet',
	]
	const stepsWhenAddingFromAnotherWallet = [
		'Open your wallet which has funds.',
		'Send the funds to the address below.',
	]

	const toast = useToast()
	const { switchNetwork } = useNetwork()
	const { data: signer } = useSigner()
	const rewardAssetContract = useContract({
		addressOrName:
      rewardAsset.address || '0x0000000000000000000000000000000000000000',
		contractInterface: ERC20ABI,
		signerOrProvider: signer,
	})

	const copyToClipboard = async() => {
		copy(grantAddress)
		toast({
			title: 'Copied!',
			status: 'success',
			duration: 9000,
			isClosable: true,
		})
	}

	const [finalAmount, setFinalAmount] = React.useState<BigNumber>()
	const [depositTransactionData, txnLink, loading] = useDepositFunds(
		finalAmount,
		rewardAsset.address,
		grantAddress,
	)

	useEffect(() => {
		if(workspace && switchNetwork && isOpen) {
			const chainId = getSupportedChainIdFromWorkspace(workspace)
			console.log(' (ADD FUNDS MODAL) Switch Network: ', workspace, chainId)
			switchNetwork(chainId!)
		}
	}, [isOpen, switchNetwork, workspace])

	const { setRefresh } = useCustomToast(txnLink)
	useEffect(() => {
		// console.log(depositTransactionData);
		if(depositTransactionData) {
			onClose()
			setFinalAmount(undefined)
			setFunding('')
			setRefresh(true)
		}

	}, [depositTransactionData])

	useEffect(() => {
		// eslint-disable-next-line func-names
		(async function() {
			try {
				if(!rewardAssetContract.provider) {
					return
				}

				const assetDecimal = await rewardAssetContract.decimals()
				setRewardAssetDecimals(assetDecimal)
				const tempAddress = await signer?.getAddress()
				const tempWalletBalance = await rewardAssetContract.balanceOf(
					// signerStates.data._address,
					tempAddress,
				)
				setWalletBalance(tempWalletBalance)
			} catch(e) {
				// console.error(e);
			}
		}())
	}, [signer, rewardAssetContract])

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onClose()}
			title="Add Funds"
			leftIcon={
				type !== -1 && (
					<IconButton
						aria-label="Back"
						variant="ghost"
						_hover={{}}
						_active={{}}
						icon={
							<Image
								mr={8}
								src="/ui_icons/black/chevron_left.svg" />
						}
						onClick={() => setType(-1)}
					/>
				)
			}
			rightIcon={
				(
					<Button
						_focus={{}}
						variant="link"
						color="#AA82F0"
						leftIcon={<Image src="/sidebar/discord_icon.svg" />}
						onClick={() => window.open(config.supportLink)}
					>
          Support 24*7
					</Button>
				)
			}
			modalWidth={527}
		>
			<ModalBody>
				{
					type === -1 && (
						<Flex
							px={7}
							mb={7}
							mt={9}
							direction="column"
							justify="start"
							align="center"
						>
							{/* <Image src="/illustrations/add_funds_body.svg" /> */}
							<Lottie animationData={animationData} />
							<Text
								mt={10}
								textAlign="center"
								fontSize="28px"
								lineHeight="40px"
								fontWeight="700"
							>
              Verified grants = 10x applicants
							</Text>
							<Text
								variant="applicationText"
								textAlign="center"
								mt="3px">
              Add funds to get a verified badge.
							</Text>
							<Text
								variant="applicationText"
								textAlign="center"
								mt={0}>
              Deposit and withdraw funds anytime.
							</Text>
							<Flex
								direction="column"
								mt={8}
								w="100%">
								<Divider />
								{
									nextScreenTexts.map((text, index) => (
										<>
											<Flex
												direction="row"
												justify="space-between"
												align="center"
												mx={4}
											>
												<Flex direction="row">
													<Button
														_active={{}}
														onClick={() => setType(index)}
														variant="link"
														my={4}>
														<Text
															variant="tableBody"
															color="#8850EA">
															{text}
															{' '}
														</Text>
													</Button>
													<Image
														ml={2}
														display="inline-block"
														alt="another_wallet"
														src="/ui_icons/info_brand_light.svg"
													/>
												</Flex>
												<IconButton
													aria-label="right_chevron"
													variant="ghost"
													_hover={{}}
													_active={{}}
													w="13px"
													h="6px"
													icon={<Image src="/ui_icons/brand/chevron_right.svg" />}
													onClick={() => setType(index)}
												/>
											</Flex>
											<Divider />
										</>
									))
								}
							</Flex>
						</Flex>
					)
				}
				{
					type === 0 && (
						<Flex direction="column">
							<Heading variant="page">
								Deposit funds from another wallet
							</Heading>
							<Flex
								direction="column"
								align="start">
								{
									stepsWhenAddingFromAnotherWallet.map((text, index) => (
										<Flex
											key={index}
											direction="row"
											justify="start"
											mt={8}
											align="center">
											<Flex
												bg="brand.500"
												w={10}
												h={10}
												borderRadius="50%"
												justify="center"
												align="center"
												mr={4}
											>
												<Text
													variant="tableBody"
													color="white"
													textAlign="center">
													{index + 1}
												</Text>
											</Flex>
											<Text>
												{text}
											</Text>
										</Flex>
									))
								}
							</Flex>
							<Flex
								w="100%"
								mt={7}>
								<SingleLineInput
									label="Smart Contract Address"
									height="80px"
									inputRightElement={
										(
											<Button
												variant="primary"
												w="89px"
												h="48px"
												mr={20}
												onClick={() => copyToClipboard()}
											>
                    Copy
											</Button>
										)
									}
									value={
										`${grantAddress.substring(
											0,
											12,
										)}....${grantAddress.substring(
											grantAddress.length - 13,
											grantAddress.length,
										)}`
									}
									disabled
									onChange={() => {}}
									isError={false}
									subtextAlign="center"
									tooltip="Smart Contract Address is the address of the smart contract that will receive the funds."
								/>
							</Flex>
							<Heading
								variant="applicationHeading"
								textAlign="center"
								color="#717A7C"
								mt={4}
							>
              Send only
								{' '}
								{rewardAsset.label}
								{' '}
              token to this
								{' '}
								{rewardAsset.label === 'WMATIC' ? 'Polygon' : 'Ethereum'}
								{' '}
              address.
							</Heading>
							<Button
								variant="primary"
								my={8}
								onClick={() => onClose()}>
              OK
							</Button>
						</Flex>
					)
				}
				{
					type === 1 && (
						<Flex direction="column">
							<Heading variant="page">
Deposit funds from your wallet
							</Heading>
							<Flex
								direction="row"
								mt={5}>
								<Image src="/ui_icons/grant_reward.svg" />
								<Flex
									flex={1}
									direction="column"
									ml={3}>
									<Text fontWeight="500">
Grant Reward
									</Text>
									<Text
										variant="footer"
										color="brand.500"
										fontWeight="700">
										{
											rewardAsset
                    && rewardAsset.committed
                    && formatAmount(rewardAsset.committed.toString(), rewardAssetDecimals)
										}
										{' '}
										{rewardAsset?.label}
									</Text>
								</Flex>
							</Flex>
							<Flex
								direction="row"
								w="100%"
								alignItems="start"
								justify="space-between"
								mt={5}
							>
								<Flex
									w="70%"
									direction="column">
									<SingleLineInput
										label="Deposit Amount"
										placeholder="100"
										value={funding}
										onChange={
											(e) => {
												if(error) {
													setError(false)
												}

												setFunding(e.target.value)
											}
										}
										isError={error}
										errorText="Required"
										type="number"
									/>
								</Flex>
								<Flex
									direction="column"
									w="25%"
									mt="20px">
									<Dropdown
										listItemsMinWidth="132px"
										listItems={
											[
												{
													icon: rewardAsset?.icon,
													label: rewardAsset?.label,
												},
											]
										}
									/>
								</Flex>
							</Flex>
							<Text
								mt={1}
								variant="tableHeader"
								color="#122224">
              Wallet Balance
								{' '}
								<Text
									variant="tableHeader"
									display="inline-block">
									{
										`${formatAmount(walletBalance.toString(), rewardAssetDecimals)} ${
											rewardAsset?.label
										}`
									}
								</Text>
							</Text>

							<Button
								variant="primary"
								my={8}
								py={loading ? 2 : 0}
								onClick={
									loading ? () => {} : () => {
										if(funding === '') {
											setError(true); return
										}

										setFinalAmount(ethers.utils.parseUnits(funding, rewardAssetDecimals))
									}
								}
							>
								{loading ? <Loader /> : 'Deposit'}
							</Button>
						</Flex>
					)
				}
			</ModalBody>
		</Modal>
	)
}

export default AddFunds
