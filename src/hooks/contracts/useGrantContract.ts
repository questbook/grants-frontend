import { useContext } from 'react'
import { WebwalletContext } from 'pages/_app'
import GrantABI from 'src/contracts/abi/GrantAbi.json'
import type { GrantAbi } from 'src/generated/contracts'
import { useContract } from 'wagmi'

export default function useGrantContract(grantId?: string) {
	const { webwallet: signer } = useContext(WebwalletContext)!
	const grantContract = useContract<GrantAbi>({
		addressOrName: grantId || '0x0000000000000000000000000000000000000000',
		contractInterface: GrantABI,
		signerOrProvider: signer,
	})

	return grantContract
}
