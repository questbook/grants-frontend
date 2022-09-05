import { useCallback, useContext, useMemo, useState } from 'react'
import { QueryHookOptions, QueryResult } from '@apollo/client'
import { ApiClientsContext } from 'pages/_app'
import SupportedChainId from 'src/generated/SupportedChainId'

export type UseMultiChainQueryOptions<Q, V> = {
	/** specify chains to query from, set undefined to query all */
	chains?: SupportedChainId[]
	options: Omit<QueryHookOptions<Q, V>, 'client'>
	useQuery: (opts: QueryHookOptions<Q, V>) => QueryResult<Q, V>
}

/**
 * Queries from multiple chains simulataneously.
 * @returns
 */
export function useMultiChainQuery<Q, V>({
	chains,
	options,
	useQuery
}: UseMultiChainQueryOptions<Q, V>) {
	const { subgraphClients } = useContext(ApiClientsContext)!

	const [results, setResults] = useState<(Q | undefined)[]>([])

	const subgraphClientList = useMemo(
		() => chains ? chains.map(chainId => subgraphClients[chainId]) : Object.values(subgraphClients),
		[chains, subgraphClients]
	)

	const allQueryFuncs = subgraphClientList.map(({ client }) => (
		useQuery({ ...options, client, skip: true })
	))

	const combineResults = useCallback((results: ({ data: Q } | undefined)[]) => {
		return results.map(result => result?.data)
	}, [])

	return {
		results,
		async fetchMore(variables?: Partial<V>, reset?: boolean) {
			if(reset) {
				setResults([])
			}

			const queryResults = await Promise.allSettled(
				allQueryFuncs.map(query => (
					reset
						? query.refetch(variables)
						: query.fetchMore({ variables })
				))
			)
			const results = combineResults(
				queryResults.map(result => {
					if(result.status === 'fulfilled') {
						return result.value
					}

					return undefined
				})
			)
			setResults(results)

			return results
		}
	}
}