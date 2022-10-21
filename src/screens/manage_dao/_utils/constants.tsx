import { WorkspaceMemberAccessLevel } from 'src/generated/graphql'

export const USER_TYPES = [
	{
		name: 'All',
		accessLevels: Object.values(WorkspaceMemberAccessLevel),
	},
	{
		name: 'Administrators',
		accessLevels: [WorkspaceMemberAccessLevel['Owner'], WorkspaceMemberAccessLevel['Admin']],
	},
	{
		name: 'Reviewers',
		accessLevels: [WorkspaceMemberAccessLevel['Reviewer']],
	},
]

export const TABLE_HEADERS = ['Members', 'Role', 'Joined on', 'Can access encrypted data', '']

export const MAX_IMAGE_SIZE_MB = 2
