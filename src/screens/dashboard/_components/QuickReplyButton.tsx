import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react'
import { ApplicationState } from 'src/generated/graphql'
import { Accept, Chat, Reject, Resubmit } from 'src/generated/icons'
import logger from 'src/libraries/utils/logger'
import { TagType } from 'src/screens/dashboard/_utils/types'

type Props = {
	id: 'accept' | 'reject' | 'resubmit' | 'feedback'
    tag: TagType
    isSelected: boolean
    index: number
} & ButtonProps

function QuickReplyButton({ tag, isSelected, index, ...props }: Props) {
	const buildComponent = () => {
		logger.info({ tag, isSelected, index }, 'QuickReplyButton.buildComponent')
		if (!tag.id) return <Flex />
		return (
			<Button
				key={index}
				variant='outline'
				justifyContent='start'
				py={1}
				px={3}
				borderRadius='18px'
				maxH={'36px'}
				leftIcon={ config[tag.id as keyof typeof config].icon }
				bg={ config[tag.id as keyof typeof config].bg + '.300' }
				border='1px solid'
				borderColor={ config[tag.id as keyof typeof config]?.bg + '.500' }
				_hover={{ bg: config[tag.id as keyof typeof config].bg + '.400' }}
				{...props}
			>
				<Text>
					{config[tag.id as keyof typeof config].title}
				</Text>
			</Button>
		)
	}

	const config = {
		accept: {
			icon: <Accept />,
			title: 'Accept',
			bg: 'accent.azure',
		},
		reject: {
			icon: <Reject />,
			title: 'Reject',
			bg: 'accent.carrot',
		},
		resubmit: {
			icon: <Resubmit />,
			title: 'Resubmit',
			bg: 'accent.orchid',
		},
		feedback: {
			icon: <Chat />,
			title: 'Feedback / Comment',
			bg: 'accent.vivid'
		}
	}

	return buildComponent()
}

export default QuickReplyButton