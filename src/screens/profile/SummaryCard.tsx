import { Divider, Flex, Image, Text } from '@chakra-ui/react'

export interface SummaryCardProps {
    imagePath?: string
    text: string
    value: string
}

function SummaryCard({ imagePath, text, value }: SummaryCardProps) {
	return (
		<Flex
			justifyContent='space-between'
			width='33%'
		>
			<Flex
				gap={4}
			>
				{imagePath ? <Image src={imagePath} /> : <></>}
				<Flex direction='column'>
					<Text
						variant='v2_subheading'
						fontWeight='500'>

						{value}
					</Text>
					<Text
						variant='v2_body'
						color='black.3'>
						{text}
					</Text>
				</Flex>
			</Flex>
			<Divider orientation='vertical' />
		</Flex>
	)
}

export default SummaryCard