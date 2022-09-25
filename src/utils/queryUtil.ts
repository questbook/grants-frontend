import { useContext } from 'react'
import { CHAIN_INFO, defaultChainId } from 'src/constants/chains'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'src/constants/chains'
import { useGetApplicationMilestonesQuery } from 'src/generated/graphql'
import { ApiClientsContext } from 'src/pages/_app'
import { ChainInfo } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

const useApplicationMilestones = (grantId: string, chainId?: SupportedChainId) => {
	const { subgraphClients, workspace } = useContext(ApiClientsContext)!
	const fullData = useGetApplicationMilestonesQuery({
		client:
		subgraphClients[
			(chainId || getSupportedChainIdFromWorkspace(workspace)) || defaultChainId
		].client,
		variables: {
			grantId,
		},
	})

	const grantApp = fullData?.data?.grantApplications[0]

	const fundingAsk = grantApp?.fields?.find((item) => item.id.endsWith('.fundingAsk.field'))?.values[0]?.value
	let rewardAsset: string
	let rewardToken
	const milestones = grantApp?.milestones || []

	if(grantApp?.grant?.reward?.token) {
		rewardAsset = grantApp?.grant?.reward?.token.address
		rewardToken = {
			address: grantApp?.grant?.reward?.token.address,
			label: grantApp?.grant?.reward?.token.label,
			decimals: grantApp?.grant?.reward?.token.decimal,
			icon: getUrlForIPFSHash(grantApp?.grant?.reward?.token.iconHash),
		}
	} else {
		rewardAsset = grantApp?.grant?.reward?.asset || ''
	}

	let decimals

	if(rewardToken?.address) {
		decimals = rewardToken.decimals
	} else if(rewardAsset && !rewardToken?.address) {
		let allCurrencies: ChainInfo['supportedCurrencies'][string][] = []
		ALL_SUPPORTED_CHAIN_IDS.forEach((id) => {
			const { supportedCurrencies } = CHAIN_INFO[id]
			const supportedCurrenciesArray = Object
				.keys(supportedCurrencies)
				.map((i) => supportedCurrencies[i])
			allCurrencies = [...allCurrencies, ...supportedCurrenciesArray]
		})

		decimals = allCurrencies
			.find((currency) => currency.address === rewardAsset)?.decimals
	}

	return {
		...fullData,
		data: {
			rewardAsset, rewardToken, milestones, fundingAsk, decimals,
		},
	}
}

export default useApplicationMilestones
