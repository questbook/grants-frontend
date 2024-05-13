import { Flex, Text, useToken } from '@chakra-ui/react'
import { Accept, Link, Reject, Resubmit, Time } from 'src/generated/icons'

type Props = {
	state: 'approved' | 'rejected' | 'resubmit' | 'submitted' | 'open'
    title: string
}

function StateButton({ state, title }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				align='center'
				justify='center'
				transition='all .5s ease'
				p='4px 10px 4px 10px'
				w='auto'
				borderRadius='6px'
				maxH='36px'
				bg={
					config[state as keyof typeof config]?.title === 'Accepted' || 	config[state as keyof typeof config]?.title === 'Not Responded Yet' ?
						config[state as keyof typeof config]?.bg :
						config[state as keyof typeof config]?.bg + '66'
				}
			>
				<Text
					variant='metadata'
					fontWeight='500'
					fontSize='12px'
					lineHeight='16px'
					color={config[state as keyof typeof config]?.title === 'Accepted' ? '#557B05' : config[state as keyof typeof config]?.title === 'Rejected' ? '#C50000' : 'black.100'}>
					{title}
				</Text>
			</Flex>
		)
	}

	const [azure, carrot, orchid, jeans, gray] = useToken(
		'colors',
		['#C3F953', 'accent.carrot', 'accent.orchid', 'white', '#F1EEE8']
	)

	const config = {
		approved: {
			icon: <Accept />,
			title: 'Accepted',
			bg: azure,
		},
		rejected: {
			icon: <Reject />,
			title: 'Rejected',
			bg: carrot,
		},
		resubmit: {
			icon: <Resubmit />,
			title: 'Resubmission',
			bg: orchid,
		},
		submitted: {
			icon: <Time />,
			title: 'Not Responded Yet',
			bg: jeans
		},
		open: {
			icon: <Link />,
			title: 'Open',
			bg: gray
		},
		review : {
			icon: <Time />,
			title: 'Review',
			bg: jeans
		}
	}

	return buildComponent()
}

export default StateButton