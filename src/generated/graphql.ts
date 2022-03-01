import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};

/** the milestone of a grant application */
export type ApplicationMilestone = {
  __typename?: 'ApplicationMilestone';
  /** amount expected by applicant */
  amount: Scalars['BigInt'];
  /** amount paid by DAO */
  amountPaid: Scalars['BigInt'];
  id: Scalars['ID'];
  state: MilestoneState;
  /** text that was sent with the milestone update */
  text?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  /** in seconds since epoch */
  updatedAtS?: Maybe<Scalars['Int']>;
};

export type ApplicationMilestone_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amountPaid?: InputMaybe<Scalars['BigInt']>;
  amountPaid_gt?: InputMaybe<Scalars['BigInt']>;
  amountPaid_gte?: InputMaybe<Scalars['BigInt']>;
  amountPaid_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountPaid_lt?: InputMaybe<Scalars['BigInt']>;
  amountPaid_lte?: InputMaybe<Scalars['BigInt']>;
  amountPaid_not?: InputMaybe<Scalars['BigInt']>;
  amountPaid_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  state?: InputMaybe<MilestoneState>;
  state_in?: InputMaybe<Array<MilestoneState>>;
  state_not?: InputMaybe<MilestoneState>;
  state_not_in?: InputMaybe<Array<MilestoneState>>;
  text?: InputMaybe<Scalars['String']>;
  text_contains?: InputMaybe<Scalars['String']>;
  text_ends_with?: InputMaybe<Scalars['String']>;
  text_gt?: InputMaybe<Scalars['String']>;
  text_gte?: InputMaybe<Scalars['String']>;
  text_in?: InputMaybe<Array<Scalars['String']>>;
  text_lt?: InputMaybe<Scalars['String']>;
  text_lte?: InputMaybe<Scalars['String']>;
  text_not?: InputMaybe<Scalars['String']>;
  text_not_contains?: InputMaybe<Scalars['String']>;
  text_not_ends_with?: InputMaybe<Scalars['String']>;
  text_not_in?: InputMaybe<Array<Scalars['String']>>;
  text_not_starts_with?: InputMaybe<Scalars['String']>;
  text_starts_with?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtS?: InputMaybe<Scalars['Int']>;
  updatedAtS_gt?: InputMaybe<Scalars['Int']>;
  updatedAtS_gte?: InputMaybe<Scalars['Int']>;
  updatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtS_lt?: InputMaybe<Scalars['Int']>;
  updatedAtS_lte?: InputMaybe<Scalars['Int']>;
  updatedAtS_not?: InputMaybe<Scalars['Int']>;
  updatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum ApplicationMilestone_OrderBy {
  Amount = 'amount',
  AmountPaid = 'amountPaid',
  Id = 'id',
  State = 'state',
  Text = 'text',
  Title = 'title',
  UpdatedAtS = 'updatedAtS'
}

export enum ApplicationState {
  Approved = 'approved',
  Completed = 'completed',
  Rejected = 'rejected',
  Resubmit = 'resubmit',
  Submitted = 'submitted'
}

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type FundsTransfer = {
  __typename?: 'FundsTransfer';
  /** How much of the funds were allocated */
  amount: Scalars['BigInt'];
  /** Application for which the funds were released */
  application?: Maybe<GrantApplication>;
  /** in seconds since epoch */
  createdAtS: Scalars['Int'];
  /** Which grant were the funds transferred to/from */
  grant: Grant;
  id: Scalars['ID'];
  /** Milestone for which the funds were released */
  milestone?: Maybe<ApplicationMilestone>;
  /** Address of who released the funds */
  sender: Scalars['Bytes'];
  /** The address to which funds were sent */
  to: Scalars['Bytes'];
  /** What the type of funds transfer is */
  type: FundsTransferType;
};

export enum FundsTransferType {
  FundsDeposited = 'funds_deposited',
  FundsDisbursed = 'funds_disbursed',
  FundsWithdrawn = 'funds_withdrawn'
}

export type FundsTransfer_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  application?: InputMaybe<Scalars['String']>;
  application_contains?: InputMaybe<Scalars['String']>;
  application_ends_with?: InputMaybe<Scalars['String']>;
  application_gt?: InputMaybe<Scalars['String']>;
  application_gte?: InputMaybe<Scalars['String']>;
  application_in?: InputMaybe<Array<Scalars['String']>>;
  application_lt?: InputMaybe<Scalars['String']>;
  application_lte?: InputMaybe<Scalars['String']>;
  application_not?: InputMaybe<Scalars['String']>;
  application_not_contains?: InputMaybe<Scalars['String']>;
  application_not_ends_with?: InputMaybe<Scalars['String']>;
  application_not_in?: InputMaybe<Array<Scalars['String']>>;
  application_not_starts_with?: InputMaybe<Scalars['String']>;
  application_starts_with?: InputMaybe<Scalars['String']>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  grant?: InputMaybe<Scalars['String']>;
  grant_contains?: InputMaybe<Scalars['String']>;
  grant_ends_with?: InputMaybe<Scalars['String']>;
  grant_gt?: InputMaybe<Scalars['String']>;
  grant_gte?: InputMaybe<Scalars['String']>;
  grant_in?: InputMaybe<Array<Scalars['String']>>;
  grant_lt?: InputMaybe<Scalars['String']>;
  grant_lte?: InputMaybe<Scalars['String']>;
  grant_not?: InputMaybe<Scalars['String']>;
  grant_not_contains?: InputMaybe<Scalars['String']>;
  grant_not_ends_with?: InputMaybe<Scalars['String']>;
  grant_not_in?: InputMaybe<Array<Scalars['String']>>;
  grant_not_starts_with?: InputMaybe<Scalars['String']>;
  grant_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  milestone?: InputMaybe<Scalars['String']>;
  milestone_contains?: InputMaybe<Scalars['String']>;
  milestone_ends_with?: InputMaybe<Scalars['String']>;
  milestone_gt?: InputMaybe<Scalars['String']>;
  milestone_gte?: InputMaybe<Scalars['String']>;
  milestone_in?: InputMaybe<Array<Scalars['String']>>;
  milestone_lt?: InputMaybe<Scalars['String']>;
  milestone_lte?: InputMaybe<Scalars['String']>;
  milestone_not?: InputMaybe<Scalars['String']>;
  milestone_not_contains?: InputMaybe<Scalars['String']>;
  milestone_not_ends_with?: InputMaybe<Scalars['String']>;
  milestone_not_in?: InputMaybe<Array<Scalars['String']>>;
  milestone_not_starts_with?: InputMaybe<Scalars['String']>;
  milestone_starts_with?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  type?: InputMaybe<FundsTransferType>;
  type_in?: InputMaybe<Array<FundsTransferType>>;
  type_not?: InputMaybe<FundsTransferType>;
  type_not_in?: InputMaybe<Array<FundsTransferType>>;
};

export enum FundsTransfer_OrderBy {
  Amount = 'amount',
  Application = 'application',
  CreatedAtS = 'createdAtS',
  Grant = 'grant',
  Id = 'id',
  Milestone = 'milestone',
  Sender = 'sender',
  To = 'to',
  Type = 'type'
}

export type Grant = {
  __typename?: 'Grant';
  /** Whether the grant is currently accepting applications or not */
  acceptingApplications: Scalars['Boolean'];
  /** in seconds since epoch */
  createdAtS: Scalars['Int'];
  /** Address of who created the grant */
  creatorId: Scalars['Bytes'];
  /** ISO formatted date string */
  deadline?: Maybe<Scalars['String']>;
  /** Expectations & other details of the grant */
  details: Scalars['String'];
  /** Expected fields from the applicants of the grant */
  fields: Array<GrantField>;
  /** Funding currently present in the grant */
  funding: Scalars['BigInt'];
  id: Scalars['ID'];
  metadataHash: Scalars['String'];
  /** Number of applications in the grant */
  numberOfApplications: Scalars['Int'];
  /** Proposed reward for the grant */
  reward: Reward;
  /** Short description of the grant */
  summary: Scalars['String'];
  title: Scalars['String'];
  /** in seconds since epoch */
  updatedAtS?: Maybe<Scalars['Int']>;
  /** Workspace which created the grant */
  workspace: Workspace;
};


export type GrantFieldsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantField_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantField_Filter>;
};

export type GrantApplication = {
  __typename?: 'GrantApplication';
  /** Address of the applicant */
  applicantId: Scalars['Bytes'];
  /** in seconds since epoch */
  createdAtS: Scalars['Int'];
  /** Feedback from the grant DAO manager/applicant */
  feedbackDao?: Maybe<Scalars['String']>;
  /** Feedback from the developer */
  feedbackDev?: Maybe<Scalars['String']>;
  /** Answers to the fields requested in the grant */
  fields: Array<GrantFieldAnswer>;
  /** The grant for which the application is for */
  grant: Grant;
  id: Scalars['ID'];
  /** Milestones of the application */
  milestones: Array<ApplicationMilestone>;
  /** Current state of the application */
  state: ApplicationState;
  /** in seconds since epoch */
  updatedAtS: Scalars['Int'];
};


