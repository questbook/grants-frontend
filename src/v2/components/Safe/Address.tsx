import { Button, Flex, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'

interface Props {
    safeAddress: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onPasteClick: () => void
    isVerified: boolean
    isDisabled: boolean
    safeAddressError?: string
    onContinue: () => void
}

function Address({ safeAddress, safeAddressError, onChange, onPasteClick, isVerified, isDisabled, onContinue }: Props) {
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

export default Address