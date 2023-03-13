import { Flex, FlexProps, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputProps, NumberInputStepper, Text } from '@chakra-ui/react'

interface Props extends NumberInputProps {
    label: string
    flexProps?: FlexProps
}

function SectionSelect({ label, flexProps, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				{...flexProps}
				mt={8}
				w='100%'
				align='end'>
				<Text
					mr={8}
					pb={2}
					variant='subheading'
					w='calc(30% - 32px)'
					fontWeight='500'
					textAlign='right'>
					{label}
				</Text>
				<NumberInput
					{...props}
					variant='flushed'
					w='70%'
					textAlign='left'
					borderColor='gray.3'
					fontSize='20px'
					lineHeight='28px'
					color='black.1'
					_placeholder={
						{
							color: 'gray.5'
						}
					}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Flex>
		)
	}

	return buildComponent()
}

export default SectionSelect