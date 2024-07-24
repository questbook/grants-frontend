import { Flex, Text, useToken } from '@chakra-ui/react'
import { Accept, Link, Reject, Resubmit, Time } from 'src/generated/icons'

type Props = {
	state: 'approved' | 'rejected' | 'resubmit' | 'submitted' | 'open' | 'review' | 'cancelled'
    title: string
	icon: boolean
}

function StateButton({ state, title, icon }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				align='center'
				justify='center'
				transition='all .5s ease'
				p='4px 10px 4px 10px'
				borderRadius='3xl'
				w={title.length + 2 + 'ch'}
				py={2}
				bg={config[state as keyof typeof config]?.bg + '4D'}
				borderColor={config[state as keyof typeof config]?.bg + '66'}
			>

				{icon && config[state as keyof typeof config].icon}
				<Text
					variant='metadata'
					fontWeight='500'
					ml={icon ? 1 : 0}>
					{title}
				</Text>
			</Flex>
		)
	}

	const [azure, carrot, orchid, jeans, gray] = useToken(
		'colors',
		['accent.azure', 'accent.carrot', 'accent.orchid', 'white', '#F1EEE8']
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
			title: 'Submitted',
			bg: gray
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
		},
		cancelled: {
			icon: <Reject />,
			title: 'Cancelled',
			bg: carrot
		}
	}

	return buildComponent()
}

export default StateButton