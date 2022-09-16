import React from 'react'
import HeroTip from 'src/components/signup/create_grant/tips/heroTip'
import TipsList from 'src/components/signup/create_grant/tips/tipsList'

interface Props {
  currentTip: number
}

const TipsContainer = ({ currentTip }: Props) => {
	const tips = [
		<HeroTip key={0} />,
		<TipsList
			tipsHeading='Tips to write a good grant'
			tips={
				[
					'Be as transparent as you can about the decision making.',
					'If you want a specific kind of eligibility criteria, mention it. You would not want the applicants to learn it after submitting application.',
					'Give clear instructions for the applicants on how to reach out to you.',
				]
			}
			key={1}
			icon='/illustrations/grant_proposal.svg'
		/>,
		<TipsList
			tipsHeading='Tips to attract good applicants'
			tips={
				[
					'Applicant name, email, project name & details, funding breakdown are to be mentioned in details for every applicant.',
					'In addition, you can ask applicants for milestones along with the funding ask associated with each milestone. ',
				]
			}
			icon='/illustrations/attract_applicants.svg'
			key={2}
		/>,
		<TipsList
			tipsHeading='Tips for setting the grant reward'
			tips={
				[
					'Grant reward is used by applicants to give them a ball park figure about the grant',
					'All the funds will be on your multi-sig safe, completely in your control'
				]
			}
			icon='/illustrations/grant_reward.svg'
			key={3}
		/>,
	]
	return tips[currentTip]
}

export default TipsContainer