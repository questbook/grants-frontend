import { useContext, useMemo } from 'react'
import { WebwalletContext } from '../../../pages/_app'
import { useNonce } from './useNonce'

export const useQuestbookAccount = (shouldRefreshNonce?: boolean) => {
	const { webwallet, scwAddress, setNonce } = useContext(WebwalletContext)!
	const nonce = useNonce(shouldRefreshNonce)

	// const [gaslessData, setGaslessData] = useState<any>()
	const gaslessData2 = useMemo(() => {
		console.log('new p', webwallet, scwAddress, nonce)
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
	// const gaslessData3 = {
	// 	address: "0x9C910261B77bEeaa84289D098EbD309Ec748E9EF",
	// 	connector: {
	// 		name: 'gasless-webwallet'
	// 	}
	// }

	// const { data: accountData } = useAccount()
	// const { data: connectData, isConnecting, isConnected, isReconnecting, isError, connect, connectors } = useConnect()

	// useEffect(() => {
	// 	console.log('Changed nonce: ', nonce)
	// }, [nonce])

	// useEffect(() => {
	// 	console.log("fdfdfdfd", gaslessData)
	// 	// console.log('HYY', nonce, webwallet, scwAddress)
	// 	if(nonce && webwallet && scwAddress && !gaslessData) {
	// 		setGaslessData({
	// 			address: scwAddress,
	// 			connector: {
	// 				name: 'gasless-webwallet'
	// 			}
	// 		})
	// 	}
	// 	// else if((!isConnecting || !isReconnecting) && connectData && isConnected){
	// 	//     setGaslessData(accountData);
	// 	// }
	// }, [nonce, webwallet, scwAddress])

	return { data: gaslessData2, nonce, setNonce }
}