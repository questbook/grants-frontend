import { useContext, useEffect, useMemo } from 'react'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { QBContract } from 'src/types'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import MAIN_LOGGER from 'src/utils/logger'

interface Props {
	chainId: SupportedChainId
	contractName: QBContract
	setTransactionStep?: (step: number | undefined) => void
	setTransactionHash?: (hash: string) => void
	title?: string
}

interface CallProps { method: string, args: unknown[], isDummy?: boolean, shouldWaitForBlock?: boolean }

function useFunctionCall({ chainId, contractName, setTransactionStep, setTransactionHash, title }: Props) {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!

	const { network, switchNetwork } = useNetwork()

	useEffect(() => {
		if(network !== chainId) {
			switchNetwork(chainId)
		}
	}, [chainId, network])

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({ chainId: chainId?.toString() })

	const { nonce } = useQuestbookAccount()
	const contract = useQBContract(contractName, chainId)

	const isBiconomyInitialised = useMemo(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && biconomy?.networkId) {
			return true
		} else {
			return false
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading])

	const toast = useCustomToast()

	const call = async({ method, args, isDummy = false, shouldWaitForBlock = true }: CallProps) => {
		const logger = MAIN_LOGGER.child({ chainId, contractName, method })
		try {
			if(!contract) {
				throw new Error('Contract not found')
			}

			if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
				logger.info({ biconomyWalletClient, scwAddress }, 'Biconomy not ready')
				throw new Error('Zero wallet is not ready')
			}

			logger.info('Calling function', { args })

			if(isDummy) {
				return
			}

			setTransactionStep?.(0)
			const tx = await sendGaslessTransaction(
				biconomy,
				contract,
				method,
				args,
				contract.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			logger.info('Transaction sent', { tx })

			if(tx) {
				setTransactionStep?.(1)
				const { receipt } = await getTransactionDetails(tx, chainId.toString())
				logger.info('Transaction executed. Waiting for block.', { receipt })
				setTransactionHash?.(receipt?.transactionHash)
				setTransactionStep?.(2)
				if(shouldWaitForBlock) {
					await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)
					logger.info('Transaction indexed')
				}

				setTransactionStep?.(3)

				toast({
					title: title ?? `Transaction executed${shouldWaitForBlock ? ' and indexed' : ''}`,
					status: 'success',
					duration: 3000,
					onCloseComplete: () => {
						setTransactionStep?.(undefined)
					}
				})
				return true
			} else {
				throw new Error('Transaction not sent')
			}
		} catch(e) {
			logger.error('Error calling function', { error: e })
			setTransactionStep?.(undefined)
			const message = getErrorMessage(e as Error)
			toast({
				position: 'top',
				title: message,
				status: 'error'
			})
			return false
		}
	}

	return { call, isBiconomyInitialised }
}

export default useFunctionCall