import { useState } from 'react'
import { DocumentNode } from '@apollo/client'
import { logger } from 'ethers'
import client from 'src/graphql/apollo'

type UseQueryOptions = {
    query: DocumentNode
};

// Define the type for the expected result of the query
type QueryResult<T> = T | undefined;

export function useQuery<T>({ query }: UseQueryOptions) {
	const [results, setResults] = useState<QueryResult<T>>(undefined)

	return {
		results,
		async fetchMore(variables?: Partial<T>, reset?: boolean) {
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
				}

				return data // Return the updated data directly
			} catch(error) {
				logger.warn(error)
				return undefined // Return undefined in case of an error
			}
		},
	}
}
