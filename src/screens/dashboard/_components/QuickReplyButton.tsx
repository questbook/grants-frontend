import { IoMdDocument } from 'react-icons/io'
import { Button, ButtonProps, Flex, Text, TextProps, useToken } from '@chakra-ui/react'
import { Accept, AddUser, Chat, Reject, Resubmit, Time } from 'src/generated/icons'
import { TagType } from 'src/screens/dashboard/_utils/types'

type Props = {
	id: 'accept' | 'reject' | 'resubmit' | 'feedback' | 'review' | 'KYC' | 'KYB' | 'HelloSign' | 'cancelled'
    tag: TagType | undefined
    isSelected: boolean
    index: number
	textProps?: TextProps
} & ButtonProps

function QuickReplyButton({ tag, index, textProps, ...props }: Props) {
	const buildComponent = () => {
		if(!tag?.id) {
			return <Flex />
		}

		return (
			<Button
				key={index}
				variant='outline'
				justifyContent='start'
				py={1}
				px={2}
				borderRadius='18px'
				maxH='36px'
				leftIcon={ config[tag?.id as keyof typeof config].icon }
				bg={ config[tag?.id as keyof typeof config].bg + '4D' }
				border='1px solid'
				borderColor={ config[tag?.id as keyof typeof config]?.bg + '66' }
				_hover={{ bg: config[tag?.id as keyof typeof config].bg }}
				{...props}
			>
				<Text {...textProps}>
					{config[tag?.id as keyof typeof config].title}
				</Text>
			</Button>
		)
	}

	const [azure, carrot, orchid, vivid, jeans] = useToken(
		'colors',
		['accent.azure', 'accent.carrot', 'accent.orchid', 'accent.vivid', 'accent.jeans']
	)

	const config = {
		accept: {
			icon: <Accept />,
			title: 'Accept',
			bg: azure,
		},
		reject: {
			icon: <Reject />,
			title: 'Reject',
			bg: carrot,
		},
		resubmit: {
			icon: <Resubmit />,
			title: 'Resubmit',
			bg: orchid,
		},
		feedback: {
			icon: <Chat />,
			title: 'Feedback / Comment',
			bg: vivid
		},
		review: {
			icon: <Time />,
			title: 'Review',
			bg: jeans
		},
		KYC: {
			icon: <AddUser />,
			title: 'Send KYC link',
			bg: jeans
		},
		KYB: {
			icon: <AddUser />,
			title: 'Send KYB link',
			bg: vivid
		},
		HelloSign: {
			icon: <IoMdDocument />,
			title: 'Send Agreement',
			bg: azure
		},
		cancelled: {
			icon: <Reject />,
			title: 'Cancel / Withdraw',
			bg: carrot
		},
	}

	return buildComponent()
}

export default QuickReplyButton