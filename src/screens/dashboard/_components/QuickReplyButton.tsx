import { Button, Text } from '@chakra-ui/react'
import { TagType } from 'src/screens/dashboard/_utils/types'

interface Props {
    tag: TagType
    selectedTags: {[key: number]: boolean}
    onTagClick: () => void
    index: number
}

function QuickReplyButton({ tag, selectedTags, onTagClick, index }: Props) {
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
				onClick={onTagClick}
				isDisabled={Object.keys(selectedTags).length > 0 && !(index in selectedTags)}
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