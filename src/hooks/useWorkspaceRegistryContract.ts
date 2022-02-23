/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable consistent-return */
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses';
import { SupportedChainId } from 'src/constants/chains';
import { useContract, useSigner } from 'wagmi';
import WORKSPACE_REGISTRY_ABI from 'src/contracts/abi/WorkspaceRegistryAbi.json';
import React, { useEffect } from 'react';
import config from 'src/constants/config';
import WorkspaceRegistryABI from '../contracts/abi/WorkspaceRegistryAbi.json';

export default function useWorkspaceRegistryContract(workspace: any, chainId?: string) {
  const [addressOrName, setAddressOrName] = React.useState<string>();
  const [signerStates] = useSigner();
  useEffect(() => {
    if (!chainId) {
      if (workspace && workspace.chainId && workspace.chainId === 'chain_4') {
        setAddressOrName(config.WorkspaceRegistryAddress);
      }
    }
    if (chainId === '1') {
      setAddressOrName(config.WorkspaceRegistryAddress);
    }
  }, [chainId, workspace]);

  const workspaceRegistryContract = useContract({
    addressOrName:
      addressOrName ?? '0x0000000000000000000000000000000000000000',
    contractInterface: WorkspaceRegistryABI,
    signerOrProvider: signerStates.data,
  });

  return workspaceRegistryContract;
}
