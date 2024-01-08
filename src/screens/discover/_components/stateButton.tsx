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
				py={1.5}
				px={3}
				w='auto'
				borderRadius='18px'
				maxH='36px'
				border='1px solid'
				bg={config[state as keyof typeof config]?.bg + '66'}
				borderColor={config[state as keyof typeof config]?.bg + '66'}
			>
				{config[state as keyof typeof config].icon}
				<Text
					variant='metadata'
					fontWeight='500'
					ml={1}>
					{title}
				</Text>
			</Flex>
		)
	}

	const [azure, carrot, orchid, jeans, gray] = useToken(
		'colors',
		['accent.azure', 'accent.carrot', 'accent.orchid', '#F1EEE8', '#F1EEE8']
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
		}
	}

	return buildComponent()
}

export default StateButton