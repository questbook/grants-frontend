import { useState } from 'react'
import { Divider, Flex, Text } from '@chakra-ui/react'
import { CreatableSelect } from 'chakra-react-select'
import { ApplicantDetailsFieldType } from 'src/types'


const detailsItem = ({ innerProps, data }: any) => {
	if(data.required === false) {
		return (
			<Flex
				className='detailsOption'
				{...innerProps}
				direction='column'
				cursor='pointer'
				p={2}
				width='100%'
			>
				<Text
					mt={1}
					variant='body'>
					{data?.title}
				</Text>
				<Divider />
			</Flex>
		)
	} else {
		return <></>
	}
}

type Props = {
    options: ApplicantDetailsFieldType[]
    setExtraDetailsFields: (value: ApplicantDetailsFieldType[]) => void
    setShowExtraFieldDropdown: (value: boolean) => void
    width?: string
    placeholder?: string
}


export function CustomSelect({ options, setExtraDetailsFields, setShowExtraFieldDropdown, placeholder }: Props) {

	const [value, setValue] = useState<ApplicantDetailsFieldType | null>()
	const createOption = (label: string): any => {
		return {
			id: label.split(' ').join(''),
			title: label,
			required: true,
			inputType: 'long-form',
			pii: false,
		}
	}

	const handleCreate = (inputValue: string) => {
		const newOption = createOption(inputValue)
		setExtraDetailsFields([...options, newOption])
		setValue(newOption)
		setShowExtraFieldDropdown(false)

	}

	const handleOnChange = (item: ApplicantDetailsFieldType) => {
		const changedItem = { ...item, required: true }
		const newOptionsList = options.filter((option) => option.id !== item.id)
		setExtraDetailsFields([...newOptionsList, changedItem])
		setShowExtraFieldDropdown(false)
	}

	return (
		<CreatableSelect
			variant='flushed'
			// isSearchable={true}
			placeholder={placeholder}
			// formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
			value={value}
			onChange={
				(item) => {
					setValue(item); handleOnChange(item!)
				}
			}
			options={options}
			onCreateOption={handleCreate}
			components={
				{
					Option: detailsItem
				}
			}
			chakraStyles={
				{
					container: (provided) => ({
						...provided,
						width: `${ placeholder?.length }ch`,
					})
				}
			}
		/>
	)


}