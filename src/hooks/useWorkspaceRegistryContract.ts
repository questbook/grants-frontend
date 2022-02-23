/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable consistent-return */
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses';
import { SupportedChainId } from 'src/constants/chains';
import { useContract, useSigner } from 'wagmi';
import WORKSPACE_REGISTRY_ABI from 'src/contracts/abi/WorkspaceRegistryAbi.json';

export default function useWorkspaceRegistryContract(chainId: SupportedChainId) {
  const [{ data }] = useSigner();
  // if (!data || !chainId) return;

  return useContract({
    addressOrName: WORKSPACE_REGISTRY_ADDRESS[chainId],
    contractInterface: WORKSPACE_REGISTRY_ABI,
    signerOrProvider: data,
  });
}
