export const unixTimestampSeconds = (date = new Date()) => (
	Math.floor(date.getTime() / 1000)
)

export const capitalizeFirstLetter = (data: string) => {
	return data.charAt(0).toUpperCase() + data.slice(1)
}

export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

/**
 * checks if the given string is base58 encoded; which are solana addrs
 * @param str the string to test
 */
export const isPlausibleSolanaAddress = (str: string | undefined) => (
	!!str && /^[1-9A-HJ-NP-Za-km-z]+$/.test(str)
)

export function getAvatar(initials: boolean, address: string | null | undefined) {
	let url = ''
	if(!address) {
		url = '/ui_icons/default_profile_picture.png'
	} else if(initials) {
		address = address.toLowerCase()
		// violet 2, teal 2, orange 2, crimson 2, pink 2
		const colors = ['785EF0', '10AEBA', 'FF7545', 'FF4C4D', 'E281BF']
		const colorId = address ? address.charCodeAt(0) % 5 : Math.floor(Math.random() * 5)
		const color = colors[colorId]
		url = `https://avatars.dicebear.com/api/initials/${address}.svg?fontSize=32&backgroundColor=%23${color}`
	} else {
		address = address.toLowerCase()
		url = `https://avatars.dicebear.com/api/identicon/${address}.svg`
	}

	return url
}

export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

export const UNIX_TIMESTAMP_MAX = unixTimestampSeconds(new Date(2038, 0, 1))
export const UNIX_TIMESTAMP_MIN = unixTimestampSeconds(new Date(1970, 0, 1))