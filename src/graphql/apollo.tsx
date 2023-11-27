import { ApolloClient, InMemoryCache } from '@apollo/client'


export const ENDPOINT_CLIENT = 'https://vhtdi50rkl.execute-api.ap-southeast-1.amazonaws.com/graphql'

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


export default client

