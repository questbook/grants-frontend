import { gql } from '@apollo/client';

export const createSubgrant = gql`
  mutation createWorkspace(
    $ownerId: String!,
    $title: String!,
    $bio: String!,
    $about: String!,
    $logoIpfsHash: String!,
    $coverImageIpfsHash: String!,
    $creatorPublicKey: String!,
    $rewardAsset: String!,
    $rewardCommitted: String!,
    $tokenLabel: String!,
    $tokenAddress: String!,
    $tokenIconHash: String!,
    $tokenDecimal: String!,
    $payoutType: String!,
    $link: String,
    $reviewType: String!,
    $fields: JSON!
    $milestones: [String],
    $rubrics: JSON,
    $subgrant: Boolean
  ) {
    createWorkspace(
      ownerId: $ownerId,
      title: $title,
      bio: $bio,
      about: $about,
      logoIpfsHash: $logoIpfsHash,
      coverImageIpfsHash: $coverImageIpfsHash,
      creatorPublicKey: $creatorPublicKey,
      rewardAsset: $rewardAsset,
      rewardCommitted: $rewardCommitted,
      tokenLabel: $tokenLabel,
      tokenAddress: $tokenAddress,
      tokenIconHash: $tokenIconHash,
      tokenDecimal: $tokenDecimal,
      payoutType: $payoutType,
      link: $link,
      reviewType: $reviewType,
      fields: $fields
      milestones: $milestones,
      rubrics: $rubrics,
      subgrant: $subgrant
    ) {
      recordId
      record {
        _id
      }
    }
  }
`;


