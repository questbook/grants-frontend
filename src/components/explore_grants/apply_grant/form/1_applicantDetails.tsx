import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box, Text,
} from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import SupportedChainId from 'src/generated/SupportedChainId'
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
	grantRequiredFields,
	applicantAddressError,
	setApplicantAddressError,
	safeNetwork
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
	const { workspace } = useContext(ApiClientsContext)!
	console.log('safe network', safeNetwork)
	const { t } = useTranslation()
	const chainNames = new Map<String, String>([
		["1", 'Ethereum Mainnet'],
		["5", 'Goerli Testnet'],
		["10", 'Optimism Mainnet'],
		["137", 'Polygon Mainnet'],
		["42220", 'Celo Mainnet'],
		["9001", "Solana"],
		["90001", "Solana"],
		["900001", "Solana"],
	])
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
				placeholder={((safeNetwork != "900001") && (safeNetwork != "90001")&& (safeNetwork != "9001")) ? '0xa2dD...' : '5yDU...'} //TODO : remove hardcoding of chainId
				subtext={`${t('/explore_grants/apply.your_address_on')} ${chainNames.get(safeNetwork)}`}
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

export default ApplicantDetails
