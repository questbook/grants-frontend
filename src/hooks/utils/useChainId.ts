import React, { useEffect } from 'react';
import { SupportedChainId } from 'src/constants/chains';
import { chain, useNetwork } from 'wagmi';

export default function useChainId() {
  const [{ data: networkData }] = useNetwork();
  const supportedChainIdFromNetworkData = (chainId: number) => {
    if (chainId === 4) {
      return SupportedChainId.RINKEBY;
    }
    if (chainId === 1666700000) {
      return SupportedChainId.HARMONY_TESTNET_S0;
    }
    if (chainId === 137) {
      return SupportedChainId.POLYGON_MAINNET;
    }
    if (chainId === 80001) {
      return SupportedChainId.POLYGON_TESTNET;
    }
    if (chainId === 10) {
      return SupportedChainId.OPTIMISM_MAINNET;
    }
    if (chainId === 245022926) {
      return SupportedChainId.NEON_DEVNET;
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
