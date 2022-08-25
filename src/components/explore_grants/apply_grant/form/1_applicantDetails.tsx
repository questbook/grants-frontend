import React from 'react'
import {
	Box, Text,
} from '@chakra-ui/react'
import SingleLineInput from '../../../ui/forms/singleLineInput'

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
}: {
  applicantName: string;
  setApplicantName: (applicantName: string) => void;
  applicantEmail: string;
  setApplicantEmail: (applicantEmail: string) => void;
  applicantNameError: boolean;
  applicantAddress: string;
  setApplicantAddress: (applicantAddress: string) => void;
  setApplicantNameError: (applicantNameError: boolean) => void;
  applicantEmailError: boolean;
  setApplicantEmailError: (applicantEmailError: boolean) => void;
  applicantAddressError: boolean;
  setApplicantAddressError: (applicantAddressError: boolean) => void;
  grantRequiredFields: string[];
}) {
	return (
		<>
			<Text
				fontWeight="700"
				fontSize="16px"
				lineHeight="20px"
				color="#8850EA">
        Applicant Details
			</Text>
			<Box mt={6} />
			<SingleLineInput
				label="Applicant Name"
				placeholder="John Doe"
				subtext="Full names are preferred."
				onChange={
					(e) => {
						if(applicantNameError) {
							setApplicantNameError(false)
						}

						setApplicantName(e.target.value)
					}
				}
				isError={applicantNameError}
				errorText="Required"
				value={applicantName}
				visible={grantRequiredFields.includes('applicantName')}
			/>
			<Box mt={6} />
			<SingleLineInput
				label="Applicant Email"
				placeholder="name@sample.com"
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
				errorText="Required"
				visible={grantRequiredFields.includes('applicantEmail')}
				type="email"
			/>
			<Box mt={6} />
			<SingleLineInput
				label="Applicant Address"
				placeholder="0xF6C42302bC230BBA9c5379dDFb33ca72409E1624"
				subtext="Your wallet address where you would like to receive funds"
				onChange={
					(e) => {
						if(applicantAddress) {
							 setApplicantAddressError(false)
						}

						setApplicantAddress(e.target.value)
					}
				}
				isError={applicantAddressError}
				errorText="Required"
				value={applicantAddress}
				visible={grantRequiredFields.includes('applicantAddress')}
			/>
		</>
	)
}

export default ApplicantDetails
