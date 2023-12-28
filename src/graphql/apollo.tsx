import { ApolloClient, DocumentNode, InMemoryCache } from '@apollo/client'
import { logger } from 'ethers'


export const ENDPOINT_CLIENT = 'https://hhteei4cak.execute-api.ap-south-1.amazonaws.com/graphql'


export const client = new ApolloClient({
	uri: ENDPOINT_CLIENT,
	cache: new InMemoryCache(),
	queryDeduplication: true,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'network-only',
		},
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
	},
})


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeMutation(mutation: DocumentNode, variables: any) {
	try {
		const response = await client.mutate({
			mutation,
			variables,
			context: {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('authToken')}`,
					'Content-Type': 'application/json',
				},
			},
		})
		const { data, errors } = response
		logger.info(data)
		logger.info(errors)

		return data
	} catch(e) {
		logger.warn(e)
	}
}

export default client

