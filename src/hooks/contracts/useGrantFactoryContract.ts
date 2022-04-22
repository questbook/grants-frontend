/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable consistent-return */
import { GRANT_FACTORY_ADDRESS } from 'src/constants/addresses';
import { SupportedChainId } from 'src/constants/chains';
import { useContract, useSigner } from '../../../multichain';
import React, { useEffect } from 'react';
import GrantFactoryABI from '../../contracts/abi/GrantFactoryAbi.json';

export default function useGrantFactoryContract(chainId?: SupportedChainId) {
  const [addressOrName, setAddressOrName] = React.useState<string>();
  const [signerStates] = useSigner();
  useEffect(() => {
    if (!chainId) {
      return;
    }
    setAddressOrName(GRANT_FACTORY_ADDRESS[chainId]);
  }, [chainId]);

  const grantContract = useContract({
    addressOrName:
      addressOrName ?? '0x0000000000000000000000000000000000000000',
    contractInterface: {abi: GrantFactoryABI},
    signerOrProvider: signerStates.data?.provider,
  });

  return grantContract;
}
