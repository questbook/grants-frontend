import { ApolloClient, DocumentNode, InMemoryCache } from '@apollo/client'
import { logger } from 'ethers'


export const ENDPOINT_CLIENT = 'https://vhtdi50rkl.execute-api.ap-southeast-1.amazonaws.com/graphql'
//export const ENDPOINT_CLIENT = 'http://localhost:5000/graphql'

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

