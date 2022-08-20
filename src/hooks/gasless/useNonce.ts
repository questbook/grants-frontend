import { useCallback, useContext, useEffect } from 'react'
import { WebwalletContext } from '../../../pages/_app'
import { getNonce } from '../../utils/gaslessUtils'

export const useNonce = (shouldRefreshNonce?: boolean) => {
	const { webwallet, setWebwallet, nonce, setNonce, loadingNonce, setLoadingNonce } = useContext(WebwalletContext)!

	const getUseNonce = useCallback(async() => {
		console.log('rerewq', webwallet)
		const _nonce = await getNonce(webwallet)
		return _nonce
	}, [webwallet])

	useEffect(() => {
		console.log('GOT NONCE', webwallet, nonce, loadingNonce, shouldRefreshNonce)

		if(!webwallet || loadingNonce || nonce) {
			return
		}

		console.log('GOT NONCE 2')
		setLoadingNonce(true)

		getUseNonce()
			.then(_nonce => {
				console.log('GOT NONCE', _nonce)
				if(!_nonce) {
					setNonce(undefined)
				} else {
					if(_nonce === 'Token expired') {
						setNonce(undefined)
					} else {
						setNonce(_nonce)
					}
				}
			})
			.catch((err) => {
				console.log('GOT NONCE', err)
			})
		setLoadingNonce(false)

	}, [webwallet, nonce, loadingNonce, shouldRefreshNonce])

	return nonce
}