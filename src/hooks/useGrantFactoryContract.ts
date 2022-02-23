/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable consistent-return */
import { GRANT_FACTORY_ADDRESS } from 'src/constants/addresses';
import { SupportedChainId } from 'src/constants/chains';
import { useContract, useSigner } from 'wagmi';
import GRANT_FACTORY_ABI from 'src/contracts/abi/GrantFactoryAbi.json';

export default function useGrantFactoryContract(chainId: SupportedChainId) {
  const [{ data }] = useSigner();
  // if (!data || !chainId) return;
  return useContract({
    addressOrName: chainId ? GRANT_FACTORY_ADDRESS[chainId] : '',
    contractInterface: GRANT_FACTORY_ABI,
    signerOrProvider: data,
  });
}
