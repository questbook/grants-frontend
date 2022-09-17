import { Box, Button, CircularProgress, Flex, Image, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'
import SafeSelect, { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'

import { useTranslation } from 'react-i18next'

interface Props {
	safesOptions: SafeSelectOption[]
	step: number
	safeAddress: string
	isVerified?: boolean
	safeAddressErrorText?: string
	isLoading?: boolean
	safeSelected: SafeSelectOption
	onSelectedSafeChange: (e: SafeSelectOption) => void
	setValue: (newValue: string) => void
	onContinue: () => void
	onPasteClick: () => void
}

function SafeDetails({ safesOptions, step, safeAddress, isVerified, isLoading, safeSelected, setValue, onSelectedSafeChange, onContinue, safeAddressErrorText, onPasteClick }: Props) {
	const { t } = useTranslation()
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
				{t('/onboarding/create-domain.attach_safe')}
			</Text>
			<Text
				variant='v2_metadata'
				//fontWeight='500'
				mt={6}
			>
				{t('/onboarding/create-domain.attach_safe_desc')}
			</Text>
			<Box mb='10' />
			<TextField
				label={t('/onboarding/create-domain.multisig_safe_address')}
				helperText={t('/onboarding/create-domain.multisig_safe_address_helper')}
				helperLinkText='(Tutorial)'
				helperLinkUrl='https://www.notion.so/questbook/Connecting-your-Safe-with-Questbook-3a3be08527b54f87b9d71a7332b108ac'
				placeholder='0x4ad2... / 5D4u...'
				value={safeAddress}
				onChange={(e) => setValue(e.target.value)}
				isVerified={isVerified}
				// isDisabled={step === 1}
				errorText={safeAddressErrorText}
				onPasteClick={onPasteClick}
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
							{t('/onboarding/create-domain.looking_for_safe')}
						</Text>
					</Flex>
				)
			}
			{step === 1 && <Box mt={6} />}
			{
				step === 1 && (
					<SafeSelect
						safesOptions={safesOptions}
						label={safesOptions.length == 1 ? t('/onboarding/create-domain.safe_found') : t('/onboarding/create-domain.safes_found')}
						helperText={t('/onboarding/create-domain.pick_network_helptext')}
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