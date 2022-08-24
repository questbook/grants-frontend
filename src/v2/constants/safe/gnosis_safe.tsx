import { MetaTransaction, Safe as GnosisSafe, TransactionType } from '../../types/safe'
import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { ethers } from 'ethers'

export class Gnosis_Safe implements GnosisSafe {
    id: number;
    name: string;
    description: string;
    image: string;
    chainId: number;
    txnServiceURL: string;

    constructor(chainId: number, txnServiceURL: string) {
        this.id = 1;
        this.name = "Gnosis Safe"
        this.description = "Gnosis Safe"
        this.image = ""
        this.chainId = chainId
        this.txnServiceURL = txnServiceURL
    }

    async createMultiTransaction(transactions: MetaTransaction[], safeAddress: string) {

    // const safeAddress = '0x7723d6CD277F0670fcB84eA8E9Efe14f1b16acBB'
    //@ts-ignore
    console.log("creating gnosis transaction for", transactions)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send('eth_requestAccounts', [])

    const signer = provider.getSigner()
    const ethAdapter = new EthersAdapter({
        ethers,
        signer,
    })

    const safeService = new SafeServiceClient({ txServiceUrl: this.txnServiceURL, ethAdapter })
    const safeFactory = await SafeFactory.create({ ethAdapter })
    const safeSdk = await Safe.create({ ethAdapter, safeAddress })

    try {
        const safeTransaction = await safeSdk.createTransaction(transactions)

        console.log(safeTransaction)

        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
        const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
        console.log(signer.getAddress())
        const txhash = await safeService.proposeTransaction({
            safeAddress,
            safeTransactionData: safeTransaction.data,
            safeTxHash,
            senderAddress: await signer.getAddress(),
            senderSignature: senderSignature.data,
            origin
        })

    } catch (e) {
        console.log(e)
    }


}

async isValidSafeAddress(address: String){
    return false
}
    
}