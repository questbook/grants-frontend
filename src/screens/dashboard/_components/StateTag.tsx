import { Flex, FlexProps, Text } from '@chakra-ui/react'
import { ApplicationState } from 'src/generated/graphql'
import { CheckDouble, Close, Resubmit } from 'src/generated/icons'
import { titleCase } from 'src/libraries/utils/formatting'

type Props = {
    state: ApplicationState
    isSelected?: boolean
    where?: 'filter' | 'proposal-card' | 'discussion'
} & FlexProps

function StateTag({ state, isSelected = true, where = 'discussion', ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				ml='auto'
				align='center'
				justify='center'
				cursor={where === 'filter' ? 'pointer' : 'default'}
				onClick={where === 'filter' ? () => { } : undefined}
				transition='all .5s ease'
				p={2}
				w={isSelected ? '96px' : '32px'}
				borderRadius={isSelected ? '12px' : '4px'}
				bg={state === 'approved' ? 'accent.columbia' : state === 'rejected' ? 'accent.melon' : 'accent.vodka'}
				{...props}>
				{state === 'approved' ? <CheckDouble /> : state === 'rejected' ? <Close /> : <Resubmit />}
				{
					isSelected && (
						<Text
							variant='metadata'
							fontWeight='500'
							ml={1}>
							{titleCase(state)}
						</Text>
					)
				}
			</Flex>
		)
	}

	const getTitle = () => {
		if(state === 'approved') {
			return where === 'discussion' ? 'Approve' : 'Approved'
		} else if(state === 'rejected') {
			return where === 'discussion' ? 'Reject' : 'Rejected'
		} else if(state === 'resubmit') {
			return where === 'discussion' ? 'Resubmit' : 'Resubmitted'
		} else if(state === 'submitted') {
			return where === 'discussion' ? 'Feedback / Comment' : ''
		}
	}

	return buildComponent()
}

export default StateTag