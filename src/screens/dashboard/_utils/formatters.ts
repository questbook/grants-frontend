import moment from 'moment'

const formatTime = (timestamp: number, isPayout: boolean = false) => {
	const now = Date.now()
	if(now - timestamp <= 24 * 60 * 60) {
		// Within a day
		return `${Math.floor((now - timestamp) / 24)}h`
	} else if(now - timestamp <= 7 * 24 * 60 * 60) {
		// Within a week
		return `${Math.floor((now - timestamp) / 7)}d`
	} else {
		return isPayout ? moment.unix(timestamp).format('DD MMM, YYYY') : moment.unix(timestamp).format('DD MMM')
	}
}

const formatAmount = (amount: number, symbol?: string): string => {
	const defaultSymbol = 'USD'
	if(!symbol) {
		symbol = defaultSymbol
	}

	if(amount >= 1e6) {
		return symbol === 'USD' ? `$${(amount / 1e6).toFixed(1)}M` : `${(amount / 1e6).toFixed(1)}M ${symbol}`
	} else if(amount >= 1e3) {
		return symbol === 'USD' ? `$${(amount / 1e3).toFixed(0)}K` : `${(amount / 1e3).toFixed(0)}K ${symbol}`
	} else {
		return symbol === 'USD' ? `$${amount}` : `${amount} ${symbol}`
	}
}


export { formatTime, formatAmount }