// This is the admin view of the grants dashboard.
import { GraphQLClient } from 'graphql-request'
import { GetServerSidePropsContext } from 'next'
import { CHAIN_INFO } from 'src/constants/chains'
import { GetGrantDetailsForSeoQuery, GetProposalDetailsForSeoQuery } from 'src/generated/graphql'
import { ENDPOINT_CLIENT } from 'src/graphql/apollo'
import _ from 'src/screens/dashboard'
import { getGrantDetailsForSEOQuery } from 'src/screens/dashboard/_data/getGrantDetailsForSEOQuery'
import { getProposalDetailsForSEOQuery } from 'src/screens/dashboard/_data/getProposalDetailsForSEOQuery'
import { DynamicData } from 'src/screens/dashboard/_utils/types'
export default _

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { grantId, chainId: _chainId, proposalId } = context.query

	if(typeof grantId !== 'string' || typeof _chainId !== 'string' || (proposalId !== undefined && typeof proposalId !== 'string')) {
		return {
			parseError: true
		}
	}

	let dynamicData: DynamicData

	try {
		const chainId = parseInt(_chainId) as keyof typeof CHAIN_INFO
		if(chainId === undefined) {
			throw new Error('Invalid chainId')
		}

		const graphQLClient = new GraphQLClient(ENDPOINT_CLIENT)

		if(proposalId === undefined) {
			const grantInfo: GetGrantDetailsForSeoQuery = await graphQLClient.request(getGrantDetailsForSEOQuery, { grantId })
			dynamicData = { title: grantInfo.grant?.title ?? '', description: 'Apply to this grant' }
		} else {
			const proposalInfo: GetProposalDetailsForSeoQuery = await graphQLClient.request(getProposalDetailsForSEOQuery, { proposalId })
			dynamicData = { title: proposalInfo.grantApplication?.title?.[0]?.values?.[0]?.value ?? '', description: `View this proposal for ${proposalInfo.grantApplication?.grant?.title}` }
		}
	} catch(error) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			...dynamicData,
		},
	}
}