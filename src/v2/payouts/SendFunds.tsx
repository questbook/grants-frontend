import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { WebwalletContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { getFieldString } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { isPlausibleSolanaAddress } from 'src/utils/generics'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { Gnosis_Safe, GnosisSafe } from 'src/v2/constants/safe/gnosis_safe'
import { Realms_Solana, RealmsSolana, usdToSolana } from 'src/v2/constants/safe/realms_solana'
import safeServicesInfo from 'src/v2/constants/safeServicesInfo'
import usePhantomWallet from 'src/v2/hooks/usePhantomWallet'
import SendFundsDrawer from 'src/v2/payouts/SendFundsDrawer/SendFundsDrawer'
import SendFundsModal from 'src/v2/payouts/SendFundsModal/SendFundsModal'
import TransactionInitiatedModal from 'src/v2/payouts/TransactionInitiatedModal'
import getGnosisTansactionLink from 'src/v2/utils/gnosisUtils'
import getProposalUrl from 'src/v2/utils/phantomUtils'
import { erc20ABI, useConnect, useDisconnect } from 'wagmi'

const ERC20Interface = new ethers.utils.Interface(erc20ABI)

export default function SendFunds({
	workspace,
	workspaceSafe,
	workspaceSafeChainId,
	sendFundsTo,
	rewardAssetAddress,
	rewardAssetDecimals,
	grantData, }) {

	//Implementing the safe send

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

	const {
		phantomWallet,
		phantomWalletConnected,
		setPhantomWalletConnected } = usePhantomWallet()

	const { isConnected } = useConnect()
	const { disconnect } = useDisconnect()

	const [sendFundsModalIsOpen, setSendFundsModalIsOpen] = useState(false)
	const [sendFundsDrawerIsOpen, setSendFundsDrawerIsOpen] = useState(false)
	const [txnInitModalIsOpen, setTxnInitModalIsOpen] = useState(false)

	const [signerVerified, setSignerVerififed] = useState(false)
	const [proposalAddr, setProposalAddr] = useState('')

	const [initiateTransactionData, setInitiateTransactionData] = useState<any>([])
	const [gnosisBatchData, setGnosisBatchData] = useState<any>([])
	const [, setGnosisReadyToExecuteTxns] = useState<any>([])
	const [step, setStep] = useState('RECEIPT_DETAILS')

	const isEvmChain = workspaceSafeChainId !== 900001

	const workspaceRegistryContract = useQBContract('workspace', workspacechainId)
	const { webwallet } = useContext(WebwalletContext)!

	const currentSafe = useMemo(() => {
		if(isEvmChain && workspaceSafe) {
			const txnServiceURL = safeServicesInfo[workspaceSafeChainId]
			return new GnosisSafe(workspaceSafeChainId, txnServiceURL, workspaceSafe)
		} else {
			if(isPlausibleSolanaAddress(workspaceSafe)) {
				return new RealmsSolana(workspaceSafe)
			}
		}
	}, [workspaceSafe])

	useEffect(() => {
		if(sendFundsTo?.length > 0) {
			if(sendFundsTo?.length === 1) {
				setSendFundsModalIsOpen(true)
			} else {
				setSendFundsDrawerIsOpen(true)
			}
		}
	}, [sendFundsTo])


	useEffect(() => {
		console.log('sendFundsTo', sendFundsTo)
		const formattedTrxnData = sendFundsTo?.map((recepient,) => (
			{
				from: currentSafe?.id?.toString(),
				to:  recepient?.applicantAddress || getFieldString(recepient, 'applicantAddress') || recepient?.applicantId,
				applicationId: recepient?.applicationId,
				selectedMilestone: recepient?.milestones[0]?.id,
				amount: 0
			})
		)
		setInitiateTransactionData(formattedTrxnData)
		setGnosisBatchData(formattedTrxnData)
	}, [sendFundsTo])

	useEffect(() => {
		if(phantomWalletConnected) {
			getRealmsVerification()
		} else if(isConnected) {
			verifyGnosisOwner()
		} else {
			setSignerVerififed(false)
		}
	}, [phantomWalletConnected, isConnected])

	useEffect(() => {
		if(signerVerified) {
			setStep('VERIFIED_OWNER')
		}
	}, [signerVerified])


	function createEVMMetaTransactions() {
		const readyTxs = gnosisBatchData.map((data: any) => {
			const txData = encodeTransactionData(data.to, (data.amount.toString()))
			const tx = {
				to: ethers.utils.getAddress(rewardAssetAddress),
				data: txData,
				value: '0'
			}
			return tx
		})
		setGnosisReadyToExecuteTxns(readyTxs)
		return readyTxs
	}

	function encodeTransactionData(recipientAddress: string, fundAmount: string) {
		const txData = ERC20Interface.encodeFunctionData('transfer', [
			recipientAddress,
			ethers.utils.parseUnits(fundAmount, rewardAssetDecimals)
		])

		return txData
	}

	const getRealmsVerification = async() => {
		if(phantomWallet?.publicKey?.toString()) {
			const isVerified = await currentSafe?.isOwner(phantomWallet.publicKey?.toString())
			if(isVerified) {
				setSignerVerififed(true)
			}
		}
	}

	const verifyGnosisOwner = async() => {
		if(isConnected) {
			const isVerified = await currentSafe?.isOwner(workspaceSafe)
			if(isVerified) {
				setSignerVerififed(true)
			} else {
				// console.log('not a owner')
				setSignerVerififed(false)
			}
		}
	}


	const initiateTransaction = async() => {
		// console.log('initiate transaction called')
		let proposaladdress: string | undefined
		if(isEvmChain) {
			const readyToExecuteTxs = createEVMMetaTransactions()
			const safeTxHash = await currentSafe?.createMultiTransaction(readyToExecuteTxs, workspaceSafe)
			if(safeTxHash) {
				proposaladdress = safeTxHash
				setProposalAddr(safeTxHash)
			} else {
				throw new Error('Proposal address not found')
			}
		} else {
			proposaladdress = await currentSafe?.proposeTransactions(grantData?.grants ? grantData?.grants[0].title! : grantData.title, initiateTransactionData, phantomWallet)
			if(!proposaladdress) {
				throw new Error('No proposal address found!')
			}

			setProposalAddr(proposaladdress?.toString())
		}

		disburseRewardFromSafe(proposaladdress?.toString()!)
			.then(() => {
				// console.log('Sent transaction to contract - realms')
			})
			.catch(() => {
				// console.log('realms sending transction error:', err)
			})

	}

	const disburseRewardFromSafe = useCallback(async(proposaladdress: string) => {
		// console.log(workspacechainId)
		if(!workspacechainId) {
			return
		}

		try {
			if(!workspacechainId) {
				throw new Error('No network specified')
			}

			if(!proposaladdress) {
				throw new Error('No proposal Address specified')
			}

			if(!initiateTransactionData) {
				throw new Error('No data provided!')
			}

			if(!workspace) {
				throw new Error('No workspace found!')
			}

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				return
			}

			console.log('initiateTransactionData', initiateTransactionData)


			const methodArgs = [
				initiateTransactionData.map((element: any) => (parseInt(element.applicationId, 16))),
				initiateTransactionData.map((element: any) => (parseInt(element.selectedMilestone?.split('.')[1]))),
				rewardAssetAddress,
				'nonEvmAssetAddress-toBeChanged',
				initiateTransactionData.map((element: any) => isEvmChain ? (ethers.utils.parseEther(element.amount.toString())) : Math.floor(element.amount.toFixed(9) * 1000000000)),
				workspace.id,
				proposaladdress
			]

			console.log('methodArgs', methodArgs)

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

			if(!transactionHash) {
				throw new Error('No transaction hash found!')
			}

			const { txFee } = await getTransactionDetails(transactionHash, workspacechainId.toString())

			// console.log('txFee', txFee)
			// console.log('receipt: ', receipt)
			await chargeGas(Number(workspace.id), Number(txFee))

		} catch(e: any) {
			// console.log('disburse error', e)
		}
	}, [workspace, biconomyWalletClient, workspacechainId, biconomy, workspaceRegistryContract, scwAddress, webwallet, nonce, initiateTransactionData, proposalAddr])

	const onChangeRecepientDetails = async(applicationId: any, fieldName: string, fieldValue: any) => {
		// console.log('onChangeRecepientDetails', applicationId, fieldName, fieldValue)
		// console.log('Gnosis Batch data', gnosisBatchData)

		if(!isEvmChain && fieldName === 'amount') {
			fieldValue = await usdToSolana(fieldValue)
		}

		const tempData = initiateTransactionData.map((transactionData: any) => {
			if(transactionData.applicationId === applicationId) {
				return { ...transactionData, [fieldName]: fieldValue }
			}

			return transactionData
		})

		// console.log('initiateTransactionData', tempData)
		setInitiateTransactionData(tempData)
		setGnosisBatchData(tempData)
	}

	const onModalStepChange = async(currentState: string) => {
		switch (currentState) {
		case 'RECEIPT_DETAILS':
			setStep('CONNECT_WALLET')
			break
		case 'CONNECT_WALLET':
			if(signerVerified) {
				setStep('VERIFIED_OWNER')
			}

			break
		case 'VERIFIED_OWNER':
			setStep('TRANSATION_INITIATED')
			initiateTransaction()
			setSendFundsModalIsOpen(false)
			setSendFundsDrawerIsOpen(false)
			setTxnInitModalIsOpen(true)

			break
		}
	}

	const onModalClose = async() => {
		setStep('RECEIPT_DETAILS')
		setSendFundsModalIsOpen(false)
		setSendFundsDrawerIsOpen(false)
		setTxnInitModalIsOpen(false)
		if(phantomWallet?.isConnected) {
			await phantomWallet.disconnect()
			setPhantomWalletConnected(false)
		}

		if(isConnected) {
			disconnect()
		}
	}

	//end of implementation

	return (
		<>

			<SendFundsModal
				isOpen={sendFundsModalIsOpen}
				onClose={onModalClose}
				safeAddress={workspaceSafe}
				proposals={sendFundsTo ?? []}

				onChangeRecepientDetails={onChangeRecepientDetails}
				phantomWallet={phantomWallet}
				isEvmChain={isEvmChain}
				signerVerified={signerVerified}
				initiateTransactionData={initiateTransactionData}
				onModalStepChange={onModalStepChange}
				step={step}
			/>

			<TransactionInitiatedModal
				isOpen={!!(txnInitModalIsOpen && proposalAddr)}
				onClose={onModalClose}
				proposalUrl={isEvmChain ? getGnosisTansactionLink(currentSafe?.id?.toString()!, currentSafe?.chainId.toString()!) : getProposalUrl(currentSafe?.id?.toString()!, proposalAddr)}
			/>

			<SendFundsDrawer
				isOpen={sendFundsDrawerIsOpen}
				onClose={onModalClose}
				safeAddress={workspaceSafe}
				proposals={sendFundsTo ?? []}
				onChangeRecepientDetails={onChangeRecepientDetails}
				phantomWallet={phantomWallet}
				setPhantomWalletConnected={setPhantomWalletConnected}
				isEvmChain={isEvmChain}
				current_safe={currentSafe}
				signerVerified={signerVerified}
				initiateTransaction={initiateTransaction}
				initiateTransactionData={initiateTransactionData}

				onModalStepChange={onModalStepChange}
				step={step}
			/>
		</>
	)
}