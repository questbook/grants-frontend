import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, useToast } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
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
										selectedMode?.value !== 'TON Wallet' && amounts?.[0] > 0 && selectedTokenInfo?.fiatConversion ? (
											<Text
												color='#53514F'
												fontSize='14px'
												mt='8px'>
												≈
												{' '}
												{(amounts?.[0] / parseFloat(selectedTokenInfo?.fiatConversion!.toString())).toFixed(2)}
												{' '}
												{selectedTokenInfo?.tokenName}
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
	const { grant } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const {
		isModalOpen,
		setIsModalOpen,
		amounts,
		setAmounts,
		milestoneIndices,
		setMilestoneIndices,
		tos,
		setTos,
		selectedTokenInfo,
		signerVerifiedState,
		setSignerVerifiedState,
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
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const milestones = useMemo(() => {
		return proposal?.milestones || []
	}, [proposal])

	useEffect(() => {
		if(!proposal) {
			return
		}

		setAmounts([proposal?.milestones?.[0]?.amount ? parseInt(proposal?.milestones?.[0]?.amount) : 0])
		setTos([getFieldString(proposal, 'applicantAddress') ?? tos?.[0]])
		setMilestoneIndices([0])
	}, [proposal])

	const isDisabled = useMemo(() => {
		return !proposal || amounts?.[0] === undefined || !tos?.[0] || milestoneIndices?.[0] === undefined || amounts?.[0] <= 0
	}, [amounts, tos, milestoneIndices])

	useEffect(() => {
		if(payoutInProcess) {
			payoutsInProcessToastRef.current = customToast({ title: 'Payouts is in process', duration: null, status: 'info' })
		} else if(!payoutInProcess && payoutsInProcessToastRef.current) {
			toast.close(payoutsInProcessToastRef.current)
		}
	}, [payoutInProcess])

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
					// disburseRewardFromSafe(response?.transactionHash, false)
					// 	.then(() => {
					// 		// console.log('Sent transaction to contract - EVM', proposaladdress)
					// 	})
					// 	.catch((err) => {
					// 		console.log('sending transction error:', err)
					// 	})
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
				selectedToken: { tokenName: selectedTokenInfo?.tokenName, info: selectedTokenInfo?.info },
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
				proposaladdress = await safeObj?.proposeTransactions(grant?.title, temp, phantomWallet)
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

			disburseRewardFromSafe(proposaladdress?.toString()!)
				.then(() => {
				// console.log('Sent transaction to contract - EVM', proposaladdress)
				})
				.catch((err) => {
					logger.error('sending transction error:', err)
				})
		}
	}

	const { workspace } = useContext(ApiClientsContext)!

	const workspacechainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: workspacechainId ? workspacechainId.toString() : defaultChainId.toString(),
	})
	const [isBiconomyInitialisedDisburse, setIsBiconomyInitialisedDisburse] = useState(false)

	useEffect(() => {

		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && workspacechainId &&
			biconomy.networkId && biconomy.networkId?.toString() === workspacechainId.toString()) {
			setIsBiconomyInitialisedDisburse(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialisedDisburse, workspacechainId])

	const { nonce } = useQuestbookAccount()
	const workspaceRegistryContract = useQBContract('workspace', workspacechainId)
	const { webwallet } = useContext(WebwalletContext)!

	const disburseRewardFromSafe = async(proposaladdress: string) => {
		try {
			logger.info({}, 'HERE 1')
			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				return
			}

			logger.info({}, 'HERE 2')

			const methodArgs = [
				[parseInt(proposal?.id!, 16)],
				[parseInt(milestones[milestoneIndices[0]].id?.split('.')[1])],
				'0x0000000000000000000000000000000000000001',
				selectedTokenInfo?.tokenName.toLowerCase(),
				'nonEvmAssetAddress-toBeChanged',
				[amounts?.[0]],
				workspace?.id,
				proposaladdress
			]


			logger.info({}, 'HERE 3')

			logger.info({ methodArgs }, 'methodArgs')

			const transactionHash = await sendGaslessTransaction(
				biconomy,
				workspaceRegistryContract,
				'disburseRewardFromSafe',
				methodArgs,
				workspaceRegistryContract.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${workspacechainId}`,
				bicoDapps[workspacechainId.toString()].webHookId,
				nonce
			)

			logger.info({}, 'HERE 4')


			if(!transactionHash) {
				throw new Error('No transaction hash found!')
			}

			const { txFee } = await getTransactionDetails(transactionHash, workspacechainId.toString())

			await chargeGas(Number(workspace?.id), Number(txFee), workspacechainId)

		} catch(e) {
			logger.error('disburse error', e)
		}
	}


	return buildComponent()
}

export default FundBuilderModal