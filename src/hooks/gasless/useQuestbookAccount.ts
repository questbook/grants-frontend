import { useContext, useEffect, useState } from 'react'
import { NonceContext, ScwAddressContext, WebwalletContext } from '../../../pages/_app'

export const useQuestbookAccount = () => {
	const { webwallet, setWebwallet } = useContext(WebwalletContext)!
	const { scwAddress, setScwAddress } = useContext(ScwAddressContext)!
	const { nonce, setNonce } = useContext(NonceContext)!

	const [gaslessData, setGaslessData] = useState<any>()
	// const { data: accountData } = useAccount()
	// const { data: connectData, isConnecting, isConnected, isReconnecting, isError, connect, connectors } = useConnect()

	// useEffect(() => {
	// 	console.log('Changed nonce: ', nonce)
	// }, [nonce])

	useEffect(() => {
		// console.log('HYY', nonce, webwallet, scwAddress)
		if(nonce && webwallet && scwAddress && !gaslessData) {
			setGaslessData({
				address: scwAddress,
				connector: {
					name: 'gasless-webwallet'
				}
			})
		}
		// else if((!isConnecting || !isReconnecting) && connectData && isConnected){
		//     setGaslessData(accountData);
		// }
	}, [nonce, webwallet, scwAddress, gaslessData])

	return { data: gaslessData, nonce, setNonce }
}