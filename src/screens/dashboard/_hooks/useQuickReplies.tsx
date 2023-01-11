import { useContext } from 'react'
import { Call, CheckDouble, Close, Resubmit } from 'src/generated/icons'
import { GrantsProgramContext } from 'src/pages/_app'
import { ProposalType, TagType } from 'src/screens/dashboard/_utils/types'

interface Props {
	proposals: ProposalType[]
}

function useProposalTags({ proposals }: Props) {
	const allTags: {[key: string]: TagType[]} = {
		admin: [
			{ id: 'accept', title: 'Accept', icon: <CheckDouble color='accent.jeans' />, isPrivate: false },
			{ id: 'reject', title: 'Pass / Reject', icon: <Close color='accent.carrot' />, isPrivate: false },
			{ id: 'resubmit', title: 'Resubmit', icon: <Resubmit color='accent.royal' />, isPrivate: false },
			{ id: 'interview', title: 'Interview', icon: <Call color='accent.azure' />, isPrivate: true }
		],
		reviewer: [],
		builder: [],
		community: []
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