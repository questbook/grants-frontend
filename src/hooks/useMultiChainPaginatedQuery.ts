import { useCallback, useMemo, useState } from 'react'
import { QueryHookOptions, QueryResult } from '@apollo/client'
import { InputMaybe, Scalars } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'

type PaginationVariables = {
	skip?: InputMaybe<Scalars['Int']>
	first?: InputMaybe<Scalars['Int']>
}

export type UseMultiChainPaginatedQuery<Q, K, V> = {
	chains?: SupportedChainId[]
	pageSize: number
	variables: V
	mergeResults: (results: Q[]) => K[]
	useQuery: (opts: QueryHookOptions<Q, V>) => QueryResult<Q, V>
}

export function useMultiChainPaginatedQuery<Q, K, V extends PaginationVariables>({
	chains,
	pageSize,
	variables,
	mergeResults,
	useQuery
}: UseMultiChainPaginatedQuery<Q, K, V>) {
	const { results, fetchMore } = useMultiChainQuery({
		chains,
		options: {
			fetchPolicy: 'cache-first',
			variables: { ...variables, first: pageSize, skip: 0 }
		},
		useQuery
	})

	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)

	const combineResults = useCallback((results: (Q | undefined)[]) => {
		// remove all failed results and merged
		const filtered: Q[] = []
		for(const result of results) {
			if(result) {
				filtered.push(result)
			}
		}

		return mergeResults(filtered)
	}, [mergeResults])

	const combinedResults = useMemo(() => combineResults(results), [results])

	return {
		combinedResults,
		hasMore,
		async fetchMore(reset?: boolean) {
			if(!hasMore && !reset) {
				return combinedResults
			}

			const prevTotal = combinedResults.length
			const newResults = await fetchMore(
				{ skip: (reset ? 0 : page) * pageSize } as V,
				reset
			)

			const merged = combineResults(newResults)
			if(!reset) {
				const newHasMore = merged.length > prevTotal
				// keep fetching till nothing new is fetched
				setHasMore(newHasMore)
				if(newHasMore) {
					setPage(page + 1)
				}
			} else {
				setHasMore(true)
				setPage(1)
			}

			return merged
		}
	}
}