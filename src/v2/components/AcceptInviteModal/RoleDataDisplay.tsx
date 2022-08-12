import { HStack, Image, Text, VStack } from '@chakra-ui/react'
import { ROLES } from 'src/constants'

const RoleDataDisplay = ({ role }: { role: number }) => {
	const roleData = ROLE_DATA[role]

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
		title: 'Administrator',
		thingsCanDo: [
			{
				icon: 'role_icons/admin0.svg',
				label: 'Pick your adventure - run grant and bounty programs.'
			},
			{
				icon: 'role_icons/admin1.svg',
				label: 'Review applications'
			},
			{
				icon: 'role_icons/admin2.svg',
				label: 'Disburse funds'
			},
			{
				icon: 'role_icons/admin3.svg',
				label: 'Invite members to your domain'
			}
		]
	},
	[ROLES.reviewer]: {
		vowelStart: false,
		title: 'Reviewer',
		thingsCanDo: [
			{
				icon: 'role_icons/reviewer0.svg',
				label: 'Pick your adventure - review grant applications.'
			},
			{
				icon: 'role_icons/reviewer1.svg',
				label: 'Get paid for it.'
			}
		]
	}
}

export default RoleDataDisplay