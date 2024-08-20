import { useState } from 'react'
import { DocumentNode } from '@apollo/client'
import client from 'src/graphql/apollo'
import logger from 'src/libraries/logger'

type UseQueryOptions = {
    query: DocumentNode
};


type QueryResult<T> = T | undefined;
export function useQuery<T>({ query }: UseQueryOptions) {
	const [results, setResults] = useState<QueryResult<T>>(undefined)

	async function fetchMore(variables?: Partial<T>, reset?: boolean, retries = 2): Promise<T | undefined> {
		if(reset) {
			setResults(undefined)
		}

		try {
			const { data, error } = await client.query<T>({
				query,
				variables,
			})

			if(data) {
				setResults(data)
			}

			if(error) {
				logger.warn(error)
				if(retries > 0) {
					await fetchMore(variables, reset, retries - 1)
					logger.info(`Retrying... Attempts left: ${retries}`)
				}
			}

			return data
		} catch(error) {
			if(error && retries > 0) {
				logger.info(`Encountered 503 error. Retrying... Attempts left: ${retries}`)
				return await fetchMore(variables, reset, retries - 2)
			} else {
				logger.warn('Retries exhausted or different error encountered.')
				return undefined
			}
		}
	}

	return {
		results,
		fetchMore,
	}
}
