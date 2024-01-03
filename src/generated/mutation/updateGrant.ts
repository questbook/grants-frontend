import { gql } from '@apollo/client';

export const updateGrant = gql`
  mutation updateGrant(
    $id: String!,
    $ownerId: String!,
    $title: String!,
    $bio: String!,
    $about: String!,
    $rewardCommitted: String!,
    $payoutType: String!,
    $link: String,
    $reviewType: String!,
    $fields: JSON!
    $milestones: [String]
    $workspace: String!
  ) {
    updateGrant(
     id: $id,
      ownerId: $ownerId,
      title: $title,
      bio: $bio,
      about: $about,
      rewardCommitted: $rewardCommitted,
      payoutType: $payoutType,
      link: $link,
      reviewType: $reviewType,
      fields: $fields
      milestones: $milestones
      workspace: $workspace
    ) {
      recordId
      record {
        _id
      }
    }
  }
`;


