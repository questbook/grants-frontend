import { ALL_SUPPORTED_CHAIN_IDS } from 'src/constants/chains';
import { useNetwork } from 'wagmi';

export default function useIsSupportedNetwork() {
  const [{ data: network }] = useNetwork();

  return ALL_SUPPORTED_CHAIN_IDS.includes(network?.chain?.id as number);
}