export type GrantApplicationFieldsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantFieldAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantFieldAnswer_Filter>;
};


export type GrantApplicationMilestonesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApplicationMilestone_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ApplicationMilestone_Filter>;
};

/** A revision after an update */
export type GrantApplicationRevision = {
  __typename?: 'GrantApplicationRevision';
  /** Who caused the update to create the revision */
  actorId: Scalars['Bytes'];
  application: GrantApplication;
  /** in seconds since epoch, when was this revision created */
  createdAtS: Scalars['Int'];
  /** Feedback from the grant DAO manager/applicant */
  feedbackDao?: Maybe<Scalars['String']>;
  /** Feedback from the developer */
  feedbackDev?: Maybe<Scalars['String']>;
  /** Answers to the fields requested in the grant */
  fields: Array<GrantFieldAnswer>;
  id: Scalars['ID'];
  /** Milestones of the application */
  milestones: Array<ApplicationMilestone>;
  /** The state that was set in the revision */
  state: ApplicationState;
};


/** A revision after an update */
export type GrantApplicationRevisionFieldsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantFieldAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantFieldAnswer_Filter>;
};


/** A revision after an update */
export type GrantApplicationRevisionMilestonesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApplicationMilestone_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ApplicationMilestone_Filter>;
};

export type GrantApplicationRevision_Filter = {
  actorId?: InputMaybe<Scalars['Bytes']>;
  actorId_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_not?: InputMaybe<Scalars['Bytes']>;
  actorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  application?: InputMaybe<Scalars['String']>;
  application_contains?: InputMaybe<Scalars['String']>;
  application_ends_with?: InputMaybe<Scalars['String']>;
  application_gt?: InputMaybe<Scalars['String']>;
  application_gte?: InputMaybe<Scalars['String']>;
  application_in?: InputMaybe<Array<Scalars['String']>>;
  application_lt?: InputMaybe<Scalars['String']>;
  application_lte?: InputMaybe<Scalars['String']>;
  application_not?: InputMaybe<Scalars['String']>;
  application_not_contains?: InputMaybe<Scalars['String']>;
  application_not_ends_with?: InputMaybe<Scalars['String']>;
  application_not_in?: InputMaybe<Array<Scalars['String']>>;
  application_not_starts_with?: InputMaybe<Scalars['String']>;
  application_starts_with?: InputMaybe<Scalars['String']>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  feedbackDao?: InputMaybe<Scalars['String']>;
  feedbackDao_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_gt?: InputMaybe<Scalars['String']>;
  feedbackDao_gte?: InputMaybe<Scalars['String']>;
  feedbackDao_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_lt?: InputMaybe<Scalars['String']>;
  feedbackDao_lte?: InputMaybe<Scalars['String']>;
  feedbackDao_not?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev?: InputMaybe<Scalars['String']>;
  feedbackDev_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_gt?: InputMaybe<Scalars['String']>;
  feedbackDev_gte?: InputMaybe<Scalars['String']>;
  feedbackDev_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_lt?: InputMaybe<Scalars['String']>;
  feedbackDev_lte?: InputMaybe<Scalars['String']>;
  feedbackDev_not?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  fields_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_not?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  milestones?: InputMaybe<Array<Scalars['String']>>;
  milestones_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_not?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains?: InputMaybe<Array<Scalars['String']>>;
  state?: InputMaybe<ApplicationState>;
  state_in?: InputMaybe<Array<ApplicationState>>;
  state_not?: InputMaybe<ApplicationState>;
  state_not_in?: InputMaybe<Array<ApplicationState>>;
};

export enum GrantApplicationRevision_OrderBy {
  ActorId = 'actorId',
  Application = 'application',
  CreatedAtS = 'createdAtS',
  FeedbackDao = 'feedbackDao',
  FeedbackDev = 'feedbackDev',
  Fields = 'fields',
  Id = 'id',
  Milestones = 'milestones',
  State = 'state'
}

