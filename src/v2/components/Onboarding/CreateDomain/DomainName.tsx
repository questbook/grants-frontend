import { Box, Button, Image, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'

interface Props {
    domainName: string
    setValue: (newValue: string) => void
    isVerified: boolean
    setIsVerified: (isVerified: boolean) => void
    onContinue: () => void
}

function DomainName({ domainName, setValue, isVerified, onContinue }: Props) {
	return (
		<>
			<Text
				variant='v2_heading_3'
				fontWeight='500'>
				Give your domain a name
			</Text>
			<Box mt='auto' />
			<TextField
				label='Domain Name'
				helperText='Domain is a workspace where you can post your grants, invite members, and fund builders.'
				helperLinkText='Learn about domains'
				helperLinkUrl='https://blog.questbook.xyz/posts/delegated-domain-allocators/'
				placeholder='Ethereum Developer Relations'
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