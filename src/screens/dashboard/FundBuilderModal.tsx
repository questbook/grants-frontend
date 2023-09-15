/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text, useToast } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { getFieldString } from 'src/libraries/utils/formatting'
import { uploadToIPFS } from 'src/libraries/utils/ipfs'
import { getGnosisTansactionLink, getProposalUrl } from 'src/libraries/utils/multisig'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import PaidByWallet from 'src/screens/dashboard/_components/FundBuilder/PaidByWallet'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import TransactionInitiated from 'src/screens/dashboard/_components/FundBuilder/TransactionInitiated'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import usetonWallet from 'src/screens/dashboard/_hooks/useTonWallet'
import getToken from 'src/screens/dashboard/_utils/tonWalletUtils'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
interface Props {
	payWithSafe: boolean
}
function FundBuilderModal({
	payWithSafe
}: Props) {
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

										<Text>
											$
										</Text>

										<FlushedInput
											borderBottom='2px solid'
											type='number'
											minW='5ch'
											value={amounts?.[0] || ''}
											onChange={
												(e) => {
													if(e.target.value?.includes('.')) {
														return
													} else {
														try {
															const val = parseInt(e.target.value)
															logger.info({ entered: e.target.value, parsed: val }, 'FundBuilderModal: entered amount')
															setAmounts([val])
														} catch(e) {
															logger.error(e, 'FundBuilderModal: error parsing entered amount')
														}
													}
												}
											}
											placeholder='0' />
									</Flex>
									{
										amounts?.[0] > 0 && selectedTokenInfo?.fiatConversion ? (
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
												<PayWithChoose selectedMode={selectedMode!} />
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
										(proposal?.state === 'submitted') && (
											<Text
												mt={8}
												variant='body'
												color='gray.500'>
												This proposal would be auto-accepted once payout is initiated for it.
											</Text>
										)
									}

									<Box mt={proposal?.state === 'submitted' ? 2 : 8} />

									{
										signerVerifiedState === 'verified' ? (
											<Button
												isDisabled={isDisabled}
												w='100%'
												isLoading={payoutInProcess}
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
												w='100%'
												isLoading={payoutInProcess}
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
							['initiate_verification', 'verifying', 'failed'].includes(signerVerifiedState) && (
								<Verify
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}

						{
							['transaction_initiated'].includes(signerVerifiedState) && safeProposalLink && (
								<TransactionInitiated
									safeProposalLink={safeProposalLink!}
									setIsModalOpen={setIsModalOpen}
								/>
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

	const { safeObj } = useSafeContext()!
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
		setSelectedTokenInfo,
		signerVerifiedState,
		setSignerVerifiedState,
	} = useContext(FundBuilderContext)!
	const { phantomWallet } = usePhantomWallet()
	const { tonWallet } = usetonWallet()
	const [safeProposalLink, setSafeProposalLink] = useState<string | undefined>(undefined)
	// const [selectedMode, setSelectedMode] = useState<{logo: string | undefined, value: string | undefined}>()
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
	const selectedMode = (payWithSafe === true && safeObj !== undefined) ? Safe : Wallets[0]

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const milestones = useMemo(() => {
		return proposal?.milestones || []
	}, [proposal])
	// const tonWalletInstance = new SupportedPayouts().getAllWallets()[0]
	useEffect(() => {
		if(!payWithSafe && selectedTokenInfo?.tokenName !== 'TON') {
			getToken().then((value) => {
				setSelectedTokenInfo(value)
			}), (() => logger.info('Error while fetching ton details'))
		}
	}
	, [[payWithSafe]])
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
			payoutsInProcessToastRef.current = customToast({ title: 'Payout is in process', duration: null, status: 'info' })
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

			tonWallet.sendMoney(tos[0], amounts[0], true, async(response: any) => {
				logger.info('TON response', response)
				if(response?.error) {
					setPayoutInProcess(false)
					customToast({
						title: 'An error occurred while creating transaction on TON Wallet',
						status: 'error',
						duration: 5000,
					})
				} else {
					customToast({
						title: 'Payouts done through TON Wallet, executing transaction...',
						status: 'success',
						duration: 5000,
					})
					// setSafeProposalAddress(response?.transactionHash)
					const currentDate = new Date()
					const timestamp = currentDate.getTime()

					logger.info('transaction hash', '99887341.' + timestamp)
					const methodArgs = [
						[parseInt(proposal?.id!, 16)],
						[parseInt(milestones[milestoneIndices[0]].id?.split('.')[1])],
						'0x0000000000000000000000000000000000000001',
						'the-open-network',
						'nonEvmAssetAddress-toBeChanged',
						[amounts?.[0]],
						grant?.workspace?.id,
						'99887341.' + timestamp
					]

					await call({ method: 'disburseRewardFromSafe', args: methodArgs, shouldWaitForBlock: false })
					// setSignerVerifiedState('transaction_initiated')
					setIsModalOpen(false)
					setPayoutInProcess(false)
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
		if(signerVerifiedState === 'verified' && proposal) {
			setPayoutInProcess(true)

			if(proposal.state === 'submitted') {
				// Approve proposal if it is not approved
				logger.info('Approving proposal', { proposal })
				const ipfsHash = await uploadToIPFS(JSON.stringify({
					feedback: '  ',
				}))

				const acceptProposalMethodArgs = [
					proposal.id,
					proposal.grant.workspace.id,
					2, // Approved state
					ipfsHash,
				]

				await acceptProposal({ method: 'updateApplicationState', args: acceptProposalMethodArgs })
			}


			const temp = [{
				from: safeObj?.safeAddress?.toString(),
				to: tos?.[0],
				applicationId: proposal?.id ? parseInt(proposal.id, 16) : 0,
				selectedMilestone: milestoneIndices?.[0],
				selectedToken: { tokenName: selectedTokenInfo?.tokenName, info: selectedTokenInfo?.info },
				amount: amounts?.[0],
			}]

			let proposaladdress: any = ''
			if(safeObj?.getIsEvm()) {
				proposaladdress = await safeObj?.proposeTransactions(JSON.stringify({ workspaceId: grant?.workspace?.id, grantAddress: grant?.id }), temp, '')
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Gnosis Safe',
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}

				// setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getGnosisTansactionLink(safeObj?.safeAddress ?? '', safeObj?.chainId?.toString(), proposaladdress as string))
			} else if(safeObj?.getIsTon() === false) {
				proposaladdress = await safeObj?.proposeTransactions(JSON.stringify({ workspaceId: grant?.workspace?.id, grantAddress: grant?.id }), temp, phantomWallet)
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Multi-sig',
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}

				// setSafeProposalAddress(proposaladdress as string)
				setSafeProposalLink(getProposalUrl(safeObj?.safeAddress ?? '', proposaladdress as string))
			} else {
				try {
					proposaladdress = await safeObj?.proposeTransactions('', temp, tonWallet)
					setSafeProposalLink('https://tonkey.fdc.ai/transactions/queue?safe=' + (safeObj?.safeAddress ?? ''))
				} catch(e) {
					customToast({
						title: (e as { message: string }).message,
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}
			}

			const methodArgs = [
				[parseInt(proposal?.id!, 16)],
				[parseInt(milestones[milestoneIndices[0]].id?.split('.')[1])],
				'0x0000000000000000000000000000000000000001',
				selectedTokenInfo?.tokenName.toLowerCase(),
				'nonEvmAssetAddress-toBeChanged',
				[amounts?.[0]],
				grant?.workspace?.id,
				proposaladdress
			]
			await call({ method: 'disburseRewardFromSafe', args: methodArgs, shouldWaitForBlock: false })
			setSignerVerifiedState('transaction_initiated')
			setPayoutInProcess(false)
		}
	}

	const workspacechainId = getSupportedChainIdFromWorkspace(grant?.workspace) || defaultChainId

	const { call } = useFunctionCall({ chainId: workspacechainId, contractName: 'workspace' })
	const { call: acceptProposal } = useFunctionCall({ chainId: workspacechainId, contractName: 'applications' })

	return buildComponent()
}

export default FundBuilderModal