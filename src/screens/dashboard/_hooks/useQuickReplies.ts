import { useMemo } from 'react'

function useQuickReplies() {
	const quickReplies = useMemo(() => {
		return {
			admin: [
				{ title: 'We’ll like to fund you.', icon: '/v2/icons/discussion/fund.svg', letEdit: false, onClick: () => {} },
				{ title: 'We’ll pass on your proposal this time.', icon: '/v2/icons/discussion/reject.svg', letEdit: false, onClick: () => {} },
				{ title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', letEdit: true, onClick: () => {} },
				{ title: 'I have a question about...', icon: '/v2/icons/discussion/question.svg', letEdit: true, onClick: () => {} }
			],
			reviewer: [],
			builder: [
				{ title: 'Here’s a milestone update', icon: '/v2/icons/discussion/milestone.svg', letEdit: true, onClick: () => {} },
				{ title: 'Let’s setup a call to discuss.', icon: '/v2/icons/discussion/call.svg', letEdit: true, onClick: () => {} },
				{ title: 'I have a question about...', icon: '/v2/icons/discussion/question.svg', letEdit: true, onClick: () => {} },
			],
			community: []
		}
	}, [])

	return { quickReplies }
}

export default useQuickReplies