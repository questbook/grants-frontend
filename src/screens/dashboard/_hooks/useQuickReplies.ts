import { useMemo } from 'react'

function useQuickReplies() {
	const quickReplies = useMemo(() => {
		return {
			admin: [
				{ id: 'fund-builder', title: 'We’ll like to fund you.', icon: '/v2/icons/discussion/fund.svg', letEdit: false },
				{ id: 'reject-proposal', title: 'We’ll pass on your proposal this time.', icon: '/v2/icons/discussion/reject.svg', letEdit: false },
				{ id: 'setup-call', title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', letEdit: true },
				{ id: 'more-info', title: 'I have a question about...', icon: '/v2/icons/discussion/question.svg', letEdit: true }
			],
			reviewer: [
				{ id: 'setup-call', title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', letEdit: true },
				{ id: 'more-info', title: 'I have a question about...', icon: '/v2/icons/discussion/question.svg', letEdit: true },
			],
			builder: [
				{ id: 'milestone-update', title: 'Here’s a milestone update', icon: '/v2/icons/discussion/milestone.svg', letEdit: true },
				{ id: 'setup-call', title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', letEdit: true },
				{ id: 'more-info', title: 'I have a question about...', icon: '/v2/icons/discussion/question.svg', letEdit: true },
			],
			community: []
		}
	}, [])

	return { quickReplies }
}

export default useQuickReplies