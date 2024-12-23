import { gql } from '@apollo/client'
export const submitProposalMutation = gql`mutation createNewGrantApplication(
    $grant: String!,
    $workspaceId: String!,
    $milestoneCount: Int!,
    $milestones: JSON!,
    $applicantId: String!,
    $applicantPublicKey: String!,
    $fields:JSON!
    $pii: JSON
    $proofs: [JSON]
    ){
    createNewGrantApplication(
      grant: $grant,
      workspaceId: $workspaceId,
      milestoneCount: $milestoneCount,
      milestones: $milestones,
      applicantId: $applicantId,
      applicantPublicKey: $applicantPublicKey,
      fields:$fields
      pii: $pii
      proofs: $proofs
    ){
      record{
        _id
      }
      recordId
    }
  }`