
import { useEffect, useMemo, useState } from 'react'
import { NetworkType } from 'src/constants/Networks'
import SAFES_ENPOINTS from 'src/constants/safesEndpointsTest.json'
import useAxios from 'src/hooks/utils/useAxios'
import { getOwners } from 'src/v2/constants/safe/realms_solana'

const URL_PREFIX = 'v1/safes/'
const URL_SUFFIX = ''


interface Props {
    safeAddress: string
    chainID?: string
	type: NetworkType
}

type ValidChainID = keyof typeof SAFES_ENPOINTS;

type SafeDetails = string[]

function useSafeOwners({ safeAddress, type, chainID }: Props) {
	const gnosisUrl = useMemo<string>(() => {
		if(type === NetworkType.Solana || !chainID) {
			return ''
		}

		const chainIDKey = chainID as ValidChainID
		if(SAFES_ENPOINTS[chainIDKey]) {
			return SAFES_ENPOINTS[chainIDKey] + URL_PREFIX + safeAddress + URL_SUFFIX
		}

		return ''
	}, [chainID, safeAddress])

	const { data: rawData, error, loaded } = useAxios({
		url: gnosisUrl,
		method: 'get'
	})
	const [gnosisData, setData] = useState<SafeDetails>([])
	const [splGovData, setSplGovData] = useState<SafeDetails>([])

	const data = useMemo(() => {
		// console.log('safeowners', splGovData, gnosisData)
		if(gnosisData.length > 0) {
			return gnosisData
		}

		return splGovData
	}, [gnosisData, splGovData])

	useEffect(() => {
		(async() => {
			const splOwners = await getOwners(safeAddress)
			setSplGovData(splOwners)
		})()
	}, [safeAddress])

	useEffect(() => {
		// console.log(loaded, error)
		if(loaded && !error) {
			// // console.log('owners', rawData?.owners)
			setData(rawData?.owners ?? [])
		}
	}, [rawData, loaded, error])

	return { error, loaded, data }
}

export default useSafeOwners
