import { EditorState } from 'draft-js'
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
	image?: string | null;
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
			address: string
			decimals: number
		}
	}
	readonly qbContracts: { [C in QBContract]: string }
	readonly subgraphClientUrl: string
	readonly rpcUrls: string[]
}

export type ChainInfoMap = { readonly [chainId in SupportedChainId]: ChainInfo }
