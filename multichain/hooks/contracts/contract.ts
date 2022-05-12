

import {
    SolanaProgramProvider,
    ContractProvider,
    Address,
    ContractInterface,
    GenericContract,
    EvmContract,
    SolanaProgram,
    EvmContractProvider,
    EvmContractSigner
} from '../../types'
import SolanaContractLib from './questbook-solana';

export type ContractFunction<T = any> = (...args: Array<any>) => Promise<T>;

function defineReadOnly<T, K extends keyof T>(object: T, name: K, value: T[K]): void {
    Object.defineProperty(object, name, {
        enumerable: true,
        value: value,
        writable: false,
    });
}

export class Contract {
    address: Address
    contractInterface: ContractInterface
    provider?: ContractProvider
    signer?: ContractProvider
    contract_?: any
    contractLib: any
    functions: { [functionName: string]: ContractFunction }

    readonly [key: string]: ContractFunction<any> | any;

    constructor(addressOrName: Address, contractInterface: ContractInterface, provider?: ContractProvider) {
        this.address = addressOrName
        this.contractInterface = contractInterface
        this.provider = provider
        this.signer = provider
        this.functions = {}

        // Solana programs.
        if (provider instanceof SolanaProgramProvider) {
            if (!contractInterface.idl) return
            this.contract_ = new SolanaProgram(contractInterface.idl, addressOrName, provider)
            this.contractLib = new SolanaContractLib(this.contract_, provider)

            // How to know 
            // const updateGrantAccessibility = () => solanaContract.rpcUpdateGrantAccessibility()



            // Object(this.contract_.methods).keys.forEach((functionName: string) => {
            //     if (this.contract_ instanceof SolanaProgram && this.contract_.hasOwnProperty(functionName)) {
            //         const value: any = (...args: Array<any>) => {

            //             // TODO: Need to add support for creating accounts. 
            //             const solanaInstruction: Promise<any> = this.contract_?.state.rpc[functionName](...args, {
            //                 accounts: {
            //                     authority: provider.wallet.publicKey
            //                 }
            //             })
            //             return solanaInstruction
            //         }
            //         defineReadOnly(this, functionName, value);
            //         this.functions[functionName] = value
            //     }
            // });

            // TODO: Need to add support for decimals and other ERC20 related functions (if the program is SPL).
        }
        else {
            // Add other blockchain types.
        }
    }

    async updateGrantAccessibility(newState: boolean){
        if (this.contract_ instanceof SolanaProgram){
            this.contractLib.rpcUpdateGrantAccessibility(0, newState, )
        }
    }
}
