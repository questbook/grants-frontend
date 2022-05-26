import { useEffect, useRef, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import InfoToast from 'src/components/ui/toasts/infoToast'

function useCustomToast(link: string, route?: string) {
	const toastRef = useRef<ToastId>()
	const toast = useToast()
	const router = useRouter()

	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		console.log('CUSTOM TOAST: ', refresh, link)
		if(refresh && link && !link.includes('undefined') && !link.includes('null')) {
			toastRef.current = toast({
				duration: 4000,
				position: 'top',
				render: () => {
					return (
						<InfoToast
							link={link}
							close={
								() => {
									if(toastRef.current) {
										toast.close(toastRef.current)
									}
								}
							}
						/>
					)
				},
				onCloseComplete: () => {
					console.log('Reloading page')
					if(route) {
						router.replace(route)
					} else {
						router.reload()
					}
				}
			})
		}
	}, [refresh, link])

	return { setRefresh }
}

export default useCustomToast
