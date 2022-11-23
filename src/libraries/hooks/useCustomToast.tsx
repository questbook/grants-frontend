import { useRef } from 'react'
import { Button, Flex, Image, Text, ToastId, useToast, UseToastOptions } from '@chakra-ui/react'

type Props = {
	action?: () => void
	actionText?: string
} & UseToastOptions

function useCustomToast() {
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const showToast = ({ action, actionText, ...props }: Props) => {
		toastRef.current = toast({
			render: () => {
				return (
					<Flex
						boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
						bg={BG[props.status ?? 'info']}
						direction='column'
						p={4}>
						<Flex>
							<Image
								src={`/v2/icons/${props.status === 'success' ? 'check double' : 'error warning'}.svg`}
								boxSize='20px' />
							<Flex
								align='start'
								direction='column'
								ml={4}>
								<Text fontWeight='400'>
									{props.title}
								</Text>
								{
									action && actionText && (
										<Button
											mt={2}
											color='black.1'
											fontWeight='500'
											variant='link'
											onClick={action}>
											{actionText}
										</Button>
									)
								}
							</Flex>
						</Flex>
					</Flex>
				)
			},
			position: 'top-right',
			...props
		})

		const BG = {
			'info': 'accent.columbia',
			'success': 'accent.june',
			'warning': 'accent.crayola',
			'error': 'accent.melon'
		}
	}

	return showToast
}

export default useCustomToast