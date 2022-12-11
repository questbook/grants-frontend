import { GetGrantsForAdminQuery, GetGrantsForReviewerQuery, GetPayoutsQuery, GetProposalsForAdminQuery } from 'src/generated/graphql'

type BaseDashboardContextType = {
    proposals: Proposals
    selectedGrantIndex: number | undefined
    setSelectedGrantIndex: (index: number) => void
    selectedProposals: boolean[]
    setSelectedProposals: (proposal: boolean[]) => void
}

type OptionalDashboardContextType =
| {
    role: 'admin'
    grants: GetGrantsForAdminQuery['grants']
}
| {
    role: 'reviewer'
    grants: GetGrantsForReviewerQuery['grantReviewerCounters']
}

export type DashboardContextType = BaseDashboardContextType & OptionalDashboardContextType
export interface TokenInfo {
    tokenIcon: string
    tokenName: string
    symbol: string
    tokenValueAmount: number
    usdValueAmount: number
    mintAddress: string
    info: {
        decimals: number
        tokenAddress: string
        fiatConversion: number
    }
}

export type FundBuilderContextType = {
    tokenInfo?: TokenInfo
    setTokenInfo: (tokenInfo: TokenInfo) => void
    amounts: number[]
    setAmounts: (amount: number[]) => void
    tos: string[]
    setTos: (to: string[]) => void
    milestoneIndices: number[]
    setMilestoneIndices: (milestoneIndex: number[]) => void

    isModalOpen: boolean
    setIsModalOpen: (isOpen: boolean) => void
    isDrawerOpen: boolean
    setIsDrawerOpen: (isOpen: boolean) => void

    signerVerifiedState: SignerVerifiedState
    setSignerVerifiedState: (state: SignerVerifiedState) => void
}

export type AdminGrant = GetGrantsForAdminQuery['grants'][number]
export type ReviewerGrant = GetGrantsForReviewerQuery['grantReviewerCounters'][number]['grant']

export type Proposals = Exclude<GetProposalsForAdminQuery['grantApplications'], null | undefined>
export type ProposalType = Proposals[number]
export type PayoutsType = Exclude<GetPayoutsQuery['fundsTransfers'], null | undefined>
export type Payout = PayoutsType[number]

export type SignerVerifiedState = 'unverified' | 'initiate_verification' | 'verifying' | 'verified_safe' | 'verified_phantom' | 'failed'