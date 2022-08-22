import { PublicKey } from '@solana/web3.js'

export interface TransactionType {
    to: string,
    amount: string,
    data: string,
    metadata: any
}

export enum TransactionStatus {
    PENDING,
    SUCCESS,
    FAILED,
}

export interface TransactionResult {
    transactionHash: string,
    url: string, // url on the safe to view the transaction
    status: TransactionStatus,
}

export interface TransactionHashStatus {
    to: string,
    from: string,
    amount: string,
    status: TransactionStatus
}

export interface Callback<T> {
    (error: Error, result: T): void;
}

export interface SafeDetails {
    name: string,
    address: string,
    balance: string,
    owners: string[],
}

/**
 * A Safe Provider + Chain uniquely identifies a Safe.
 * e.g. "GnosisSafe on Optimism", "GnosisSafe on Arbitrum", "Realms on Solana", "Cashmere on Solana"...
 */

export interface Safe {
    id: number | PublicKey;
    name: string;
    description: string;
    image: string;
    chainId: number;

    /**
     *
     * @param transactions List of transactions that need to be executed from the safe
     * @param callback Callback function that is called when the transactions are executed/failed
     * Takes a list of parameters and returns a component that can be rendered in the modal on questbook
     * This component must carry out the following functions where relevant :
     *   1. Request the transaction(s) to be signed by an external wallet like metamask or phantom or walletconnect
     *   2. Create the transaction on the safe (gnosis, celosafe, realms etc)
     *   3. Ask the user to approve/execute the transaction safe by providing the UI to go to the safe (e.g. URL that they can click and open gnosis-safe.io/{tx})
     *   4. Wait for the transaction to be mined and return the result to the user
     *   5. Update the transaction on the Questbook smart contract
     *   6. Close the modal using the Callback
     */
    proposeTransactions(transactions : TransactionType[], wallet: any, callback: Callback<TransactionResult>): void;

    /**
     * @param address : Address of the safe
     * This is useful when searching for detecting which network the safe is on (in the onboarding)
     */
    isValidSafeAddress(address: String) : Promise<boolean>;

    /**
     * @param address : Address of the safe
     *
     * This should pop up metamask/walletconnect/phantom etc to allow the user to sign a message and then check if the signer address is owner on the safe
     */
    isOwner(address: String, callback: Callback<any>) : void;

    /**
     * @param address : Address of the safe
     * Fetch the details of the safe from the appropriate api and return the details
     */
    getSafeDetails(address: String) : Promise<SafeDetails>;


    /**
     * @param address : List of transaction hashes
     * Fetch the details of the transaction hashes from the appropriate api and return the status and amount transferred
     */
    getTransactionHashStatus(transactionHashes: String[]) : Promise<TransactionHashStatus>;
}