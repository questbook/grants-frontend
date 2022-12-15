import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box, Text,
} from '@chakra-ui/react'
import { logger } from 'ethers'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import { resolveApplicantAddress } from 'src/utils/applicantAddressUtils'
import { chainNames } from 'src/utils/chainNames'
import { isValidEthereumAddress, isValidSolanaAddress } from 'src/utils/validationUtils'

function ApplicantDetails({
	applicantName,
	setApplicantName,
	applicantEmail,
	setApplicantEmail,
	applicantAddress,
	setApplicantAddress,
	applicantNameError,
	setApplicantNameError,
	applicantEmailError,
	setApplicantEmailError,
	grantRequiredFields,
	applicantAddressError,
	setApplicantAddressError,
	safeNetwork,
}: {
  applicantName: string
  setApplicantName: (applicantName: string) => void
  applicantEmail: string
  setApplicantEmail: (applicantEmail: string) => void
  applicantNameError: boolean
  applicantAddress: string
  setApplicantAddress: (applicantAddress: string) => void
  setApplicantNameError: (applicantNameError: boolean) => void
  applicantEmailError: boolean
  setApplicantEmailError: (applicantEmailError: boolean) => void
  applicantAddressError: boolean
  setApplicantAddressError: (applicantAddressError: boolean) => void
  grantRequiredFields: string[]
  safeNetwork: string
}) {
	const { t } = useTranslation()
	const { safeObj } = useSafeContext()
	const isEvm = safeObj?.getIsEvm()

	useEffect(() => {
		logger.info('safeObj', safeObj, isEvm, chainNames.get(safeObj?.chainId?.toString()))
	}, [safeObj])

	return (
		<>
			<Text
				fontWeight='700'
				fontSize='16px'
				lineHeight='20px'
				color='#8850EA'>
				{t('/explore_grants/apply.proposer_details')}
			</Text>
			<Box mt={6} />
			<SingleLineInput
				label={t('/explore_grants/apply.name')}
				onChange={
					(e) => {
						if(applicantNameError) {
							setApplicantNameError(false)
						}

						setApplicantName(e.target.value)
					}
				}
				isError={applicantNameError}
				errorText='Required'
				value={applicantName}
				visible={grantRequiredFields.includes('applicantName')}
			/>
			<Box mt={6} />
			<SingleLineInput
				label={t('/explore_grants/apply.email')}
				value={applicantEmail}
				onChange={
					(e) => {
						if(applicantEmailError) {
							setApplicantEmailError(false)
						}

						setApplicantEmail(e.target.value)
					}
				}
				isError={applicantEmailError}
				errorText='Required'
				visible={grantRequiredFields.includes('applicantEmail')}
				type='email'
			/>
			<Box mt={6} />
			<SingleLineInput
				label={t('/explore_grants/apply.address')}
				tooltip={
					<div>
						<ol>
							<li>
								Wallet address on the specified network
							</li>
							<li>
								Unstoppable Domain on the specified network
							</li>
							<li>
								IDriss email, phone number or Twitter handle
							</li>
						</ol>
					</div>
				}
				placeholder={isEvm === undefined || isEvm ? '0xa2dD...' : '5yDU...' } //TODO : remove hardcoding of chainId
				subtext={`${t('/explore_grants/apply.your_address_on')} ${safeObj?.chainId ? chainNames.get(safeObj?.chainId?.toString()) : 'EVM based chain'}`}
				onChange={
					async(e) => {
						setApplicantAddressError(false)
						setApplicantAddress(e.target.value)

						let safeAddressValid = false
						let resolvedAddress = false
						const response = await resolveApplicantAddress(safeObj, e.target.value) as any
						if(response) {
							const keys = Object.keys(response)
							for(const key of keys) {
								if(response[key]) {
									resolvedAddress = true
									setApplicantAddressError(false)
									setApplicantAddress(response[key])
								}
							}
						}

						// Will be removed when safe would be made optional
						if(isEvm === undefined) {
							setApplicantAddressError(false)
						} else if(isEvm && !resolvedAddress) {
							safeAddressValid = isValidEthereumAddress(e.target.value)
							setApplicantAddressError(!safeAddressValid)
						} else if(!isEvm && !resolvedAddress) {
							safeAddressValid = isValidSolanaAddress(e.target.value)
							setApplicantAddressError(!safeAddressValid)
						} else if(!resolvedAddress) {
							setApplicantAddressError(true)
						}
					}
				}
				isError={applicantAddressError}
				errorText={t('/explore_grants/apply.invalid_address_on_chain').replace('%CHAIN', chainNames?.get(safeNetwork) !== undefined ? chainNames.get(safeNetwork)!.toString() : 'EVM based chain')}
				value={applicantAddress}
				visible={grantRequiredFields.includes('applicantAddress')}
			/>
		</>
	)
}

export default ApplicantDetails
