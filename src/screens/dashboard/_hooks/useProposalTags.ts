import { useContext, useMemo } from 'react'
import logger from 'src/libraries/logger'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import useGetComments from 'src/screens/dashboard/_hooks/useGetComments'
import { ProposalType } from 'src/screens/dashboard/_utils/types'

interface Props {
    proposal: ProposalType
}

function useProposalTags({ proposal }: Props) {
	const { role } = useContext(ApiClientsContext)!
	const { scwAddress } = useContext(WebwalletContext)!

	const { comments } = useGetComments({ selectedProposal: proposal })

	const cutoffTimestamp = 1 * 24 * 60 * 60

	const tag = useMemo(() => {
		const now = Math.floor(Date.now() / 1000)
		logger.info({ now, createdAtS: proposal.createdAtS, updatedAtS: proposal }, 'useProposalTags')
		if(!proposal || now - proposal.updatedAtS > cutoffTimestamp || !scwAddress) {
			return { title: '', color: '' }
		}

		logger.info({ now, createdAtS: proposal.createdAtS, updatedAtS: proposal.updatedAtS }, 'useProposalTags')

		if(role === 'reviewer') {
			if(proposal.pendingReviewerAddresses.includes(scwAddress.toLocaleLowerCase())) {
				return { title: 'To be reviewed', color: 'accent.crayola' }
			} else {
				return { title: 'Reviewed', color: 'accent.vodka' }
			}
		} else if(role === 'admin') {
			if(now - proposal.createdAtS <= cutoffTimestamp) {
				return { title: 'Recent submission', color: 'accent.crayola' }
			}

			const recentComments = comments.filter(c => now - (c.timestamp || 0) <= cutoffTimestamp && c.sender?.toLowerCase() !== scwAddress.toLowerCase())
			if(recentComments.length > 0) {
				const milestoneUpdateComments = recentComments.filter(c => c.tags?.indexOf('milestone-update') !== -1)
				if(milestoneUpdateComments.length > 0) {
					return { title: 'New milestone update', color: 'accent.melon' }
				} else {
					return { title: 'New comment', color: 'accent.june' }
				}
			}
		} else if(role === 'builder') {
			const recentComments = comments.filter(c => now - (c.timestamp || 0) <= cutoffTimestamp && c.sender?.toLowerCase() !== scwAddress.toLowerCase())
			if(recentComments.length > 0) {
				return { title:'Respond to new comments', color:'accent.crayola' }
			}
		}
	}, [proposal, scwAddress, role])

	return { tag }
}

export default useProposalTags