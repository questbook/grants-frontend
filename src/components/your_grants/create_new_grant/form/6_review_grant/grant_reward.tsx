import React, { useEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import Datepicker from 'src/components/ui/formsV2/datepicker'
import Dropdown from 'src/components/ui/formsV2/dropdown'
import SingleLineInput from 'src/components/ui/formsV2/singleLineInput'
import CustomTokenModal from 'src/components/ui/submitCustomTokenModal'

function ReviewGrantReward({
	supportedCurrencies,
	reward,
	setReward,
	rewardError,
	setRewardError,
	rewardCurrency,
	setRewardCurrency,
	setRewardCurrencyAddress,
	setRewardToken,
	dateError,
	setDateError,
	date,
	setDate,
}) {
	const [isModalOpen, setIsModalOpen] = React.useState(false)
	const [oldDate, setOldDate] = React.useState(false)
	const [supportedCurrenciesList, setSupportedCurrenciesList] = React.useState<any[]>([])

	useEffect(() => {
		if(supportedCurrencies && supportedCurrencies.length > 0) {
			setSupportedCurrenciesList(supportedCurrencies)
		}
	}, [supportedCurrencies])

	const [isJustAddedToken, setIsJustAddedToken] = React.useState<boolean>(false)
	const addERC = true
	return (
		<Flex
			direction="column"
			bg={'white'}
			paddingTop={'28px'}
			paddingBottom={'28px'}
			paddingLeft={'32px'}
			paddingRight={'32px'}
			borderRadius={'4px'}
			mt={12}>

			<Box
			>
				<Text
					fontSize={'20px'}
					fontWeight={'500'}
					mb={'8px'}>
					Grant reward & deadline
				</Text>
				<Text
					fontSize={'14px'}
					color={'#7D7DA0'}
					mb={'24px'}>
					Applicants can see these details, and encourages them to apply.
				</Text>
				<Text
					fontWeight={'500'}
					mb={'4px'}>
					Reward
				</Text>
				<Text
					fontSize={'12px'}
					color={'#7D7DA0'}
					mb={'8px'}>
					Maximum amount each grantee can get
				</Text>
				<SingleLineInput
					placeholder="Type the amount in USD ($)"
					value={reward}
					onChange={
						(e) => {
							if(rewardError) {
								setRewardError(false)
							}

							setReward(e.target.value)
						}
					}
					isError={rewardError}
					errorText="Required"
					type="number"
				/>
				<CustomTokenModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					setRewardCurrency={setRewardCurrency}
					setRewardCurrencyAddress={setRewardCurrencyAddress}
					setRewardToken={setRewardToken}
					supportedCurrenciesList={supportedCurrenciesList}
					setSupportedCurrenciesList={setSupportedCurrenciesList}
					setIsJustAddedToken={setIsJustAddedToken}
				/>
				<Text
					fontWeight={'500'}
					mt={'24px'}
					mb={'4px'}>
					Payout token
				</Text>
				<Text
					fontSize={'12px'}
					color={'#7D7DA0'}
					mb={'8px'}>
					Token in which grantee will be paid.
				</Text>
				<Box>
					<Dropdown
						listItemsMinWidth="132px"
						listItems={supportedCurrenciesList}
						value={rewardCurrency}
						// eslint-disable-next-line react/no-unstable-nested-components
						onChange={
							(data: any) => {
								if(data === 'addERCToken') {
									setIsModalOpen(true)
								}

								setRewardCurrency(data.label)
								setRewardCurrencyAddress(data.id)
								if(data !== 'addERCToken' && !isJustAddedToken && data.icon.lastIndexOf('chain_assets') === -1) {
									// console.log('On selecting reward', data)
									setRewardToken({
										iconHash: data.icon.substring(data.icon.lastIndexOf('=') + 1),
										address: data.address,
										label: data.label,
										decimal: data.decimals.toString(),
									})
								} else {
									setRewardToken({
										label: '',
										address: '',
										decimal: '18',
										iconHash: '',
									})
								}
							}
						}
						addERC={addERC}
					/>
				</Box>
			</Box>


			<Text
				fontWeight={'500'}
				mt={'24px'}
				mb={'4px'}>
				Deadline
			</Text>
			<Text
				fontSize={'12px'}
				color={'#7D7DA0'}
				mb={'8px'}>
				Applicants cannot apply for the grant post deadline.
			</Text>
			<Datepicker
				onChange={
					(e) => {
						if(dateError) {
							setDateError(false)
						}

						const date = new Date()
						if(new Date(e.target.value) <= date) {
							setOldDate(true)
							setDateError(true)
						} else {
							setDate(e.target.value)
						}
					}
				}
				value={date}
				isError={dateError}
				errorText={oldDate ? 'Choose a date in the future' : 'Date is Required'}
			/>

		</Flex>
	)
}

export default ReviewGrantReward