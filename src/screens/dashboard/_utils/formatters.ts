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

const formatAmount = (amount: number): string => {
	if(amount >= 1e6) {
		return `$${(amount / 1e6).toFixed(1)}M`
	} else if(amount >= 1e3) {
		return `$${(amount / 1e3).toFixed(0)}K`
	} else {
		return `$${amount}`
	}
}

export { formatTime, formatAmount }