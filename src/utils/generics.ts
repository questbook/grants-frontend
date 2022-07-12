
export const unixTimestampSeconds = (date = new Date()) => (
	Math.floor(date.getTime() / 1000)
)

export const UNIX_TIMESTAMP_MAX = unixTimestampSeconds(new Date(2038, 0, 1))