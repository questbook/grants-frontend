import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, ToastId, useToast } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { logger } from 'ethers'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import PaidByWallet from 'src/screens/dashboard/_components/FundBuilder/PaidByWallet'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import TransactionInitiated from 'src/screens/dashboard/_components/FundBuilder/TransactionInitiated'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { getGnosisTansactionLink } from 'src/v2/utils/gnosisUtils'
import { getProposalUrl } from 'src/v2/utils/phantomUtils'

function FundBuilderModal() {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isModalOpen}
				size='2xl'
				onClose={
					() => {
						setIsModalOpen(false)
						setSignerVerifiedState('unverified')
					}
				}
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						{
							['unverified', 'verified', 'initiate_TON_transaction'].includes(signerVerifiedState) && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'>
									<Text fontWeight='500'>
										Fund Builder
									</Text>
									<Flex
										mt={7}
										w='100%'
										justify='center'
										align='start'>
										{
											selectedMode?.value !== 'TON Wallet' && (
												<Text>
													$
												</Text>
											)
										}
										<FlushedInput
											borderBottom='2px solid'
											textPadding={1}
											type='number'
											minW='5ch'
											value={amounts?.[0] || ''}
											onChange={
												(e) => {
													const val = parseFloat(e.target.value)
													setAmounts([val])
												}
											}
											placeholder='0' />
									</Flex>
									{
										selectedMode?.value !== 'TON Wallet' && amounts?.[0] > 0 && tokenInfo?.fiatConversion ? (
											<Text
												color='#53514F'
												fontSize='14px'
												mt='8px'>
												≈
												{' '}
												{(amounts?.[0] / parseFloat(tokenInfo?.fiatConversion!.toString())).toFixed(2)}
												{' '}
												{tokenInfo?.tokenName}
											</Text>
										) : null
									}
									{
										proposal && (
											<Flex
												mt={6}
												w='100%'
												direction='column'
												border='1px solid #E7E4DD'>
												<PayFromChoose
													selectedMode={selectedMode} />
												<PayWithChoose selectedMode={selectedMode} />
												<ToChoose
													type='single'
													proposal={proposal}
													index={0} />
												<MilestoneChoose
													proposal={proposal}
													index={0} />
											</Flex>
										)
									}

									{
										signerVerifiedState === 'verified' ? (
											<Button
												isDisabled={isDisabled}
												mt={8}
												w='100%'
												variant='primaryLarge'
												onClick={onInitiateTransaction}>
												<Text
													fontWeight='500'
													color='white'>
													Initiate Transaction
												</Text>
											</Button>
										) : (
											<Button
												isDisabled={isDisabled}
												mt={8}
												w='100%'
												variant='primaryLarge'
												onClick={onContinue}>
												<Text
													fontWeight='500'
													color='white'>
													Continue
												</Text>
											</Button>
										)
									}
								</Flex>
							)
						}

						{
							['initiate_verification', 'verifying', 'failed' ].includes(signerVerifiedState) && (
								<Verify
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}

						{
							['transaction_initiated'].includes(signerVerifiedState) && safeProposalLink && (
								<TransactionInitiated
									safeProposalLink={safeProposalLink!} />
							)
						}

						{
							['transaction_done_wallet'].includes(signerVerifiedState) && (
								<PaidByWallet />
							)
						}

					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const { safeObj } = useSafeContext()
	const { proposals, selectedProposals, selectedGrant } = useContext(DashboardContext)!
	const {
		isModalOpen,
		setIsModalOpen,
		amounts,
		setAmounts,
		milestoneIndices,
		setMilestoneIndices,
		tos,
		setTos,
		tokenInfo,
		signerVerifiedState,
		setSignerVerifiedState,
		setTokenInfo,
	} = useContext(FundBuilderContext)!
	const { phantomWallet } = usePhantomWallet()
	const [safeProposalAddress, setSafeProposalAddress] = useState<string | undefined>(undefined)
	const [safeProposalLink, setSafeProposalLink] = useState<string | undefined>(undefined)
	const [selectedMode, setSelectedMode] = useState<any>()
	const [payoutInProcess, setPayoutInProcess] = useState(false)

	const customToast = useCustomToast()
	const toast = useToast()
  	const payoutsInProcessToastRef = useRef<any>()

	const Safe = {
		logo: safeObj?.safeLogo,
		value: safeObj?.safeAddress ?? ''
	}

	const Wallets = new SupportedPayouts().getAllWallets().map((wallet) => {
		return {
			logo: wallet.logo,
			value: wallet.name
		}
	})

	useEffect(() => {
		setSelectedMode(safeObj ? Safe : Wallets[0])
	}, [safeObj])

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	useEffect(() => {
		if(!proposal) {
			return
		}

		setTos([getFieldString(proposal, 'applicantAddress') ?? tos?.[0]])
		setMilestoneIndices([0])
	}, [proposal])

	const isDisabled = useMemo(() => {
		return !proposal || amounts?.[0] === undefined || !tos?.[0] || milestoneIndices?.[0] === undefined || amounts?.[0] <= 0
	}, [amounts, tos, milestoneIndices])

	const onContinue = async() => {
		if(selectedMode?.value === 'TON Wallet') {
			setPayoutInProcess(true)
			setSignerVerifiedState('initiate_TON_transaction')

			const tonWallet = new SupportedPayouts().getWallet('TON Wallet')
			tonWallet.checkTonReady(window)
			tonWallet.sendMoney(tos[0], amounts[0], (response: any) => {
				logger.info('TON response', response)
				setPayoutInProcess(false)
				if(response?.error) {
					customToast({
						title: 'An error occurred while creating transaction on TON Wallet',
						status: 'error',
						duration: 5000,
					})
				} else {
					customToast({
						title: 'Payouts done through TON Wallet',
						status: 'success',
						duration: 5000,
					})
					setSafeProposalAddress(response?.transactionHash)
					setIsModalOpen(false)
				}

			})

		}

		if(selectedMode?.value !== 'TON Wallet' && signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
		}
	}


	const onInitiateTransaction = async() => {
		if(signerVerifiedState === 'verified') {
			setPayoutInProcess(true)
			const temp = [{
				from: safeObj?.safeAddress?.toString(),
				to: tos?.[0],
				applicationId: proposal?.id,
				selectedMilestone: milestoneIndices?.[0],
				selectedToken: { tokenName: tokenInfo?.tokenName, info: tokenInfo?.info },
				amount: amounts?.[0],
			}]

			let proposaladdress: any = ''
			if(safeObj.getIsEvm()) {
				proposaladdress = await safeObj?.proposeTransactions('', temp, '')
				setPayoutInProcess(false)
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Gnosis Safe',
						status: 'error',
						duration: 3000,
					})
					return
				}

				setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getGnosisTansactionLink(safeObj?.safeAddress, safeObj?.chainId))
				setSignerVerifiedState('transaction_initiated')
			} else {
				proposaladdress = await safeObj?.proposeTransactions(selectedGrant?.title, temp, phantomWallet)
				setPayoutInProcess(false)
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Multi-sig',
						status: 'error',
						duration: 3000,
					})
					return
				}

				setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getProposalUrl(safeObj.safeAddress, proposaladdress as string))
				setSignerVerifiedState('transaction_initiated')
			}
		}
	}

	useEffect(() => {
		if(payoutInProcess) {
			payoutsInProcessToastRef.current = customToast({ title: 'Payouts is in process', duration: null, status: 'info' })
		} else if(!payoutInProcess && payoutsInProcessToastRef.current) {
			toast.close(payoutsInProcessToastRef.current)
		}
	}, [payoutInProcess])

	return buildComponent()
}

export default FundBuilderModal