import { ChangeEventHandler } from 'react'
import React from 'react'
import { Flex, Link, Select, Text } from '@chakra-ui/react'
import { MdArrowDropDown } from 'react-icons/md'

interface Props {
	label: string;
	optionalText?: string;
	helperText?: string;
	helperLinkText?: string;
	helperLinkUrl?: string;
	placeholder?: string;
	value: string | number;
	onChange: ChangeEventHandler<HTMLInputElement>;
	isError?: boolean;
}

function Dropdown({ label, optionalText, helperText, helperLinkText, helperLinkUrl, placeholder, value, onChange }: Props) {
	const [currentLength, setCurrentLength] = React.useState(value?.toString().length)

	React.useEffect(() => {
		setCurrentLength(value?.toString().length)
	}, [value])
	return (
		<Flex direction="column">
			<Flex>
				<Text
					variant="v2_body"
					fontWeight="500">
					{label}
				</Text>
				{
					optionalText && (
						<Text
							ml={1}
							variant="v2_metadata"
							color="black.3">
							{optionalText}
						</Text>
					)
				}
			</Flex>
			{
				helperText && (
					<Text
						variant="v2_metadata"
						color="black.3">
						{helperText}
						{' '}
						{
							helperLinkText && (
								<Link
									display="inline-block"
									fontWeight="500"
									color={'black.3'}
									isExternal
									href={helperLinkUrl}>
									{helperLinkText}
								</Link>
							)
						}
					</Text>
				)
			}
			<Select icon={<MdArrowDropDown  />} variant="flushed">
				<option value={value}>{value}</option>
			</Select>
		</Flex>
	)
}

export default Dropdown