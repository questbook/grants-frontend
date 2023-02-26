import { useContext, useMemo } from 'react'
import axios from 'axios'
import sha256 from 'crypto-js/sha256'
import { COMMUNICATION_ADDRESS } from 'src/constants/addresses'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import logger from 'src/libraries/logger'
import { WebwalletContext } from 'src/pages/_app'
import { bicoDapps, getTransactionDetails, sendGaslessTransaction } from 'src/libraries/utils/gasless'

type FunctionProps = {
    email: string
}

type HookProps = {
    chainId: SupportedChainId
}

function useCreateMapping({ chainId }: HookProps) {
	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({ chainId: chainId?.toString()! })
	const { nonce } = useQuestbookAccount()
	const communicationContract = useQBContract('communication', chainId)

	const createMapping = async({ email }: FunctionProps) => {
		if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
			throw new Error('Zero wallet is not ready')
		}

		const check = await axios.post(`${process.env.API_ENDPOINT}/mapping/check`, {
			id: scwAddress,
			from: scwAddress,
			to: email
		})

		if(check.status === 200) {
			logger.info({ check }, 'useCreateMapping: Mapping Exists')
		} else {

			const encryptedEmail = sha256(email).toString()
			const signedMessage = (await webwallet?.signMessage(email))?.toString()

			const commMethodArgs = [chainId, encryptedEmail, signedMessage]
			logger.info({ commMethodArgs }, 'useCreateMapping: Communication method args')

			const commTx = await sendGaslessTransaction(
				biconomy,
				communicationContract,
				'createLink',
				commMethodArgs,
				COMMUNICATION_ADDRESS[chainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			logger.info({ commTx }, 'useCreateMapping: commTx')

			if(commTx) {
				const { receipt: commReceipt } = await getTransactionDetails(commTx, chainId.toString())
				logger.info({ commReceipt }, 'useCreateMapping: commReceipt')
				const txHash = commReceipt.transactionHash

				logger.info({ txHash }, 'useCreateMapping: Communication tx hash')

				const ret = await axios.post(`${process.env.API_ENDPOINT}/mapping/create`, {
					id: scwAddress,
					chainId,
					sender: scwAddress,
					to: email,
					wallet: webwallet?.address,
					transactionHash: txHash,
				})

				logger.info({ ret }, 'useCreateMapping: Mapping response')
			}
		}
	}

	return useMemo(() => {
		return createMapping
	}, [biconomy, biconomyWalletClient, scwAddress, webwallet, chainId, nonce])
}

export default useCreateMapping