import { useContext, useEffect } from 'react'
import { WebwalletContext } from '../../../pages/_app'
import { getNonce } from '../../utils/gaslessUtils'

export const useNonce = () => {
	const { webwallet, setWebwallet, nonce, setNonce } = useContext(WebwalletContext)!

	const getUseNonce = async() => {
		const _nonce = await getNonce(webwallet)
		return _nonce
	}

	useEffect(() => {
		if(!webwallet) {
			return
		}

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
				})
		}
	}, [webwallet, nonce, setNonce])

	return nonce
}