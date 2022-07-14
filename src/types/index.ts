import { EditorState } from 'draft-js'
import { ApplicationRegistryAbi, ApplicationReviewRegistryAbi, GrantFactoryAbi, WorkspaceRegistryAbi } from 'src/generated/contracts'
import {
	GetAllGrantsForADaoQuery,
	GetApplicationMilestonesQuery,
	GetDaoDetailsQuery,
	GetFundSentForApplicationQuery,
	GetWorkspaceDetailsQuery,
	GetWorkspaceMembersQuery,
	SupportedNetwork,
} from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'

export type Grant = GetAllGrantsForADaoQuery['grants'][number];
export type ApplicationMilestone = GetApplicationMilestonesQuery['grantApplications'][number]['milestones'][number];
export type FundTransfer = GetFundSentForApplicationQuery['fundsTransfers'][number];
export type MinimalWorkspace = GetWorkspaceMembersQuery['workspaceMembers'][number]['workspace'];
export type Workspace = Exclude<GetWorkspaceDetailsQuery['workspace'], null | undefined>;
export type DAOWorkspace = GetDaoDetailsQuery['workspace'];
export type DAOGrant = GetDaoDetailsQuery['grants'];

export type PartnersProps = {
	name: string;
	industry: string;
	website?: string | null;
	partnerImageHash?: string | null | undefined;
}

export type SettingsForm = {
  name: string;
  about: EditorState;
  bio: string;
  supportedNetwork: SupportedNetwork;
  partners?: PartnersProps[];
  image?: string;
  coverImage?: string;
  twitterHandle?: string;
  discordHandle?: string;
  telegramChannel?: string;
};

export type AddressMap = { [C in SupportedChainId]: string }

export type QBContract = 'workspace' | 'grantFactory' | 'applications' | 'reviews'

export type QBContractABIMap = {
	'workspace': WorkspaceRegistryAbi
	'grantFactory': GrantFactoryAbi
	'applications': ApplicationRegistryAbi
	'reviews': ApplicationReviewRegistryAbi
}

export interface ChainInfo {
	readonly id: SupportedChainId
	readonly name: string
	readonly isTestNetwork?: boolean
	readonly icon: string
	readonly wallets: string[],
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

export type ChainInfoMap = { readonly [chainId in SupportedChainId]: ChainInfo }
