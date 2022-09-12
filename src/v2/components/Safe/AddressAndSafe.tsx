import { Box, Button, CircularProgress, Flex, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'
import SafeSelect, { SafeSelectOption } from 'src/v2/components/Safe/SafeSelect'

interface Props {
	step: number
    safeAddress: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onPasteClick: () => void
    isVerified: boolean
    isDisabled: boolean
	isLoading: boolean
    safeAddressError?: string

	safesOptions: SafeSelectOption[]
	selectedSafe: SafeSelectOption | undefined
	onSelectedSafeChange: (e: SafeSelectOption | undefined) => void
    onContinue: () => void
}

function AddressAndSafe({ step, safeAddress, safeAddressError, onChange, onPasteClick, isVerified, isDisabled, isLoading, safesOptions, selectedSafe, onSelectedSafeChange, onContinue }: Props) {
	return (
		<Flex
			my='auto'
			direction='column'
			align='center'>
			<TextField
				label='Safe Name'
				helperText='Your safe can be used to do payouts on Questbook.'
				helperLinkText='Learn more'
				helperLinkUrl='https://www.notion.so/questbook/Connecting-your-Safe-with-Questbook-3a3be08527b54f87b9d71a7332b108ac'
				placeholder='Ethereum or Solana address'
				align='center'
				w='54%'
				value={safeAddress}
				onChange={onChange}
				onPasteClick={onPasteClick}
				isVerified={isVerified}
				isDisabled={isDisabled}
				errorText={safeAddressError}
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
						w='54%'
						mt={8}
						safesOptions={safesOptions}
						label='Safes Found'
						helperText='Associated with this address on all networks.'
						helperLinkText='Learn about supported networks'
						helperLinkUrl='https://www.notion.so/questbook/Supported-Safes-on-Questbook-20d76804bf8a4ef8a17d2e5b85d3421c'
						value={selectedSafe}
						onSafeChange={onSelectedSafeChange} />
				)
			}
			{/* <Box m='auto' /> */}
			<Button
				mt={8}
				isDisabled={!isVerified}
				onClick={onContinue}
				variant='primaryV2'>
				Continue
			</Button>
			<Text
				mt={2}
				variant='v2_body'>
				You will be asked to verify that you are an owner on the safe.
			</Text>
		</Flex>
	)
}

export default AddressAndSafe