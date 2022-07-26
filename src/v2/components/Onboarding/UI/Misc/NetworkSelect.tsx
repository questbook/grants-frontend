import { Box, Button, Text } from '@chakra-ui/react'
import DropdownSelect from 'src/v2/components/DropdownSelect'
import { NetworkSelectOption, supportedNetworks } from '../../SupportedNetworksData'

const Option = ({ innerProps, data }: any) => (
	<Box
		{...innerProps}
		alignItems={'center'}
		p={0}
		m={0}
	>
		<Button
			w={'100%'}
			variant={'ghost'}
			py={1}
			px={4}
			justifyContent={'flex-start'}
			borderRadius={0}
			h={8}
		>
			{data.icon}
			<Text
				ml={2}
				fontWeight={'400'}
			>
				{data.label}
			</Text>
		</Button>
	</Box>
)

const NetworkSelect = ({
	value,
	onChange,
	placeholder,
}: {
  value: NetworkSelectOption | undefined;
  onChange: (value: NetworkSelectOption | undefined) => void;
  placeholder: string;
}) => (
	<DropdownSelect
		options={supportedNetworks}
		makeOption={Option}
		placeholder={placeholder}
		selected={value}
		setSelected={onChange} />
)

export default NetworkSelect