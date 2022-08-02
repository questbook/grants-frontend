import { useContext, useEffect } from 'react'
import { Wallet } from 'ethers'
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
			setWebwallet(Wallet.createRandom())
		}

		if(webwallet && !nonce) {
			getUseNonce()
				.then(_nonce => {
					if(!_nonce) {
						setNonce(undefined)
					} else {
						if(_nonce === 'Token expired') {
							setNonce(undefined)
						}
					}
				})
		}
	}, [webwallet, nonce])

	return nonce
}