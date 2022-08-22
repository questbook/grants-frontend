
import {
	createInstructionData,
	getAllTokenOwnerRecords,
	getGovernance,
	getGovernanceAccounts,
	getNativeTreasuryAddress,
	getRealm,
	Governance,
	pubkeyFilter,
	VoteType,
	withCreateProposal,
	withInsertTransaction,
	withSignOffProposal } from '@solana/spl-governance'
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { Safe, TransactionType } from '../../types/safe'

export class Realms_Solana implements Safe {
    id: PublicKey;
    name: string;
    description: string;
    image: string;
    chainId: number;

    connection: Connection
    programId: PublicKey
    constructor() {
    	this.id = new PublicKey('HWuCwhwayTaNcRtt72edn2uEMuKCuWMwmDFcJLbah3KC') // realmPK
    	this.name = 'Realms on Solana'
    	this.description = 'Realms on Solana'
    	this.image = ''
    	this.chainId = 9000001

    	this.connection = new Connection('https://mango.devnet.rpcpool.com', 'recent')
    	this.programId = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw')
    }


    async proposeTransactions(transactions: TransactionType[], wallet: any) {

    	const governance = await getGovernance(this.connection, new PublicKey('9PDa3cRWPiA6uCDN5rC92XygoV8WeKuvsM2YuoETCQkb'))
    	const realmData = await getRealm(this.connection, this.id)
    	const payer = wallet.publicKey

    	const tokenOwnerRecord = await getAllTokenOwnerRecords(
    		this.connection,
    		realmData.owner,
    		realmData.pubkey
    	)

    	const proposalInstructions: TransactionInstruction[] = []

    	const proposalAddress = await withCreateProposal(
    		proposalInstructions,
    		this.programId,
    		2,
    		this.id,
    		governance.pubkey,
    		tokenOwnerRecord[0].pubkey,
    		`QB - NEW give me 0.3 sol payouts ${new Date().toTimeString()}`,
    		'give me money',
    		tokenOwnerRecord[0].account.governingTokenMint,
            payer!,
            governance.account.proposalCount,
            VoteType.SINGLE_CHOICE,
            ['Approve'],
            true,
            payer!
    	)

    	console.log('create New proposal - proposal Address', proposalAddress)

    	const nativeTreasury = await getNativeTreasuryAddress(this.programId, governance.pubkey)

    	console.log('create New proposal - nativeTreasury', nativeTreasury.toString())

    	const ins1 = SystemProgram.transfer({
    		fromPubkey: nativeTreasury,
    		toPubkey: payer!,
    		lamports: 0.3 * 1000000000,
    		programId: this.programId,
    	})


    	const ins2 = SystemProgram.transfer({
    		fromPubkey: nativeTreasury,
    		toPubkey: new PublicKey('5JhJkGb7ZhSV1SeXyVstmC1miHDurL3fgsBWZ9Vveetv'),
    		lamports: 0.4 * 1000000000,
    		programId: this.programId,
    	})

    	console.log('create New proposal - proposalInstructions', proposalInstructions)
    	console.log('create New proposal - ins1', ins1)
    	console.log('create New proposal - ins2', ins1)

    	const instructionData1 = createInstructionData(ins1)
    	const instructionData2 = createInstructionData(ins2)

    	await withInsertTransaction(
    		proposalInstructions,
    		this.programId,
    		2,
    		governance.pubkey,
    		proposalAddress,
    		tokenOwnerRecord[0].pubkey,
            payer!,
            0,
            0,
            0,
            [instructionData1],
            payer!
    	)

    	await withInsertTransaction(
    		proposalInstructions,
    		this.programId,
    		2,
    		governance.pubkey,
    		proposalAddress,
    		tokenOwnerRecord[0].pubkey,
            payer!,
            1,
            0,
            0,
            [instructionData2],
            payer!
    	)

    	console.log('create New proposal - after withInsertTransaction', proposalInstructions)

    	withSignOffProposal(
    		proposalInstructions,
    		this.programId,
    		2,
    		this.id,
    		governance.pubkey,
    		proposalAddress,
            payer!,
            undefined,
            tokenOwnerRecord[0].pubkey
    	)

    	const getProvider = (): any => {
    		if('solana' in window) {
    			// @ts-ignore
    			const provider = window.solana as any
    			if(provider.isPhantom) {
    				return provider as any
    			}
    		}
    	}

    	console.log('create New proposal - getProvider', getProvider())

    	const block = await this.connection.getLatestBlockhash('confirmed')
    	const transaction = new Transaction()
    	transaction.recentBlockhash = block.blockhash
    	transaction.feePayer = payer!
    	transaction.add(...proposalInstructions)
    	const sendTrxn = await getProvider().signAndSendTransaction(transaction)
    	console.log('create realms proposal - sendTrxn', sendTrxn)

    	return proposalAddress
    }

    isValidSafeAddress(realmsPublicKey: string): any {
    	//safe address => realms public key
    	return false
    }

    async isOwner(address: String): any {
    	const walletPublicKey = new PublicKey(address)
    	const realmData = await getRealm(this.connection, this.id)
    	console.log('realms_solana - realmData', realmData)

    	const COUNCIL_MINT = realmData.account.config.councilMint

    	const governanceInfo = await getGovernanceAccounts(this.connection, this.programId, Governance, [pubkeyFilter(33, COUNCIL_MINT)!])
    	console.log('realms_solana - governanceInfo', governanceInfo[0])

    	const tokenownerrecord = await getAllTokenOwnerRecords(this.connection, this.programId, this.id)

    	let isOwner = false
    	for(let i = 0; i < tokenownerrecord.length; i++) {
    		if(tokenownerrecord[i].account.governingTokenOwner.toString() === address) {
    			isOwner = true
    			break
    		}
    	}

    	return isOwner
    }

    getSafeDetails(realmsPublicKey: String) : any {

    }

    getTransactionHashStatus(proposalPublicKeys: String[]):any {

    }
}