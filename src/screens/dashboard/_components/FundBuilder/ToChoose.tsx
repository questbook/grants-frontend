import { useContext } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

type Props =
| {
	proposal: ProposalType
	index: number
	type: 'single'
} | {
	type: 'multi'
}

function ToChoose(prop: Props) {
	const buildComponent = () => {
		return (
			<Flex
				p={4}
				w='100%'
				align='center'
				borderBottom='1px solid #E7E4DD'>
				<Text
					minW='20%'
					color='gray.600'>
					To
				</Text>
				{
					prop.type === 'single' && (
						<FlushedInput
							isDisabled={!prop.proposal}
							placeholder='Enter builder address here'
							value={tos?.[prop.index]}
							onChange={(e) => setTos([e.target.value])}
							fontSize='16px'
							fontWeight='400'
							lineHeight='20px'
							borderBottom={undefined}
							variant='unstyled'
							w='100%'
							textAlign='left'
							flexProps={
								{
									w: '100%',
								}
							} />
					)
				}

			</Flex>
		)
	}

	const { tos, setTos } = useContext(FundBuilderContext)!

	return buildComponent()
}

export default ToChoose