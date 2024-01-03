import { gql } from '@apollo/client'
export const DisburseRewardSafeMutation = gql`
		mutation disburseRewardsFromSafe($applicationIds: [String!]!, $milestoneIds: [String!]!, $asset: String!, $tokenName: String!, $nonEvmAssetAddress: String!, $amounts: [Float!]!, $transactionHash: String!, $sender: String!, $grant: String!, $to: String!
			) {
			disburseRewardsFromSafe(
					applicationIds: $applicationIds
					milestoneIds: $milestoneIds
					asset: $asset
					tokenName: $tokenName
					nonEvmAssetAddress: $nonEvmAssetAddress
					amounts: $amounts
					transactionHash: $transactionHash
					sender: $sender
					grant: $grant
					to: $to
				){
				record {
					_id
				}
			}
			}`