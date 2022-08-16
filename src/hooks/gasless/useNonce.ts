import { useContext, useEffect } from 'react'
import { WebwalletContext } from '../../../pages/_app'
import { getNonce } from '../../utils/gaslessUtils'

export const useNonce = () => {
	const { webwallet, setWebwallet, nonce, setNonce, loadingNonce, setLoadingNonce } = useContext(WebwalletContext)!

	const getUseNonce = async() => {
		const _nonce = await getNonce(webwallet)
		return _nonce
	}

	useEffect(() => {
		if(!webwallet || loadingNonce) {
			return
		}

		setLoadingNonce(true)

		console.log('GOT NONCE', nonce)
		if(webwallet && !nonce) {
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

					setLoadingNonce(false)
				})
		}
	}, [webwallet, nonce])

	return nonce
}