export type GrantApplication_Filter = {
  applicantId?: InputMaybe<Scalars['Bytes']>;
  applicantId_contains?: InputMaybe<Scalars['Bytes']>;
  applicantId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  applicantId_not?: InputMaybe<Scalars['Bytes']>;
  applicantId_not_contains?: InputMaybe<Scalars['Bytes']>;
  applicantId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  feedbackDao?: InputMaybe<Scalars['String']>;
  feedbackDao_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_gt?: InputMaybe<Scalars['String']>;
  feedbackDao_gte?: InputMaybe<Scalars['String']>;
  feedbackDao_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_lt?: InputMaybe<Scalars['String']>;
  feedbackDao_lte?: InputMaybe<Scalars['String']>;
  feedbackDao_not?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev?: InputMaybe<Scalars['String']>;
  feedbackDev_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_gt?: InputMaybe<Scalars['String']>;
  feedbackDev_gte?: InputMaybe<Scalars['String']>;
  feedbackDev_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_lt?: InputMaybe<Scalars['String']>;
  feedbackDev_lte?: InputMaybe<Scalars['String']>;
  feedbackDev_not?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  fields_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_not?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains?: InputMaybe<Array<Scalars['String']>>;
  grant?: InputMaybe<Scalars['String']>;
  grant_contains?: InputMaybe<Scalars['String']>;
  grant_ends_with?: InputMaybe<Scalars['String']>;
  grant_gt?: InputMaybe<Scalars['String']>;
  grant_gte?: InputMaybe<Scalars['String']>;
  grant_in?: InputMaybe<Array<Scalars['String']>>;
  grant_lt?: InputMaybe<Scalars['String']>;
  grant_lte?: InputMaybe<Scalars['String']>;
  grant_not?: InputMaybe<Scalars['String']>;
  grant_not_contains?: InputMaybe<Scalars['String']>;
  grant_not_ends_with?: InputMaybe<Scalars['String']>;
  grant_not_in?: InputMaybe<Array<Scalars['String']>>;
  grant_not_starts_with?: InputMaybe<Scalars['String']>;
  grant_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  milestones?: InputMaybe<Array<Scalars['String']>>;
  milestones_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_not?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains?: InputMaybe<Array<Scalars['String']>>;
  state?: InputMaybe<ApplicationState>;
  state_in?: InputMaybe<Array<ApplicationState>>;
  state_not?: InputMaybe<ApplicationState>;
  state_not_in?: InputMaybe<Array<ApplicationState>>;
  updatedAtS?: InputMaybe<Scalars['Int']>;
  updatedAtS_gt?: InputMaybe<Scalars['Int']>;
  updatedAtS_gte?: InputMaybe<Scalars['Int']>;
  updatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtS_lt?: InputMaybe<Scalars['Int']>;
  updatedAtS_lte?: InputMaybe<Scalars['Int']>;
  updatedAtS_not?: InputMaybe<Scalars['Int']>;
  updatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum GrantApplication_OrderBy {
  ApplicantId = 'applicantId',
  CreatedAtS = 'createdAtS',
  FeedbackDao = 'feedbackDao',
  FeedbackDev = 'feedbackDev',
  Fields = 'fields',
  Grant = 'grant',
  Id = 'id',
  Milestones = 'milestones',
  State = 'state',
  UpdatedAtS = 'updatedAtS'
}

export type GrantField = {
  __typename?: 'GrantField';
  id: Scalars['ID'];
  inputType: GrantFieldInputType;
  possibleValues?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
};

export type GrantFieldAnswer = {
  __typename?: 'GrantFieldAnswer';
  field: GrantField;
  id: Scalars['ID'];
  value: Array<Scalars['String']>;
};

export type GrantFieldAnswer_Filter = {
  field?: InputMaybe<Scalars['String']>;
  field_contains?: InputMaybe<Scalars['String']>;
  field_ends_with?: InputMaybe<Scalars['String']>;
  field_gt?: InputMaybe<Scalars['String']>;
  field_gte?: InputMaybe<Scalars['String']>;
  field_in?: InputMaybe<Array<Scalars['String']>>;
  field_lt?: InputMaybe<Scalars['String']>;
  field_lte?: InputMaybe<Scalars['String']>;
  field_not?: InputMaybe<Scalars['String']>;
  field_not_contains?: InputMaybe<Scalars['String']>;
  field_not_ends_with?: InputMaybe<Scalars['String']>;
  field_not_in?: InputMaybe<Array<Scalars['String']>>;
  field_not_starts_with?: InputMaybe<Scalars['String']>;
  field_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  value?: InputMaybe<Array<Scalars['String']>>;
  value_contains?: InputMaybe<Array<Scalars['String']>>;
  value_not?: InputMaybe<Array<Scalars['String']>>;
  value_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export enum GrantFieldAnswer_OrderBy {
  Field = 'field',
  Id = 'id',
  Value = 'value'
}

export enum GrantFieldInputType {
  LongForm = 'long_form',
  Numeric = 'numeric',
  ShortForm = 'short_form'
}

export type GrantField_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  inputType?: InputMaybe<GrantFieldInputType>;
  inputType_in?: InputMaybe<Array<GrantFieldInputType>>;
  inputType_not?: InputMaybe<GrantFieldInputType>;
  inputType_not_in?: InputMaybe<Array<GrantFieldInputType>>;
  possibleValues?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_contains?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_not?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_not_contains?: InputMaybe<Array<Scalars['String']>>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
};

export enum GrantField_OrderBy {
  Id = 'id',
  InputType = 'inputType',
  PossibleValues = 'possibleValues',
  Title = 'title'
}

export type Grant_Filter = {
  acceptingApplications?: InputMaybe<Scalars['Boolean']>;
  acceptingApplications_in?: InputMaybe<Array<Scalars['Boolean']>>;
  acceptingApplications_not?: InputMaybe<Scalars['Boolean']>;
  acceptingApplications_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  creatorId?: InputMaybe<Scalars['Bytes']>;
  creatorId_contains?: InputMaybe<Scalars['Bytes']>;
  creatorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  creatorId_not?: InputMaybe<Scalars['Bytes']>;
  creatorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  creatorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  deadline?: InputMaybe<Scalars['String']>;
  deadline_contains?: InputMaybe<Scalars['String']>;
  deadline_ends_with?: InputMaybe<Scalars['String']>;
  deadline_gt?: InputMaybe<Scalars['String']>;
  deadline_gte?: InputMaybe<Scalars['String']>;
  deadline_in?: InputMaybe<Array<Scalars['String']>>;
  deadline_lt?: InputMaybe<Scalars['String']>;
  deadline_lte?: InputMaybe<Scalars['String']>;
  deadline_not?: InputMaybe<Scalars['String']>;
  deadline_not_contains?: InputMaybe<Scalars['String']>;
  deadline_not_ends_with?: InputMaybe<Scalars['String']>;
  deadline_not_in?: InputMaybe<Array<Scalars['String']>>;
  deadline_not_starts_with?: InputMaybe<Scalars['String']>;
  deadline_starts_with?: InputMaybe<Scalars['String']>;
  details?: InputMaybe<Scalars['String']>;
  details_contains?: InputMaybe<Scalars['String']>;
  details_ends_with?: InputMaybe<Scalars['String']>;
  details_gt?: InputMaybe<Scalars['String']>;
  details_gte?: InputMaybe<Scalars['String']>;
  details_in?: InputMaybe<Array<Scalars['String']>>;
  details_lt?: InputMaybe<Scalars['String']>;
  details_lte?: InputMaybe<Scalars['String']>;
  details_not?: InputMaybe<Scalars['String']>;
  details_not_contains?: InputMaybe<Scalars['String']>;
  details_not_ends_with?: InputMaybe<Scalars['String']>;
  details_not_in?: InputMaybe<Array<Scalars['String']>>;
  details_not_starts_with?: InputMaybe<Scalars['String']>;
  details_starts_with?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  fields_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_not?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains?: InputMaybe<Array<Scalars['String']>>;
  funding?: InputMaybe<Scalars['BigInt']>;
  funding_gt?: InputMaybe<Scalars['BigInt']>;
  funding_gte?: InputMaybe<Scalars['BigInt']>;
  funding_in?: InputMaybe<Array<Scalars['BigInt']>>;
  funding_lt?: InputMaybe<Scalars['BigInt']>;
  funding_lte?: InputMaybe<Scalars['BigInt']>;
  funding_not?: InputMaybe<Scalars['BigInt']>;
  funding_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  metadataHash?: InputMaybe<Scalars['String']>;
  metadataHash_contains?: InputMaybe<Scalars['String']>;
  metadataHash_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_gt?: InputMaybe<Scalars['String']>;
  metadataHash_gte?: InputMaybe<Scalars['String']>;
  metadataHash_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_lt?: InputMaybe<Scalars['String']>;
  metadataHash_lte?: InputMaybe<Scalars['String']>;
  metadataHash_not?: InputMaybe<Scalars['String']>;
  metadataHash_not_contains?: InputMaybe<Scalars['String']>;
  metadataHash_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataHash_starts_with?: InputMaybe<Scalars['String']>;
  numberOfApplications?: InputMaybe<Scalars['Int']>;
  numberOfApplications_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplications_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not_in?: InputMaybe<Array<Scalars['Int']>>;
  reward?: InputMaybe<Scalars['String']>;
  reward_contains?: InputMaybe<Scalars['String']>;
  reward_ends_with?: InputMaybe<Scalars['String']>;
  reward_gt?: InputMaybe<Scalars['String']>;
  reward_gte?: InputMaybe<Scalars['String']>;
  reward_in?: InputMaybe<Array<Scalars['String']>>;
  reward_lt?: InputMaybe<Scalars['String']>;
  reward_lte?: InputMaybe<Scalars['String']>;
  reward_not?: InputMaybe<Scalars['String']>;
  reward_not_contains?: InputMaybe<Scalars['String']>;
  reward_not_ends_with?: InputMaybe<Scalars['String']>;
  reward_not_in?: InputMaybe<Array<Scalars['String']>>;
  reward_not_starts_with?: InputMaybe<Scalars['String']>;
  reward_starts_with?: InputMaybe<Scalars['String']>;
  summary?: InputMaybe<Scalars['String']>;
  summary_contains?: InputMaybe<Scalars['String']>;
  summary_ends_with?: InputMaybe<Scalars['String']>;
  summary_gt?: InputMaybe<Scalars['String']>;
  summary_gte?: InputMaybe<Scalars['String']>;
  summary_in?: InputMaybe<Array<Scalars['String']>>;
  summary_lt?: InputMaybe<Scalars['String']>;
  summary_lte?: InputMaybe<Scalars['String']>;
  summary_not?: InputMaybe<Scalars['String']>;
  summary_not_contains?: InputMaybe<Scalars['String']>;
  summary_not_ends_with?: InputMaybe<Scalars['String']>;
  summary_not_in?: InputMaybe<Array<Scalars['String']>>;
  summary_not_starts_with?: InputMaybe<Scalars['String']>;
  summary_starts_with?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtS?: InputMaybe<Scalars['Int']>;
  updatedAtS_gt?: InputMaybe<Scalars['Int']>;
  updatedAtS_gte?: InputMaybe<Scalars['Int']>;
  updatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtS_lt?: InputMaybe<Scalars['Int']>;
  updatedAtS_lte?: InputMaybe<Scalars['Int']>;
  updatedAtS_not?: InputMaybe<Scalars['Int']>;
  updatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  workspace?: InputMaybe<Scalars['String']>;
  workspace_contains?: InputMaybe<Scalars['String']>;
  workspace_ends_with?: InputMaybe<Scalars['String']>;
  workspace_gt?: InputMaybe<Scalars['String']>;
  workspace_gte?: InputMaybe<Scalars['String']>;
  workspace_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_lt?: InputMaybe<Scalars['String']>;
  workspace_lte?: InputMaybe<Scalars['String']>;
  workspace_not?: InputMaybe<Scalars['String']>;
  workspace_not_contains?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with?: InputMaybe<Scalars['String']>;
  workspace_not_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_not_starts_with?: InputMaybe<Scalars['String']>;
  workspace_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Grant_OrderBy {
  AcceptingApplications = 'acceptingApplications',
  CreatedAtS = 'createdAtS',
  CreatorId = 'creatorId',
  Deadline = 'deadline',
  Details = 'details',
  Fields = 'fields',
  Funding = 'funding',
  Id = 'id',
  MetadataHash = 'metadataHash',
  NumberOfApplications = 'numberOfApplications',
  Reward = 'reward',
  Summary = 'summary',
  Title = 'title',
  UpdatedAtS = 'updatedAtS',
  Workspace = 'workspace'
}

export enum MilestoneState {
  Approved = 'approved',
  Requested = 'requested',
  Submitted = 'submitted'
}

export type Notification = {
  __typename?: 'Notification';
  /** Who caused the notification to be sent */
  actorId?: Maybe<Scalars['Bytes']>;
  /** rich content of the notification */
  content: Scalars['String'];
  /** Descending order of cursor */
  cursor: Scalars['String'];
  /** The ID of the entity being affected */
  entityId: Scalars['String'];
  id: Scalars['ID'];
  /** Who all should recv the notification */
  recipientIds: Array<Scalars['Bytes']>;
  /** title of the notification */
  title: Scalars['String'];
  type: NotificationType;
};

export enum NotificationType {
  ApplicationAccepted = 'application_accepted',
  ApplicationCompleted = 'application_completed',
  ApplicationRejected = 'application_rejected',
  ApplicationResubmitted = 'application_resubmitted',
  ApplicationSubmitted = 'application_submitted',
  FundsDeposited = 'funds_deposited',
  FundsDisbursed = 'funds_disbursed',
  FundsWithdrawn = 'funds_withdrawn',
  MilestoneAccepted = 'milestone_accepted',
  MilestoneRejected = 'milestone_rejected',
  MilestoneRequested = 'milestone_requested'
}

export type Notification_Filter = {
  actorId?: InputMaybe<Scalars['Bytes']>;
  actorId_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_not?: InputMaybe<Scalars['Bytes']>;
  actorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  content?: InputMaybe<Scalars['String']>;
  content_contains?: InputMaybe<Scalars['String']>;
  content_ends_with?: InputMaybe<Scalars['String']>;
  content_gt?: InputMaybe<Scalars['String']>;
  content_gte?: InputMaybe<Scalars['String']>;
  content_in?: InputMaybe<Array<Scalars['String']>>;
  content_lt?: InputMaybe<Scalars['String']>;
  content_lte?: InputMaybe<Scalars['String']>;
  content_not?: InputMaybe<Scalars['String']>;
  content_not_contains?: InputMaybe<Scalars['String']>;
  content_not_ends_with?: InputMaybe<Scalars['String']>;
  content_not_in?: InputMaybe<Array<Scalars['String']>>;
  content_not_starts_with?: InputMaybe<Scalars['String']>;
  content_starts_with?: InputMaybe<Scalars['String']>;
  cursor?: InputMaybe<Scalars['String']>;
  cursor_contains?: InputMaybe<Scalars['String']>;
  cursor_ends_with?: InputMaybe<Scalars['String']>;
  cursor_gt?: InputMaybe<Scalars['String']>;
  cursor_gte?: InputMaybe<Scalars['String']>;
  cursor_in?: InputMaybe<Array<Scalars['String']>>;
  cursor_lt?: InputMaybe<Scalars['String']>;
  cursor_lte?: InputMaybe<Scalars['String']>;
  cursor_not?: InputMaybe<Scalars['String']>;
  cursor_not_contains?: InputMaybe<Scalars['String']>;
  cursor_not_ends_with?: InputMaybe<Scalars['String']>;
  cursor_not_in?: InputMaybe<Array<Scalars['String']>>;
  cursor_not_starts_with?: InputMaybe<Scalars['String']>;
  cursor_starts_with?: InputMaybe<Scalars['String']>;
  entityId?: InputMaybe<Scalars['String']>;
  entityId_contains?: InputMaybe<Scalars['String']>;
  entityId_ends_with?: InputMaybe<Scalars['String']>;
  entityId_gt?: InputMaybe<Scalars['String']>;
  entityId_gte?: InputMaybe<Scalars['String']>;
  entityId_in?: InputMaybe<Array<Scalars['String']>>;
  entityId_lt?: InputMaybe<Scalars['String']>;
  entityId_lte?: InputMaybe<Scalars['String']>;
  entityId_not?: InputMaybe<Scalars['String']>;
  entityId_not_contains?: InputMaybe<Scalars['String']>;
  entityId_not_ends_with?: InputMaybe<Scalars['String']>;
  entityId_not_in?: InputMaybe<Array<Scalars['String']>>;
  entityId_not_starts_with?: InputMaybe<Scalars['String']>;
  entityId_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  recipientIds?: InputMaybe<Array<Scalars['Bytes']>>;
  recipientIds_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  recipientIds_not?: InputMaybe<Array<Scalars['Bytes']>>;
  recipientIds_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<NotificationType>;
  type_in?: InputMaybe<Array<NotificationType>>;
  type_not?: InputMaybe<NotificationType>;
  type_not_in?: InputMaybe<Array<NotificationType>>;
};

export enum Notification_OrderBy {
  ActorId = 'actorId',
  Content = 'content',
  Cursor = 'cursor',
  EntityId = 'entityId',
  Id = 'id',
  RecipientIds = 'recipientIds',
  Title = 'title',
  Type = 'type'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  applicationMilestone?: Maybe<ApplicationMilestone>;
  applicationMilestones: Array<ApplicationMilestone>;
  fundsTransfer?: Maybe<FundsTransfer>;
  fundsTransfers: Array<FundsTransfer>;
  grant?: Maybe<Grant>;
  grantApplication?: Maybe<GrantApplication>;
  grantApplicationRevision?: Maybe<GrantApplicationRevision>;
  grantApplicationRevisions: Array<GrantApplicationRevision>;
  grantApplications: Array<GrantApplication>;
  grantField?: Maybe<GrantField>;
  grantFieldAnswer?: Maybe<GrantFieldAnswer>;
  grantFieldAnswers: Array<GrantFieldAnswer>;
  grantFields: Array<GrantField>;
  grants: Array<Grant>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  social?: Maybe<Social>;
  socials: Array<Social>;
  workspace?: Maybe<Workspace>;
  workspaceMember?: Maybe<WorkspaceMember>;
  workspaceMembers: Array<WorkspaceMember>;
  workspaces: Array<Workspace>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryApplicationMilestoneArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryApplicationMilestonesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApplicationMilestone_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ApplicationMilestone_Filter>;
};


export type QueryFundsTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFundsTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundsTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundsTransfer_Filter>;
};


export type QueryGrantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantApplicationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantApplicationRevisionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantApplicationRevisionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplicationRevision_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantApplicationRevision_Filter>;
};


