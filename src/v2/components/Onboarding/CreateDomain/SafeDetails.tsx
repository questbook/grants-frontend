import { Box, Button, CircularProgress, Flex, Image, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'
import SafeSelect, { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'

interface Props {
	safesOptions: SafeSelectOption[]
	step: number
	safeAddress: string
	isPasted?: boolean
	isVerified?: boolean
	isSafeAddressError?: boolean
	safeAddressErrorText?: string
	isLoading?: boolean
	safeSelected: SafeSelectOption
	onSelectedSafeChange: (e: SafeSelectOption) => void
	setValue: (newValue: string) => void
	onContinue: () => void
}

function SafeDetails({ safesOptions, step, safeAddress, isPasted, isVerified, isLoading, safeSelected, setValue, onSelectedSafeChange, onContinue, isSafeAddressError, safeAddressErrorText }: Props) {
	return (
		<>
			<Text
				variant='v2_body'
				color='black.3'>
				Let’s begin the adventure.
			</Text>
			<Text
				variant='v2_heading_3'
				fontWeight='500'>
				Create a domain
			</Text>
			<Text
				variant='v2_body'
				fontWeight='500'
				mt={6}>
				To create a domain, you need a safe.
			</Text>
			<Box mb='10' />
			<TextField
				label='Safe Address'
				helperText='Your safe can be used to do payouts on Questbook.'
				helperLinkText='Learn more'
				helperLinkUrl='https://www.notion.so/questbook/Connecting-your-Safe-with-Questbook-3a3be08527b54f87b9d71a7332b108ac'
				placeholder='Ethereum or Solana address'
				value={safeAddress}
				onChange={(e) => setValue(e.target.value)}
				isVerified={isVerified}
				isDisabled={step === 1}
				errorText={safeAddressErrorText}
			/>
			{
				isLoading && (
					<Flex
						mt={2}
						align='center'>
						<CircularProgress
							color='violet.2'
							size='11px'
							isIndeterminate />
						<Text
							ml={2}
							variant='v2_metadata'
							color='black.3'>
							Looking up safes with this address on different networks...
						</Text>
					</Flex>
				)
			}
			{step === 1 && <Box mt={6} />}
			{
				step === 1 && (
					<SafeSelect
						safesOptions={safesOptions}
						label='Safes Found'
						helperText='Associated with this address on all networks.'
						helperLinkText='Learn about supported networks'
						helperLinkUrl='https://www.notion.so/questbook/Supported-Safes-on-Questbook-20d76804bf8a4ef8a17d2e5b85d3421c'
						value={safeSelected}
						onChange={
							(safeSelected: SafeSelectOption | undefined) => {
								if(safeSelected) {
									onSelectedSafeChange(safeSelected)
								}
							}
						} />
				)
			}
			<Box m='auto' />
			<Button
				variant='primaryV2'
				ml='auto'
				mt={6}
				rightIcon={<Image src={`/ui_icons/arrow-right-fill${!isVerified ? '-disabled' : ''}.svg`} />}
				disabled={!isVerified}
				onClick={onContinue}>
				Continue
			</Button>
		</>
	)
}

export default SafeDetails