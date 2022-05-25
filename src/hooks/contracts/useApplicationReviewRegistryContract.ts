
/* eslint-disable consistent-return */
import React, { useEffect } from 'react'
import { APPLICATION_REVIEW_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import { useContract, useSigner } from 'wagmi'
import ApplicationReviewRegistryABI from '../../contracts/abi/ApplicationReviewRegistryAbi.json'

export default function useApplicationReviewRegistryContract(chainId?: SupportedChainId) {
	const [addressOrName, setAddressOrName] = React.useState<string>()
	const [signerStates] = useSigner()
	useEffect(() => {
		if(!chainId) {
			return
		}

		setAddressOrName(APPLICATION_REVIEW_REGISTRY_ADDRESS[chainId])
	}, [chainId])

	const grantContract = useContract({
		addressOrName:
      addressOrName ?? '0x0000000000000000000000000000000000000000',
		contractInterface: ApplicationReviewRegistryABI,
		signerOrProvider: signerStates.data,
	})

	return grantContract
}
