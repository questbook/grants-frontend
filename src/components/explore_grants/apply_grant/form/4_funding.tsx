import React from 'react'
import {
	Box, } from '@chakra-ui/react'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'

function Funding({
	fundingBreakdown,
	setFundingBreakdown,
	fundingBreakdownError,
	setFundingBreakdownError,

	rewardAmount,
	rewardCurrency,
	rewardCurrencyCoin,

	grantRequiredFields,

	totalMilestoneReward,
}: {
  fundingBreakdown: string
  setFundingBreakdown: (fundingBreakdown: string) => void
  fundingBreakdownError: boolean
  setFundingBreakdownError: (fundingBreakdownError: boolean) => void

  rewardAmount: string
  rewardCurrency: string
  rewardCurrencyCoin: string

  grantRequiredFields: string[]

	totalMilestoneReward: number
}) {

	const totalFundingSubtext = [
		`Maximum reward for the grant is ${rewardAmount} ${rewardCurrency}.`,
		`Your total funding ask is within the grant reward (${rewardAmount} ${rewardCurrency}).`,
		`Your total funding ask is more than grant reward (${rewardAmount} ${rewardCurrency}).`
	]

	return (
		<>
			{
				totalMilestoneReward === 0 ? (
					<SingleLineInput
						key='lol'
						label='Total funding ask'
						value={undefined}
						placeholder={rewardAmount}
						disabled
						onChange={() => {}}
						type='number'
						subtext={totalMilestoneReward === 0 ? totalFundingSubtext[0] : totalMilestoneReward < parseInt(rewardAmount) ? totalFundingSubtext[1] : totalFundingSubtext[2]}
					/>
				) : (
					<SingleLineInput
						key='lol1'
						label='Total funding ask'
						value={totalMilestoneReward.toString()}
						placeholder={rewardAmount}
						disabled
						onChange={() => {}}
						type='number'
						subtext={totalMilestoneReward === 0 ? totalFundingSubtext[0] : totalMilestoneReward < parseInt(rewardAmount) ? totalFundingSubtext[1] : totalFundingSubtext[2]}
					/>
				)
			}


			{/* <Text
				fontWeight='700'
				fontSize='16px'
				lineHeight='20px'
				color='#8850EA'>
				Funding & Budget Breakdown
				<Tooltip
					icon='/ui_icons/tooltip_questionmark_brand.svg'
					label='How much funding in total would you need and explain how you would spend the money if your application is accepted.'
					placement='bottom-start'
				/>
			</Text>

			<Box mt={8} />

			<Flex
				direction='row'
				alignItems='flex-start'
				mt='24px'>
				<Image
					ml='auto'
					h='45px'
					w='45px'
					src={rewardCurrencyCoin}
					fallbackSrc='/images/dummy/Ethereum Icon.svg' />
				<Flex
					flex={1}
					direction='column'
					ml={3}>
					<Text fontWeight='500'>
						Grant Reward
					</Text>
					<Text
						mt='1px'
						lineHeight='20px'
						fontSize='14px'
						fontWeight='400'>
						{`${rewardAmount} ${rewardCurrency}`}
						{' '}
						≈ 2500 USD
					</Text>
				</Flex>
			</Flex>

			<Box mt={8} />

			<Flex
				alignItems='flex-start'
				display={grantRequiredFields.includes('fundingBreakdown') ? 'flex' : 'none'}>
				<Box
					minW='160px'
					flex={1}>
					<SingleLineInput
						label='Funding Ask'
						placeholder='100'
						value={fundingAsk}
						onChange={
							(e) => {
								// console.log(e.target.value)
								if(fundingAskError) {
									setFundingAskError(false)
								}

								setFundingAsk(e.target.value)
							}
						}
						isError={fundingAskError}
						errorText='Required'
						type='number'
					/>
				</Box>
				<Box
					mt={5}
					ml={4}
					minW='132px'
					flex={0}>
					<Dropdown
						listItemsMinWidth='132px'
						listItems={
							[
								{
									icon: rewardCurrencyCoin,
									label: rewardCurrency,
								},
							]
						}
					/>
				</Box>
			</Flex> */}

			<Box mt={8} />

			<MultiLineInput
				placeholder='Write about how you plan to use the funds for your project - hiring, marketing etc.'
				label='Funding Breakdown'
				maxLength={1000}
				value={fundingBreakdown}
				onChange={
					(e) => {
						if(fundingBreakdownError) {
							setFundingBreakdownError(false)
						}

						setFundingBreakdown(e.target.value)
					}
				}
				isError={fundingBreakdownError}
				errorText='Required'
				tooltip='Details on how the project will use funding to achieve goals..'
				visible={grantRequiredFields.includes('fundingBreakdown')}
			/>
		</>
	)
}

export default Funding
