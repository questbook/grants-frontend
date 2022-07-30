
export const unixTimestampSeconds = (date = new Date()) => (
	Math.floor(date.getTime() / 1000)
)

export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export const UNIX_TIMESTAMP_MAX = unixTimestampSeconds(new Date(2038, 0, 1))