export type QueryGrantApplicationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplication_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantApplication_Filter>;
};


export type QueryGrantFieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantFieldAnswerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantFieldAnswersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantFieldAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantFieldAnswer_Filter>;
};


export type QueryGrantFieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantField_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantField_Filter>;
};


export type QueryGrantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Grant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Grant_Filter>;
};


export type QueryNotificationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryNotificationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Notification_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Notification_Filter>;
};


export type QueryRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Reward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Reward_Filter>;
};


export type QuerySocialArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySocialsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Social_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Social_Filter>;
};


export type QueryWorkspaceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWorkspaceMemberArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWorkspaceMembersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WorkspaceMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WorkspaceMember_Filter>;
};


export type QueryWorkspacesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Workspace_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Workspace_Filter>;
};

export type Reward = {
  __typename?: 'Reward';
  asset: Scalars['Bytes'];
  committed: Scalars['BigInt'];
  id: Scalars['ID'];
};

export type Reward_Filter = {
  asset?: InputMaybe<Scalars['Bytes']>;
  asset_contains?: InputMaybe<Scalars['Bytes']>;
  asset_in?: InputMaybe<Array<Scalars['Bytes']>>;
  asset_not?: InputMaybe<Scalars['Bytes']>;
  asset_not_contains?: InputMaybe<Scalars['Bytes']>;
  asset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  committed?: InputMaybe<Scalars['BigInt']>;
  committed_gt?: InputMaybe<Scalars['BigInt']>;
  committed_gte?: InputMaybe<Scalars['BigInt']>;
  committed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  committed_lt?: InputMaybe<Scalars['BigInt']>;
  committed_lte?: InputMaybe<Scalars['BigInt']>;
  committed_not?: InputMaybe<Scalars['BigInt']>;
  committed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum Reward_OrderBy {
  Asset = 'asset',
  Committed = 'committed',
  Id = 'id'
}

export type Social = {
  __typename?: 'Social';
  id: Scalars['ID'];
  /** Name of the network. Eg. twitter, discord */
  name: Scalars['String'];
  /** Handle or URL */
  value: Scalars['String'];
};

export type Social_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
  value_contains?: InputMaybe<Scalars['String']>;
  value_ends_with?: InputMaybe<Scalars['String']>;
  value_gt?: InputMaybe<Scalars['String']>;
  value_gte?: InputMaybe<Scalars['String']>;
  value_in?: InputMaybe<Array<Scalars['String']>>;
  value_lt?: InputMaybe<Scalars['String']>;
  value_lte?: InputMaybe<Scalars['String']>;
  value_not?: InputMaybe<Scalars['String']>;
  value_not_contains?: InputMaybe<Scalars['String']>;
  value_not_ends_with?: InputMaybe<Scalars['String']>;
  value_not_in?: InputMaybe<Array<Scalars['String']>>;
  value_not_starts_with?: InputMaybe<Scalars['String']>;
  value_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Social_OrderBy {
  Id = 'id',
  Name = 'name',
  Value = 'value'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  applicationMilestone?: Maybe<ApplicationMilestone>;
  applicationMilestones: Array<ApplicationMilestone>;
  fundsTransfer?: Maybe<FundsTransfer>;
  fundsTransfers: Array<FundsTransfer>;
  grant?: Maybe<Grant>;
  grantApplication?: Maybe<GrantApplication>;
  grantApplicationRevision?: Maybe<GrantApplicationRevision>;
  grantApplicationRevisions: Array<GrantApplicationRevision>;
  grantApplications: Array<GrantApplication>;
  grantField?: Maybe<GrantField>;
  grantFieldAnswer?: Maybe<GrantFieldAnswer>;
  grantFieldAnswers: Array<GrantFieldAnswer>;
  grantFields: Array<GrantField>;
  grants: Array<Grant>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  social?: Maybe<Social>;
  socials: Array<Social>;
  workspace?: Maybe<Workspace>;
  workspaceMember?: Maybe<WorkspaceMember>;
  workspaceMembers: Array<WorkspaceMember>;
  workspaces: Array<Workspace>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionApplicationMilestoneArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionApplicationMilestonesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApplicationMilestone_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ApplicationMilestone_Filter>;
};


export type SubscriptionFundsTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFundsTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundsTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundsTransfer_Filter>;
};


