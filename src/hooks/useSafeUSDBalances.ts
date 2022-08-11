
import { useEffect, useMemo, useState } from 'react'
import SAFES_ENPOINTS from '../constants/safesEndpointsTest.json'
import useAxiosMulti from './utils/useAxiosMulti'

const URL_PREFIX = 'v1/safes/'
const URL_SUFFIX = '/balances/usd'
const SAFES_BALANCES_CHAIN_ID = Object.keys(SAFES_ENPOINTS)
const SAFES_BALANCES_ENPOINTS = Object.values(SAFES_ENPOINTS)
const USD_BALANCE_THRESHOLD = 200

interface Props {
    safeAddress: string
}

export interface USDBalancesData {
    [key: string]: number;
}

interface SingleTokenData {
    fiatBalance?: string;
}

interface AllTokensData extends Array<SingleTokenData> { }

function useSafeUSDBalances({ safeAddress }: Props) {
	const urls = useMemo(() => {
		if(safeAddress === '') {
			return []
		}

		return SAFES_BALANCES_ENPOINTS.map(element => element + URL_PREFIX + safeAddress + URL_SUFFIX)
	}, [safeAddress])

	const { data: rawData, error, loaded } = useAxiosMulti({
		urls,
		method: 'get'
	})
	const [data, setData] = useState<USDBalancesData>({})

	useEffect(() => {
		if(loaded && !error) {
			const newData: USDBalancesData = {}
			rawData.forEach((allTokensData: AllTokensData, index) => {
				const currentChainID = SAFES_BALANCES_CHAIN_ID[index]
				const tokensSum = allTokensData.reduce((partialSum: number, item) => partialSum + parseFloat(item?.fiatBalance || '0'), 0)
				if(tokensSum >= USD_BALANCE_THRESHOLD) {
					newData[currentChainID] = tokensSum
				}
			})
			console.log('Final Safe', newData)
			setData(newData)
		}
	}, [rawData, loaded, error])

	return { error, loaded, data }
}

export default useSafeUSDBalances
