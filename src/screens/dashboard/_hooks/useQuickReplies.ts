import { useContext } from 'react'
import { ApiClientsContext } from 'src/pages/_app'

function useProposalTags() {
	const allTags = (
		{
			admin: [
				// { id: 'fund-builder', title: 'We’ll like to fund you.', icon: '/v2/icons/discussion/fund.svg', letEdit: false },
				// { id: 'reject-proposal', title: 'We’ll pass on your proposal this time.', icon: '/v2/icons/discussion/reject.svg', letEdit: false },
				{ id: 'accept', title: 'We accept your proposal.', icon: '/v2/icons/discussion/fund.svg', isPrivate: false },
				{ id: 'reject', title: 'We’ll be rejecting your proposal.', icon: '/v2/icons/discussion/reject.svg', isPrivate: false },
				{ id: 'resubmit', title: 'Can you resubmit your proposal?', icon: '/v2/icons/discussion/call.svg', isPrivate: false },
				// { id: 'setup-call', title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', letEdit: true },
				{ id: 'more-info', title: 'I want to interview...', icon: '/v2/icons/discussion/question.svg', isPrivate: false }
			],
			reviewer: [
				{ id: 'setup-call', title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', isPrivate: true },
				{ id: 'more-info', title: 'I have a question about...', icon: '/v2/icons/discussion/question.svg', isPrivate: false },
			],
			builder: [
				{ id: 'milestone-update', title: 'Here’s a milestone update', icon: '/v2/icons/discussion/milestone.svg', isPrivate: true },
				{ id: 'setup-call', title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', isPrivate: true },
				{ id: 'more-info', title: 'I have a question about...', icon: '/v2/icons/discussion/question.svg', isPrivate: false },
			],
			community: []
		}
	)

	const { role } = useContext(ApiClientsContext)!

	return { proposalTags: allTags[role] }
}

export default useProposalTags