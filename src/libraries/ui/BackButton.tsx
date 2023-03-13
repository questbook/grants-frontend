import { Button, ButtonProps, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'src/generated/icons'

function BackButton(props: ButtonProps) {
	const buildComponent = () => {
		return (
			<Button
				variant='linkV2'
				fontWeight='500'
				leftIcon={<ArrowLeft />}
				onClick={
					() => {
						router.back()
					}
				}
				{...props}>
				<Text variant='body'>
					Back
				</Text>
			</Button>
		)
	}

	const router = useRouter()
	return buildComponent()
}

export default BackButton