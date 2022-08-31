import { useCallback, useContext, useEffect, useState } from 'react'
import { WebwalletContext } from 'pages/_app'
import { getNonce } from 'src/utils/gaslessUtils'

export const useNonce = (shouldRefreshNonce?: boolean) => {
	const { webwallet, nonce, setNonce } = useContext(WebwalletContext)!
	const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)

	const getUseNonce = useCallback(async () => {
		// console.log('rerewq', webwallet)
		const _nonce = await getNonce(webwallet)
		return _nonce
	}, [webwallet])

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem('loadingNonce', 'false')
		}

		setShouldRefresh(true)
	}, [])

	useEffect(() => {
		const loadingNonce = localStorage.getItem('loadingNonce') === 'true'
		// console.log('GOT NONCE', webwallet, nonce, shouldRefreshNonce, loadingNonce)
		if (!webwallet || loadingNonce || nonce) {
			return
		}

		// console.log('GOT NONCE 255')
		localStorage.setItem('loadingNonce', 'true')

		getUseNonce()
			.then(_nonce => {
				// console.log('GOT NONCE', _nonce, nonce)
				if (!_nonce) {
					setNonce(undefined)
				} else {
					if (_nonce === 'Token expired') {
						setNonce(undefined)
					} else {
						setNonce(_nonce)
					}
				}
				localStorage.setItem('loadingNonce', 'false')
			})
			.catch((err) => {
				console.log("err", err)
			})

		return (() => {
			if (typeof window !== 'undefined') {
				// console.log('hasan')
				localStorage.setItem('loadingNonce', 'false')
			}
		})

	}, [webwallet, nonce, shouldRefreshNonce])

	return nonce
}