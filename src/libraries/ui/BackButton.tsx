import { Button, ButtonProps, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

function BackButton(props: ButtonProps) {
	const buildComponent = () => {
		return (
			<Button
				variant='linkV2'
				fontWeight='500'
				leftIcon={<Image src='/v2/icons/arrow left/enabled.svg' />}
				onClick={
					() => {
						router.back()
					}
				}
				{...props}>
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