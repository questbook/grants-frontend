import { CHAIN_INFO } from 'src/constants/chainInfo';
import { SupportedChainId } from 'src/constants/chains';
import supportedCurrencies from '../constants/supportedCurrencies';

export function getAssetInfo(
  asset?: string,
  chainId?: SupportedChainId,
): { label: string; icon: string } {
  if (!asset) {
    return { label: '', icon: '' };
  }
  if (chainId) {
    return {
      label:
        CHAIN_INFO[
          chainId
        ]?.supportedCurrencies[asset.toLowerCase()]?.label
        ?? 'LOL',
      icon:
        CHAIN_INFO[
          chainId
        ]?.supportedCurrencies[asset.toLowerCase()]?.icon,
    };
  }

  return (
    supportedCurrencies.find(
      (curr) => curr?.id.toLowerCase() === asset?.toLowerCase(),
    ) ?? { label: '', icon: '' }
  );
}

export function dummy() {}
