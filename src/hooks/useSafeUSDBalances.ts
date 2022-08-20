
import { useEffect, useMemo, useState } from 'react'
import { getRealm } from '@solana/spl-governance'
import { Connection, PublicKey } from '@solana/web3.js'
import { CHAIN_INFO } from 'src/constants/chains'
import { SafeSelectOption } from 'src/v2/components/Onboarding/CreateDomain/SafeSelect'
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

	const { data: rawData, error, loaded } = useAxiosMulti({
		urls: gnosisUrls,
		method: 'get'
	})

	const [data, setData] = useState<SafeSelectOption[]>([])


	useEffect(() => {
		(async() => {
			const connection = new Connection('https://api.devnet.solana.com')
			const programId = new PublicKey('3mdphuX2x94TLqu5Hjm7xr8qTTUWGkREXr41fMWZZjrZ')
			const realm = await getRealm(connection, programId)
			console.log('realms', programId.toString(), realm)
			console.log(realm.account)
		})()
	}, [])

	const getTokensSum = (tokensData: AllTokensData) => {
		return tokensData.reduce((partialSum: number, item) => partialSum + parseFloat(item?.fiatBalance || '0'), 0)
	}

	useEffect(() => {
		if(loaded && !error) {
			const newData: SafeSelectOption[] = []
			rawData.forEach((allTokensData: AllTokensData, index) => {
				const currentChainID = SAFES_BALANCES_CHAIN_ID[index] as unknown as ValidChainID
				const tokensSum = getTokensSum(allTokensData)
				if(tokensSum >= USD_BALANCE_THRESHOLD) {
					const newElement: SafeSelectOption = {
						networkId: currentChainID.toString(),
						networkName: CHAIN_INFO[currentChainID]?.name,
						networkIcon: CHAIN_INFO[currentChainID]?.icon,
						safeType: 'Gnosis',
						safeIcon: '/ui_icons/gnosis.svg',
						amount: Math.floor(tokensSum),
					}
					newData.push(newElement)
				}
			})
			console.log('Final Safe', newData)
			setData(newData)
		}
	}, [rawData, loaded, error])

	return { error, loaded, data }
}

export default useSafeUSDBalances
