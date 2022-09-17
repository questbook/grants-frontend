import { HStack, Image, Text, VStack } from '@chakra-ui/react'
import { ROLES } from 'src/constants'
import { useTranslation } from 'react-i18next'

const RoleDataDisplay = ({ role }: { role: number }) => {
	const roleData = ROLE_DATA[role]
	const { t } = useTranslation()
	return (
		<VStack
			align='start'
			spacing='3'>
			<Text
				fontSize='sm'>
				As
				{' '}
				{roleData?.vowelStart ? 'an' : 'a'}
				{' '}
				{roleData.title}
				, here’s what you can do:
				<br />
			</Text>

			<VStack
				align='start'
				spacing='2'>
				{
					roleData.thingsCanDo.map(
						({ icon, label }) => {
							return (
								<HStack key={label}>
									<Image
										src={icon}
										w='8'
										h='8' />
									<Text fontSize='0.75rem'>
										{label}
									</Text>
								</HStack>
							)
						}
					)
				}
			</VStack>
		</VStack>
	)
}

export const getRoleTitle = (role: number) => ROLE_DATA[role]?.title

const ROLE_DATA = {
	[ROLES.admin]: {
		vowelStart: true,
		title: 'Admin',
		thingsCanDo: [
			{
				icon: 'role_icons/admin0.svg',
				label: 'Create new grants'
			},
			{
				icon: 'role_icons/admin2.svg',
				label: 'Send money'
			},
			{
				icon: 'role_icons/admin3.svg',
				label: 'Invite members to the team'
			}
		]
	},
	[ROLES.reviewer]: {
		vowelStart: false,
		title: 'Reviewer',
		thingsCanDo: [
			{
				icon: 'role_icons/reviewer0.svg',
				label: 'Review proposal\'s impact on ecosystem growth' 
			},
			{
				icon: 'role_icons/reviewer1.svg',
				label: 'Recommend whether or not to give grant to the proposal'
			}
		]
	}
}

export default RoleDataDisplay