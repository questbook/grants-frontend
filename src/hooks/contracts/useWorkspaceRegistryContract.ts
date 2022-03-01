/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable consistent-return */
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses';
import { SupportedChainId } from 'src/constants/chains';
import { useContract, useSigner } from 'wagmi';
import React, { useEffect } from 'react';
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json';

export default function useWorkspaceRegistryContract(chainId?: SupportedChainId) {
  const [addressOrName, setAddressOrName] = React.useState<string>();
  const [signerStates] = useSigner();
  useEffect(() => {
    if (!chainId) {
      return;
    }
    setAddressOrName(WORKSPACE_REGISTRY_ADDRESS[chainId]);
  }, [chainId]);

  const workspaceRegistryContract = useContract({
    addressOrName:
      addressOrName ?? '0x0000000000000000000000000000000000000000',
    contractInterface: WorkspaceRegistryABI,
    signerOrProvider: signerStates.data,
  });

  return workspaceRegistryContract;
}
