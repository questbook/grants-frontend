import { Box, Button, Text } from '@chakra-ui/react'
import { OptionBase } from 'chakra-react-select'
import DropdownSelect from 'src/v2/payouts/SendFundsModal/DropdownSelect'


export interface MilestoneSelectOption extends OptionBase {
	id: string
  label: string
  title: string
}

const Option = ({ innerProps, data }: any) => (
	<Box
		{...innerProps}
		alignItems='center'
		p={0}
		m={0}
	>
		<Button
			w='100%'
			variant='ghost'
			py='10px'
			px={4}
			alignItems='flex-start'
			borderRadius={0}
			display='flex'
			flexDirection='column'
			textAlign='left'
			h='auto'
		>
			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
			>
				{data.title}
			</Text>

			<Text
				fontSize='12px'
				lineHeight='16px'
				fontWeight='400'
				color='#7D7DA0'
				mt='2px'
			>
				{data.label}
			</Text>
		</Button>
	</Box>
)

const MilestoneSelect = ({
	milestoneList,
	value,
	onChange,
	placeholder,
}: {
	milestoneList: any[]
  value: MilestoneSelectOption | undefined
  onChange: (value: MilestoneSelectOption | undefined) => void
  placeholder: string
}) => (
	<DropdownSelect
		options={
			milestoneList.map((milestone,) => ({
				id: milestone.id,
				title: milestone.title,
				label: ''
			}))
		}
		makeOption={Option}
		placeholder={placeholder}
		selected={milestoneList.find((milestone) => milestone.id === value) ?? undefined}
		setSelected={onChange} />
)

export default MilestoneSelect