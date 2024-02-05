/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from 'react'
import { Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import { batchGrantApplicationUpdateMutation, DisburseRewardSafeMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import { getFieldString } from 'src/libraries/utils/formatting'
import { getGnosisTansactionLink, getProposalUrl, getTonkeyProposalUrl } from 'src/libraries/utils/multisig'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ProposalDetails from 'src/screens/dashboard/_components/FundBuilder/ProposalDetails'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import TransactionInitiated from 'src/screens/dashboard/_components/FundBuilder/TransactionInitiated'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import usetonWallet from 'src/screens/dashboard/_hooks/useTonWallet'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'

function FundBuilderDrawer() {
	const buildComponent = () => {
		return (
			<>
				<Drawer
					isOpen={isDrawerOpen}
					placement='right'
					onClose={
						() => {
							setIsDrawerOpen(false)
							setSignerVerifiedState('unverified')
						}
					}
					size='lg' >
					<DrawerOverlay />
					<DrawerCloseButton />
					<DrawerContent m={4}>
						{
							['unverified', 'verified'].includes(signerVerifiedState) && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'
									h='100%'>
									<Text fontWeight='500'>
										Fund Builders
									</Text>

									<Flex
										mt={6}
										w='100%'
										h='100%'
										direction='column'
										border='1px solid #E7E4DD'
										overflowY='auto'>
										<PayFromChoose
											selectedMode={selectedMode} />
										<PayWithChoose selectedMode={selectedMode} />
										<ToChoose type='multi' />
										{
											selectedProposalsData?.map((selectedProposalData, index) => (
												<ProposalDetails
													key={selectedProposalData.id}
													proposal={selectedProposalData}
													index={index}
													tokenInfo={selectedTokenInfo!} />
											))
										}
									</Flex>

									<Box mt='auto' />

									{
										selectedProposalsData?.some(p => p.state === 'submitted') && (
											<Text
												mt={8}
												variant='body'
												color='gray.500'>
												Some proposals would be auto-accepted once payout is initiated for them.
											</Text>
										)
									}

									<Box mt={selectedProposalsData?.some(p => p.state === 'submitted') ? 2 : 8} />

									{
										signerVerifiedState === 'verified' ? (
											<Button
												isDisabled={isDisabled}
												w='100%'
												variant='primaryLarge'
												isLoading={payoutInProcess}
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
							['initiate_verification', 'verifying', 'failed' ].includes(signerVerifiedState) && (
								<Verify
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}
					</DrawerContent>
				</Drawer>

				{
					['transaction_initiated'].includes(signerVerifiedState) && safeProposalLink && (
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

									<TransactionInitiated
										safeProposalLink={safeProposalLink!}
										setIsModalOpen={setIsModalOpen}
									/>

								</ModalBody>
							</ModalContent>
						</Modal>
					)
				}
			</>
		)
	}

	const { safeObj } = useSafeContext()!
	const {
		isModalOpen,
		setIsModalOpen,
		isDrawerOpen,
		setIsDrawerOpen,
		amounts,
		setAmounts,
		tos,
		setTos,
		milestoneIndices,
		setMilestoneIndices,
		selectedTokenInfo,
		signerVerifiedState,
		setSignerVerifiedState
	} = useContext(FundBuilderContext)!
	const { phantomWallet } = usePhantomWallet()
	const { tonWallet } = usetonWallet()
	const [safeProposalLink, setSafeProposalLink] = useState<string | undefined>(undefined)
	const [selectedMode, setSelectedMode] = useState<any>()
	const [payoutInProcess, setPayoutInProcess] = useState(false)

	const customToast = useCustomToast()

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

	const { grant } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const selectedProposalsData = useMemo(() => {
		if(!proposals || !selectedProposals) {
			return [] as ProposalType[]
		}

		const p: ProposalType[] = []
		for(let i = 0; i < proposals.length; i++) {
			if(selectedProposals.has(proposals[i].id)) {
				p.push(proposals[i])
			}
		}

		return p
	}, [proposals, selectedProposals])

	useEffect(() => {
		if(!selectedProposalsData) {
			return
		}

		setAmounts(selectedProposalsData.map((p) => p?.milestones?.[0]?.amount ? parseInt(p?.milestones?.[0]?.amount) : 0))
		setTos(selectedProposalsData.map((p) => getFieldString(p, 'applicantAddress') ?? ''))
		setMilestoneIndices(selectedProposalsData.map((p) => p.milestones.findIndex((m) => parseFloat(m?.amountPaid) === 0) !== -1 ? p.milestones.findIndex((m) => parseFloat(m?.amountPaid) === 0) : 0))
	}, [selectedProposalsData])

	const isDisabled = useMemo(() => {
		return !selectedProposalsData || !amounts?.every((amt) => amt !== undefined && amt > 0) || !tos?.every((to) => to !== undefined) || !milestoneIndices?.every((mi) => mi !== undefined) || !selectedTokenInfo
	}, [selectedProposalsData, amounts, tos, milestoneIndices, selectedTokenInfo])

	const onContinue = () => {
		if(signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
			return
		}
	}

	const onInitiateTransaction = async() => {
		if(signerVerifiedState === 'verified' && grant) {
			setPayoutInProcess(true)
			if(selectedProposalsData?.some(p => p.state === 'submitted')) {
				const submittedProposals = selectedProposalsData.filter(p => p.state === 'submitted')
				const hash = { feedback: '' }

				// const methodArgs = [
				// 	submittedProposals.map((proposal) => proposal.id),
				// 	submittedProposals.map(() => 2),
				// 	grant.workspace.id,
				// 	submittedProposals.map(() => ipfsHash),
				// ]

				const methodArgs = {
					id: submittedProposals.map((proposal) => proposal.id),
					grant: grant.id,
					workspaceId: grant.workspace.id,
					applicantId: submittedProposals.map((proposal) => proposal.applicantId),
					state: submittedProposals.map(() => 'approved'),
					feedback: submittedProposals.map(() => hash),
				}


				await executeMutation(batchGrantApplicationUpdateMutation, methodArgs)
			}

			const transactionData = tos.map((to, i) => {
				return {
					from: safeObj?.safeAddress?.toString(),
					to,
					applicationId: selectedProposalsData[i]?.id?.startsWith('0x') ? parseInt(selectedProposalsData[i]?.id, 16) : parseInt(selectedProposalsData[i]?.id?.slice(-2) ?? '0', 16),
					selectedMilestone: milestoneIndices?.[i],
					selectedToken: { tokenName: selectedTokenInfo?.tokenName as string, info: selectedTokenInfo?.info },
					amount: amounts?.[i],
				}
			})

			let proposaladdress: any = ''
			if(safeObj?.getIsEvm()) {
				// // { workspaceId:  grant?.workspace?.id?.startsWith('0x') ? grant?.workspace?.id : `0x${grant?.workspace?.id?.slice(-2)}`, grantAddress:  grant?.id?.startsWith('0x') ? grant?.id : `0x${grant?.id?.slice(-2)}` }
				// proposaladdress = await safeObj?.proposeTransactions(JSON.stringify({ workspaceId: grant?.workspace?.id, grantAddress: grant?.id }), transactionData, '')
				proposaladdress = await safeObj?.proposeTransactions(JSON.stringify({ workspaceId: grant?.workspace?.id?.startsWith('0x') ? grant?.workspace?.id : `0x${grant?.workspace?.id?.slice(-2)}`, grantAddress: grant?.id?.startsWith('0x') ? grant?.id : `0x${grant?.id?.slice(-2)}` }), transactionData, '')
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Gnosis Safe',
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}

				setSafeProposalLink(getGnosisTansactionLink(safeObj?.safeAddress ?? '', safeObj?.chainId?.toString(), proposaladdress))
			} else if(safeObj?.getIsTon() === false) {
				proposaladdress = await safeObj?.proposeTransactions(JSON.stringify({ workspaceId: grant?.workspace?.id, grantAddress: grant?.id }), transactionData, phantomWallet)
				if(proposaladdress?.error) {
					customToast({
						title: 'An error occurred while creating transaction on Multi-sig',
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}

				setSafeProposalLink(getProposalUrl(safeObj?.safeAddress ?? '', proposaladdress))
			} else {
				try {
					proposaladdress = await safeObj?.proposeTransactions('', transactionData, tonWallet)

					setSafeProposalLink(getTonkeyProposalUrl(safeObj?.safeAddress ?? '', 'queue'))
				} catch(e) {
					customToast({
						title: e as string,
						status: 'error',
						duration: 3000,
					})
					setPayoutInProcess(false)
					return
				}
			}

			// const methodArgs = [
			// 	selectedProposalsData.map((proposal) => parseInt(proposal?.id, 16)),
			// 	selectedProposalsData.map((proposal, i) => parseInt(proposal.milestones[milestoneIndices[i]].id?.split('.')[1])),
			// 	'0x0000000000000000000000000000000000000001',
			// 	selectedTokenInfo?.tokenName.toLowerCase(),
			// 	'nonEvmAssetAddress-toBeChanged',
			// 	amounts,
			// 	grant?.workspace?.id,
			// 	proposaladdress
			// ]

			// const args = {
			// 	applicationIds: [String(parseInt(proposal?.id!, 16))],
			// 	milestoneIds: [String(parseInt(milestones[milestoneIndices[0]].id?.split('.')[1]))],
			// 	asset: '0x0000000000000000000000000000000000000001',
			// 	tokenName: selectedTokenInfo?.tokenName!,
			// 	nonEvmAssetAddress: 'nonEvmAssetAddress-toBeChanged',
			// 	amounts: [amounts?.[0]],
			// 	transactionHash: '99887341.' + timestamp,
			// 	sender: safeAddress,
			// 	grant: grant?.id!,
			// 	to: tos?.[0]
			// }

			const args = {
				applicationIds: selectedProposalsData.map((proposal) => proposal?.id),
				milestoneIds: selectedProposalsData.map((proposal, i) => (proposal.milestones[milestoneIndices[i]].id?.split('.')[1])),
				asset: '0x0000000000000000000000000000000000000001',
				tokenName: selectedTokenInfo?.tokenName!,
				nonEvmAssetAddress: 'nonEvmAssetAddress-toBeChanged',
				amounts: amounts,
				transactionHash: proposaladdress,
				sender: safeObj?.safeAddress,
				grant: grant?.id!,
				to: tos?.[0]
			}


			// await call({ method: 'disburseRewardFromSafe', args: methodArgs, shouldWaitForBlock: false })
			await executeMutation(DisburseRewardSafeMutation, args)
			setSignerVerifiedState('transaction_initiated')
			setIsDrawerOpen(false)
			setIsModalOpen(true)
			setPayoutInProcess(false)
		}
	}

	const workspacechainId = getSupportedChainIdFromWorkspace(grant?.workspace) || defaultChainId

	const { } = useFunctionCall({ chainId: workspacechainId, contractName: 'workspace', title: 'Payout initiated' })

	// useEffect(() => {
	// 	if(payoutInProcess) {
	// 		payoutsInProcessToastRef.current = customToast({ title: 'Payouts are in process', duration: null, status: 'info' })
	// 	} else if(!payoutInProcess && payoutsInProcessToastRef.current) {
	// 		toast.close(payoutsInProcessToastRef.current)
	// 	}
	// }, [payoutInProcess])

	return buildComponent()
}

export default FundBuilderDrawer