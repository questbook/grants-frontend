import { GetAllGrantsForADaoQuery, GetApplicationMilestonesQuery, GetFundSentForApplicationQuery } from 'src/generated/graphql';

export type Grant = GetAllGrantsForADaoQuery['grants'][number];
export type ApplicationMilestone = GetApplicationMilestonesQuery['grantApplications'][number]['milestones'][number];
export type FundTransfer = GetFundSentForApplicationQuery['fundsTransfers'][number];
