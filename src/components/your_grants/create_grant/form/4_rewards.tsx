import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box,
	Flex,
	Switch,
	Text,
} from '@chakra-ui/react'
import Datepicker from 'src/components/ui/forms/datepicker'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import CustomTokenModal from 'src/components/ui/submitCustomTokenModal'
import { USD_ASSET, USD_DECIMALS } from 'src/constants/chains'
import 'react-datepicker/dist/react-datepicker.css'

function GrantRewardsInput({
	reward,
	setReward,
	rewardError,
	setRewardError,
	rewardCurrency,
	setRewardCurrency,
	setRewardCurrencyAddress,
	date,
	setDate,
	dateError,
	setDateError,
	shouldEncrypt,
	setShouldEncrypt,
	shouldEncryptReviews,
	setShouldEncryptReviews,
	isEVM,
	oldDate,
	setOldDate,
}: {
  reward: string
  setReward: (rewards: string) => void
  rewardError: boolean
  setRewardError: (rewardError: boolean) => void
  rewardCurrency: string
  setRewardCurrency: (rewardCurrency: string) => void
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void
  date: string
  setDate: (date: string) => void
  dateError: boolean
  setDateError: (dateError: boolean) => void
  shouldEncrypt: boolean
  setShouldEncrypt: (shouldEncrypt: boolean) => void
  shouldEncryptReviews: boolean
  setShouldEncryptReviews: (shouldEncryptReviews: boolean) => void
  isEVM: boolean
	oldDate: boolean
	setOldDate: (oldDate: boolean) => void
}) {
	const [isModalOpen, setIsModalOpen] = React.useState(false)
	const [supportedCurrenciesList, setSupportedCurrenciesList] = React.useState<any[]>([])

	const [isJustAddedToken, setIsJustAddedToken] = React.useState<boolean>(false)
	const addERC = false
	const showSupportedCurrencies = isEVM && supportedCurrenciesList.length > 0

	const [showDropdown, setShowDropdown] = React.useState(false)

	useEffect(() => {
		const CurrenciesList = supportedCurrenciesList.filter((currencyItem) => currencyItem.length > 0)
		setShowDropdown(CurrenciesList.length > 0)
	}, [supportedCurrenciesList])

	useEffect(() => {
		if(!showSupportedCurrencies) {
			setRewardCurrencyAddress(USD_ASSET)
		}
	}, [showSupportedCurrencies])

	const { t } = useTranslation()
	return (
		<Flex direction='column'>

			<Flex
				direction='row'
				mt={12}>
				<Box
					minW='160px'
					flex={1}>
					<SingleLineInput
						label={t('/create-grant.amount')}
						placeholder='e.g. 100'
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
						errorText='Required'
						type='number'
					/>
				</Box>
			</Flex>

			<Box mt={12} />

			<Datepicker
				onChange={
					(e) => {
						if(dateError) {
							setDateError(false)
						}

						if(oldDate) {
							setOldDate(false)
						}

						setDate(e.target.value)


						// const date = new Date()
						// if(new Date(e.target.value) <= date) {
						// 	setOldDate(true)
						// 	setDateError(true)
						// } else {
						// 	setDate(e.target.value)
						// }
					}
				}
				value={date}
				isError={dateError}
				errorText={oldDate ? 'Choose a date in the future' : 'Date is Required'}
				label={t('/create-grant.deadline')}
			/>

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
						isChecked={shouldEncrypt}
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
			</Flex>

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
						{t('/create-grant.private_review')}
					</Text>
					<Flex>
						<Text
							color='#717A7C'
							fontSize='14px'
							lineHeight='20px'>
							{t('/create-grant.private_review_desc')}
						</Text>
					</Flex>
				</Flex>
				<Flex
					justifyContent='center'
					gap={2}
					alignItems='center'>
					<Switch
						id='encryptReviews'
						isChecked={shouldEncryptReviews}
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
