import { SafeDetailsInterface } from '@questbook/supported-safes/lib/types/Safe'
import { PublicKey } from '@solana/web3.js'
import { OptionBase } from 'chakra-react-select'
import { EditorState } from 'draft-js'
import {
	ApplicationRegistryAbi,
	ApplicationReviewRegistryAbi,
	CommunicationAbi,
	GrantFactoryAbi,
	WorkspaceRegistryAbi,
} from 'src/generated/contracts'
import {
	GetGrantQuery,
	GetWorkspaceMembersQuery,
	GrantApplication,
	RubricItem,
	SupportedNetwork,
} from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'

export type MinimalWorkspace =
  GetWorkspaceMembersQuery['workspaceMembers'][number]['workspace'];

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
  reviews: GrantApplication['reviews']
  milestones: GrantApplication['milestones']
  reviewers: GrantApplication['applicationReviewers']
}

export type IReview = IApplicantData['reviews'][number]

export type IReviewer = { id: string, fullName?: string | null }

export interface FeedbackType {
	rubric: RubricItem
	rating: number
	comment: string
}

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

export type Roles = 'admin' | 'reviewer' | 'builder' | 'community'

export type GrantType = GetGrantQuery['grant']

export type GrantProgramContextType = {
  grant: GrantType
  setGrant: (grant: GrantType) => void
  role: Roles
  setRole: (role: Roles) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export type NotificationContextType = {
  qrCodeText: string | undefined
  setQrCodeText: (qrCodeText: string | undefined) => void
}

export type NoteDetails = {
	bgColor: string
	color: string
	text: string
	link?: string
	linkText?: string
	linkTextColor?: string
}

export type SafeSelectOption = SafeDetailsInterface & OptionBase

export type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';

export interface ConnectOpts {
    onlyIfTrusted: boolean
}

export interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
    disconnect: () => Promise<void>
    on: (event: PhantomEvent, callback: () => void) => void
    isPhantom: boolean
	publicKey: PublicKey
	isConnected: boolean
}

export type WindowWithSolana = Window & {
    solana?: PhantomProvider
}

export type BuilderProfile = {
  _id: string
  telegram: string
  username: string
  imageURL: string
}