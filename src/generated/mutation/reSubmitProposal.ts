import { gql } from '@apollo/client'
export const reSubmitProposalMutation = gql `mutation updateGrantApplication(
    $id: String!,
    $grant: String!,
    $workspaceId: String!,
    $milestoneCount: Int!,
    $milestones: JSON!,
    $applicantId: String!,
    $applicantPublicKey: String!,
    $fields:JSON!
    $pii: JSON
    $state: String!
    ){
    updateGrantApplication(
     id: $id,
      grant: $grant,
      workspaceId: $workspaceId,
      milestoneCount: $milestoneCount,
      milestones: $milestones,
      applicantId: $applicantId,
      applicantPublicKey: $applicantPublicKey,
      fields:$fields
      pii: $pii
     state: $state
    ){
      record{
        _id
      }
      recordId
    }
  }`