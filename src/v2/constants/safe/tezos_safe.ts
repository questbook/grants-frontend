/* eslint-disable */
import { TzSign } from '@tezos/qb-tzsign/src/multisig'
import { TzSignAPI } from '@tezos/qb-tzsign/src/tzSignAPI'
import { initWallet } from '@tezos/qb-tzsign/src/wallet'
import axios from 'axios'
import { MetaTransaction, Safe as _TezosSafe, SafeDetails, TransactionType } from 'src/v2/types/safe'

export class TezosSafe implements _TezosSafe {
    id: string
    name: string
    description: string
    image: string
    chainId: number
    tzSign: TzSign

    constructor(safeAddress: string, wallet: any) {
        this.id = safeAddress
        this.name = 'Tezos Safe'
        this.description = 'Tezos Safe'
        this.image = ''
        this.chainId = 9000002


        // const wallet = await initWallet();
        const api = new TzSignAPI();
        this.tzSign = new TzSign(wallet, api, wallet.contract.at(safeAddress))
    }
    proposeTransactions(grantName: string, transactions: TransactionType[], wallet: any): Promise<string> {
        throw new Error('Method not implemented.')
    }
    createMultiTransaction(transactions: MetaTransaction[], safeAddress: string): void {
        throw new Error('Method not implemented.')
    }
    isValidRecipientAddress(address: String): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
    getSafeDetails(address: String): Promise<SafeDetails> {
        throw new Error('Method not implemented.')
    }

    getNextSteps(): string[] {
        return ['Open the transaction on Gnosis Safe', 'Sign the transaction created under the Queue section', 'Ask the other multi-sig signers to sign this transaction too']
    }
    initialiseAllProposals(): void {
        throw new Error('Method not implemented.')
    }

    // done
    async proposeXTZTransactions(amount: number, recipientAddress: string): Promise<string> {
        const tx = await this.tzSign.createXTZTransaction(amount, recipientAddress);

        // Sign the transaction
        const signedTx = await this.tzSign.signTx("approve");

        // Send the final transaction
        const finalTx = await this.tzSign.sendTx("approve");

        return tx
    }

    // done
    async isValidSafeAddress(address: string) {
        return this.tzSign.isValidSafeAddress(address)
    }

    // done
    async isOwner(safeAddress: string): Promise<boolean> {
        return this.tzSign.isOwner(safeAddress)
    }


    async getTransactionHashStatus(safeTxHash: string): Promise<any> {
        const txInfo = this.tzSign.getTransactionHashStatus(safeTxHash)
        return txInfo
    }
}
