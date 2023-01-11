import { Button, ButtonProps, Text } from '@chakra-ui/react'
import { TagType } from 'src/screens/dashboard/_utils/types'

type Props = {
    tag: TagType
    selectedTags: {[key: number]: boolean}
    index: number
} & ButtonProps

function QuickReplyButton({ tag, selectedTags, index, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Button
				key={index}
				variant='outline'
				justifyContent='start'
				py={1}
				px={3}
				borderRadius='12px'
				leftIcon={tag.icon}
				bg={ index in selectedTags ? 'gray.3' : 'white'}
				border='1px solid #E7E4DD'
				{...props}
			>
				<Text
					variant='v2_body'
					fontWeight={index in selectedTags ? 'bold' : 'normal'}
				>
					{tag.title}
				</Text>
			</Button>
		)
	}

	return buildComponent()
}

export default QuickReplyButton