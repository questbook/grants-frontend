import { ethers } from 'ethers'

export type BiconomyWalletClient = {
    engine: any
    biconomyAttributes: any,
    isSignerWithAccounts: any;
    provider: any;
    targetProvider: any;
    walletFactoryAddress: string,
    baseWalletAddress: string,
    entryPointAddress: string,
    handlerAddress: string,
    providerOrSigner: ethers.Signer | ethers.providers.Provider,
    networkId: number,
    walletFactory: ethers.Contract,
    baseWallet: ethers.Contract,
    entryPoint: ethers.Contract,
    checkIfWalletExists: (params: CheckIfWalletExistsParams) => Promise<CheckIfWalletExistsType>,
    checkIfWalletExistsAndDeploy: (params: CheckIfWalletExistsParams) => Promise<CheckIfWalletExistsAndDeployType>,
    buildExecTransaction: (params: BuildExecTransactionParams) => Promise<BuildExecTransaction>,
    sendBiconomyWalletTransaction: (params: SendBiconomyWalletTransactionParams) => Promise<string>
}

export type SendBiconomyWalletTransactionParams = {
    execTransactionBody: BuildExecTransaction,
    walletAddress: string,
    signature: string,
    webHookAttributes?: WebHookAttributesType
}

export type WebHookAttributesType = {
    webHookId: string,
    webHookData: any
}


export type CheckIfWalletExistsParams = {
    eoa: string
}

export type CheckIfWalletExistsType = {
    doesWalletExist: boolean,
    walletAddress: string
}

export type CheckIfWalletExistsAndDeployType = string

export type BuildExecTransactionParams = {
    data?: string,
    to: string,
    walletAddress: string
}

export type BuildExecTransaction = {
    to: string,
    value: number,
    data: string,
    operation: number,
    targetTxGas: number,
    baseGas: number,
    gasPrice: number,
    gasToken: string,
    refundReceiver: string,
    nonce: number
}

export type SendBiconomyWalletTransaction = string;