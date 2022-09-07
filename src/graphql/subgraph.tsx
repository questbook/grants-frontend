import {
	ApolloClient,
	HttpLink, InMemoryCache,
} from '@apollo/client'
import { CHAIN_INFO } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import { GetLatestBlockDocument } from 'src/generated/graphql'
import { delay } from 'src/utils/generics'

class SubgraphClient {
	client: ApolloClient<{ }>

	constructor(chainId: SupportedChainId) {
		const link = new HttpLink({ uri: CHAIN_INFO[chainId].subgraphClientUrl })
		const client = new ApolloClient({
			link,
			cache: new InMemoryCache(),
		})
		this.client = client
		this.waitForBlock = this.waitForBlock.bind(this)
	}

	async waitForBlock(blockNumber: number) {
		let latestBlockNumber = 0
		do {
			// Schedule a promise that will be ready once
			// the next Ethereum block will likely be available.
			const response = await this.client.query({
				query: GetLatestBlockDocument,
				fetchPolicy: 'network-only',
			})
			// eslint-disable-next-line no-underscore-dangle
			latestBlockNumber = response.data._meta.block.number

			// waiting for 4 seconds to fetch next block(s)
			await delay(4000)
		} while(latestBlockNumber < blockNumber)
	}
}

export default SubgraphClient