export type SubscriptionGrantArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantApplicationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantApplicationRevisionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantApplicationRevisionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplicationRevision_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantApplicationRevision_Filter>;
};


export type SubscriptionGrantApplicationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplication_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantApplication_Filter>;
};


export type SubscriptionGrantFieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantFieldAnswerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantFieldAnswersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantFieldAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantFieldAnswer_Filter>;
};


export type SubscriptionGrantFieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantField_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantField_Filter>;
};


export type SubscriptionGrantsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Grant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Grant_Filter>;
};


export type SubscriptionNotificationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionNotificationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Notification_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Notification_Filter>;
};


export type SubscriptionRewardArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewardsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Reward_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Reward_Filter>;
};


export type SubscriptionSocialArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSocialsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Social_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Social_Filter>;
};


export type SubscriptionWorkspaceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWorkspaceMemberArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWorkspaceMembersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WorkspaceMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WorkspaceMember_Filter>;
};


export type SubscriptionWorkspacesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Workspace_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Workspace_Filter>;
};

export enum SupportedNetwork {
  Chain_1 = 'chain_1',
  Chain_4 = 'chain_4',
  Chain_137 = 'chain_137',
  Chain_80001 = 'chain_80001'
}

/** Schema for a Workspace or DAO */
export type Workspace = {
  __typename?: 'Workspace';
  /** General info about the workspace */
  about: Scalars['String'];
  /** Cover image for the workspace */
  coverImageIpfsHash?: Maybe<Scalars['String']>;
  /** in seconds since epoch */
  createdAtS: Scalars['Int'];
  id: Scalars['ID'];
  /** Hash to fetch the logo */
  logoIpfsHash: Scalars['String'];
  /** Members of the workspace */
  members: Array<WorkspaceMember>;
  /** Hash of the IPFS file from which the details about the workspace were pulled */
  metadataHash: Scalars['String'];
  /** Address of the owner of the workspace */
  ownerId: Scalars['Bytes'];
  /** List of social media handles of the workspace */
  socials: Array<Social>;
  /** List of supported networks of the workspace */
  supportedNetworks: Array<SupportedNetwork>;
  /** Title of the workspace */
  title: Scalars['String'];
  /** in seconds since epoch */
  updatedAtS: Scalars['Int'];
};


/** Schema for a Workspace or DAO */
export type WorkspaceMembersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WorkspaceMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkspaceMember_Filter>;
};


/** Schema for a Workspace or DAO */
export type WorkspaceSocialsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Social_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Social_Filter>;
};

export type WorkspaceMember = {
  __typename?: 'WorkspaceMember';
  /** What permissions the member has on the workspace */
  accessLevel: WorkspaceMemberAccessLevel;
  /** the ID of the member itself */
  actorId: Scalars['Bytes'];
  email?: Maybe<Scalars['String']>;
  /** Globally unique ID of the member */
  id: Scalars['ID'];
  workspace: Workspace;
};

export enum WorkspaceMemberAccessLevel {
  Admin = 'admin',
  Member = 'member',
  Owner = 'owner'
}

export type WorkspaceMember_Filter = {
  accessLevel?: InputMaybe<WorkspaceMemberAccessLevel>;
  accessLevel_in?: InputMaybe<Array<WorkspaceMemberAccessLevel>>;
  accessLevel_not?: InputMaybe<WorkspaceMemberAccessLevel>;
  accessLevel_not_in?: InputMaybe<Array<WorkspaceMemberAccessLevel>>;
  actorId?: InputMaybe<Scalars['Bytes']>;
  actorId_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_not?: InputMaybe<Scalars['Bytes']>;
  actorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  email?: InputMaybe<Scalars['String']>;
  email_contains?: InputMaybe<Scalars['String']>;
  email_ends_with?: InputMaybe<Scalars['String']>;
  email_gt?: InputMaybe<Scalars['String']>;
  email_gte?: InputMaybe<Scalars['String']>;
  email_in?: InputMaybe<Array<Scalars['String']>>;
  email_lt?: InputMaybe<Scalars['String']>;
  email_lte?: InputMaybe<Scalars['String']>;
  email_not?: InputMaybe<Scalars['String']>;
  email_not_contains?: InputMaybe<Scalars['String']>;
  email_not_ends_with?: InputMaybe<Scalars['String']>;
  email_not_in?: InputMaybe<Array<Scalars['String']>>;
  email_not_starts_with?: InputMaybe<Scalars['String']>;
  email_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  workspace?: InputMaybe<Scalars['String']>;
  workspace_contains?: InputMaybe<Scalars['String']>;
  workspace_ends_with?: InputMaybe<Scalars['String']>;
  workspace_gt?: InputMaybe<Scalars['String']>;
  workspace_gte?: InputMaybe<Scalars['String']>;
  workspace_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_lt?: InputMaybe<Scalars['String']>;
  workspace_lte?: InputMaybe<Scalars['String']>;
  workspace_not?: InputMaybe<Scalars['String']>;
  workspace_not_contains?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with?: InputMaybe<Scalars['String']>;
  workspace_not_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_not_starts_with?: InputMaybe<Scalars['String']>;
  workspace_starts_with?: InputMaybe<Scalars['String']>;
};

export enum WorkspaceMember_OrderBy {
  AccessLevel = 'accessLevel',
  ActorId = 'actorId',
  Email = 'email',
  Id = 'id',
  Workspace = 'workspace'
}

export type Workspace_Filter = {
  about?: InputMaybe<Scalars['String']>;
  about_contains?: InputMaybe<Scalars['String']>;
  about_ends_with?: InputMaybe<Scalars['String']>;
  about_gt?: InputMaybe<Scalars['String']>;
  about_gte?: InputMaybe<Scalars['String']>;
  about_in?: InputMaybe<Array<Scalars['String']>>;
  about_lt?: InputMaybe<Scalars['String']>;
  about_lte?: InputMaybe<Scalars['String']>;
  about_not?: InputMaybe<Scalars['String']>;
  about_not_contains?: InputMaybe<Scalars['String']>;
  about_not_ends_with?: InputMaybe<Scalars['String']>;
  about_not_in?: InputMaybe<Array<Scalars['String']>>;
  about_not_starts_with?: InputMaybe<Scalars['String']>;
  about_starts_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_contains?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_ends_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_gt?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_gte?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_in?: InputMaybe<Array<Scalars['String']>>;
  coverImageIpfsHash_lt?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_lte?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_contains?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_ends_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  coverImageIpfsHash_not_starts_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_starts_with?: InputMaybe<Scalars['String']>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  logoIpfsHash?: InputMaybe<Scalars['String']>;
  logoIpfsHash_contains?: InputMaybe<Scalars['String']>;
  logoIpfsHash_ends_with?: InputMaybe<Scalars['String']>;
  logoIpfsHash_gt?: InputMaybe<Scalars['String']>;
  logoIpfsHash_gte?: InputMaybe<Scalars['String']>;
  logoIpfsHash_in?: InputMaybe<Array<Scalars['String']>>;
  logoIpfsHash_lt?: InputMaybe<Scalars['String']>;
  logoIpfsHash_lte?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_contains?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_ends_with?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  logoIpfsHash_not_starts_with?: InputMaybe<Scalars['String']>;
  logoIpfsHash_starts_with?: InputMaybe<Scalars['String']>;
  metadataHash?: InputMaybe<Scalars['String']>;
  metadataHash_contains?: InputMaybe<Scalars['String']>;
  metadataHash_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_gt?: InputMaybe<Scalars['String']>;
  metadataHash_gte?: InputMaybe<Scalars['String']>;
  metadataHash_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_lt?: InputMaybe<Scalars['String']>;
  metadataHash_lte?: InputMaybe<Scalars['String']>;
  metadataHash_not?: InputMaybe<Scalars['String']>;
  metadataHash_not_contains?: InputMaybe<Scalars['String']>;
  metadataHash_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataHash_starts_with?: InputMaybe<Scalars['String']>;
  ownerId?: InputMaybe<Scalars['Bytes']>;
  ownerId_contains?: InputMaybe<Scalars['Bytes']>;
  ownerId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  ownerId_not?: InputMaybe<Scalars['Bytes']>;
  ownerId_not_contains?: InputMaybe<Scalars['Bytes']>;
  ownerId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  socials?: InputMaybe<Array<Scalars['String']>>;
  socials_contains?: InputMaybe<Array<Scalars['String']>>;
  socials_not?: InputMaybe<Array<Scalars['String']>>;
  socials_not_contains?: InputMaybe<Array<Scalars['String']>>;
  supportedNetworks?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_contains?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_not?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_not_contains?: InputMaybe<Array<SupportedNetwork>>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtS?: InputMaybe<Scalars['Int']>;
  updatedAtS_gt?: InputMaybe<Scalars['Int']>;
  updatedAtS_gte?: InputMaybe<Scalars['Int']>;
  updatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtS_lt?: InputMaybe<Scalars['Int']>;
  updatedAtS_lte?: InputMaybe<Scalars['Int']>;
  updatedAtS_not?: InputMaybe<Scalars['Int']>;
  updatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Workspace_OrderBy {
  About = 'about',
  CoverImageIpfsHash = 'coverImageIpfsHash',
  CreatedAtS = 'createdAtS',
  Id = 'id',
  LogoIpfsHash = 'logoIpfsHash',
  Members = 'members',
  MetadataHash = 'metadataHash',
  OwnerId = 'ownerId',
  Socials = 'socials',
  SupportedNetworks = 'supportedNetworks',
  Title = 'title',
  UpdatedAtS = 'updatedAtS'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetAllGrantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetAllGrantsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } }> };

export type GetAllGrantsForADaoQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  workspaceId: Scalars['String'];
}>;


export type GetAllGrantsForADaoQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, createdAtS: number, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string }, workspace: { __typename?: 'Workspace', title: string, logoIpfsHash: string } }> };

export type GetAllGrantsForCreatorQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  creatorId?: InputMaybe<Scalars['Bytes']>;
  workspaceId?: InputMaybe<Scalars['String']>;
}>;


export type GetAllGrantsForCreatorQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } }> };

export type GetApplicantsForAGrantQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  grantID: Scalars['String'];
}>;


export type GetApplicantsForAGrantQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, grant: { __typename?: 'Grant', title: string, funding: string, reward: { __typename?: 'Reward', asset: string } }, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, value: Array<string> }> }> };

export type GetApplicationDetailsQueryVariables = Exact<{
  applicationID: Scalars['ID'];
}>;


export type GetApplicationDetailsQuery = { __typename?: 'Query', grantApplication?: { __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, feedbackDao?: string | null, feedbackDev?: string | null, createdAtS: number, updatedAtS: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, value: Array<string> }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, amount: string }>, grant: { __typename?: 'Grant', id: string, title: string, funding: string, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, reward: { __typename?: 'Reward', id: string, asset: string, committed: string } } } | null };

export type GetApplicationMilestonesQueryVariables = Exact<{
  grantId: Scalars['ID'];
}>;


export type GetApplicationMilestonesQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', grant: { __typename?: 'Grant', reward: { __typename?: 'Reward', asset: string } }, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, state: MilestoneState, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, text?: string | null }>, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, value: Array<string> }> }> };

export type GetDaoDetailsQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
  daoID: Scalars['String'];
}>;


export type GetDaoDetailsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, title: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork>, socials: Array<{ __typename?: 'Social', name: string, value: string }> } | null, grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, createdAtS: number, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string }, workspace: { __typename?: 'Workspace', title: string, logoIpfsHash: string } }> };

export type GetFundSentForApplicationQueryVariables = Exact<{
  applicationId?: InputMaybe<Scalars['String']>;
}>;


export type GetFundSentForApplicationQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, application?: { __typename?: 'GrantApplication', id: string } | null, milestone?: { __typename?: 'ApplicationMilestone', id: string, title: string } | null }> };

export type GetFundingQueryVariables = Exact<{
  grantId?: InputMaybe<Scalars['String']>;
}>;


export type GetFundingQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, grant: { __typename?: 'Grant', id: string }, application?: { __typename?: 'GrantApplication', id: string } | null, milestone?: { __typename?: 'ApplicationMilestone', id: string, title: string } | null }> };

export type GetGrantApplicationQueryVariables = Exact<{
  grantID: Scalars['String'];
  applicantID: Scalars['Bytes'];
}>;


export type GetGrantApplicationQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, grant: { __typename?: 'Grant', id: string, title: string } }> };

export type GetGrantDetailsQueryVariables = Exact<{
  grantID: Scalars['ID'];
}>;


export type GetGrantDetailsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, deadline?: string | null, funding: string, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType }>, reward: { __typename?: 'Reward', id: string, asset: string, committed: string }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } }> };

export type GetMyApplicationsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantID: Scalars['Bytes'];
}>;


export type GetMyApplicationsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, updatedAtS: number, grant: { __typename?: 'Grant', id: string, title: string, funding: string, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } } }> };

export type GetNumberOfApplicationsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantId?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetNumberOfApplicationsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string }> };

export type GetNumberOfGrantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  creatorId?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetNumberOfGrantsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string }> };

export type GetWorkspaceDetailsQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
}>;


export type GetWorkspaceDetailsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, title: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork>, socials: Array<{ __typename?: 'Social', name: string, value: string }>, members: Array<{ __typename?: 'WorkspaceMember', actorId: string, email?: string | null }> } | null };

export type GetWorkspaceMembersQueryVariables = Exact<{
  actorId: Scalars['Bytes'];
}>;


export type GetWorkspaceMembersQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, workspace: { __typename?: 'Workspace', id: string, ownerId: string, logoIpfsHash: string, title: string, supportedNetworks: Array<SupportedNetwork> } }> };


export const GetAllGrantsDocument = gql`
    query getAllGrants($first: Int, $skip: Int) {
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {acceptingApplications: true}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    creatorId
    title
    summary
    details
    reward {
      committed
      id
      asset
    }
    workspace {
      id
      title
      logoIpfsHash
      supportedNetworks
    }
    deadline
    funding
    numberOfApplications
  }
}
    `;

/**
 * __useGetAllGrantsQuery__
 *
 * To run a query within a React component, call `useGetAllGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGrantsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetAllGrantsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllGrantsQuery, GetAllGrantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGrantsQuery, GetAllGrantsQueryVariables>(GetAllGrantsDocument, options);
      }
export function useGetAllGrantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGrantsQuery, GetAllGrantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGrantsQuery, GetAllGrantsQueryVariables>(GetAllGrantsDocument, options);
        }
export type GetAllGrantsQueryHookResult = ReturnType<typeof useGetAllGrantsQuery>;
export type GetAllGrantsLazyQueryHookResult = ReturnType<typeof useGetAllGrantsLazyQuery>;
export type GetAllGrantsQueryResult = Apollo.QueryResult<GetAllGrantsQuery, GetAllGrantsQueryVariables>;
export const GetAllGrantsForADaoDocument = gql`
    query getAllGrantsForADao($first: Int, $skip: Int, $workspaceId: String!) {
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {workspace: $workspaceId}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    creatorId
    title
    createdAtS
    summary
    details
    reward {
      committed
      id
      asset
    }
    workspace {
      title
      logoIpfsHash
    }
    deadline
    funding
    numberOfApplications
  }
}
    `;

/**
 * __useGetAllGrantsForADaoQuery__
 *
 * To run a query within a React component, call `useGetAllGrantsForADaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGrantsForADaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGrantsForADaoQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllGrantsForADaoQuery(baseOptions: Apollo.QueryHookOptions<GetAllGrantsForADaoQuery, GetAllGrantsForADaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGrantsForADaoQuery, GetAllGrantsForADaoQueryVariables>(GetAllGrantsForADaoDocument, options);
      }
export function useGetAllGrantsForADaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGrantsForADaoQuery, GetAllGrantsForADaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGrantsForADaoQuery, GetAllGrantsForADaoQueryVariables>(GetAllGrantsForADaoDocument, options);
        }
export type GetAllGrantsForADaoQueryHookResult = ReturnType<typeof useGetAllGrantsForADaoQuery>;
export type GetAllGrantsForADaoLazyQueryHookResult = ReturnType<typeof useGetAllGrantsForADaoLazyQuery>;
export type GetAllGrantsForADaoQueryResult = Apollo.QueryResult<GetAllGrantsForADaoQuery, GetAllGrantsForADaoQueryVariables>;
export const GetAllGrantsForCreatorDocument = gql`
    query getAllGrantsForCreator($first: Int, $skip: Int, $creatorId: Bytes, $workspaceId: String) {
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {creatorId: $creatorId, workspace: $workspaceId}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    creatorId
    title
    summary
    details
    reward {
      committed
      id
      asset
    }
    workspace {
      id
      title
      logoIpfsHash
      supportedNetworks
    }
    deadline
    funding
    numberOfApplications
  }
}
    `;

/**
 * __useGetAllGrantsForCreatorQuery__
 *
 * To run a query within a React component, call `useGetAllGrantsForCreatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGrantsForCreatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGrantsForCreatorQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      creatorId: // value for 'creatorId'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllGrantsForCreatorQuery(baseOptions?: Apollo.QueryHookOptions<GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables>(GetAllGrantsForCreatorDocument, options);
      }
export function useGetAllGrantsForCreatorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables>(GetAllGrantsForCreatorDocument, options);
        }
export type GetAllGrantsForCreatorQueryHookResult = ReturnType<typeof useGetAllGrantsForCreatorQuery>;
export type GetAllGrantsForCreatorLazyQueryHookResult = ReturnType<typeof useGetAllGrantsForCreatorLazyQuery>;
export type GetAllGrantsForCreatorQueryResult = Apollo.QueryResult<GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables>;
export const GetApplicantsForAGrantDocument = gql`
    query getApplicantsForAGrant($first: Int, $skip: Int, $grantID: String!) {
  grantApplications(first: $first, where: {grant: $grantID}, subgraphError: allow) {
    id
    grant {
      title
      funding
      reward {
        asset
      }
    }
    applicantId
    state
    createdAtS
    fields {
      id
      value
    }
  }
}
    `;

/**
 * __useGetApplicantsForAGrantQuery__
 *
 * To run a query within a React component, call `useGetApplicantsForAGrantQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicantsForAGrantQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicantsForAGrantQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      grantID: // value for 'grantID'
 *   },
 * });
 */
