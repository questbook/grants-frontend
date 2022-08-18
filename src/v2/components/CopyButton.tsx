import { Button, useToast } from '@chakra-ui/react'
import copy from 'copy-to-clipboard'

type CopyButtonProps = {
	text: string
}

export default ({ text }: CopyButtonProps) => {
	const toast = useToast()

	const copyToClipboard = () => {
		copy(text)
		toast({
			title: 'Copied!',
			status: 'success',
			duration: 3000,
			isClosable: true,
		})
	}

	return (
		<Button
			variant='ghost'
			color='#572EF5'
			size='sm'
			onClick={copyToClipboard}>
			Copy
		</Button>
	)
}