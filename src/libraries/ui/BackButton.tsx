import { Button, ButtonProps, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function BackButton(props: ButtonProps) {
	const buildComponent = () => {
		return (
			<Button
				{...props}
				variant='link'
				leftIcon={<Image src='/v2/icons/arrow left/enabled.svg' />}
				onClick={
					() => {
						router.back()
					}
				}>
				<Text variant='v2_body'>
					Back
				</Text>
			</Button>
		)
	}

	const router = useRouter()
	return buildComponent()
}

export default BackButton