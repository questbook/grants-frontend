import { useContext, useMemo } from 'react'
import { WebwalletContext } from 'src/pages/_app'

export const useQuestbookAccount = () => {
	const { webwallet, scwAddress, setNonce, nonce } = useContext(WebwalletContext)!

	// const [gaslessData, setGaslessData] = useState<any>()
	const gaslessData2 = useMemo(() => {
		if(scwAddress && nonce && webwallet) {
			return {
				address: scwAddress,
				connector: {
					name: 'gasless-webwallet'
				}
			}
		}

		return undefined
	}, [webwallet, scwAddress, nonce])

	return { data: gaslessData2, nonce, setNonce }
}