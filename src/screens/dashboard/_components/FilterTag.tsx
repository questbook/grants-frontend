import { Button, ButtonProps, Text, useToken } from '@chakra-ui/react'
import { ApplicationState } from 'src/generated/graphql'
import { Accept, Reject, Resubmit, Time } from 'src/generated/icons'
import { titleCase } from 'src/libraries/utils/formatting'

type Props = {
	state: ApplicationState
	isSelected?: boolean
} & ButtonProps

function FilterTag({ state, isSelected = true, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Button
				align='center'
				justify='center'
				transition='all .5s ease'
				w={(titleCase(config[state as keyof typeof config]?.title).length + 2) + 'ch' }
				leftIcon={config[state as keyof typeof config].icon(isSelected ? 'white' : 'black.100')}
				borderRadius='18px'
				maxH='36px'
				border='1px solid'
				_hover={
					{
						bg: config[state as keyof typeof config]?.bg + '66'
					}
				}
				bg={isSelected ? config[state as keyof typeof config]?.bg : config[state as keyof typeof config]?.bg + '4D'}
				borderColor={config[state as keyof typeof config]?.bg + '66'}
				{...props}>
				<Text
					variant='metadata'
					fontWeight='500'
					color={isSelected ? 'white' : 'black.100'}
					ml={1}>
					{titleCase(config[state as keyof typeof config]?.title)}
				</Text>
			</Button>
		)
	}

	const [azure, carrot, orchid, vivid, jeans] = useToken(
		'colors',
		['accent.azure', 'accent.carrot', 'accent.orchid', 'accent.vivid', 'accent.jeans']
	)

	const config = {
		approved: {
			icon: (color?: string) => <Accept color={color ?? 'black.100'} />,
			title: 'Accepted',
			bg: azure,
		},
		rejected: {
			icon: (color?: string) => <Reject color={color ?? 'black.100'} />,
			title: 'Rejected',
			bg: carrot,
		},
		resubmit: {
			icon: (color?: string) => <Resubmit color={color ?? 'black.100'} />,
			title: 'Resubmission',
			bg: orchid,
		},
		submitted: {
			icon: (color?: string) => <Time color={color ?? 'black.100'} />,
			title: 'Not Responded Yet',
			bg: vivid,
		},
		review: {
			icon: (color?: string) => <Time color={color ?? 'black.100'} />,
			title: 'Review',
			bg: jeans
		}
	}

	return buildComponent()
}

export default FilterTag