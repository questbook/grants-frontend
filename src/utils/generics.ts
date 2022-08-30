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

export const sumArray = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

export const UNIX_TIMESTAMP_MAX = unixTimestampSeconds(new Date(2038, 0, 1))
export const UNIX_TIMESTAMP_MIN = unixTimestampSeconds(new Date(1970, 0, 1))