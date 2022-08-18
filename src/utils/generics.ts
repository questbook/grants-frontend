export const unixTimestampSeconds = (date = new Date()) => (
	Math.floor(date.getTime() / 1000)
)

export const capitalizeFirstLetter = (data: string) => {
	return data.charAt(0).toUpperCase() + data.slice(1)
}

export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export const UNIX_TIMESTAMP_MAX = unixTimestampSeconds(new Date(2038, 0, 1))
export const UNIX_TIMESTAMP_MIN = unixTimestampSeconds(new Date(1970, 0, 1))