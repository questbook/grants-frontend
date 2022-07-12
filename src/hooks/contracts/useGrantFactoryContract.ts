
/* eslint-disable consistent-return */
import React, { useEffect } from 'react'
import { GRANT_FACTORY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import type { GrantFactoryAbi } from 'src/generated/contracts'
import { useContract, useSigner } from 'wagmi'
import GrantFactoryABI from '../../contracts/abi/GrantFactoryAbi.json'

export default function useGrantFactoryContract(chainId?: SupportedChainId) {
	const [addressOrName, setAddressOrName] = React.useState<string>()
	const { data: signer } = useSigner()
	useEffect(() => {
		if(!chainId) {
			return
		}

		setAddressOrName(GRANT_FACTORY_ADDRESS[chainId])
	}, [chainId])

	const grantContract = useContract<GrantFactoryAbi>({
		addressOrName:
      addressOrName ?? '0x0000000000000000000000000000000000000000',
		contractInterface: GrantFactoryABI,
		signerOrProvider: signer,
	})

	return grantContract
}
