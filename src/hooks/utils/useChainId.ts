import React, { useEffect } from 'react';
import { SupportedChainId } from 'src/constants/chains';
import { useNetwork } from 'wagmi';

export default function useChainId() {
  const [{ data: networkData }] = useNetwork();
  const supportedChainIdFromNetworkData = (chainId: number) => {
    if (chainId === 137) {
      return SupportedChainId.POLYGON_MAINNET;
    }
    if (chainId === 10) {
      return SupportedChainId.OPTIMISM_MAINNET;
    }
    return undefined;
  };

  const [chainId, setChainId] = React.useState<SupportedChainId>();
  useEffect(() => {
    // console.log('changing net');
    if (!networkData.chain?.id) {
      setChainId(undefined);
      return;
    }
    setChainId(supportedChainIdFromNetworkData(networkData.chain.id));
  }, [networkData.chain?.id]);

  return chainId;
}
