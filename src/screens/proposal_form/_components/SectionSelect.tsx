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
				direction={['column', 'row']}
				align={['stretch', 'end']}>
				<Text
					mr={8}
					pb={2}
					variant='subheading'
					w={['100%', 'calc(30% - 32px)']}
					fontWeight='500'
					textAlign={['left', 'right']}>
					{label}
				</Text>
				<NumberInput
					{...props}
					variant='flushed'
					w='70%'
					textAlign='left'
					borderColor='gray.300'
					fontSize='20px'
					max={10}
					lineHeight='28px'
					color='black.100'
					_placeholder={
						{
							color: 'gray.500'
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