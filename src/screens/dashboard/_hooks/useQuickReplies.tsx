import { useContext } from 'react'
import { Chat, CheckDouble, Close, Resubmit } from 'src/generated/icons'
import { GrantsProgramContext } from 'src/pages/_app'
import { ProposalType, TagType } from 'src/screens/dashboard/_utils/types'

interface Props {
	proposals: ProposalType[]
}

function useProposalTags({ proposals }: Props) {
	const allTags: {[key: string]: TagType[]} = {
		admin: [
			{ id: 'accept', title: 'Accept', commentString: 'Your proposal is accepted', icon: <CheckDouble color='accent.jeans' />, isPrivate: false },
			{ id: 'reject', title: 'Pass / Reject', commentString: 'Sorry! we won\'t be able to proceed with your proposal', icon: <Close color='accent.carrot' />, isPrivate: false },
			{ id: 'resubmit', title: 'Resubmit', commentString: 'Please resubmit your proposal', icon: <Resubmit color='accent.royal' />, isPrivate: false },
			{ id: 'feedback', title: 'Feedback / Comment', commentString: '', icon: <Chat color='accent.vivid' />, isPrivate: false }
		],
		reviewer: [
			{ id: 'feedback', title: 'Feedback / Comment', commentString: '', icon: <Chat color='accent.vivid' />, isPrivate: false }
		],
		builder: [
			{ id: 'feedback', title: 'Feedback / Comment', commentString: '', icon: <Chat color='accent.vivid' />, isPrivate: false }
		],
		community: [
			{ id: 'feedback', title: 'Feedback / Comment', commentString: '', icon: <Chat color='accent.vivid' />, isPrivate: false }
		]
	}

	const { role } = useContext(GrantsProgramContext)!

	if(role === 'admin') {
		if(proposals.every(p => p.state === 'submitted')) {
			return { proposalTags: allTags['admin'] }
		} else {
			return { proposalTags: allTags['admin'].slice(3) }
		}
	} else {
		return { proposalTags: allTags[role] }
	}
}

export default useProposalTags