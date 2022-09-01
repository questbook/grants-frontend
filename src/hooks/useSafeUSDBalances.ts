
import { useEffect, useMemo, useState } from 'react'
import { USD_THRESHOLD } from 'src/constants'
import { CHAIN_INFO } from 'src/constants/chains'
import { NetworkType } from 'src/constants/Networks'
import SAFES_ENPOINTS_MAINNETS from 'src/constants/safesEndpoints.json'
import SAFES_ENPOINTS_TESTNETS from 'src/constants/safesEndpointsTest.json'
import useAxiosMulti from 'src/hooks/utils/useAxiosMulti'
import { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
import { getSafeDetails } from 'src/v2/constants/safe/realms_solana'


const URL_PREFIX = 'v1/safes/'
// const URL_PREFIX = 'v1/safes/'
const URL_SUFFIX = '/balances/usd'
const SAFES_ENDPOINTS = process.env.NEXT_PUBLIC_IS_TEST === 'true' ? SAFES_ENPOINTS_TESTNETS : SAFES_ENPOINTS_MAINNETS
const SAFES_BALANCES_CHAIN_ID = Object.keys(SAFES_ENDPOINTS)
const SAFES_BALANCES_ENPOINTS = Object.values(SAFES_ENDPOINTS)
const DEFAULT_ERROR_MESSAGE = 'Could not fetch data'

interface Props {
    safeAddress: string
}

interface SingleTokenData {
    fiatBalance?: string
}

type ValidChainID = keyof typeof CHAIN_INFO;

interface AllTokensData extends Array<SingleTokenData> { }

function useSafeUSDBalances({ safeAddress }: Props) {
	const gnosisUrls = useMemo(() => {
		if(safeAddress === '') {
			return []
		}

		// console.log('Inside safe usd balance', safeAddress)
		// console.log('API url', SAFES_BALANCES_ENPOINTS[0] + URL_PREFIX + safeAddress + URL_SUFFIX)
		return SAFES_BALANCES_ENPOINTS.map(element => element + URL_PREFIX + safeAddress + URL_SUFFIX)
	}, [safeAddress])

	const { data: gnosisRawData, error: gnosisError, loaded: gnosisLoaded } = useAxiosMulti({
		urls: gnosisUrls,
		method: 'get'
	})

	const [splGovSafe, setSplGovSafe] = useState<SafeSelectOption | null>(null)
	const [splGovLoaded, setSplGovLoaded] = useState(false)
	const [splGovError, setSplGovError] = useState('')

	const [gnosisData, setGnosisData] = useState<SafeSelectOption[]>([])

	const data = useMemo<SafeSelectOption[]>(() => {
		if(splGovSafe) {
			const temp = [...gnosisData, splGovSafe]
			temp.sort((a, b) => b.amount - a.amount)
			return temp
		}

		return [...gnosisData.sort((a, b) => b.amount - a.amount)]
	}, [gnosisData, splGovSafe])

	useEffect(() => {
		(async() => {
			setSplGovLoaded(false)
			try {
				const newSplGovSafe = await getSafeDetails(safeAddress)
				setSplGovSafe(newSplGovSafe)
				setSplGovError('')
			} catch(error: any) {
				// console.log(error)
				if(typeof error === 'string') {
					setSplGovError(error)
				}

				if(typeof error?.message === 'string') {
					setSplGovError(error.message)
				} else {
					setSplGovError(DEFAULT_ERROR_MESSAGE)
				}

				setSplGovSafe(null)
			}

			setSplGovLoaded(true)
		})()
	}, [safeAddress])

	const getTokensSum = (tokensData: AllTokensData) => {
		return tokensData.reduce((partialSum: number, item) => partialSum + parseFloat(item?.fiatBalance || '0'), 0)
	}

	useEffect(() => {
		if(gnosisLoaded && !gnosisError) {
			const newData: SafeSelectOption[] = []
			gnosisRawData.forEach((allTokensData: AllTokensData, index) => {
				const currentChainID = SAFES_BALANCES_CHAIN_ID[index] as unknown as ValidChainID
				const tokensSum = getTokensSum(allTokensData)
				// if(tokensSum >= USD_BALANCE_THRESHOLD) {
				if(allTokensData.length > 0 && currentChainID in CHAIN_INFO) {
					const newElement: SafeSelectOption = {
						safeAddress: safeAddress,
						networkType: NetworkType.EVM,
						networkId: currentChainID.toString(),
						networkName: CHAIN_INFO[currentChainID]?.name,
						networkIcon: CHAIN_INFO[currentChainID]?.icon,
						safeType: 'Gnosis',
						safeIcon: '/safes_icons/gnosis.svg',
						amount: Math.floor(tokensSum),
						isDisabled: Math.floor(tokensSum) < USD_THRESHOLD
					}
					newData.push(newElement)
				}
			})
			// console.log('Final Safe', newData)
			setGnosisData(newData)
		}
	}, [gnosisRawData, gnosisLoaded, gnosisError, safeAddress])

	return { gnosisError, splGovError, loaded: gnosisLoaded && splGovLoaded, data }
}

export default useSafeUSDBalances