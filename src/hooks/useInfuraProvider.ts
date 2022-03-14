import { ethers } from 'ethers';

const infuraId = process.env.INFURA_ID;

export default function useInfuraProvider(network: number) {
  const provider = new ethers.providers.InfuraProvider(network, infuraId);

  return provider;
}
