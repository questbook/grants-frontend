
import { useEffect, useState } from 'react'
import axios from 'axios'

const DEFAULT_ERROR_MESSAGE = 'Could not fetch all data.'

interface Props {
  urls: string[],
  payload?: any,
  method: string,
}

function useAxiosMulti({ urls, payload, method }: Props) {
	const [data, setData] = useState<any[]>([])
	const [error, setError] = useState<string>('')
	const [loaded, setLoaded] = useState<boolean>(false)

	useEffect(() => {
		(async() => {
			try {
				setLoaded(false)
				const axiosRequests = urls.map(url => axios.request({
					data: payload,
					// signal: controllerRef.current.signal,
					method,
					url
				}))
				const newData = await Promise.allSettled(axiosRequests)
				const finalData = newData.map(element => {
					try {
						if(element.status === 'fulfilled') {
							return element.value.data
						}

						return []
					} catch(error) {
						return []
					}
				})
				setData(finalData)
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
	}, [urls, payload, method])
	return { data, error, loaded }
}

export default useAxiosMulti
