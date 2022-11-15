import { GetGrantQuery, GetGrantsQuery } from 'src/generated/graphql'

export type DashboardContextType = {
    grants: GetGrantsQuery['grants']
    proposals: Proposals
    selectedGrant: GetGrantQuery['grant']
    setSelectedGrant: (grant: GetGrantQuery['grant']) => void
    selectedGrantIndex: number | undefined
    setSelectedGrantIndex: (index: number) => void
    selectedProposals: boolean[]
    setSelectedProposals: (proposal: boolean[]) => void
}

export type Proposals = Exclude<GetGrantQuery['grant'], null | undefined>['applications']
export type Proposal = Proposals[number]