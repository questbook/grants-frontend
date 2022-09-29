import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { ActionItemType } from 'src/screens/proposal/_types'
import { getFormattedDateFromUnixTimestampWithYear } from 'src/utils/formattingUtils'

function ActionItem({ item }: {item: ActionItemType}) {
	switch (item.type) {
	case 'fund_sent':
		return (
			<Flex
				w='100%'
				mr='auto'
				align='center'
				mt={3}>
				<Image
					src='/ui_icons/pointer.svg'
					boxSize='10px' />
				<Text
					ml={2}
					variant='v2_body'>
					Sent
					{' '}
					{item.amount}
				</Text>
				<Box mx='auto' />
				<Text
					variant='v2_metadata'
					color='black.3'>
					{getFormattedDateFromUnixTimestampWithYear(item.time)}
				</Text>
			</Flex>
		)
	case 'feedback_dao':
		return (
			<Flex
				direction='column'
				w='100%'
				mb={6}>
				<Flex
					w='100%'
					mr='auto'
					align='center'
					mt={3}>
					<Image
						src='/ui_icons/pointer.svg'
						boxSize='10px' />
					<Text
						ml={2}
						variant='v2_body'>
						Marked milestone as done
					</Text>
					<Box mx='auto' />
					<Text
						variant='v2_metadata'
						color='black.3'>
						{getFormattedDateFromUnixTimestampWithYear(item.time)}
					</Text>
				</Flex>
				<Flex
					ml='10px'
					borderRadius='4px'
					mt={3}
					bg='violet.1'
					px={2}
					py={1}>
					<Text variant='v2_body'>
						{item?.feedback}
					</Text>
				</Flex>
			</Flex>
		)
	case 'feedback_dev':
		return (
			<Flex
				mb={6}
				direction='column'
				w='100%'>
				<Flex
					w='100%'
					mr='auto'
					align='center'
					mt={3}>
					<Image
						src='/ui_icons/pointer.svg'
						boxSize='10px' />
					<Text
						ml={2}
						variant='v2_body'>
						Applicant marked milestone as done
					</Text>
					<Box mx='auto' />
					<Text
						variant='v2_metadata'
						color='black.3'>
						{getFormattedDateFromUnixTimestampWithYear(item.time)}
					</Text>
				</Flex>
				<Flex
					ml='10px'
					borderRadius='4px'
					mt={3}
					bg='violet.1'
					px={2}
					py={1}>
					<Text variant='v2_body'>
						{item?.feedback}
					</Text>
				</Flex>
			</Flex>
		)
	default:
		return <Flex />
	}
}

export default ActionItem