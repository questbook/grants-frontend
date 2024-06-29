import { useEffect, useState } from 'react'
import axios from 'axios'

const getTokenPrice = async(): Promise<number> => {
	const getLocalStoragePrice = localStorage.getItem('axlPrice')
	try {
		const res = await axios.post('https://api.axelarscan.io/api/getTokensPrice', {
			symbol: ['AXL']
		})
		if(!res.data?.AXL?.price) {
			return getLocalStoragePrice ? parseFloat(getLocalStoragePrice) : 1
		}

		const price = res.data?.AXL?.price
		localStorage.setItem('axlPrice', price)
		return price
	} catch(error) {
		return getLocalStoragePrice ? parseFloat(getLocalStoragePrice) : 1
	}
}

export const useTokenPrice = (): number => {
	const [price, setPrice] = useState<number>(1)

	useEffect(() => {
		const fetchPrice = async() => {
			const price = await getTokenPrice()
			setPrice(price)
		}

		fetchPrice()
	}, [])

	return price
}
