import { GetGrantsQuery, GetPayoutsQuery, GetProposalsQuery } from 'src/generated/graphql'

export type DashboardContextType = {
    grants: GetGrantsQuery['grants']
    proposals: Proposals
    selectedGrantIndex: number | undefined
    setSelectedGrantIndex: (index: number) => void
    selectedProposals: boolean[]
    setSelectedProposals: (proposal: boolean[]) => void
}

export type Proposals = Exclude<GetProposalsQuery['grantApplications'], null | undefined>
export type Proposal = Proposals[number]
export type PayoutsType = Exclude<GetPayoutsQuery['fundsTransfers'], null | undefined>
export type Payout = PayoutsType[number]