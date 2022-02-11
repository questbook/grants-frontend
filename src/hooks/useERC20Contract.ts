import { useEffect, useState } from 'react';
import { useContract } from 'wagmi';
import { erc20Interface } from '../contracts/utils/ERC20';

export default function useERC20Contract(address: string) {
  const [contract, setContract] = useState(null);
  const contractHook = useContract({
    addressOrName: address,
    contractInterface: erc20Interface,
  });

  useEffect(() => {
    setContract(contractHook);
  }, [contractHook]);
  return contract;
}
