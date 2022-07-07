export async function getFundsInSafe(safeChain, safeAddress, rewardAsset){
    return 0;
    //todo@madhavan 
    if(!rewardAsset.offchain) {
        const safeContract = useContract({
            addressOrName: rewardAsset.address,
            contractInterface: ERC20ABI,
            signerOrProvider: signer,
        })

        const balance = await safeContract.balanceOf(safeAddress)
        return balance
    }
    else {
        // SOLANA: 9000001
        // SOLANA-DEVNET : 9000002
        if(rewardAsset.safeAddress == 9000001) {
            //todo get solana balance from mainnet for rewardToken.address
            // ref: https://www.quicknode.com/guides/web3-sdks/how-to-get-all-tokens-held-by-a-wallet-in-solana
            return 0;
        }
    }
    return 0
}

export async function getTransaction(safeChain: number, safeAddress: number, hash: string) {
    // todo@madhavan : get transaction from hash
    // is origin == safeAddress
}
