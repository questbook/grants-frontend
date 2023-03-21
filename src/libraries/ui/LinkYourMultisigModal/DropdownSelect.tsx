import { ReactNode } from 'react'
import { Box, BoxProps, Flex, Text } from '@chakra-ui/react'
import { ControlProps, GroupBase, PlaceholderProps, Select, SelectComponentsConfig, SingleValueProps } from 'chakra-react-select'
import { Dropdown } from 'src/generated/icons'

type DropdownSelectProps<T extends object> = {
	options: T[]
	placeholder?: ReactNode
	makeOption: SelectComponentsConfig<T, false, GroupBase<T>>['Option']
	singleValue?: SelectComponentsConfig<T, false, GroupBase<T>>['SingleValue']
	selected: T | undefined
	setSelected: (role: T | undefined) => void
}

export default function DropdownSelect<T extends object>({ options, placeholder, makeOption, singleValue, selected, setSelected }: DropdownSelectProps<T>) {
	return (
		<Select<T>
			options={options}
			maxMenuHeight={240}
			isSearchable={false}
			blurInputOnSelect
			placeholder={placeholder}
			value={selected}
			onChange={(item) => setSelected(item || undefined)}
			components={
				{
					Option: makeOption,
					DropdownIndicator,
					SingleValue: singleValue ?? SingleValue,
					Control,
					// @ts-ignore
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
}

const DropdownIndicator = ({ innerProps }: {innerProps: BoxProps}) => (
	<Box
		{...innerProps}
		px={2}>
		<Dropdown
			h='5px'
			w='10px'
			color='#7D7DA0'
			transition='all 0.2s ease-in'
		/>
	</Box>
)

function SingleValue<T extends object>({ innerProps, data }: SingleValueProps<T, false, GroupBase<T>>) {
	if(!('icon' in data) || !('label' in data) || (typeof data.label !== 'string')) {
		return <Flex />
	}

	return (
		<Box
			{...innerProps}
			display='inline-flex'
			alignItems='center'
			p={0}
			m={0}
		>
			<>
				{data.icon}
				<Text
					ml={2}>
					{data.label}
				</Text>
			</>
		</Box>
	)
}

function Control<T>({ innerProps, isFocused, ...rest }: ControlProps<T, false, GroupBase<T>>) {
	return (
		<Box
			{...innerProps}
			minW='150px'
			py={2}
			px={0}
			display='inline-flex'
			flex={1}
			transition='all 0.2s ease-in'
			borderBottom={isFocused ? '1px solid #2B67F6' : '1px solid #D2D2E3'}
			boxShadow={isFocused ? '0px 1px 0px 0px #2b67f6' : 'none'}
			_hover={
				{
					borderBottom: '1px solid #2B67F6',
					boxShadow: '0px 1px 0px 0px #2b67f6'
				}
			}
			cursor='pointer'
		>
			{rest.children}
		</Box>
	)
}

const Placeholder = ({ innerProps, children }: PlaceholderProps) => {
	return (
		<Box
			{...innerProps}
			// h={8}
			display='inline-flex'
			alignItems='center'
		>
			<Text
				fontWeight='500'
				color='#AFAFCC'
			>
				{children}
			</Text>
		</Box>
	)
}