export function useGetApplicantsForAGrantQuery(baseOptions: Apollo.QueryHookOptions<GetApplicantsForAGrantQuery, GetApplicantsForAGrantQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicantsForAGrantQuery, GetApplicantsForAGrantQueryVariables>(GetApplicantsForAGrantDocument, options);
      }
export function useGetApplicantsForAGrantLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicantsForAGrantQuery, GetApplicantsForAGrantQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicantsForAGrantQuery, GetApplicantsForAGrantQueryVariables>(GetApplicantsForAGrantDocument, options);
        }
export type GetApplicantsForAGrantQueryHookResult = ReturnType<typeof useGetApplicantsForAGrantQuery>;
export type GetApplicantsForAGrantLazyQueryHookResult = ReturnType<typeof useGetApplicantsForAGrantLazyQuery>;
export type GetApplicantsForAGrantQueryResult = Apollo.QueryResult<GetApplicantsForAGrantQuery, GetApplicantsForAGrantQueryVariables>;
export const GetApplicationDetailsDocument = gql`
    query getApplicationDetails($applicationID: ID!) {
  grantApplication(id: $applicationID, subgraphError: allow) {
    id
    fields {
      id
      value
    }
    milestones {
      id
      title
      amount
    }
    grant {
      id
      title
      funding
      workspace {
        id
        title
        logoIpfsHash
        supportedNetworks
      }
      reward {
        id
        asset
        committed
      }
    }
    applicantId
    state
    feedbackDao
    feedbackDev
    createdAtS
    updatedAtS
  }
}
    `;

/**
 * __useGetApplicationDetailsQuery__
 *
 * To run a query within a React component, call `useGetApplicationDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationDetailsQuery({
 *   variables: {
 *      applicationID: // value for 'applicationID'
 *   },
 * });
 */
export function useGetApplicationDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationDetailsQuery, GetApplicationDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationDetailsQuery, GetApplicationDetailsQueryVariables>(GetApplicationDetailsDocument, options);
      }
export function useGetApplicationDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationDetailsQuery, GetApplicationDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationDetailsQuery, GetApplicationDetailsQueryVariables>(GetApplicationDetailsDocument, options);
        }
export type GetApplicationDetailsQueryHookResult = ReturnType<typeof useGetApplicationDetailsQuery>;
export type GetApplicationDetailsLazyQueryHookResult = ReturnType<typeof useGetApplicationDetailsLazyQuery>;
export type GetApplicationDetailsQueryResult = Apollo.QueryResult<GetApplicationDetailsQuery, GetApplicationDetailsQueryVariables>;
export const GetApplicationMilestonesDocument = gql`
    query getApplicationMilestones($grantId: ID!) {
  grantApplications(where: {id: $grantId}) {
    grant {
      reward {
        asset
      }
    }
    milestones {
      id
      state
      title
      amount
      amountPaid
      updatedAtS
      text
    }
    fields {
      id
      value
    }
  }
}
    `;

/**
 * __useGetApplicationMilestonesQuery__
 *
 * To run a query within a React component, call `useGetApplicationMilestonesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationMilestonesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationMilestonesQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *   },
 * });
 */
export function useGetApplicationMilestonesQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationMilestonesQuery, GetApplicationMilestonesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationMilestonesQuery, GetApplicationMilestonesQueryVariables>(GetApplicationMilestonesDocument, options);
      }
export function useGetApplicationMilestonesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationMilestonesQuery, GetApplicationMilestonesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationMilestonesQuery, GetApplicationMilestonesQueryVariables>(GetApplicationMilestonesDocument, options);
        }
export type GetApplicationMilestonesQueryHookResult = ReturnType<typeof useGetApplicationMilestonesQuery>;
export type GetApplicationMilestonesLazyQueryHookResult = ReturnType<typeof useGetApplicationMilestonesLazyQuery>;
export type GetApplicationMilestonesQueryResult = Apollo.QueryResult<GetApplicationMilestonesQuery, GetApplicationMilestonesQueryVariables>;
export const GetDaoDetailsDocument = gql`
    query getDAODetails($workspaceID: ID!, $daoID: String!) {
  workspace(id: $workspaceID, subgraphError: allow) {
    id
    title
    about
    logoIpfsHash
    coverImageIpfsHash
    supportedNetworks
    socials {
      name
      value
    }
  }
  grants(
    subgraphError: allow
    where: {workspace: $daoID}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    creatorId
    title
    createdAtS
    summary
    details
    reward {
      committed
      id
      asset
    }
    workspace {
      title
      logoIpfsHash
    }
    deadline
    funding
    numberOfApplications
  }
}
    `;

/**
 * __useGetDaoDetailsQuery__
 *
 * To run a query within a React component, call `useGetDaoDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDaoDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDaoDetailsQuery({
 *   variables: {
 *      workspaceID: // value for 'workspaceID'
 *      daoID: // value for 'daoID'
 *   },
 * });
 */
export function useGetDaoDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetDaoDetailsQuery, GetDaoDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDaoDetailsQuery, GetDaoDetailsQueryVariables>(GetDaoDetailsDocument, options);
      }
export function useGetDaoDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDaoDetailsQuery, GetDaoDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDaoDetailsQuery, GetDaoDetailsQueryVariables>(GetDaoDetailsDocument, options);
        }
export type GetDaoDetailsQueryHookResult = ReturnType<typeof useGetDaoDetailsQuery>;
export type GetDaoDetailsLazyQueryHookResult = ReturnType<typeof useGetDaoDetailsLazyQuery>;
export type GetDaoDetailsQueryResult = Apollo.QueryResult<GetDaoDetailsQuery, GetDaoDetailsQueryVariables>;
export const GetFundSentForApplicationDocument = gql`
    query getFundSentForApplication($applicationId: String) {
  fundsTransfers(
    where: {application: $applicationId}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    application {
      id
    }
    milestone {
      id
      title
    }
    id
    amount
    sender
    to
    createdAtS
    type
  }
}
    `;

/**
 * __useGetFundSentForApplicationQuery__
 *
 * To run a query within a React component, call `useGetFundSentForApplicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundSentForApplicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundSentForApplicationQuery({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetFundSentForApplicationQuery(baseOptions?: Apollo.QueryHookOptions<GetFundSentForApplicationQuery, GetFundSentForApplicationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundSentForApplicationQuery, GetFundSentForApplicationQueryVariables>(GetFundSentForApplicationDocument, options);
      }
export function useGetFundSentForApplicationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundSentForApplicationQuery, GetFundSentForApplicationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundSentForApplicationQuery, GetFundSentForApplicationQueryVariables>(GetFundSentForApplicationDocument, options);
        }
export type GetFundSentForApplicationQueryHookResult = ReturnType<typeof useGetFundSentForApplicationQuery>;
export type GetFundSentForApplicationLazyQueryHookResult = ReturnType<typeof useGetFundSentForApplicationLazyQuery>;
export type GetFundSentForApplicationQueryResult = Apollo.QueryResult<GetFundSentForApplicationQuery, GetFundSentForApplicationQueryVariables>;
export const GetFundingDocument = gql`
    query getFunding($grantId: String) {
  fundsTransfers(
    where: {grant: $grantId}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    grant {
      id
    }
    application {
      id
    }
    milestone {
      id
      title
    }
    id
    amount
    sender
    to
    createdAtS
    type
  }
}
    `;

/**
 * __useGetFundingQuery__
 *
 * To run a query within a React component, call `useGetFundingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundingQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *   },
 * });
 */
export function useGetFundingQuery(baseOptions?: Apollo.QueryHookOptions<GetFundingQuery, GetFundingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundingQuery, GetFundingQueryVariables>(GetFundingDocument, options);
      }
export function useGetFundingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundingQuery, GetFundingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundingQuery, GetFundingQueryVariables>(GetFundingDocument, options);
        }
export type GetFundingQueryHookResult = ReturnType<typeof useGetFundingQuery>;
export type GetFundingLazyQueryHookResult = ReturnType<typeof useGetFundingLazyQuery>;
export type GetFundingQueryResult = Apollo.QueryResult<GetFundingQuery, GetFundingQueryVariables>;
export const GetGrantApplicationDocument = gql`
    query getGrantApplication($grantID: String!, $applicantID: Bytes!) {
  grantApplications(
    where: {applicantId: $applicantID, grant: $grantID}
    subgraphError: allow
  ) {
    id
    grant {
      id
      title
    }
    applicantId
  }
}
    `;

/**
 * __useGetGrantApplicationQuery__
 *
 * To run a query within a React component, call `useGetGrantApplicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantApplicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantApplicationQuery({
 *   variables: {
 *      grantID: // value for 'grantID'
 *      applicantID: // value for 'applicantID'
 *   },
 * });
 */
