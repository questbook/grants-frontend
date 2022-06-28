import { Box, Button, Text } from '@chakra-ui/react'
import { GroupBase, Select } from 'chakra-react-select'
import { SelectDropdownArrow } from 'src/v2/assets/custom chakra icons/Arrows/SelectDropdownArrow'
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

const DropdownIndicator = ({ innerProps }: any) => (
	<Box
		{...innerProps}
		px={2}>
		<SelectDropdownArrow
			h={'5px'}
			w={'10px'}
			color={'#7D7DA0'}
			transition={'all 0.2s ease-in'}
		/>
	</Box>
)

const SingleValue = ({ innerProps, data }: any) => (
	<Box
		{...innerProps}
		display={'inline-flex'}
		alignItems={'center'}
		p={0}
		m={0}
	>
		{data.icon}
		<Text
			ml={2}>
			{data.label}
		</Text>
	</Box>
)

const Control = ({ innerProps, isFocused, ...rest }: any) => {
	return (
		<Box
			{...innerProps}
			py={2}
			px={0}
			display={'inline-flex'}
			flex={1}
			w={'100%'}
			transition={'all 0.2s ease-in'}
			borderBottom={isFocused ? '1px solid #2B67F6' : '1px solid #D2D2E3'}
			boxShadow={isFocused ? '0px 1px 0px 0px #2b67f6' : 'none'}
			_hover={
				{
					borderBottom: '1px solid #2B67F6',
					boxShadow: '0px 1px 0px 0px #2b67f6'
				}
			}
			cursor={'pointer'}
		>
			{rest.children}
		</Box>
	)
}

const Placeholder = ({ innerProps }: any) => {
	return (
		<Box
			{...innerProps}
			// h={8}
			display={'inline-flex'}
			alignItems={'center'}
		>
			<Text
				fontWeight={'500'}
				color={'#AFAFCC'}
			>
					Choose the network
			</Text>
		</Box>
	)
}

const NetworkSelect = ({
	value,
	onChange,
	placeholder,
}: {
  value: NetworkSelectOption | undefined;
  onChange: (value: NetworkSelectOption | null) => void;
  placeholder: string;
}) => (
	<Select<NetworkSelectOption, false, GroupBase<NetworkSelectOption>>
		options={supportedNetworks}
		placeholder={placeholder}
		maxMenuHeight={240}
		isSearchable={false}
		blurInputOnSelect
		value={value}
		onChange={onChange}
		components={
			{
				Option,
				DropdownIndicator,
				SingleValue,
				Control,
				Placeholder,
			}
		}
		chakraStyles={
			{
				indicatorSeparator: (provided) => ({
					...provided,
					display: 'none'
				}),
				control: (provided) => ({
					...provided,
					border: 'none',
					boxShadow: 'none',
					cursor: 'pointer',
				}),
				menuList: (provided) => ({
					...provided,
					py: '4px',
					border: 'none'
				}),
				menu: (provided) => ({
					...provided,
					border: 'none',
					boxShadow: '0px 3px 5px rgba(31, 31, 51, 0.2), 0px 0px 1px rgba(31, 31, 51, 0.31)',
					borderRadius: '3px',
				}),
				valueContainer: (provided) => ({
					...provided,
					display: 'flex',
					padding: '0px',
				}),
			}
		}
	/>
)

export default NetworkSelect