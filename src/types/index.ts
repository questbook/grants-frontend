import { EditorState } from 'draft-js'
import { FeedbackType } from 'src/components/your_grants/feedbackDrawer'
import {
	ApplicationRegistryAbi,
	ApplicationReviewRegistryAbi,
	CommunicationAbi,
	GrantAbi,
	GrantFactoryAbi,
	WorkspaceRegistryAbi,
} from 'src/generated/contracts'
import {
	GetAllGrantsForADaoQuery, GetApplicantsForAGrantQuery,
	GetApplicationMilestonesQuery,
	GetDaoDetailsQuery,
	GetFundSentForApplicationQuery,
	GetReviewersForAWorkspaceQuery,
	GetWorkspaceDetailsQuery,
	GetWorkspaceMembersQuery,
	SupportedNetwork,
} from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'

export type Grant = GetAllGrantsForADaoQuery['grants'][number];
export type ApplicationMilestone =
  GetApplicationMilestonesQuery['grantApplications'][number]['milestones'][number];
export type FundTransfer =
  GetFundSentForApplicationQuery['fundsTransfers'][number];
export type MinimalWorkspace =
  GetWorkspaceMembersQuery['workspaceMembers'][number]['workspace'];
export type Workspace = Exclude<
  GetWorkspaceDetailsQuery['workspace'],
  null | undefined
>;
export type DAOWorkspace = GetDaoDetailsQuery['workspace'];
export type DAOGrant = GetDaoDetailsQuery['grants'];

export type IApplicantData = {
  grantTitle?: string
  applicationId: string
  applicantName?: string
  applicantEmail?: string
  applicantAddress?: string
  sentOn: string
  updatedOn: string
  projectName?: string
  fundingAsked: {
    amount: string
    symbol: string
    icon: string
  }
  grant?: {
    id: string
  }
  status: number
  amountPaid: string
  reviews: GetApplicantsForAGrantQuery['grantApplications'][number]['reviews']
  milestones: GetApplicantsForAGrantQuery['grantApplications'][number]['milestones']
  reviewers: GetApplicantsForAGrantQuery['grantApplications'][number]['applicationReviewers']
}

export type IReview = IApplicantData['reviews'][0]

export type IReviewer = { id: string, fullName?: string | null }

export type IReviewFeedback = {
  isApproved?: boolean
  createdAtS?: number
  reviewer?: string
  items: FeedbackType[]
  total: number
}

export type PartnersProps = {
  name: string
  industry: string
  website?: string | null
  partnerImageHash?: string | null | undefined
};

export type SettingsForm = {
  name: string
  about: EditorState
  bio: string
  supportedNetwork: SupportedNetwork
  partners?: PartnersProps[]
  image?: string
  coverImage?: string
  twitterHandle?: string
  discordHandle?: string
  telegramChannel?: string
};

export type AddressMap = { [C in SupportedChainId]: string };

export type QBContract =
  | 'workspace'
  | 'grantFactory'
  | 'applications'
  | 'reviews'
  | 'communication';

export type QBContractABIMap = {
  workspace: WorkspaceRegistryAbi
  grantFactory: GrantFactoryAbi
  applications: ApplicationRegistryAbi
  reviews: ApplicationReviewRegistryAbi
  communication: CommunicationAbi
};

export interface ChainInfo {
  readonly id: SupportedChainId
  readonly name: string
  readonly isTestNetwork?: boolean
  readonly icon: string
  readonly wallets: string[]
  readonly explorer: {
    address: string
    transactionHash: string
  }
  readonly supportedCurrencies: {
    [address: string]: {
      icon: string
      label: string
      pair?: string
      address: string
      decimals: number
    }
  }
  readonly qbContracts: { [C in QBContract]: string }
  readonly subgraphClientUrl: string
  readonly rpcUrls: string[]
  readonly nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export type ChainInfoMap = {
  readonly [chainId in SupportedChainId]: ChainInfo;
};

export interface SidebarRubrics {
  index: number
  criteria: string
  description: string
}

export interface SidebarReviewer {
  data: Exclude<GetReviewersForAWorkspaceQuery['workspace'], null | undefined>['members'][number]
  isSelected: boolean
  index: number
}


export type SafeToken = {
  tokenAddress: string
  token: {
    decimals: number
    logoUri: string
    symbol: string
  }
}

export type ApplicantDetailsFieldType = {
  title: string
  id: string
  inputType: string
  required: boolean
  pii?: boolean
}

export type DynamicInputValues = {
  [key: number]: string
}

export type CustomField = {
	title: string
	value: string
	isError: boolean
}

// eslint-disable-next-line no-restricted-syntax
export enum ReviewType {
  'Voting',
  'Rubrics'
}