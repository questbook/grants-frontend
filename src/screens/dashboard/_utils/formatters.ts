import moment from 'moment'

const formatTime = (updatedAtS: number) => {
	const now = Date.now()
	if(now - updatedAtS <= 24 * 60 * 60) {
		// Within a day
		return `${Math.floor((now - updatedAtS) / 24)}h`
	} else if(now - updatedAtS <= 7 * 24 * 60 * 60) {
		// Within a week
		return `${Math.floor((now - updatedAtS) / 7)}d`
	} else {
		return moment.unix(updatedAtS).format('DD MMM')
	}
}

export { formatTime }