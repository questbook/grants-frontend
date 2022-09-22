import { useContext } from 'react'
import { Button, Flex, FlexProps, Image, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'src/pages/_app'
import { formatAddress } from 'src/utils/formattingUtils'

interface Props extends FlexProps {
	safeIcon: string | undefined
    safeAddress: string
    signerAddress: string
    onAddToSafeClick: () => void
    onCancelClick: () => void
}

function Confirm({ safeIcon, safeAddress, signerAddress, onAddToSafeClick, onCancelClick, ...props }: Props) {
	const { workspace } = useContext(ApiClientsContext)!

	return (
		<Flex
			direction='column'
			{...props}>
			<Text
				variant='v2_heading_3'
				fontWeight='500'>
				{workspace?.title}
			</Text>
			<Flex
				mt={3}
				align='center'>
				<Image src={safeIcon} />
				<Text
					ml={1}
					variant='v2_title'>
					{formatAddress(safeAddress)}
				</Text>
				<Text
					ml={2}
					variant='v2_metadata'
					fontWeight='500'>
					Verified owner:
					{' '}
					{formatAddress(signerAddress)}
				</Text>
				<Image
					ml={2}
					src='/ui_icons/verified-signer.svg'
					boxSize='16px' />
			</Flex>
			<Button
				variant='primaryV2'
				mt={8}
				onClick={onAddToSafeClick}>
				Add your safe
			</Button>
			<Button
				mt={4}
				variant='linkV2'
				onClick={onCancelClick}>
				Cancel
			</Button>
		</Flex>

	)
}

export default Confirm