import {
	GetCommentsQuery,
	GetGrantsForAdminQuery,
	GetGrantsForReviewerQuery,
	GetPayoutsQuery,
	GetProposalsForAdminQuery,
	RubricItem,
} from 'src/generated/graphql'
import { PIIForCommentType } from 'src/libraries/utils/types'

type BaseDashboardContextType = {
  isLoading: boolean
  proposals: Proposals
  selectedGrantIndex: number | undefined
  setSelectedGrantIndex: (index: number) => void
  selectedProposals: boolean[]
  setSelectedProposals: (proposal: boolean[]) => void
  selectedGrant: AdminGrant | ReviewerGrant | undefined
  review: ReviewInfo | undefined
  setReview: (reviews: ReviewInfo) => void
};

type OptionalDashboardContextType =
  | {
      role: 'admin'
      grants: GetGrantsForAdminQuery['grants']
    }
  | {
      role: 'reviewer'
      grants: GetGrantsForReviewerQuery['grantReviewerCounters']
    }
  | {
      role: 'builder'
      grants: []
    };

export type DashboardContextType = BaseDashboardContextType &
  OptionalDashboardContextType;
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
  fiatConversion: number
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
};

export type SendAnUpdateContextType = {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
};

export type ReviewData = {
  rubric: RubricItem
  rating: number
  comment: string
};
export type ReviewInfo = {
  isApproved?: boolean
  createdAtS?: number
  reviewer?: string
  items: ReviewData[]
  total: number
};
export type AdminGrant = GetGrantsForAdminQuery['grants'][number];
export type ReviewerGrant =
  GetGrantsForReviewerQuery['grantReviewerCounters'][number]['grant'];

export type Proposals = Exclude<
  GetProposalsForAdminQuery['grantApplications'],
  null | undefined
>;
export type ProposalType = Proposals[number];
export type PayoutsType = Exclude<
  GetPayoutsQuery['fundsTransfers'],
  null | undefined
>;
export type Payout = PayoutsType[number];

export type SignerVerifiedState = 'unverified' | 'initiate_verification' | 'verifying'| 'failed' | 'verified' | 'transaction_initiated' | 'initiate_TON_transaction' | 'transaction_done_wallet'

// export type CommentMessage = {
//     sender: string
//     message: string
//     timestamp: number
//     role: string
//   }

export type CommentType = Exclude<
  GetCommentsQuery['comments'],
  null | undefined
>[number] & PIIForCommentType;
