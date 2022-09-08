import { createClient } from 'urql'

export const calculateUSDValue = async(value: number | string, tokenPair: string | null) => {

	const wethPriceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
 }
}
`
	const priceQuery = `
{
	bundle(id: "1" ) {
	 ethPrice
   }
   pair(id: "${tokenPair}"){
	   token0 {
		 derivedETH
	   }
   }
  }
`
	let amount = 0

	const client = createClient({
		url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
	})

	async function fetchWethPrice() {
		const data = await client.query(wethPriceQuery).toPromise()
		amount = data.data.bundle.ethPrice * (typeof value === 'string' ? parseInt(value) : value)
	}

	async function fetchTokenPrice() {
		const data = await client.query(priceQuery).toPromise()
		amount = (data?.data?.pair?.token0! ? data.data.pair.token0.derivedETH : 0) * data.data.bundle.ethPrice * (typeof value === 'string' ? parseInt(value) : value)
	}

	if(tokenPair === '0x0') {
		await fetchWethPrice()
	} else if(tokenPair !== undefined) {
		await fetchTokenPrice()
	}

	return amount
}

export const useTimeDifference = (first: number, second: number) => {
	const msPerMinute = 60 * 1000
	const msPerHour = msPerMinute * 60
	const msPerDay = msPerHour * 24
	const msPerWeek = msPerDay * 7
	const msPerMonth = msPerDay * 30
	const msPerYear = msPerDay * 365

	const elapsed = first - second

	if(elapsed < msPerMinute) {
		return Math.round(elapsed / 1000) + 's'
	} else if(elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + 'min'
	} else if(elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + 'h'
	} else if(elapsed < msPerWeek) {
		return Math.round(elapsed / msPerDay) + 'd'
	} else if(elapsed < msPerMonth) {
		return Math.round(elapsed / msPerWeek) + 'w'
	} else if(elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) + 'mo'
	} else {
		return Math.round(elapsed / msPerYear) + 'y'
	}
}

export const getAverageTime = (applicationTimes: Array<number>, fundingTimes: Array<number>) => {
	const oneSecond = 60
	const oneMinute = 60 * 1000
	const oneHour = oneMinute * 60
	const oneDay = oneHour * 24
	const oneWeek = oneDay * 7
	const twoWeeks = oneWeek * 2

	let fundingDatesAverage = 0
	let applicationSentAverage = 0

	if(fundingTimes.length >= 1) {
		fundingDatesAverage = (+applicationTimes.reduce((sum, a) => sum + a, 0).toFixed(0)) / applicationTimes.length
		applicationSentAverage = (+fundingTimes.reduce((sum, a) => sum + a, 0).toFixed(0)) / fundingTimes.length
	}

	const average = applicationSentAverage - fundingDatesAverage

	if(average < oneSecond) {
		return '--'
	} else if(average < oneMinute) {
		return Math.round(average / 1000) + 's'
	} else if(average < oneHour) {
		return Math.round(average / oneMinute) + 'min'
	} else if(average < oneDay) {
		return Math.round(average / oneHour) + 'h'
	} else if(average < oneWeek) {
		return Math.round(average / oneDay) + 'd'
	} else if(average < twoWeeks) {
		return Math.round(average / oneWeek) + 'w'
	} else if(average >= twoWeeks) {
		return '--'
	}
}
