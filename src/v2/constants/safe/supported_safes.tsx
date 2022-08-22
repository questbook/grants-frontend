import { Safe } from '../../types/safe'
import { Realms_Solana } from './realms_solana'

export class SupportedSafes {
    safes: Safe[];
    constructor() {
    	this.safes = []
    	this.safes.push(new Realms_Solana())
    }

    getSafe(id: number): Safe | undefined {
    	return this.safes.find(safe => safe.id === id)
    }

    getSafeByChainId(chainId: number): Safe | undefined {
    	return this.safes.find(safe => safe.chainId === chainId)
    }

    getAllSafes(): Safe[] {
    	return this.safes
    }

}