

// Wallet Connectors
import { Connector as WagmiConnector } from 'wagmi'
import { BaseMessageSignerWalletAdapter as SolanaWalletAdapter } from '@solana/wallet-adapter-base'
export type WalletConnector = WagmiConnector | SolanaWalletAdapter
export { SolanaWalletAdapter, WagmiConnector }

// Providers for creating connections with contracts/programs.
import { Provider as EvmContractProvider } from '@ethersproject/providers'
import { Signer as EvmContractSigner } from 'ethers';
import { AnchorProvider as SolanaProgramProvider } from '@project-serum/anchor';
export type WagmiContractProvider = EvmContractProvider | EvmContractSigner
export type ContractProvider = WagmiContractProvider | SolanaProgramProvider
export { SolanaProgramProvider, EvmContractProvider, EvmContractSigner };

// Adress type of Solana and EVM.
import { Address as SolanaAddress } from '@project-serum/anchor'
export type Address = SolanaAddress | string

// A wallet abstraction for creating a connections to a Solana's program.
import { PublicKey as SolanaPublicKey } from '@solana/web3.js'
import {Transaction as SolanaTransaction} from '@solana/web3.js'
export type SolanaProgramWallet = {
    signTransaction(tx: SolanaTransaction): Promise<SolanaTransaction>;
    signAllTransactions(txs: SolanaTransaction[]): Promise<SolanaTransaction[]>;
    publicKey: SolanaPublicKey;
}

// Abstract contract interface to include EVM's ABI and Solana IDL.
import { ContractInterface as EVMContractInterface } from 'ethers';
import { Idl as SolanaContractInterface } from '@project-serum/anchor';
export type ContractInterface = {
    abi?: EVMContractInterface,
    idl?: SolanaContractInterface 
}
export type { EVMContractInterface, SolanaContractInterface }

// Generic Contract type.
import { Program as SolanaProgram } from '@project-serum/anchor'
import { Contract as EvmContract } from 'ethers'
export type GenericContract = SolanaProgram | EvmContract
export {EvmContract, SolanaProgram}
