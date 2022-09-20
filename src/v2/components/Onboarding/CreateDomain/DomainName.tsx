import { useTranslation } from 'react-i18next'
import { Button, Image, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'

interface Props {
    domainName: string
    setValue: (newValue: string) => void
    isVerified: boolean
    setIsVerified: (isVerified: boolean) => void
    onContinue: () => void
}

function DomainName({ domainName, setValue, isVerified, onContinue }: Props) {
	const { t } = useTranslation()
	return (
		<>
			<Text
				variant='v2_heading_3'
				fontWeight='500'>
				{t('/onboarding/create-domain.program_name_title')}
			</Text>
			<TextField
				mt={6}
				label={t('/onboarding/create-domain.program_name')}
				helperText={t('/onboarding/create-domain.program_name_helper')}
				placeholder={t('/onboarding/create-domain.program_name_placeholder')}
				value={domainName}
				onChange={(e) => setValue(e.target.value)}
				// setValue={setValue}
				isVerified={isVerified}
				maxLength={30} />
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

export default DomainName