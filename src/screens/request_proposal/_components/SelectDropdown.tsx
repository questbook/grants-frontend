import { useState } from 'react'
import { Divider, Flex, Text } from '@chakra-ui/react'
import { Select, SingleValue, } from 'chakra-react-select'


interface Props<T> {
    options: T[]
    onChange: (value: SingleValue<T>) => void
    placeholder?: string
}

function SelectDropdown<T>({ options, placeholder, onChange }: Props<T>) {
	return (
		<Select<T>
			variant='flushed'
			options={options}
			placeholder={placeholder}
			selectedOptionStyle='check'
			onChange={onChange}
			chakraStyles={
				{
					container: (provided) => ({
						...provided,
						width: '30%',
						fontSize: '96px',
						fontWeight: '400',
						color: 'black.1'
					}),
					valueContainer: (provided) => ({
						...provided,
						fontSize: '28px',
					}),
					menu: (provided) => ({
						...provided,
						fontSize: '24px',
						fontWeight: '400',
					})
				}
			}
			 />
	)
}

export default SelectDropdown