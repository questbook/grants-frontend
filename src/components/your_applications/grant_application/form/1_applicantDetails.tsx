import React, { useContext } from 'react'
import {
	Box, Text,
} from '@chakra-ui/react'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { isValidEthereumAddress } from 'src/utils/validationUtils'

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
	applicantAddressError,
	setApplicantAddressError,
	readOnly,
	grantRequiredFields,
}: {
  applicantName: string
  setApplicantName: (applicantName: string) => void
  applicantEmail: string
  setApplicantEmail: (applicantEmail: string) => void
  applicantAddress: string
  setApplicantAddress: (applicantAddress: string) => void
  applicantNameError: boolean
  setApplicantNameError: (applicantNameError: boolean) => void
  applicantEmailError: boolean
  setApplicantEmailError: (applicantEmailError: boolean) => void
  applicantAddressError: boolean
  setApplicantAddressError: (applicantAddressError: boolean) => void
  readOnly?: boolean
  grantRequiredFields: string[]
}) {
	const { workspace } = useContext(ApiClientsContext)!
	return (
		<>
			<Text
				fontWeight='700'
				fontSize='16px'
				lineHeight='20px'
				color='#8850EA'>
				Applicant Details
			</Text>
			<Box mt={6} />
			<SingleLineInput
				label='Applicant Name'
				placeholder='Nouns DAO'
				subtext='Full names are preferred.'
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
				disabled={readOnly}
				visible={grantRequiredFields.includes('applicantName')}
			/>
			<Box mt={6} />
			<SingleLineInput
				label='Applicant Email'
				placeholder='name@sample.com'
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
				disabled={readOnly}
				visible={grantRequiredFields.includes('applicantEmail')}
				type='email'
			/>
			<Box mt={6} />
			<SingleLineInput
				label='Applicant Address'
				placeholder={isValidEthereumAddress(workspace?.safe?.address ?? '') ? 'Ethereum Address' : 'Solana Address'}
				subtext='Your wallet address where you would like to receive funds'
				onChange={
					(e) => {
						if(applicantAddress) {
							 setApplicantAddressError(false)
						}

						setApplicantAddress(e.target.value)
					}
				}
				isError={applicantAddressError}
				errorText='Required'
				value={applicantAddress}
				visible={grantRequiredFields.includes('applicantAddress')}
			/>
		</>
	)
}

ApplicantDetails.defaultProps = {
	readOnly: false,
}
export default ApplicantDetails
