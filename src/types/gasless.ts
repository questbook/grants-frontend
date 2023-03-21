import { ethers } from 'ethers'

export type BiconomyWalletClient = {
    provider: ethers.providers.Provider
    targetProvider: ethers.providers.Provider
    walletFactoryAddress: string
    baseWalletAddress: string
    entryPointAddress: string
    handlerAddress: string
    providerOrSigner: ethers.Signer | ethers.providers.Provider
    networkId: number
    walletFactory: ethers.Contract
    baseWallet: ethers.Contract
    entryPoint: ethers.Contract
    checkIfWalletExists: (params: CheckIfWalletExistsParams) => Promise<CheckIfWalletExistsType>
    checkIfWalletExistsAndDeploy: (params: CheckIfWalletExistsAndDeployParams) => Promise<CheckIfWalletExistsAndDeployType>
    buildExecTransaction: (params: BuildExecTransactionParams) => Promise<BuildExecTransaction>
    sendBiconomyWalletTransaction: (params: SendBiconomyWalletTransactionParams) => Promise<string>
}

export type SendBiconomyWalletTransactionParams = {
    execTransactionBody: BuildExecTransaction
    walletAddress: string
    signature: string
    webHookAttributes?: WebHookAttributesType
}

export type WebHookAttributesType = {
    webHookId: string
    webHookData: {
        signedNonce: {
            v: number
            r: string
            s: string
            transactionHash: string
        }
		nonce: string
		to: string
		chain_id: string
    }
}

export type CheckIfWalletExistsParams = {
    eoa: string
}

export type CheckIfWalletExistsAndDeployParams = {
    eoa: string
    webHookAttributes: WebHookAttributesType
}

export type CheckIfWalletExistsType = {
    doesWalletExist: boolean
    walletAddress: string
}

export type CheckIfWalletExistsAndDeployType = {
    walletAddress: string
    txHash: string
}

export type BuildExecTransactionParams = {
    data?: string
    to: string
    walletAddress: string
}

export type BuildExecTransaction = {
    to: string
    value: number
    data: string
    operation: number
    targetTxGas: number
    baseGas: number
    gasPrice: number
    gasToken: string
    refundReceiver: string
    nonce: number
}

export type SendBiconomyWalletTransaction = string;