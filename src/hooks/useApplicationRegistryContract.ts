import { APPLICATION_REGISTRY_ADDRESS } from 'src/constants/addresses';
import { SupportedChainId } from 'src/constants/chains';
import { useContract, useSigner } from 'wagmi';
import APPLICATION_REGISTRY_ABI from 'src/contracts/abi/ApplicationRegistryAbi.json';

export default function useApplicationRegistryContract(chainId: SupportedChainId) {
  const [{ data: signer }] = useSigner();
  return useContract({
    addressOrName: APPLICATION_REGISTRY_ADDRESS[chainId],
    contractInterface: APPLICATION_REGISTRY_ABI,
    signerOrProvider: signer,
  });
}
