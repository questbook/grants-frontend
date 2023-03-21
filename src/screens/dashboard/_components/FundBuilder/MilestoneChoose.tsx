import { useContext, useMemo } from 'react'
import { Flex, FlexProps, Text } from '@chakra-ui/react'
import { GroupBase, OptionProps, SingleValueProps } from 'chakra-react-select'
import logger from 'src/libraries/logger'
import DropdownSelect from 'src/libraries/ui/LinkYourMultisigModal/DropdownSelect'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

interface Props extends FlexProps {
	proposal: ProposalType
	index: number
}

type DropdownItem = ProposalType['milestones'][number] & { index: number }

function MilestoneChoose({ proposal, index, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				borderBottom='1px solid #E7E4DD'
				{...props}>
				<Text
					w='20%'
					color='gray.600'>
					Milestones
				</Text>
				<Flex
					direction='column'>
					<DropdownSelect
						options={
							milestones.map((milestone, index) => {
								return { ...milestone, index }
							})
						}
						makeOption={milestoneItem}
						selected={{ ...milestones?.[milestoneIndices?.[index]], index: milestoneIndices?.[index] }}
						singleValue={singleValue}
						setSelected={
							(value: DropdownItem | undefined) => {
								if(!value) {
									return
								}

								logger.info({ value, index }, 'Selected milestone')

								const newMilestoneIndices = [...milestoneIndices]
								newMilestoneIndices[index] = value.index
								setMilestoneIndices(newMilestoneIndices)

								const copy = [...amounts]
								copy[index] = parseFloat(value.amount)
								setAmounts(copy)
							}
						} />
					{/*  */}
					<Text
						mt={1}
						variant='body'>
						{milestones?.[milestoneIndices?.[index]]?.title}
					</Text>
				</Flex>
			</Flex>
		)
	}

	function milestoneItem<T extends object>({ innerProps, data }: OptionProps<T, false, GroupBase<T>>) {
		if(!('index' in data) || (typeof data.index !== 'number') || !('title' in data) || (typeof data.title !== 'string')) {
			return <Flex />
		}

		return (
			<Flex
				{...innerProps}
				direction='column'
				cursor='pointer'
				minWidth='max-content'
				p={2}
			>
				<Text
					color='gray.400'
					variant='heading3'
					fontWeight='500'>
					{data.index < 9 ? `0${data.index + 1}` : (data.index + 1)}
				</Text>
				<Text
					mt={1}
					variant='body'
				>
					{data?.title}
				</Text>
			</Flex>
		)
	}

	function singleValue<T extends object>({ innerProps, data }: SingleValueProps<T, false, GroupBase<T>>) {
		logger.info({ data }, 'Single Value')
		if(!('index' in data) || (typeof data.index !== 'number')) {
			return <Flex />
		}

		return (
			<Text
				{...innerProps}
				color='gray.400'
				variant='heading3'
				fontWeight='500'>
				{data.index < 9 ? `0${data.index + 1}` : (data.index + 1)}
			</Text>
		)
	}

	const { milestoneIndices, setMilestoneIndices, amounts, setAmounts } = useContext(FundBuilderContext)!

	const milestones = useMemo(() => {
		return proposal?.milestones || []
	}, [proposal])

	return buildComponent()
}

export default MilestoneChoose