import { useContract, useSigner } from '../../../multichain';
import erc20Interface from '../../contracts/abi/ERC20.json';

export default function useERC20Contract(address?: string) {
  const [signerStates] = useSigner();
  const contract = useContract({
    addressOrName: address ?? '0x0000000000000000000000000000000000000000',
    contractInterface: {abi: erc20Interface},
    signerOrProvider: signerStates.data?.provider,
  });

  return contract;
}
