import { Gnosis_Safe } from 'src/v2/constants/safe/gnosis_safe'
import { Realms_Solana } from 'src/v2/constants/safe/realms_solana'
import safeServicesInfo from 'src/v2/constants/safeServicesInfo'
import { Safe } from 'src/v2/types/safe'

const safeChainIds = Object.keys(safeServicesInfo)

export class SupportedSafes {
	safes: Safe[]
	constructor(safeAddress: string) {
    	this.safes = []
    	this.safes.push(new Realms_Solana(''))
    	for(let i = 0; i < safeChainIds.length; i++) {
    		const newGnosisSafe = new Gnosis_Safe(parseInt(safeChainIds[i]), safeServicesInfo[parseInt(safeChainIds[i])], safeAddress)
    		this.safes.push(newGnosisSafe)
    	}

    	// console.log('Safes initialized', this.safes)
	}

	getSafe(id: number | string): Safe | undefined {
    	return this.safes.find(safe => safe.id === id)
	}

	getSafeByChainId(chainId: number): Safe | undefined {
    	return this.safes.find(safe => safe.chainId === chainId)
	}

	getAllSafes(): Safe[] {
    	return this.safes
	}

}