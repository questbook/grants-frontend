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
	applicantData,
	safeAddress,
}: {
  step: number,
  milestoneId: string | undefined,
  setMilestoneId: (id: string) => void,
  amount: number | undefined,
  setAmount: (amount: number) => void,
	applicantData: any[],
	safeAddress: string,
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
						{safeAddress}
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
					mb={6}
				>
							To
				</Text>


				{
					applicantData.map((data, i) => (
						<>
							<Box
								fontSize='14px'
								lineHeight='20px'
								fontWeight='400'
								h='20px'
								w='20px'
								bg='#F0F0F7'
								display='flex'
								justifyContent={'center'}
								alignItems={'center'}
								mr={4}
								mb={2}
							>
								{i + 1}
							</Box>
							<Text
								fontSize='12px'
								lineHeight='16px'
								fontWeight='400'
								color='#7D7DA0'
								mt='2px'
							>
								{data?.project_name}
								{' '}
•
								{' '}
								{data?.applicantName}
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
									value={data?.applicant_address}
									errorBorderColor={'red'}
									height={'auto'}
								/>
							</Flex>

							<Box h={6} />

							<Flex alignItems={'center'}>
								<Flex
									flex={1}
									flexDirection={'column'}>

									<MilestoneSelect
										placeholder='Select from the list'
										value={undefined}
										onChange={(value) => value && setMilestoneId(value?.id)} />
								</Flex>

								<Box w={6} />

								<Flex
									flex={1}
									flexDirection={'column'}>

									<Box h={2} />
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

							<Box h={6} />
						</>
					))
				}

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