import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { GroupBase, OptionProps } from 'chakra-react-select'
import DropdownSelect from 'src/v2/components/DropdownSelect'
import { useTranslation } from 'react-i18next'

type Role = {
	id: number
	label: string
	detail: string
}

type RoleSelectProps = {
	selectedRole: Role['id'] | undefined
	setSelectedRole: (role: Role['id'] | undefined) => void
}

const RoleSelect = ({ selectedRole, setSelectedRole }: RoleSelectProps) => {
	const { t } = useTranslation()
	return (
		<DropdownSelect
			options={ROLES}
			placeholder='Select the role'
			makeOption={Option}
			selected={ROLES.find(role => role.id === selectedRole)}
			setSelected={
				(role) => {
					setSelectedRole(role?.id)
				}
			}
		/>
	)
}

const Option = ({ innerProps, data }: OptionProps<Role, boolean, GroupBase<Role>>) => (
	<Box
		{...innerProps}
		alignItems='center'
		p={0}
		m={0}
	>
		<Button
			m='1'
			ml='0'
			w='100%'
			variant='ghost'
			justifyContent='flex-start'
			borderRadius='0'
		>
			<VStack
				spacing='0'
				align='start'>
				<Text fontWeight='bold'>
					{data.label}
				</Text>
				<Text
					color='v2Grey'
					fontSize='0.8rem'
					fontWeight='thin'>
					{data.detail}
				</Text>
			</VStack>
		</Button>
	</Box>
)

const ROLES: Role[] = [
	{
		id: 0x0,
		label: 'Admin',
		detail: 'Has complete access, can send funds, and add/remove members.',
	},
	{
		id: 0x1,
		label: 'Reviewer',
		detail: 'Can only access proposals to review them'
	}
]

export default RoleSelect
