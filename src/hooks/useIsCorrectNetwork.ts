import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'src/constants/chains';
import { useNetwork } from 'wagmi';

export default function useIsCorrectNetworkSelected(chainId: SupportedChainId | undefined) {
  const [{ data: network }] = useNetwork();

  if (!chainId) return false;

  return ALL_SUPPORTED_CHAIN_IDS.includes(network?.chain?.id as number)
  && network?.chain?.id.toString() === chainId.toString();
}
