const DEFAULT_VISIBLE_LENGTH_LEFT = 21
const DEFAULT_VISIBLE_LENGTH_RIGHT = 10

function formatLink(link: string, visibleLengthLeft: number = DEFAULT_VISIBLE_LENGTH_LEFT, visibleLengthRight: number = DEFAULT_VISIBLE_LENGTH_RIGHT) {
	return `${link.substring(0, visibleLengthLeft)}....${link.substring(link.length - visibleLengthRight)}`
}

export { formatLink }