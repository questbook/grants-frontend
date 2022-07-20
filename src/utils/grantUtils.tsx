import { BigNumber } from 'ethers'
import { formatAmount } from './formattingUtils'

const CUTOFF = 4 // We will consider values which are only greater than 4 places of decimal
function isValid(funding: string, decimals?: number) {
	if(decimals) {
		return funding.length > decimals - CUTOFF + 1
	}

	return false
}

function verify(funding: string, decimals?: number): [boolean, string] {
	return [
		isValid(funding, decimals) && BigNumber.from(funding).gt(0),
		formatAmount(funding, decimals || 18),
	]
}

export default verify
