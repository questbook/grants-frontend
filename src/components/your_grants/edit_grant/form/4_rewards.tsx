import React, { useEffect } from 'react'
import {
	Box,
	Flex,
	Switch,
	Text,
} from '@chakra-ui/react'
import { Token } from '@questbook/service-validator-client'
import Datepicker from 'src/components/ui/forms/datepicker'
import Dropdown from 'src/components/ui/forms/dropdown'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import CustomTokenModal from 'src/components/ui/submitCustomTokenModal'
import { extractDate } from 'src/utils/formattingUtils'
import 'react-datepicker/dist/react-datepicker.css'

function GrantRewardsInput({
	reward,
	setReward,
	rewardError,
	setRewardError,
	setRewardToken,
	rewardCurrency,
	setRewardCurrency,
	setRewardCurrencyAddress,
	date,
	setDate,
	dateError,
	setDateError,
	supportedCurrencies,
	shouldEncrypt,
	setShouldEncrypt,
	defaultShouldEncrypt,
	defaultShouldEncryptReviews,
	shouldEncryptReviews,
	setShouldEncryptReviews,
	isEVM
}: {
  reward: string
  setReward: (rewards: string) => void
  rewardError: boolean
  setRewardError: (rewardError: boolean) => void
  setRewardToken: (rewardToken: Token) => void
  rewardCurrency: string
  setRewardCurrency: (rewardCurrency: string) => void
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void
  date: string
  setDate: (date: string) => void
  dateError: boolean
  setDateError: (dateError: boolean) => void
  supportedCurrencies: any[]
  shouldEncrypt: boolean
  setShouldEncrypt: (shouldEncrypt: boolean) => void
  defaultShouldEncrypt: boolean
  defaultShouldEncryptReviews: boolean
  shouldEncryptReviews: boolean
  setShouldEncryptReviews: (shouldEncryptReviews: boolean) => void
  isEVM: boolean
}) {
	const [isModalOpen, setIsModalOpen] = React.useState(false)
	const [supportedCurrenciesList, setSupportedCurrenciesList] = React.useState<any[]>([])

	useEffect(() => {
		if(supportedCurrencies && supportedCurrencies.length > 0) {
			setSupportedCurrenciesList(supportedCurrencies)
		}
	}, [supportedCurrencies])

	const [isJustAddedToken, setIsJustAddedToken] = React.useState<boolean>(false)
	const addERC = true
	return (
		<Flex direction='column'>

			<Flex
				direction='row'
				mt={12}>
				<Box
					minW='160px'
					flex={1}>
					<SingleLineInput
						label='Grant Reward (In USD)'
						placeholder='100'
						errorText='Required'
						onChange={
							(e) => {
								if(rewardError) {
									setRewardError(false)
								}

								setReward(e.target.value)
							}
						}
						value={reward}
						isError={rewardError}
						type='number'
					/>
				</Box>
				{/* <CustomTokenModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					setRewardCurrency={setRewardCurrency}
					setRewardCurrencyAddress={setRewardCurrencyAddress}
					setRewardToken={setRewardToken}
					supportedCurrenciesList={supportedCurrenciesList}
					setSupportedCurrenciesList={setSupportedCurrenciesList}
					setIsJustAddedToken={setIsJustAddedToken}
				/>
				<Box
					mt={5}
					ml={4}
					minW='132px'
					flex={0}
					alignSelf='center'>
					{
						isEVM ? (
							<Dropdown
								listItemsMinWidth='132px'
								listItems={supportedCurrenciesList}
								value={rewardCurrency}
								onChange={
									(data: any) => {
										// console.log('tokenDATA', data)
										if(data === 'addERCToken') {
											setIsModalOpen(true)
										}

										setRewardCurrency(data.label)
										setRewardCurrencyAddress(data.id)
										if(data !== 'addERCToken' && !isJustAddedToken && data.icon.lastIndexOf('chain_assets') === -1) {
											// console.log('custom token', data)
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
						) : (
							<Dropdown
								listItemsMinWidth='132px'
								listItems={
									[
										{
											icon: '',
											label: 'USD',
										},
									]
								}
							/>
						)
					}
				</Box> */}
			</Flex>

			<Box mt={12} />

			<Datepicker
				onChange={
					(e) => {
						if(dateError) {
							setDateError(false)
						}

						setDate(e.target.value)
					}
				}
				value={extractDate(date)}
				isError={dateError}
				errorText='Required'
				label='Grant Deadline'
				tooltip='This is the last date on/before which grantees can apply'
			/>

			<Flex
				direction='column'
				mt={12}>
				<Text
					fontSize='18px'
					fontWeight='700'
					lineHeight='26px'
					letterSpacing={0}
				>
					Grant privacy
				</Text>
			</Flex>

			{/* <Flex
				mt={8}
				gap='2'
				justifyContent='space-between'>
				<Flex direction='column'>
					<Text
						color='#122224'
						fontWeight='bold'
						fontSize='16px'
						lineHeight='20px'
					>
						Hide applicant personal data (email, and about team)
					</Text>
					<Flex>
						<Text
							color='#717A7C'
							fontSize='14px'
							lineHeight='20px'>
							{
								shouldEncrypt
									? 'The applicant data will be visible only to DAO members.'
									: 'The applicant data will be visible to everyone with the link.'
							}
						</Text>
					</Flex>
				</Flex>
				<Flex
					justifyContent='center'
					gap={2}
					alignItems='center'>
					<Switch
						id='encrypt'
						defaultChecked={defaultShouldEncrypt}
						onChange={
							(e) => {
								setShouldEncrypt(e.target.checked)
							}
						}
					/>
					<Text
						fontSize='12px'
						fontWeight='bold'
						lineHeight='16px'>
						{`${shouldEncrypt ? 'YES' : 'NO'}`}
					</Text>
				</Flex>
			</Flex> */}

			<Flex
				mt={8}
				gap='2'
				justifyContent='space-between'>
				<Flex direction='column'>
					<Text
						color='#122224'
						fontWeight='bold'
						fontSize='16px'
						lineHeight='20px'
					>
						Keep applicant reviews private
					</Text>
					<Flex>
						<Text
							color='#717A7C'
							fontSize='14px'
							lineHeight='20px'>
							Private review is only visible to reviewers, DAO members.
						</Text>
					</Flex>
				</Flex>
				<Flex
					justifyContent='center'
					gap={2}
					alignItems='center'>
					<Switch
						id='encrypt'
						defaultChecked={defaultShouldEncryptReviews}
						onChange={
							(e) => {
								setShouldEncryptReviews(e.target.checked)
							}
						}
					/>
					<Text
						fontSize='12px'
						fontWeight='bold'
						lineHeight='16px'>
						{`${shouldEncryptReviews ? 'YES' : 'NO'}`}
					</Text>
				</Flex>
			</Flex>

		</Flex>
	)
}

export default GrantRewardsInput
