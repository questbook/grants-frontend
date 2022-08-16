import { useCallback, useContext } from 'react'
import { WebwalletContext } from '../../../pages/_app'
import { getNonce } from '../../utils/gaslessUtils'

export const useNonce = () => {
	const { webwallet, setWebwallet, nonce, setNonce, loadingNonce, setLoadingNonce } = useContext(WebwalletContext)!

	const getUseNonce = useCallback(async() => {
		console.log('rerewq', webwallet)
		const _nonce = await getNonce(webwallet)
		return _nonce
	}, [webwallet])

	// useEffect(() => {
	// 	const nonceTimeout = new Promise(r => setTimeout(r, 4000))

	// 	console.log('GOT NONCE', webwallet, nonce, loadingNonce)

	// 	if (!webwallet || loadingNonce || nonce) {
	// 		return
	// 	}

	// 	// setLoadingNonce(true)

	// 	getUseNonce()
	// 		.then(_nonce => {
	// 			console.log('GOT NONCE', _nonce)
	// 			if (!_nonce) {
	// 				setNonce(undefined)
	// 			} else {
	// 				if (_nonce === 'Token expired') {
	// 					setNonce(undefined)
	// 				} else {
	// 					setNonce(_nonce)
	// 				}
	// 			}
	// 		})


	// 	// setLoadingNonce(false)

	// }, [webwallet, nonce, loadingNonce])

	return nonce
}