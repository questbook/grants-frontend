import { getFormattedDate } from 'src/utils/formattingUtils'

export type DeadlineProps = {
	date: Date | undefined
}

export default ({ date }: DeadlineProps) => {
	if(!date) {
		return (
			<>
				Loading...
			</>
		)
	}

	const isExpired = date.getTime() < Date.now()
	return (
		<>
			{(isExpired ? 'Ended on' : 'Ends on') + ' ' + getFormattedDate(date.getTime())}
		</>
	)
}