import { useContext, useMemo, useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { Proposal } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'

function Milestones() {
	const buildComponent = () => {
		return (
			<Flex
				px={5}
				py={4}
				direction='column'
				align='stretch'
				w='100%'>
				<Flex
					justify='space-between'
					onClick={
						() => {
							setExpanded(!expanded)
						}
					}>
					<Text fontWeight='500'>
						Milestones
					</Text>
					<Image
						mr={2}
						src='/v2/icons/dropdown.svg'
						transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
						alt='options'
						cursor='pointer'
					/>
				</Flex>

				<Flex
					display={expanded ? 'block' : 'none'}
					direction='column'>
					{milestones.map(milestoneItem)}
				</Flex>
			</Flex>
		)
	}

	const milestoneItem = (milestone: Proposal['milestones'][number], index: number) => {
		return (
			<Flex
				direction='column'
				mt={index === 0 ? 4 : 2}>
				<Text
					color='gray.4'
					variant='heading3'
					fontWeight='500'>
					{index < 9 ? `0${index + 1}` : (index + 1)}
				</Text>
				<Text
					mt={1}
					variant='body'>
					{milestone?.title}
				</Text>
			</Flex>
		)
	}

	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const [expanded, setExpanded] = useState(true)

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const milestones = useMemo(() => {
		return proposal?.milestones || []
	}, [proposal])

	return buildComponent()
}

export default Milestones