import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { ArrowDownCircle } from 'src/v2/assets/custom chakra icons/Arrows/ArrowDownCircle'
import { ExternalLink } from 'src/v2/assets/custom chakra icons/ExternalLink'
import AlertBanner from './AlertBanner'
import MilestoneSelect from './MilestoneSelect'

const RecipientDetails = ({
	step,
	milestoneId,
	setMilestoneId,
	amount,
	setAmount,
}: {
  step: number,
  milestoneId: string | undefined,
  setMilestoneId: (id: string) => void,
  amount: number | undefined,
  setAmount: (amount: number) => void,
}) => {
	return (
		<>
			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'
			>
				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
							From
				</Text>

				<Flex
					alignItems={'baseline'}
					mt={2}
				>
					<Text
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
									0x0CF4b49b4cdE2Cf4BE5dA09B8Fc5570D2c422027
					</Text>

					<ExternalLink
						ml={1}
						h={'12px'}
						w={'12px'}
						cursor='pointer'
					/>
				</Flex>

			</Flex>

			<Flex
				bg='white'
				mx='auto'
				mt='-10px'
			>
				<ArrowDownCircle
					color='#785EF0'
					h="28px"
					w='28px'
				/>
			</Flex>


			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'
			>
				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
							To
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
							Summer NFT Bootcamp on Polygon • Ryan Adams
				</Text>


				<Flex
					alignItems={'baseline'}
					mt={2}
				>
					<Input
						variant={'brandFlushed'}
						placeholder={'DAO Name'}
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight={'500'}
						fontSize='14px'
						value={'0x0CF4b49b4cdE2Cf4BE5dA09B8Fc5570D2c422027'}
						errorBorderColor={'red'}
						height={'auto'}
					/>
				</Flex>

				<Box h={6} />

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
							Milestone
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
							On milestone completion funds are sent as a reward.
				</Text>

				<Box h={2} />

				<MilestoneSelect
					placeholder='Select from the list'
					value={undefined}
					onChange={(value) => value && setMilestoneId(value?.id)} />

				<Box h={6} />

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
							Amount (in USD)
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
							Balance: 1000 USD
				</Text>


				<Flex
					alignItems={'baseline'}
					mt={2}
				>
					<Input
						variant={'brandFlushed'}
						placeholder={'Amount'}
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight={'500'}
						fontSize='14px'
						value={amount}
						errorBorderColor={'red'}
						height={'auto'}
						type={'number'}
						onChange={(e) => setAmount(parseInt(e.target.value))}
					/>
				</Flex>

			</Flex>

			<AlertBanner
				message={
					<Text>
								Next, you will asked be to confirm that you are an owner on the safe. Only safe owners are allowed to send funds.
					</Text>
				}
				type='infoSendFunds'
			/>
		</>
	)
}

export default RecipientDetails