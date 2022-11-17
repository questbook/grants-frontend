import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { QueryHookOptions, QueryResult } from '@apollo/client'
import { InputMaybe, Scalars } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { ApiClientsContext } from 'src/pages/_app'

type PaginationVariables = {
	skip?: InputMaybe<Scalars['Int']>
	first?: InputMaybe<Scalars['Int']>
}

export type UseMultiChainPaginatedQueryOptions<Q, K, V, D> = {
	/** specify chains to query from, set undefined to query all */
	chains?: SupportedChainId[]
	pageSize: number
	variables: V
	listGetter: (data: Q) => D[]
	mergeResults: (results: Q[]) => K[]
	useQuery: (opts: QueryHookOptions<Q, V>) => QueryResult<Q, V>
}

/**
 * Queries from multiple chains simulataneously.
 * @returns
 */
export function useMultichainDaosPaginatedQuery<Q, K, V extends PaginationVariables, D>({
	chains,
	variables,
	pageSize,
	listGetter,
	useQuery,
	mergeResults,
}: UseMultiChainPaginatedQueryOptions<Q, K, V, D>) {
	const { subgraphClients } = useContext(ApiClientsContext)!

	const [results, setResults] = useState<K[]>([])
	const [loading, setLoading] = useState(false)

	const pageRef = useRef(0)
	const hasMoreRef = useRef(false)

	const subgraphClientList = useMemo(
		() => chains ? chains.map(chainId => subgraphClients[chainId]) : Object.values(subgraphClients),
		[chains, subgraphClients]
	)

	const allQueryFuncs = subgraphClientList.map(({ client }) => (
		useQuery({
			variables,
			client,
			skip: true,
		})
	))

	const fetchMore = useCallback(
		async(reset?: boolean) => {
			if(!hasMoreRef.current && !reset) {
				return results
			}

			if(reset) {
				pageRef.current = 0
				hasMoreRef.current = false
			}

			const vars = {
				skip: (reset ? 0 : pageRef.current) * pageSize,
				first: pageSize
			} as Partial<V>

			setLoading(true)

			const queryResults: Q[] = []
			const hasMoreArr: boolean[] = []

			await Promise.allSettled(
				allQueryFuncs.map(async query => {
					const result = await query.fetchMore({ variables: vars })
					// if any chain returns data equal to the page size, then there is possibility of more data...
					hasMoreArr.push(listGetter(result.data).length === pageSize)

					if(result.data) {
						queryResults.push(result.data)
					}
				})
			)

			const newMergedResults = mergeResults(queryResults)

			pageRef.current += 1

			// checking if results from at least one chain has more data
			hasMoreRef.current = !!hasMoreArr.find(() => true)

			setLoading(false)
			setResults(results => [
				...(reset ? [] : results),
				...newMergedResults
			])

			return results
		}, [loading, setLoading, setResults, pageSize, subgraphClientList]
	)

	return {
		results,
		loading,
		hasMore: hasMoreRef.current,
		fetchMore,
	}
}