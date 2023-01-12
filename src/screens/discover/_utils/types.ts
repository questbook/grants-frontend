import { GetAllGrantsForBuilderQuery, GetAllGrantsForExploreQuery, GetAllGrantsForMemberQuery, GetAllGrantsForReviewerExploreQuery } from 'src/generated/graphql'

export type Grant = GetAllGrantsForExploreQuery['grants'][0]

export type PersonalGrant = GetAllGrantsForMemberQuery['grants'][0]

export type BuilderGrant = GetAllGrantsForBuilderQuery['grants'][0]

export type ReviewerGrant = GetAllGrantsForReviewerExploreQuery['grantReviewerCounters'][0]