import { useTranslation } from 'react-i18next'
import { getFormattedDate } from 'src/utils/formattingUtils'

export type DeadlineProps = {
	date: Date | undefined
}

export default ({ date }: DeadlineProps) => {
	const { t } = useTranslation()
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
			{(isExpired ? t('/explore_grants/about_grant.was_accepting_proposals_till') : t('/explore_grants/about_grant.accepting_proposals_till')) + ' ' + getFormattedDate(date.getTime())}
		</>
	)
}