import { useContext } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { FundBuilderContext } from 'src/screens/dashboard/Context'
import { useEnsAddress } from 'wagmi'

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
		const { data: ensAddress } = useEnsAddress({ name: tos?.[prop?.type === 'single' ? prop?.index : 0], chainId: 1 })
		return (
			<>
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
				{
					prop?.type === 'single' && tos?.[prop.index]?.includes('.eth') && !ensAddress && (
						<Text
							p={2}
							w='100%'
							align='center'
							color='red.500'
							fontSize='12px'>
							Invalid ENS address Please enter valid eth address
						</Text>
					)
				}
			</>
		)
	}

	const { tos, setTos } = useContext(FundBuilderContext)!


	return buildComponent()
}

export default ToChoose