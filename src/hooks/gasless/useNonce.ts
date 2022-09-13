import { useCallback, useContext, useEffect, useState } from 'react'
import { WebwalletContext } from 'pages/_app'
import { addAuthorizedUser, getNonce } from 'src/utils/gaslessUtils'

export const useNonce = (shouldRefreshNonce?: boolean) => {
	const { nonce } = useContext(WebwalletContext)!
	// const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)

	// const getUseNonce = useCallback(async() => {
	// 	const _nonce = await getNonce(webwallet)
	// 	return _nonce
	// }, [webwallet])


	// useEffect(() => {
	// 	if(!webwallet) {
	// 		return
	// 	}

	// 	if(nonce && nonce !== 'Token expired') {
	// 		return
	// 	}

	// 	addAuthorizedUser(webwallet?.address)
	// 	 .then(() => {
	// 		getUseNonce()
	// 		 .then(_nonce => {
	// 			setNonce(_nonce)
	// 		 })
	// 	 })
	// }, [webwallet, nonce])

	// useEffect(() => {
	// 	if(typeof window !== 'undefined') {
	// 		localStorage.setItem('loadingNonce', 'false')
	// 	}

	// 	setShouldRefresh(true)
	// }, [])

	// useEffect(() => {
	// 	const loadingNonce = localStorage.getItem('loadingNonce') === 'true'
	// 	if(!webwallet || loadingNonce || nonce) {
	// 		return
	// 	}

	// 	localStorage.setItem('loadingNonce', 'true')

	// 	getUseNonce()
	// 		.then(_nonce => {
	// 			if(!_nonce) {
	// 				setNonce(undefined)
	// 			} else {
	// 				if(_nonce === 'Token expired') {
	// 					setNonce(undefined)
	// 				} else {
	// 					setNonce(_nonce)
	// 				}
	// 			}

	// 			localStorage.setItem('loadingNonce', 'false')
	// 		})
	// 		.catch((err) => {
	// 			console.log('err', err)
	// 		})

	// 	return (() => {
	// 		if(typeof window !== 'undefined') {
	// 			localStorage.setItem('loadingNonce', 'false')
	// 		}
	// 	})

	// }, [webwallet, nonce, shouldRefreshNonce])

	return nonce
}