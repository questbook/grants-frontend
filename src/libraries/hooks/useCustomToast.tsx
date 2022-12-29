import { useRef } from 'react'
import { AlertStatus, Button, Flex, Image, Text, ToastId, useToast, UseToastOptions } from '@chakra-ui/react'

type Props = {
	action?: () => void
	actionText?: string
	status: AlertStatus | 'loading'
} & UseToastOptions

function useCustomToast() {
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const showToast = ({ action, actionText, status, ...props }: Props) => {
		toast.closeAll()
		return toastRef.current = toast({
			render: () => {
				return (
					<Flex
						boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
						bg={BG[status ?? 'info']}
						direction='column'
						p={4}>
						<Flex>
							{
								props.title === 'Linking your multisig' ? (
									<Image
										className='loader'
										src='/ui_icons/loader.svg'
										color='black.1'
									/>
								) : (
									<Image
										src={`/v2/icons/${status === 'success' ? 'check double' : 'error warning'}.svg`}
										boxSize='20px' />
								)
							}
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
											bg={BG[status ?? 'info']}
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
	}

	const BG = {
		'info': 'accent.columbia',
		'success': 'accent.june',
		'warning': 'accent.crayola',
		'error': 'accent.melon',
		'loading': 'black.1'
	}

	return showToast
}

export default useCustomToast