// UTILS AND HOOKS
import React, { useEffect, useState } from 'react'
import {
	Button,
	Flex,
	Heading,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	ModalBody,
	Stack,
	Text,
	useClipboard,
} from '@chakra-ui/react'
import { utils } from 'ethers'
import Loader from 'src/components/ui/loader'
import { CHAIN_INFO } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import useChainId from 'src/hooks/utils/useChainId'
import useCustomToast from 'src/hooks/utils/useCustomToast'
import { useContract, useSigner } from 'wagmi'
// CONSTANTS AND ABIS
import ERC20ABI from '../../contracts/abi/ERC20.json'
import useFulfillReviewPayment from '../../hooks/useFullfilReviewPayment'
import useMarkReviewPaymentDone from '../../hooks/useMarkReviewPaymentDone'
import { formatAmount, trimAddress } from '../../utils/formattingUtils'
// UI AND COMPONENT TOOLS
import Dropdown from '../ui/forms/dropdown'

interface Props {
  workspaceId: string;
  reviewIds: string[];
  applications: string[];
  payMode: number;
  setPayMode: React.Dispatch<React.SetStateAction<number>>;
  reviewerAddress: string | any;
  reviews: number;
  onClose: () => void;
  setPaymentOutside: React.Dispatch<React.SetStateAction<boolean>>;
  paymentOutside: boolean;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

function PayoutModalContent({
	workspaceId,
	applications,
	reviewIds,
	payMode,
	setPayMode,
	reviewerAddress,
	reviews,
	onClose,
	setPaymentOutside,
	paymentOutside,
	setTabIndex,
}: Props) {
	// WAGMI && ETH HOOKS
	const currentChain = useChainId() ?? SupportedChainId.RINKEBY
	const { data: signer } = useSigner()

	// CHAKRA HOOKS
	const { hasCopied, onCopy } = useClipboard(reviewerAddress)

	const supportedCurrencies = Object.keys(
		CHAIN_INFO[currentChain].supportedCurrencies,
	)
		.map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
		.map((currency) => ({ ...currency, id: currency.address }))

	// STATES TO FILL WITH FORM INPUTS
	const [reviewsToPay, setReviewsToPay] = useState<number>()
	const [amountToPay, setAmountToPay] = useState<string>()
	const [totalAmount, setTotalAmount] = useState<number>(0)
	const [amountDeposited, setAmountDeposited] = useState<string>()
	const [transactionHash, setTransactionHash] = useState<string>()
	const [submitPayment, setSubmitPayment] = useState<boolean>(false)
	const [submitMarkDone, setSubmitMarkDone] = useState<boolean>(false)
	const [applicationsId, setApplicationsId] = React.useState<any>([])
	const [applicationIdsToPay, setApplicationIdsToPay] = React.useState<any>([])
	const [reviewIdsToPay, setReviewIdsToPay] = React.useState<any>([])

	useEffect(() => {
		if(applicationsId.length === 0) {
			applications.forEach((app: any) => app.reviewers.forEach(
				(reviewer: any) => reviewer.actorId === reviewerAddress
            && setApplicationsId((array: any) => [...array, app.id]),
			))
		}
	}, [applications, applicationsId, reviewerAddress])

	useEffect(() => {
		if(reviewsToPay !== 0) {
			if(reviewsToPay !== applicationIdsToPay.length) {
				setApplicationIdsToPay(applicationsId.slice(0, reviewsToPay))
			}

			if(reviewsToPay !== reviewIdsToPay.length) {
				setReviewIdsToPay(reviewIds.slice(0, reviewsToPay))
			}
		}

		console.log(applicationIdsToPay.length)
		console.log(reviewIdsToPay.length)

	}, [reviewsToPay])

	async function setTransactionHashFromClipboard() {
		try {
			const text = await navigator.clipboard.readText()
			setTransactionHash(text)
		} catch(err) {
			// eslint-disable-next-line no-console
			console.error('Failed to read clipboard contents: ', err)
		}
	}

	const [reviewCurrency, setReviewCurrency] = useState(
		supportedCurrencies[0].label,
	)
	const [reviewCurrencyAddress, setReviewCurrencyAddress] = useState(
		supportedCurrencies[0].address,
	)

	// STATES TO FILL WITH ETH HOOKS
	const [walletBalance, setWalletBalance] = React.useState(0)

	const [transactionData, txnLink, loading] = useMarkReviewPaymentDone(
		workspaceId,
		reviewIdsToPay,
		applicationIdsToPay,
		utils.parseEther(totalAmount.toString()),
		submitMarkDone,
		reviewerAddress,
		reviewCurrencyAddress,
		transactionHash,
	)

	console.log(txnLink)

	const [fulfillPaymentData, fulfillTxnLink, fulfillLoading, error] = useFulfillReviewPayment(
		workspaceId,
		reviewIdsToPay,
		applicationIdsToPay,
		utils.parseEther(totalAmount.toString()),
		submitPayment,
		reviewerAddress,
		reviewCurrencyAddress,
	)

	console.log(fulfillPaymentData)

	useEffect(() => {
		if(currentChain) {
			const currencies = Object.keys(
				CHAIN_INFO[currentChain].supportedCurrencies,
			)
				.map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
				.map((currency) => ({ ...currency, id: currency.address }))
			setReviewCurrency(currencies[0].label)
			setReviewCurrencyAddress(currencies[0].address)
		}

	}, [currentChain])

	const rewardAssetContract = useContract({
		addressOrName:
      reviewCurrencyAddress ?? '0x0000000000000000000000000000000000000000',
		contractInterface: ERC20ABI,
		signerOrProvider: signer,
	})

	useEffect(() => {
		// eslint-disable-next-line wrap-iife
		// eslint-disable-next-line func-names
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		async function getBalance() {
			try {
				const tempAddress = await signer?.getAddress()
				const tempWalletBalance = await rewardAssetContract.balanceOf(
					tempAddress,
				)
				setWalletBalance(tempWalletBalance)
			} catch{
				// eslint-disable-next-line no-console
				console.error('could not')
			}
		}

		getBalance()

	}, [totalAmount])

	const { setRefresh } = useCustomToast(txnLink)
	useEffect(() => {
		if(transactionData) {
			onClose()
			setSubmitMarkDone(false)
			setTabIndex(1)
			setRefresh(true)
		} else if(error) {
			onClose()
			setSubmitMarkDone(false)
		}

	}, [transactionData])

	const { setRefresh: fulfillTxnRefresh } = useCustomToast(fulfillTxnLink)
	useEffect(() => {
		if(fulfillPaymentData) {
			onClose()
			setSubmitPayment(false)
			setTabIndex(1)
			fulfillTxnRefresh(true)
		} else if(error) {
			onClose()
			setSubmitPayment(false)
		}

	}, [fulfillPaymentData, error])

	const sendSubmit = () => {
		if(reviewsToPay !== undefined
      && amountDeposited !== undefined
      && transactionHash !== undefined
		) {
			setTotalAmount(reviewsToPay * parseFloat(amountDeposited))
			setSubmitMarkDone(true)
		}
	}

	const sendPayment = () => {
		if(reviewsToPay !== undefined
      && amountToPay !== undefined
		) {
			setTotalAmount(reviewsToPay * parseFloat(amountToPay))
			setSubmitPayment(true)
		}
	}

	useEffect(() => {
		console.log(totalAmount)
	}, [totalAmount])

	return (
		<ModalBody>
			<Flex
				direction="column"
				gap="1rem"
				overflow="hidden">
				{
					(payMode === 0 || (payMode === 1 && !paymentOutside)) && (
						<>
							<Flex
								w="100%"
								mt={7}
								direction="row"
								justify="space-between"
								align="center"
							>
								<Heading
									fontSize="0.875rem"
									textAlign="left">
                Address:
								</Heading>
								<Text fontSize="0.875rem">
									{trimAddress(reviewerAddress, 8)}
									{' '}
									<IconButton
										alignItems="center"
										justifyItems="center"
										_focus={{ boxShadow: 'none' }}
										aria-label="Back"
										variant="ghost"
										_hover={{}}
										_active={{}}
										icon={
											(
												<Image
													src={
														!hasCopied
															? '/ui_icons/copy/normal.svg'
															: '/ui_icons/copy/active.svg'
													}
												/>
											)
										}
										onClick={() => onCopy()}
									/>
								</Text>
							</Flex>
							<Flex
								direction="column"
								gap="0.5rem">
								<Heading
									fontSize="0.875rem"
									textAlign="left">
                Reviews:
								</Heading>
								<InputGroup size="md">
									<Input
										pr="4.5rem"
										placeholder="Enter number of reviews"
										min={1}
										max={reviewIds.length}
										isInvalid={(reviewsToPay as number) > reviews || (reviewsToPay as number) < 1}
										onChange={(e) => setReviewsToPay(parseInt(e.target.value, 10))}
										value={reviewsToPay}
										h={12}
										type="number"
									/>
									<InputRightElement
										width="fit-content"
										p={5}
										mt="0.25rem">
										<Button
											bg="none"
											color="#8850EA"
											fontWeight="bold"
											h="1.75rem"
											size="sm"
											onClick={() => setReviewsToPay(reviews)}
										>
                    ALL
										</Button>
									</InputRightElement>
								</InputGroup>
								<Text
									fontSize="0.75rem"
									color="red"
									fontWeight="bold">
									{
										(reviewsToPay as number) > reviews
											? `You cannot trigger payouts for more than ${reviews} reviews`
											: (reviewsToPay as number) < 1
                    && 'You need to pay at least 1 review'
									}
								</Text>
							</Flex>
							<Flex direction="row">
								<Flex
									w="70%"
									direction="column"
									gap="0.5rem">
									<Heading
										fontSize="0.875rem"
										textAlign="left">
                  Amount per Review:
									</Heading>
									<Input
										mr="0.5rem"
										placeholder="Enter Amount"
										onChange={
											(e) => {
												setAmountToPay(e.target.value)
											}
										}
										value={Number.isNaN(parseFloat(amountToPay as string)) ? '' : amountToPay}
										min={0}
										step={0.01}
										pattern="^\d*(\.\d{0,2})?$"
										h={12}
									/>
								</Flex>
								<Flex
									direction="column"
									w="fit-content"
									mt="20px">
									<Dropdown
										listItemsMinWidth="132px"
										listItems={supportedCurrencies}
										value={reviewCurrency}
										onChange={
											(data: any) => {
												setReviewCurrency(data.label)
												setReviewCurrencyAddress(data.id)
											}
										}
									/>
								</Flex>
							</Flex>
							<Flex>
								{
									totalAmount !== 0 ? (
										<Flex
											direction="column"
											w="100%">
											<InputGroup>
												<Input
													color="#717A7C"
													border="none"
													bg="rgba(241, 247, 255, 0.83)"
													isReadOnly
													value="Total Amount"
													pr="4.5rem"
													h={12}
												/>
												<InputRightElement
													zIndex="0"
													p={5}
													mt="0.25rem"
													width="fit-content"
												>
													<Text
														bg="none"
														fontSize="0.875rem"
														color="black"
														size="sm"
													>
														{totalAmount}
														{' '}
														{reviewCurrency}
													</Text>
												</InputRightElement>
											</InputGroup>

											<Text
												mt="0.75rem"
												color="#AAAAAA">
                    Wallet Balance
												{' '}
												<Text
													color="#AAAAAA"
													display="inline-block"
													fontWeight="bold"
												>
													{`${formatAmount(walletBalance.toString())}`}
													{' '}
													{reviewCurrency}
												</Text>
											</Text>
										</Flex>
									) : null
								}
							</Flex>
						</>
					)
				}

				{
					paymentOutside && (
						<Stack spacing="1rem">
							<Flex
								w="100%"
								mt={7}
								direction="row"
								align="center">
								<Flex
									align="center"
									justify="center"
									bgColor="#8850EA"
									borderRadius="full"
									w="48px"
									h="48px"
									mr="1rem"
								>
									<Text color="white">
1
									</Text>
								</Flex>
								<Text>
Open a wallet with funds.
								</Text>
							</Flex>
							<Flex
								w="100%"
								mt={7}
								direction="row"
								align="center">
								<Flex
									align="center"
									justify="center"
									bgColor="#8850EA"
									borderRadius="full"
									w="48px"
									h="48px"
									mr="1rem"
								>
									<Text color="white">
2
									</Text>
								</Flex>
								<Text>
                Send
									{' '}
									{totalAmount !== 0 && `${totalAmount} ${reviewCurrency}`}
									{' '}
                to the address below.
								</Text>
							</Flex>
							<Flex
								w="100%"
								mt={7}
								direction="row"
								align="center">
								<Flex
									align="center"
									justify="center"
									bgColor="#8850EA"
									borderRadius="full"
									w="48px"
									h="48px"
									mr="1rem"
								>
									<Text color="white">
3
									</Text>
								</Flex>
								<Text>
Copy the TX hash and set payment as done.
								</Text>
							</Flex>

							<Heading
								fontSize="0.875rem"
								textAlign="left">
              Reviewer Wallet Address
							</Heading>

							<InputGroup>
								<Input
									color="#717A7C"
									border="none"
									bg="rgba(241, 247, 255, 0.83)"
									isReadOnly
									value={reviewerAddress}
									pr="4.5rem"
									h={16}
									alignItems="center"
									alignContent="center"
									justifyContent="center"
									justifySelf="center"
									justifyItems="center"
								/>
								<InputRightElement
									width="fit-content"
									p={3}
									mt="0.75rem">
									<Button
										bg="none"
										fontSize="0.875rem"
										color="black"
										h="1.75rem"
										size="sm"
										onClick={() => onCopy()}
									>
										{hasCopied ? 'Copied!' : 'Copy'}
									</Button>
								</InputRightElement>
							</InputGroup>

							<Text
								color="#717A7C"
								fontSize="0.875rem">
              NOTE: Send only
								{' '}
								{reviewCurrency}
								{' '}
              to the address in the Polygon
              network.
							</Text>
						</Stack>
					)
				}

				{
					payMode === 0 && (
						<>
							<Text
								fontSize="0.75rem"
								alignContent="center">
								<Image
									display="inline-block"
									h="10px"
									w="10px"
									alt="wallet_info"
									src="/ui_icons/info_brand.svg"
								/>
								{' '}
              By pressing Make Payment you will have to approve the transaction
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
							<Button
								variant="primary"
								my={8}
								isDisabled={reviewsToPay !== reviewIdsToPay.length}
								onClick={() => sendPayment()}
							>
								{fulfillLoading ? <Loader /> : 'Make Payment'}
							</Button>
						</>
					)
				}

				{
					payMode === 1 && (
						<Button
							variant="primary"
							my={8}
							isDisabled={reviewsToPay !== reviewIdsToPay.length}
							onClick={
								() => {
									// eslint-disable-next-line no-console
									console.log(
										reviewCurrencyAddress,
										totalAmount,
										reviewCurrency,
										reviewerAddress,
									)
									// eslint-disable-next-line @typescript-eslint/no-unused-expressions
									reviewsToPay !== undefined
              && amountToPay !== undefined
              && !paymentOutside
										? (setPaymentOutside(true), setTotalAmount(reviewsToPay * parseFloat(amountToPay)))
										: (setPaymentOutside(false), setPayMode(2))
								}
							}
						>
							{paymentOutside ? 'Mark Payment as Done' : 'Make Payment'}
						</Button>
					)
				}

				{
					payMode === 2 && (
						<Flex
							direction="column"
							gap="1rem"
							overflow="hidden">
							<Flex
								w="100%"
								mt={7}
								direction="row"
								justify="space-between"
								align="center"
							>
								<Heading
									fontSize="0.875rem"
									textAlign="left">
                Address:
								</Heading>
								<Text fontSize="0.875rem">
									{trimAddress(reviewerAddress, 8)}
									{' '}
									<IconButton
										alignItems="center"
										justifyItems="center"
										_focus={{ boxShadow: 'none' }}
										aria-label="Back"
										variant="ghost"
										_hover={{}}
										_active={{}}
										icon={
											(
												<Image
													src={
														!hasCopied
															? '/ui_icons/copy/normal.svg'
															: '/ui_icons/copy/active.svg'
													}
												/>
											)
										}
										onClick={() => onCopy()}
									/>
								</Text>
							</Flex>
							<Flex
								direction="column"
								gap="0.5rem">
								<Heading
									fontSize="0.875rem"
									textAlign="left">
                Reviews:
								</Heading>
								<InputGroup size="md">
									<Input
										pr="4.5rem"
										placeholder="Enter number of reviews"
										min={1}
										max={reviews}
										isInvalid={(reviewsToPay as number) > reviews || (reviewsToPay as number) < 1}
										onChange={(e) => setReviewsToPay(parseInt(e.target.value, 10))}
										value={reviewsToPay}
										h={12}
										type="number"
									/>
									<InputRightElement
										width="fit-content"
										p={5}
										mt="0.25rem">
										<Button
											bg="none"
											color="#8850EA"
											fontWeight="bold"
											h="1.75rem"
											size="sm"
											onClick={() => setReviewsToPay(reviews)}
										>
                    ALL
										</Button>
									</InputRightElement>
								</InputGroup>
								<Text
									fontSize="0.75rem"
									color="red"
									fontWeight="bold">
									{
										(reviewsToPay as number) > reviews
											? `You cannot trigger payouts for more than ${reviews} reviews`
											: (reviewsToPay as number) < 1
                    && 'You need to pay at least 1 review'
									}
								</Text>
							</Flex>
							<Flex direction="row">
								<Flex
									w="70%"
									direction="column"
									gap="0.5rem">
									<Heading
										fontSize="0.875rem"
										textAlign="left">
                  Amount Deposited:
									</Heading>
									<Input
										mr="0.5rem"
										placeholder="Enter Amount"
										onChange={
											(e) => {
												setAmountDeposited(e.target.value)
											}
										}
										value={Number.isNaN(parseFloat(amountDeposited as string)) ? '' : amountDeposited}
										min={0}
										step={0.01}
										pattern="^\d*(\.\d{0,2})?$"
										h={12}
									/>
								</Flex>
								<Flex
									direction="column"
									w="fit-content"
									mt="20px">
									<Dropdown
										listItemsMinWidth="132px"
										listItems={supportedCurrencies}
										value={reviewCurrency}
										onChange={
											(data: any) => {
												setReviewCurrency(data.label)
												setReviewCurrencyAddress(data.id)
											}
										}
									/>
								</Flex>
							</Flex>

							<InputGroup>
								<Input
									color="#717A7C"
									border="none"
									bg="rgba(241, 247, 255, 0.83)"
									placeholder="Paste the TXN hash here"
									value={transactionHash}
									onChange={(e) => setTransactionHash(e.target.value)}
									pr="4.5rem"
									h={16}
								/>
								<InputRightElement
									pt="1rem"
									pr="1rem"
									zIndex="0"
									m="auto"
									mt="0.25rem"
									width="min-content"
								>
									<Button
										bg="none"
										fontSize="0.875rem"
										color="black"
										onClick={
											() => {
												setTransactionHashFromClipboard()
											}
										}
									>
										{hasCopied ? 'Pasted!' : 'Paste'}
									</Button>
								</InputRightElement>
							</InputGroup>

							<Button
								variant="primary"
								my={8}
								isDisabled={reviewsToPay !== reviewIdsToPay.length}
								onClick={() => sendSubmit()}
							>
								{!loading ? 'Mark Payment as Done' : <Loader />}
							</Button>
						</Flex>
					)
				}
			</Flex>
		</ModalBody>
	)
}

export default PayoutModalContent
