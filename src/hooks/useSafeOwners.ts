
import { useEffect, useMemo, useState } from 'react'
import SAFES_ENPOINTS from '../constants/safesEndpointsTest.json'
import useAxios from './utils/useAxios'

const URL_PREFIX = 'v1/safes/'
const URL_SUFFIX = ''

interface Props {
    safeAddress: string;
    chainID: string;
}

type ValidChainID = keyof typeof SAFES_ENPOINTS;

interface SafeDetails {
    owners?: string[];
}

function useSafeOwners({ safeAddress, chainID }: Props) {
	const url = useMemo<string>(() => {
		const chainIDKey = chainID as ValidChainID
		if(SAFES_ENPOINTS[chainIDKey]) {
			return SAFES_ENPOINTS[chainIDKey] + URL_PREFIX + safeAddress + URL_SUFFIX
		}

		return ''
	}, [chainID, safeAddress])

	const { data: rawData, error, loaded } = useAxios({
		url,
		method: 'get'
	})
	const [data, setData] = useState<string[]>([])

	useEffect(() => {
		console.log(loaded, error)
		if(loaded && !error) {
			console.log('what?', rawData)
			console.log('owners', rawData?.owners)
			setData(rawData?.owners ?? [])
		}
	}, [rawData, loaded, error])

	return { error, loaded, data }
}

export default useSafeOwners
