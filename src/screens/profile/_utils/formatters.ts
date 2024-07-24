export const timeAgo = (timestamp: string): String => {
	const now = new Date().getTime()
	const then = new Date(timestamp).getTime()
	const diffInMs = now - then

	const seconds = diffInMs / 1000
	const minutes = seconds / 60
	const hours = minutes / 60
	const days = hours / 24
	const weeks = days / 7
	const months = days / 30

	if(days < 1) {
		return `${Math.floor(hours)} hour(s) ago`
	} else if(days < 7) {
		return `${Math.floor(days)} day(s) ago`
	} else if(days < 30) {
		return `${Math.floor(weeks)} week(s) ago`
	} else {
		return `${Math.floor(months)} month(s) ago`
	}
}