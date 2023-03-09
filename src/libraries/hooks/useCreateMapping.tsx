import { useContext } from 'react'
import axios from 'axios'
import sha256 from 'crypto-js/sha256'
import SupportedChainId from 'src/generated/SupportedChainId'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { WebwalletContext } from 'src/pages/_app'

type FunctionProps = {
    email: string
}

type HookProps = {
    chainId: SupportedChainId
}

function useCreateMapping({ chainId }: HookProps) {
	const { webwallet, scwAddress } = useContext(WebwalletContext)!

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'communication' })

	const createMapping = async({ email }: FunctionProps) => {
		if(!isBiconomyInitialised) {
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

			const receipt = await call({ method: 'createLink', args: commMethodArgs, shouldWaitForBlock: false })

			if(receipt) {
				const txHash = receipt.transactionHash
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

	return createMapping
}

export default useCreateMapping