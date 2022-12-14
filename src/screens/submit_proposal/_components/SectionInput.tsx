import { useState } from 'react'
import { Flex, FlexProps, Input, InputProps, Text } from '@chakra-ui/react'

interface Props extends InputProps {
    label: string
    flexProps?: FlexProps
}

function SectionInput({ label, flexProps, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				{...flexProps}
				direction='column'
				mt={8}
				w='100%'>
				<Flex
					w='100%'
					align='end'>
					<Text
						mr={8}
						pb={2}
						variant='v2_subheading'
						w='calc(30% - 32px)'
						fontWeight='500'
						textAlign='right'>
						{label}
					</Text>

					<Input
						{...props}
						w='70%'
						variant='flushed'
						textAlign='left'
						borderColor='gray.3'
						borderBottom='1px solid'
						fontSize='20px'
						lineHeight='28px'
						color='black.1'
						onWheel={(e) => (e.target as HTMLElement).blur()}
						_placeholder={
							{
								color: 'gray.5'
							}
						}
						onChange={
							(e) => {
								setValue(e.target.value)
								props?.onChange?.(e)
							}
						} />
				</Flex>
				{
					props?.maxLength && (
						<Text
							mt={1}
							ml='auto'
							variant='v2_metadata'
							color='gray.5'>
							{value?.length}
							/
							{props?.maxLength}
						</Text>
					)
				}
			</Flex>
		)
	}

	const [value, setValue] = useState<string>(props?.value?.toString() ?? '')

	return buildComponent()
}

export default SectionInput