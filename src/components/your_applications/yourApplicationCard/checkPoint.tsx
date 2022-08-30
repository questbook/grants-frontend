import React from 'react'
import { Box, Image, Text } from '@chakra-ui/react'

interface Props {
  state:
  | 'sent'
  | 'under_review'
  | 'approved'
  | 'submitted'
  | 'rejected'
  | 'resubmit'
  date?: string
}

function CheckPoint({ state, date }: Props) {
	const stateInfo = {
		sent: {
			text: 'Sent',
			icon: '/ui_icons/sent_application.svg',
			bgColor: '#418FA0',
			textColor: '#418FA0',
		},
		under_review: {
			text: 'Under review',
			icon: '/ui_icons/review_application.svg',
			bgColor: '#418FA0',
			textColor: '#418FA0',
		},
		submitted: {
			text: 'Result',
			icon: '/ui_icons/result_pending_application.svg',
			bgColor: '#D0D3D3',
			textColor: '#BDBDBD',
		},
		approved: {
			text: 'Approved',
			icon: '/ui_icons/result_accepted_application.svg',
			bgColor: '#418FA0',
			textColor: '#418FA0',
		},
		completed: {
			text: 'Completed',
			icon: '/ui_icons/result_accepted_application.svg',
			bgColor: '#418FA0',
			textColor: '#418FA0',
		},
		rejected: {
			text: 'Rejected',
			icon: '/ui_icons/result_rejected_application.svg',
			bgColor: '#FF9797',
			textColor: '#7B4646',
		},
		resubmit: {
			text: 'Resubmit',
			icon: '/ui_icons/result_resubmit_application.svg',
			bgColor: '#FFC85E',
			textColor: '#7B4646',
		},
	}
	return (
		<>
			<Text
				fontSize='14px'
				lineHeight='24px'
				fontWeight='700'
				color='#414E50'
				position='absolute'
				top='-20px'
				whiteSpace='nowrap'
			>
				{ date}
			</Text>
			<Box
				display='flex'
				alignItems='center'
				justifyContent='center'
				h={9}
				w={9}
				bg={stateInfo[state]?.bgColor}
				borderRadius='36px'
			>
				<Image src={stateInfo[state]?.icon} />
			</Box>
			<Text
				fontSize='14px'
				lineHeight='16px'
				fontWeight='500'
				color={stateInfo[state]?.textColor}
				position='absolute'
				bottom='-18px'
				whiteSpace='nowrap'
			>
				{stateInfo[state]?.text}
			</Text>
		</>
	)
}

CheckPoint.defaultProps = {
	date: '',
}
export default CheckPoint
