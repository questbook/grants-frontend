import { useContext } from 'react'
import { WebwalletContext } from 'pages/_app'
import type { ERC20 } from 'src/generated/contracts/ERC20'
import { useContract } from 'wagmi'
import erc20Interface from '../../contracts/abi/ERC20.json'

export default function useERC20Contract(address?: string) {
	const { webwallet: signer } = useContext(WebwalletContext)!
	const contract = useContract<ERC20>({
		addressOrName: address || '0x0000000000000000000000000000000000000000',
		contractInterface: erc20Interface,
		signerOrProvider: signer,
	})

	return contract
}
