import { useContext } from 'react'
import { Call, CheckDouble, Close, Resubmit } from 'src/generated/icons'
import { ApiClientsContext } from 'src/pages/_app'
import { TagType } from 'src/screens/dashboard/_utils/types'

function useProposalTags() {
	const allTags: {[key: string]: TagType[]} = {
		admin: [
			{ id: 'accept', title: 'Accept', icon: <CheckDouble color='accent.jeans' />, isPrivate: false },
			{ id: 'reject', title: 'Pass / Reject', icon: <Close color='accent.carrot' />, isPrivate: false },
			{ id: 'resubmit', title: 'Resubmit', icon: <Resubmit color='accent.royal' />, isPrivate: false },
			{ id: 'interview', title: 'Interview', icon: <Call color='accent.azure' />, isPrivate: false }
		],
		reviewer: [],
		builder: [],
		community: []
	}

	const { role } = useContext(ApiClientsContext)!

	return { proposalTags: allTags[role] }
}

export default useProposalTags