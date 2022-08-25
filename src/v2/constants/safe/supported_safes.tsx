import { Safe } from '../../types/safe'
import safeServicesInfo from '../safeServicesInfo.json'
import { Gnosis_Safe } from './gnosis_safe'
import { Realms_Solana } from './realms_solana'

const safeChainIds = Object.keys(safeServicesInfo)

export class SupportedSafes {
    safes: Safe[];
    constructor() {
    	this.safes = []
    	this.safes.push(new Realms_Solana(''))
    	for(let i = 0; i < safeChainIds.length; i++) {
    		const newGnosisSafe = new Gnosis_Safe(parseInt(safeChainIds[i]), safeServicesInfo[safeChainIds[i]])
    		this.safes.push(newGnosisSafe)
    	}

    	console.log('Safes initialized', this.safes)
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