export function useGetGrantApplicationQuery(baseOptions: Apollo.QueryHookOptions<GetGrantApplicationQuery, GetGrantApplicationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantApplicationQuery, GetGrantApplicationQueryVariables>(GetGrantApplicationDocument, options);
      }
export function useGetGrantApplicationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantApplicationQuery, GetGrantApplicationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantApplicationQuery, GetGrantApplicationQueryVariables>(GetGrantApplicationDocument, options);
        }
export type GetGrantApplicationQueryHookResult = ReturnType<typeof useGetGrantApplicationQuery>;
export type GetGrantApplicationLazyQueryHookResult = ReturnType<typeof useGetGrantApplicationLazyQuery>;
export type GetGrantApplicationQueryResult = Apollo.QueryResult<GetGrantApplicationQuery, GetGrantApplicationQueryVariables>;
export const GetGrantDetailsDocument = gql`
    query getGrantDetails($grantID: ID!) {
  grants(where: {id: $grantID}, subgraphError: allow) {
    id
    creatorId
    title
    summary
    details
    fields(first: 20) {
      id
      title
      inputType
    }
    reward {
      id
      asset
      committed
    }
    workspace {
      id
      title
      logoIpfsHash
      supportedNetworks
    }
    deadline
    funding
  }
}
    `;

/**
 * __useGetGrantDetailsQuery__
 *
 * To run a query within a React component, call `useGetGrantDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantDetailsQuery({
 *   variables: {
 *      grantID: // value for 'grantID'
 *   },
 * });
 */
export function useGetGrantDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetGrantDetailsQuery, GetGrantDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantDetailsQuery, GetGrantDetailsQueryVariables>(GetGrantDetailsDocument, options);
      }
export function useGetGrantDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantDetailsQuery, GetGrantDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantDetailsQuery, GetGrantDetailsQueryVariables>(GetGrantDetailsDocument, options);
        }
export type GetGrantDetailsQueryHookResult = ReturnType<typeof useGetGrantDetailsQuery>;
export type GetGrantDetailsLazyQueryHookResult = ReturnType<typeof useGetGrantDetailsLazyQuery>;
export type GetGrantDetailsQueryResult = Apollo.QueryResult<GetGrantDetailsQuery, GetGrantDetailsQueryVariables>;
export const GetMyApplicationsDocument = gql`
    query getMyApplications($first: Int, $skip: Int, $applicantID: Bytes!) {
  grantApplications(
    first: $first
    skip: $skip
    where: {applicantId: $applicantID}
    subgraphError: allow
  ) {
    id
    grant {
      id
      title
      funding
      workspace {
        id
        title
        logoIpfsHash
        supportedNetworks
      }
    }
    applicantId
    state
    createdAtS
    updatedAtS
  }
}
    `;

/**
 * __useGetMyApplicationsQuery__
 *
 * To run a query within a React component, call `useGetMyApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyApplicationsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      applicantID: // value for 'applicantID'
 *   },
 * });
 */
export function useGetMyApplicationsQuery(baseOptions: Apollo.QueryHookOptions<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>(GetMyApplicationsDocument, options);
      }
export function useGetMyApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>(GetMyApplicationsDocument, options);
        }
export type GetMyApplicationsQueryHookResult = ReturnType<typeof useGetMyApplicationsQuery>;
export type GetMyApplicationsLazyQueryHookResult = ReturnType<typeof useGetMyApplicationsLazyQuery>;
export type GetMyApplicationsQueryResult = Apollo.QueryResult<GetMyApplicationsQuery, GetMyApplicationsQueryVariables>;
export const GetNumberOfApplicationsDocument = gql`
    query getNumberOfApplications($first: Int, $skip: Int, $applicantId: Bytes) {
  grantApplications(where: {applicantId: $applicantId}, subgraphError: allow) {
    id
  }
}
    `;

/**
 * __useGetNumberOfApplicationsQuery__
 *
 * To run a query within a React component, call `useGetNumberOfApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNumberOfApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNumberOfApplicationsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      applicantId: // value for 'applicantId'
 *   },
 * });
 */
export function useGetNumberOfApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<GetNumberOfApplicationsQuery, GetNumberOfApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNumberOfApplicationsQuery, GetNumberOfApplicationsQueryVariables>(GetNumberOfApplicationsDocument, options);
      }
export function useGetNumberOfApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNumberOfApplicationsQuery, GetNumberOfApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNumberOfApplicationsQuery, GetNumberOfApplicationsQueryVariables>(GetNumberOfApplicationsDocument, options);
        }
export type GetNumberOfApplicationsQueryHookResult = ReturnType<typeof useGetNumberOfApplicationsQuery>;
export type GetNumberOfApplicationsLazyQueryHookResult = ReturnType<typeof useGetNumberOfApplicationsLazyQuery>;
export type GetNumberOfApplicationsQueryResult = Apollo.QueryResult<GetNumberOfApplicationsQuery, GetNumberOfApplicationsQueryVariables>;
export const GetNumberOfGrantsDocument = gql`
    query getNumberOfGrants($first: Int, $skip: Int, $creatorId: Bytes) {
  grants(where: {creatorId: $creatorId}, subgraphError: allow) {
    id
  }
}
    `;

/**
 * __useGetNumberOfGrantsQuery__
 *
 * To run a query within a React component, call `useGetNumberOfGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNumberOfGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNumberOfGrantsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      creatorId: // value for 'creatorId'
 *   },
 * });
 */
export function useGetNumberOfGrantsQuery(baseOptions?: Apollo.QueryHookOptions<GetNumberOfGrantsQuery, GetNumberOfGrantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNumberOfGrantsQuery, GetNumberOfGrantsQueryVariables>(GetNumberOfGrantsDocument, options);
      }
export function useGetNumberOfGrantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNumberOfGrantsQuery, GetNumberOfGrantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNumberOfGrantsQuery, GetNumberOfGrantsQueryVariables>(GetNumberOfGrantsDocument, options);
        }
export type GetNumberOfGrantsQueryHookResult = ReturnType<typeof useGetNumberOfGrantsQuery>;
export type GetNumberOfGrantsLazyQueryHookResult = ReturnType<typeof useGetNumberOfGrantsLazyQuery>;
export type GetNumberOfGrantsQueryResult = Apollo.QueryResult<GetNumberOfGrantsQuery, GetNumberOfGrantsQueryVariables>;
export const GetWorkspaceDetailsDocument = gql`
    query getWorkspaceDetails($workspaceID: ID!) {
  workspace(id: $workspaceID, subgraphError: allow) {
    id
    title
    about
    logoIpfsHash
    coverImageIpfsHash
    supportedNetworks
    socials {
      name
      value
    }
    members {
      actorId
      email
    }
  }
}
    `;

/**
 * __useGetWorkspaceDetailsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceDetailsQuery({
 *   variables: {
 *      workspaceID: // value for 'workspaceID'
 *   },
 * });
 */
export function useGetWorkspaceDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceDetailsQuery, GetWorkspaceDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceDetailsQuery, GetWorkspaceDetailsQueryVariables>(GetWorkspaceDetailsDocument, options);
      }
export function useGetWorkspaceDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceDetailsQuery, GetWorkspaceDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceDetailsQuery, GetWorkspaceDetailsQueryVariables>(GetWorkspaceDetailsDocument, options);
        }
export type GetWorkspaceDetailsQueryHookResult = ReturnType<typeof useGetWorkspaceDetailsQuery>;
export type GetWorkspaceDetailsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceDetailsLazyQuery>;
export type GetWorkspaceDetailsQueryResult = Apollo.QueryResult<GetWorkspaceDetailsQuery, GetWorkspaceDetailsQueryVariables>;
export const GetWorkspaceMembersDocument = gql`
    query getWorkspaceMembers($actorId: Bytes!) {
  workspaceMembers(
    where: {actorId: $actorId}
    subgraphError: allow
    orderBy: id
    orderDirection: desc
  ) {
    id
    actorId
    workspace {
      id
      ownerId
      logoIpfsHash
      title
      supportedNetworks
    }
  }
}
    `;

/**
 * __useGetWorkspaceMembersQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceMembersQuery({
 *   variables: {
 *      actorId: // value for 'actorId'
 *   },
 * });
 */
export function useGetWorkspaceMembersQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceMembersQuery, GetWorkspaceMembersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceMembersQuery, GetWorkspaceMembersQueryVariables>(GetWorkspaceMembersDocument, options);
      }
export function useGetWorkspaceMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceMembersQuery, GetWorkspaceMembersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceMembersQuery, GetWorkspaceMembersQueryVariables>(GetWorkspaceMembersDocument, options);
        }
export type GetWorkspaceMembersQueryHookResult = ReturnType<typeof useGetWorkspaceMembersQuery>;
export type GetWorkspaceMembersLazyQueryHookResult = ReturnType<typeof useGetWorkspaceMembersLazyQuery>;
export type GetWorkspaceMembersQueryResult = Apollo.QueryResult<GetWorkspaceMembersQuery, GetWorkspaceMembersQueryVariables>;