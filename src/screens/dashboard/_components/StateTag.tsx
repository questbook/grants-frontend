import { Flex, FlexProps, Text, useToken } from '@chakra-ui/react'
import { ApplicationState } from 'src/generated/graphql'
import { Accept, Reject, Resubmit, Time } from 'src/generated/icons'
import { titleCase } from 'src/libraries/utils/formatting'

type Props = {
	state: ApplicationState
	isSelected?: boolean
} & FlexProps

function StateTag({ state, isSelected = true, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				align='center'
				justify='center'
				transition='all .5s ease'
				py={1}
				px={3}
				w={isSelected ? (titleCase(config[state as keyof typeof config]?.title).length + 2) + 'ch' : '32px'}
				borderRadius='18px'
				maxH='36px'
				border='1px solid'
				bg={isSelected ? config[state as keyof typeof config]?.bg + '4D' : config[state as keyof typeof config]?.bg + '66'}
				borderColor={config[state as keyof typeof config]?.bg + '66'}
				{...props}>
				{config[state as keyof typeof config].icon}
				{
					isSelected && (
						<Text
							variant='metadata'
							fontWeight='500'
							ml={1}>
							{titleCase(config[state as keyof typeof config]?.title)}
						</Text>
					)
				}
			</Flex>
		)
	}

	const [azure, carrot, orchid, jeans] = useToken(
		'colors',
		['accent.azure', 'accent.carrot', 'accent.orchid', 'accent.jeans']
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
		}
	}

	return buildComponent()
}

export default StateTag