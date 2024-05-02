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
			{ id: 'feedback', title: 'Feedback / Comment', commentString: '', icon: <Chat color='accent.vivid' />, isPrivate: false },
			{ id: 'review', title: 'Review', commentString: 'Your proposal is under review', icon: <Chat color='accent.vivid' />, isPrivate: false },
			{ id: 'KYC', title: 'Send KYC Link', commentString: 'Please complete your KYC', icon: <Chat color='accent.vivid' />, isPrivate: true },
			{ id: 'KYB', title: 'Send KYB Link', commentString: 'Please complete your KYB', icon: <Chat color='accent.vivid' />, isPrivate: true },
			{ id: 'HelloSign', title: 'Send Document', commentString: 'Please sign the document', icon: <Chat color='accent.vivid' />, isPrivate: true },
			{ id: 'cancelled', title: 'Cancelled / Withdrawn', commentString: 'Sorry! Your proposal is Cancelled/Withdrawn', icon: <Close color='accent.carrot' />, isPrivate: false }
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

	const { role, grant } = useContext(GrantsProgramContext)!

	if(role === 'admin') {
		if(proposals.every(p => p.state === 'submitted')) {
			// remove last 2 tags
			return { proposalTags: allTags['admin']?.slice(0, 5) }
		} else if(proposals.every(p => p.state === 'resubmit')) {
			return { proposalTags: allTags['admin'].slice(0, 2).concat(allTags['admin'].slice(3)) }
		} else if(proposals.every(p => p.state === 'review')) {
			return { proposalTags: allTags['admin'].slice(0, 4) }
		} else if(proposals.every(p => p.state === 'approved') && (grant?.workspace?.synapsKYC && grant?.workspace?.synapsId && proposals?.every(p => p.synapsId === null))) {
			return { proposalTags: allTags['admin'].slice(5, 7).concat(allTags['admin'].slice(3, 4)).concat(allTags['admin'].slice(8, 9)) }
		} else if(proposals.every(p => p.state === 'approved' && p.synapsId !== null) && (grant?.workspace?.docuSign && proposals?.every(p => p.helloSignId === null))) {
			return { proposalTags: allTags['admin'].slice(7, 9).concat(allTags['admin'].slice(3, 4)) }
		} else if(proposals.every(p => p.state === 'approved')) {
			return { proposalTags: allTags['admin'].slice(8, 9).concat(allTags['admin'].slice(3, 4)) }
		} else {
			return { proposalTags: allTags['admin'].slice(3, 4) }
		}
	} else {
		return { proposalTags: allTags[role] }
	}

}

export default useProposalTags