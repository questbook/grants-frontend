import { useRef } from 'react'
import { Button, Flex, Image, Text, ToastId, useToast } from '@chakra-ui/react'

interface Props {
    type: 'info' | 'success' | 'warning' | 'error'
    prompt: string
    action?: () => void
    actionText?: string
}

function useCustomToast({ type, prompt, action, actionText }: Props) {
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const showToast = (bg: string) => {
		toastRef.current = toast({
			position: 'top',
			render: () => {
				return (
					<Flex
						boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
						bg={bg}
						direction='column'
						p={4}>
						<Flex>
							<Image
								src={`/v2/icons/${type === 'success' ? 'check double' : 'error warning'}.svg`}
								boxSize='20px' />
							<Flex
								align='start'
								direction='column'
								ml={4}>
								<Text fontWeight='400'>
									{prompt}
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
			}
		})
	}

	const showInfoToast = () => {
		showToast('accent.columbia')
	}

	const showSuccessToast = () => {
		showToast('accent.june')
	}

	const showWarningToast = () => {
		showToast('accent.crayola')
	}

	const showErrorToast = () => {
		showToast('accent.melon')
	}

	return { toastRef, showInfoToast, showSuccessToast, showWarningToast, showErrorToast }
}

export default useCustomToast