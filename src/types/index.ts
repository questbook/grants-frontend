import {
	GetAllGrantsForADaoQuery,
	GetApplicationMilestonesQuery,
	GetDaoDetailsQuery,
	GetFundSentForApplicationQuery,
	GetWorkspaceDetailsQuery,
	GetWorkspaceMembersQuery,
	SupportedNetwork,
} from 'src/generated/graphql'

export type Grant = GetAllGrantsForADaoQuery['grants'][number];
export type ApplicationMilestone = GetApplicationMilestonesQuery['grantApplications'][number]['milestones'][number];
export type FundTransfer = GetFundSentForApplicationQuery['fundsTransfers'][number];
export type MinimalWorkspace = GetWorkspaceMembersQuery['workspaceMembers'][number]['workspace'];
export type Workspace = Exclude<GetWorkspaceDetailsQuery['workspace'], null | undefined>;
export type DAOWorkspace = GetDaoDetailsQuery['workspace'];
export type DAOGrant = GetDaoDetailsQuery['grants'];

interface PartnersProps {
	name: string;
	industry?: string;
	website?: string;
	image?: string;
}

export type SettingsForm = {
  name: string;
  about: string;
	bio: string;
  supportedNetwork: SupportedNetwork;
	partners: PartnersProps;
  image?: string;
  coverImage?: string;
  twitterHandle?: string;
  discordHandle?: string;
  telegramChannel?: string;
};
