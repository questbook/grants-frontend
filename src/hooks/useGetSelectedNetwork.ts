import { ALL_SUPPORTED_CHAIN_IDS } from 'src/constants/chains';
import { useNetwork } from 'wagmi';

export default function useGetSelectedNetwork() {
  const [{ data: network }] = useNetwork();

  return ALL_SUPPORTED_CHAIN_IDS.find((cId) => cId === network?.chain?.id as number);
}
