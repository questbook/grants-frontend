
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const DEFAULT_ERROR_MESSAGE = 'Could not fetch the required data.'

interface Props {
    url: string;
    method: string;
    payload?: any;
}

const useAxios = ({ url, method, payload }: Props) => {
	const [data, setData] = useState<any>(null)
	const [error, setError] = useState('')
	const [loaded, setLoaded] = useState(false)
	const controllerRef = useRef(new AbortController())
	const cancel = () => {
		controllerRef.current.abort()
	}

	useEffect(() => {
		(async() => {
			setLoaded(false)
			try {
				const response = await axios.request({
					data: payload,
					signal: controllerRef.current.signal,
					method,
					url,
				})
				console.log('axios', response)
				setData(response.data)
				setError('')
			} catch(error: any) {
				if(typeof error === 'string') {
					setError(error)
				}

				if(typeof error?.message === 'string') {
					setError(error.message)
				} else {
					setError(DEFAULT_ERROR_MESSAGE)
				}
			} finally {
				setLoaded(true)
			}
		})()
	}, [url, method, payload])
	return { cancel, data, error, loaded }
}

export default useAxios
