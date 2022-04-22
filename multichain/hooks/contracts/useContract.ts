import React from 'react'
import { Contract } from './contract'
import { useContext } from '../../context'
import { ContractInterface, Address, ContractProvider } from '../../types';
import { useContract as useContractWagmi } from 'wagmi';


export type Config = {
  /** Contract address */
  addressOrName: Address
  /** Contract interface and Program's IDL */
  contractInterface: ContractInterface

  /** Signer or provider to attach to contract */
  signerOrProvider?: ContractProvider
}

const getContract = <T = Contract>({
  addressOrName,
  contractInterface,
  signerOrProvider,
}: Config) =>
  <T>(<unknown>new Contract(addressOrName, contractInterface, signerOrProvider))

export const useContract = <Contract = any>({
  addressOrName,
  contractInterface,
  signerOrProvider,
}: Config) => {
  const context = useContext()
  return React.useMemo(() => {
    
    return getContract<Contract>({
      addressOrName,
      contractInterface,
      signerOrProvider,
    })
  }, [addressOrName, contractInterface, signerOrProvider])
}