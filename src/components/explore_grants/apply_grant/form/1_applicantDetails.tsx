import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box, Text,
} from '@chakra-ui/react'
import { logger } from 'ethers'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import { useSafeContext } from 'src/contexts/safeContext'
import { chainNames } from 'src/utils/chainNames'
import { isValidEthereumAddress, isValidSolanaAddress } from 'src/utils/validationUtils'
import { defaultChainId } from 'src/constants/chains'

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
	resolvedDomain,
	resolvedDomainError,
	resolvedDomainErrorMessage
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
  resolvedDomain: string
  resolvedDomainError: boolean
  resolvedDomainErrorMessage: string
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
				placeholder={isEvm ? '0xa2dD...' : '5yDU...' } //TODO : remove hardcoding of chainId
				subtext={resolvedDomain ? `Unstoppable domain found with owner ${resolvedDomain}` : `${t('/explore_grants/apply.your_address_on')} ${chainNames.get(safeObj?.chainId?.toString())}`}
				onChange={
					async(e) => {
						setApplicantAddress(e.target.value)
						let safeAddressValid = false
						if(isEvm) {
							safeAddressValid = await isValidEthereumAddress(e.target.value)
							setApplicantAddressError(!safeAddressValid)
						} else {
							safeAddressValid = await isValidSolanaAddress(e.target.value)
							setApplicantAddressError(!safeAddressValid)
						}

						// console.log('safe address', e.target.value, safeAddressValid)
					}
				}
				isError={applicantAddressError && resolvedDomainError}
				errorText={resolvedDomainErrorMessage ? resolvedDomainErrorMessage : t('/explore_grants/apply.invalid_address_on_chain').replace('%CHAIN', chainNames.get(safeNetwork)?.toString() ?? defaultChainId.toString())}
				value={applicantAddress}
				visible={grantRequiredFields.includes('applicantAddress')}
			/>
		</>
	)
}

export default ApplicantDetails
