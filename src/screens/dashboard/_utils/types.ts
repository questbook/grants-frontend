import { GetGrantsQuery, GetPayoutsQuery, GetProposalsQuery } from 'src/generated/graphql'

export type DashboardContextType = {
    grants: GetGrantsQuery['grants']
    proposals: Proposals
    selectedGrantIndex: number | undefined
    setSelectedGrantIndex: (index: number) => void
    selectedProposals: boolean[]
    setSelectedProposals: (proposal: boolean[]) => void
}

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

export type Proposals = Exclude<GetProposalsQuery['grantApplications'], null | undefined>
export type ProposalType = Proposals[number]
export type PayoutsType = Exclude<GetPayoutsQuery['fundsTransfers'], null | undefined>
export type Payout = PayoutsType[number]

export type SignerVerifiedState = 'unverified' | 'initiate_verification' | 'verifying' | 'verified_safe' | 'verified_phantom' | 'failed'