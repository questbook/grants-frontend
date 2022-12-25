import { Divider, Flex, Text } from '@chakra-ui/react'

export interface SummaryCardProps {
    imagePath?: string
    text: string
    value: string
}

function RFPStats({ text, value }: SummaryCardProps) {
	return (
		<Flex
			// gap={4}
			width='33%'
			justifyContent='space-between'
		>
			<Flex direction='column'>
				<Text
					variant='v2_title'
					fontWeight='500'>
					{value}
				</Text>
				<Text
					variant='v2_body'
					fontWeight='400'
					color='black.3'>
					{text}
				</Text>
			</Flex>
			<Divider orientation='vertical' />
		</Flex>
	)
}

export default RFPStats