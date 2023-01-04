import { ReactNode } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { PlaceholderProps, Select, SelectComponentsConfig } from 'chakra-react-select'
import { SelectDropdownArrow } from 'src/libraries/assets/custom chakra icons/Arrows/SelectDropdownArrow'

type DropdownSelectProps<T> = {
	options: T[]
	placeholder?: ReactNode
	makeOption: SelectComponentsConfig<T, any, any>['Option']
	singleValue: SelectComponentsConfig<T, any, any>['SingleValue']
	selected: T | undefined
	setSelected: (role: T | undefined) => void
}

export default function Dropdown<T>({ options, placeholder, makeOption, singleValue, selected, setSelected }: DropdownSelectProps<T>) {
	return (
		<Select<T>
			options={options}
			isSearchable={false}
			blurInputOnSelect
			placeholder={placeholder}
			value={selected}
			onChange={(item) => setSelected(item || undefined)}
			components={
				{
					Option: makeOption,
					DropdownIndicator,
					SingleValue: singleValue,
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
						py: '0',
						border: 'none',
						width: 'fit-content',
					}),
					menu: (provided) => ({
						...provided,
						border: 'none',
						boxShadow: '0px 3px 5px rgba(31, 31, 51, 0.2), 0px 0px 1px rgba(31, 31, 51, 0.31)',
						borderRadius: '3px',
						zIndex: 100,
					}),
					valueContainer: (provided) => ({
						...provided,
						display: 'flex',
						padding: '0px',
						justifyContent: 'flex-start',
					}),
				}
			}
		/>
	)
}

const DropdownIndicator = () => (
	<Box
		px={2}>
		<SelectDropdownArrow
			h='5px'
			w='10px'
			color='#7D7DA0'
			transition='all 0.2s ease-in'
		/>
	</Box>
)

const Control = ({ innerProps, isFocused, ...rest }: any) => {
	return (
		<Box
			{...innerProps}
			py={1}
			px={0}
			display='inline-flex'
			flex={1}
			w='100%'
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
				fontSize='14px'
			>
				{children}
			</Text>
		</Box>
	)
}