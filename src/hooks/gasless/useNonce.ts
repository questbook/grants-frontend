import { useCallback, useContext, useEffect } from 'react'
import { WebwalletContext } from '../../../pages/_app'
import { getNonce } from '../../utils/gaslessUtils'

export const useNonce = (shouldRefreshNonce?: boolean) => {
	const { webwallet, setWebwallet, nonce, setNonce } = useContext(WebwalletContext)!

	const getUseNonce = useCallback(async() => {
		console.log('rerewq', webwallet)
		const _nonce = await getNonce(webwallet)
		return _nonce
	}, [webwallet])

	useEffect(() => {
		const loadingNonce = localStorage.getItem('loadingNonce') === 'true'
		console.log('GOT NONCE', webwallet, nonce, shouldRefreshNonce, loadingNonce)
		if(!webwallet || loadingNonce || nonce) {
			return
		}

		console.log('GOT NONCE 255')
		localStorage.setItem('loadingNonce', 'true')

		getUseNonce()
			.then(_nonce => {
				console.log('GOT NONCE', _nonce)
				if(!_nonce) {
					setNonce(undefined)
				} else {
					2
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
		localStorage.setItem('loadingNonce', 'false')

	}, [webwallet, nonce, shouldRefreshNonce])

	return nonce
}