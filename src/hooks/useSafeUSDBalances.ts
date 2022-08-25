
import { useEffect, useMemo, useState } from 'react'
import { CHAIN_INFO } from 'src/constants/chains'
import { NetworkType } from 'src/constants/Networks'
import { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
import { getSafeDetails } from 'src/v2/constants/safe/realms_solana'
import SAFES_ENPOINTS from '../constants/safesEndpointsTest.json'
import useAxiosMulti from './utils/useAxiosMulti'


const URL_PREFIX = 'v1/safes/'
const URL_SUFFIX = '/balances/usd'
const SAFES_BALANCES_CHAIN_ID = Object.keys(SAFES_ENPOINTS)
const SAFES_BALANCES_ENPOINTS = Object.values(SAFES_ENPOINTS)
const USD_BALANCE_THRESHOLD = 50

interface Props {
    safeAddress: string
}

interface SingleTokenData {
    fiatBalance?: string;
}

type ValidChainID = keyof typeof CHAIN_INFO;

interface AllTokensData extends Array<SingleTokenData> { }

function useSafeUSDBalances({ safeAddress }: Props) {
	const gnosisUrls = useMemo(() => {
		if(safeAddress === '') {
			return []
		}

		return SAFES_BALANCES_ENPOINTS.map(element => element + URL_PREFIX + safeAddress + URL_SUFFIX)
	}, [safeAddress])

	const { data: gnosisRawData, error, loaded } = useAxiosMulti({
		urls: gnosisUrls,
		method: 'get'
	})

	const [splGovSafe, setSplGovSafe] = useState<SafeSelectOption | null>(null)
	const [isSplGovSafeLoading, setIsSplGovSafeLoading] = useState(false)

	const [gnosisData, setGnosisData] = useState<SafeSelectOption[]>([])

	const data = useMemo(() => {
		if(!loaded || isSplGovSafeLoading) {
			return
		}

		if(gnosisData.length > 0 && splGovSafe) {
			return [...gnosisData, splGovSafe]
		} else if(gnosisData.length > 0 && !splGovSafe) {
			return gnosisData
		} else if(gnosisData.length === 0 && splGovSafe) {
			return [splGovSafe]
		} else {
			return []
		}
	}, [gnosisData, splGovSafe])

	useEffect(() => {
		(async() => {
			setIsSplGovSafeLoading(true)
			const newSplGovSafe = await getSafeDetails(safeAddress)
			setIsSplGovSafeLoading(false)
			setSplGovSafe(newSplGovSafe)
		})()
	}, [safeAddress])

	const getTokensSum = (tokensData: AllTokensData) => {
		return tokensData.reduce((partialSum: number, item) => partialSum + parseFloat(item?.fiatBalance || '0'), 0)
	}

	useEffect(() => {
		if(loaded && !error) {
			const newData: SafeSelectOption[] = []
			gnosisRawData.forEach((allTokensData: AllTokensData, index) => {
				const currentChainID = SAFES_BALANCES_CHAIN_ID[index] as unknown as ValidChainID
				const tokensSum = getTokensSum(allTokensData)
				if(tokensSum >= USD_BALANCE_THRESHOLD) {
					const newElement: SafeSelectOption = {
						networkType: NetworkType.EVM,
						networkId: currentChainID.toString(),
						networkName: CHAIN_INFO[currentChainID]?.name,
						networkIcon: CHAIN_INFO[currentChainID]?.icon,
						safeType: 'Gnosis',
						safeIcon: '/safes_icons/gnosis.svg',
						amount: Math.floor(tokensSum),
					}
					newData.push(newElement)
				}
			})
			console.log('Final Safe', newData)
			setGnosisData(newData)
		}
	}, [gnosisRawData, loaded, error])

	return { error, loaded, data }
}

export default useSafeUSDBalances