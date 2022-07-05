import { MinimalWorkspace } from 'src/types'

function getRole(workspace: MinimalWorkspace, address: string) {
	const member = workspace.members.find(
		(m) => m.actorId.toLowerCase() === address?.toLowerCase()
	)

	switch (member?.accessLevel) {
	case 'admin':
	case 'owner':
		return 'Administrator'
	case 'reviewer':
		return 'Reviewer'

	default:
		return ''
	}
}

export default getRole