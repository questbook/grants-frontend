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
  /** The grant application this milestone belongs to */
  application: GrantApplication;
  /** Feedback from the grant DAO manager/applicant */
  feedbackDao?: Maybe<Scalars['String']>;
  /** Feedback from the developer */
  feedbackDev?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** Current state of the milestone */
  state: MilestoneState;
  title: Scalars['String'];
  /** in seconds since epoch */
  updatedAtS?: Maybe<Scalars['Int']>;
};

export type ApplicationMilestone_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  application?: InputMaybe<Scalars['String']>;
  application_?: InputMaybe<GrantApplication_Filter>;
  application_contains?: InputMaybe<Scalars['String']>;
  application_contains_nocase?: InputMaybe<Scalars['String']>;
  application_ends_with?: InputMaybe<Scalars['String']>;
  application_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_gt?: InputMaybe<Scalars['String']>;
  application_gte?: InputMaybe<Scalars['String']>;
  application_in?: InputMaybe<Array<Scalars['String']>>;
  application_lt?: InputMaybe<Scalars['String']>;
  application_lte?: InputMaybe<Scalars['String']>;
  application_not?: InputMaybe<Scalars['String']>;
  application_not_contains?: InputMaybe<Scalars['String']>;
  application_not_contains_nocase?: InputMaybe<Scalars['String']>;
  application_not_ends_with?: InputMaybe<Scalars['String']>;
  application_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_not_in?: InputMaybe<Array<Scalars['String']>>;
  application_not_starts_with?: InputMaybe<Scalars['String']>;
  application_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  application_starts_with?: InputMaybe<Scalars['String']>;
  application_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao?: InputMaybe<Scalars['String']>;
  feedbackDao_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_gt?: InputMaybe<Scalars['String']>;
  feedbackDao_gte?: InputMaybe<Scalars['String']>;
  feedbackDao_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_lt?: InputMaybe<Scalars['String']>;
  feedbackDao_lte?: InputMaybe<Scalars['String']>;
  feedbackDao_not?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev?: InputMaybe<Scalars['String']>;
  feedbackDev_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_gt?: InputMaybe<Scalars['String']>;
  feedbackDev_gte?: InputMaybe<Scalars['String']>;
  feedbackDev_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_lt?: InputMaybe<Scalars['String']>;
  feedbackDev_lte?: InputMaybe<Scalars['String']>;
  feedbackDev_not?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  Application = 'application',
  FeedbackDao = 'feedbackDao',
  FeedbackDev = 'feedbackDev',
  Id = 'id',
  State = 'state',
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

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

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
  /** Asset that was used in the funds transfer */
  asset: Scalars['Bytes'];
  /** in seconds since epoch */
  createdAtS: Scalars['Int'];
  /** Which grant were the funds transferred to/from */
  grant: Grant;
  id: Scalars['ID'];
  /** Milestone for which the funds were released */
  milestone?: Maybe<ApplicationMilestone>;
  /** Reviw for which the payment was done */
  review?: Maybe<Review>;
  /** Address of who released the funds */
  sender: Scalars['Bytes'];
  /** The address to which funds were sent */
  to: Scalars['Bytes'];
  /** Hash/signature of the transaction */
  transactionHash?: Maybe<Scalars['Bytes']>;
  /** What the type of funds transfer is */
  type: FundsTransferType;
};

export enum FundsTransferType {
  FundsDeposited = 'funds_deposited',
  FundsDisbursed = 'funds_disbursed',
  FundsWithdrawn = 'funds_withdrawn',
  ReviewPaymentDone = 'review_payment_done'
}

export type FundsTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  application?: InputMaybe<Scalars['String']>;
  application_?: InputMaybe<GrantApplication_Filter>;
  application_contains?: InputMaybe<Scalars['String']>;
  application_contains_nocase?: InputMaybe<Scalars['String']>;
  application_ends_with?: InputMaybe<Scalars['String']>;
  application_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_gt?: InputMaybe<Scalars['String']>;
  application_gte?: InputMaybe<Scalars['String']>;
  application_in?: InputMaybe<Array<Scalars['String']>>;
  application_lt?: InputMaybe<Scalars['String']>;
  application_lte?: InputMaybe<Scalars['String']>;
  application_not?: InputMaybe<Scalars['String']>;
  application_not_contains?: InputMaybe<Scalars['String']>;
  application_not_contains_nocase?: InputMaybe<Scalars['String']>;
  application_not_ends_with?: InputMaybe<Scalars['String']>;
  application_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_not_in?: InputMaybe<Array<Scalars['String']>>;
  application_not_starts_with?: InputMaybe<Scalars['String']>;
  application_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  application_starts_with?: InputMaybe<Scalars['String']>;
  application_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset?: InputMaybe<Scalars['Bytes']>;
  asset_contains?: InputMaybe<Scalars['Bytes']>;
  asset_in?: InputMaybe<Array<Scalars['Bytes']>>;
  asset_not?: InputMaybe<Scalars['Bytes']>;
  asset_not_contains?: InputMaybe<Scalars['Bytes']>;
  asset_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  grant?: InputMaybe<Scalars['String']>;
  grant_?: InputMaybe<Grant_Filter>;
  grant_contains?: InputMaybe<Scalars['String']>;
  grant_contains_nocase?: InputMaybe<Scalars['String']>;
  grant_ends_with?: InputMaybe<Scalars['String']>;
  grant_ends_with_nocase?: InputMaybe<Scalars['String']>;
  grant_gt?: InputMaybe<Scalars['String']>;
  grant_gte?: InputMaybe<Scalars['String']>;
  grant_in?: InputMaybe<Array<Scalars['String']>>;
  grant_lt?: InputMaybe<Scalars['String']>;
  grant_lte?: InputMaybe<Scalars['String']>;
  grant_not?: InputMaybe<Scalars['String']>;
  grant_not_contains?: InputMaybe<Scalars['String']>;
  grant_not_contains_nocase?: InputMaybe<Scalars['String']>;
  grant_not_ends_with?: InputMaybe<Scalars['String']>;
  grant_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  grant_not_in?: InputMaybe<Array<Scalars['String']>>;
  grant_not_starts_with?: InputMaybe<Scalars['String']>;
  grant_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  grant_starts_with?: InputMaybe<Scalars['String']>;
  grant_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  milestone?: InputMaybe<Scalars['String']>;
  milestone_?: InputMaybe<ApplicationMilestone_Filter>;
  milestone_contains?: InputMaybe<Scalars['String']>;
  milestone_contains_nocase?: InputMaybe<Scalars['String']>;
  milestone_ends_with?: InputMaybe<Scalars['String']>;
  milestone_ends_with_nocase?: InputMaybe<Scalars['String']>;
  milestone_gt?: InputMaybe<Scalars['String']>;
  milestone_gte?: InputMaybe<Scalars['String']>;
  milestone_in?: InputMaybe<Array<Scalars['String']>>;
  milestone_lt?: InputMaybe<Scalars['String']>;
  milestone_lte?: InputMaybe<Scalars['String']>;
  milestone_not?: InputMaybe<Scalars['String']>;
  milestone_not_contains?: InputMaybe<Scalars['String']>;
  milestone_not_contains_nocase?: InputMaybe<Scalars['String']>;
  milestone_not_ends_with?: InputMaybe<Scalars['String']>;
  milestone_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  milestone_not_in?: InputMaybe<Array<Scalars['String']>>;
  milestone_not_starts_with?: InputMaybe<Scalars['String']>;
  milestone_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  milestone_starts_with?: InputMaybe<Scalars['String']>;
  milestone_starts_with_nocase?: InputMaybe<Scalars['String']>;
  review?: InputMaybe<Scalars['String']>;
  review_?: InputMaybe<Review_Filter>;
  review_contains?: InputMaybe<Scalars['String']>;
  review_contains_nocase?: InputMaybe<Scalars['String']>;
  review_ends_with?: InputMaybe<Scalars['String']>;
  review_ends_with_nocase?: InputMaybe<Scalars['String']>;
  review_gt?: InputMaybe<Scalars['String']>;
  review_gte?: InputMaybe<Scalars['String']>;
  review_in?: InputMaybe<Array<Scalars['String']>>;
  review_lt?: InputMaybe<Scalars['String']>;
  review_lte?: InputMaybe<Scalars['String']>;
  review_not?: InputMaybe<Scalars['String']>;
  review_not_contains?: InputMaybe<Scalars['String']>;
  review_not_contains_nocase?: InputMaybe<Scalars['String']>;
  review_not_ends_with?: InputMaybe<Scalars['String']>;
  review_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  review_not_in?: InputMaybe<Array<Scalars['String']>>;
  review_not_starts_with?: InputMaybe<Scalars['String']>;
  review_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  review_starts_with?: InputMaybe<Scalars['String']>;
  review_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  type?: InputMaybe<FundsTransferType>;
  type_in?: InputMaybe<Array<FundsTransferType>>;
  type_not?: InputMaybe<FundsTransferType>;
  type_not_in?: InputMaybe<Array<FundsTransferType>>;
};

export enum FundsTransfer_OrderBy {
  Amount = 'amount',
  Application = 'application',
  Asset = 'asset',
  CreatedAtS = 'createdAtS',
  Grant = 'grant',
  Id = 'id',
  Milestone = 'milestone',
  Review = 'review',
  Sender = 'sender',
  To = 'to',
  TransactionHash = 'transactionHash',
  Type = 'type'
}

export type Grant = {
  __typename?: 'Grant';
  /** Whether the grant is currently accepting applications or not */
  acceptingApplications: Scalars['Boolean'];
  /** List of applications for the grant */
  applications: Array<GrantApplication>;
  /** in seconds since epoch */
  createdAtS: Scalars['Int'];
  /** Address of who created the grant */
  creatorId: Scalars['Bytes'];
  /** ISO formatted date string */
  deadline?: Maybe<Scalars['String']>;
  /** Deadlint for the grant, in seconds since epoch */
  deadlineS: Scalars['Int'];
  /** Expectations & other details of the grant */
  details: Scalars['String'];
  /** Expected fields from the applicants of the grant */
  fields: Array<GrantField>;
  /** List of fund transfer records for the grant */
  fundTransfers: Array<FundsTransfer>;
  /** Funding currently present in the grant */
  funding: Scalars['BigInt'];
  id: Scalars['ID'];
  /** People who will manage the grant. They can see the PII submitted in an application */
  managers: Array<GrantManager>;
  metadataHash: Scalars['String'];
  /** Number of applications in the grant */
  numberOfApplications: Scalars['Int'];
  /** Proposed reward for the grant */
  reward: Reward;
  /** Rubric for evaulating the grant */
  rubric?: Maybe<Rubric>;
  /** Short description of the grant */
  summary: Scalars['String'];
  title: Scalars['String'];
  /** in seconds since epoch */
  updatedAtS?: Maybe<Scalars['Int']>;
  /** Workspace which created the grant */
  workspace: Workspace;
};


export type GrantApplicationsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplication_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantApplication_Filter>;
};


export type GrantFieldsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantField_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantField_Filter>;
};


export type GrantFundTransfersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundsTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<FundsTransfer_Filter>;
};


export type GrantManagersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantManager_Filter>;
};

export type GrantApplication = {
  __typename?: 'GrantApplication';
  /** Address of the applicant */
  applicantId: Scalars['Bytes'];
  /** People who will review this grant application */
  applicationReviewers: Array<GrantApplicationReviewer>;
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
  /** PII Data */
  pii: Array<PiiAnswer>;
  /** @deprecated (use 'applicationReviewers') People who will review the grant application */
  reviewers: Array<WorkspaceMember>;
  /** Reviews of the application */
  reviews: Array<Review>;
  /** Current state of the application */
  state: ApplicationState;
  /** in seconds since epoch */
  updatedAtS: Scalars['Int'];
  /** Version of the application, incremented on resubmission */
  version: Scalars['Int'];
};


export type GrantApplicationApplicationReviewersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplicationReviewer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantApplicationReviewer_Filter>;
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


export type GrantApplicationPiiArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PiiAnswer_Filter>;
};


export type GrantApplicationReviewersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WorkspaceMember_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<WorkspaceMember_Filter>;
};


export type GrantApplicationReviewsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Review_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Review_Filter>;
};

export type GrantApplicationReviewer = {
  __typename?: 'GrantApplicationReviewer';
  /** Unix timestamp of when the user was assigned */
  assignedAtS: Scalars['Int'];
  id: Scalars['ID'];
  /** The member who was assigned */
  member: WorkspaceMember;
};

export type GrantApplicationReviewer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  assignedAtS?: InputMaybe<Scalars['Int']>;
  assignedAtS_gt?: InputMaybe<Scalars['Int']>;
  assignedAtS_gte?: InputMaybe<Scalars['Int']>;
  assignedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  assignedAtS_lt?: InputMaybe<Scalars['Int']>;
  assignedAtS_lte?: InputMaybe<Scalars['Int']>;
  assignedAtS_not?: InputMaybe<Scalars['Int']>;
  assignedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  member?: InputMaybe<Scalars['String']>;
  member_?: InputMaybe<WorkspaceMember_Filter>;
  member_contains?: InputMaybe<Scalars['String']>;
  member_contains_nocase?: InputMaybe<Scalars['String']>;
  member_ends_with?: InputMaybe<Scalars['String']>;
  member_ends_with_nocase?: InputMaybe<Scalars['String']>;
  member_gt?: InputMaybe<Scalars['String']>;
  member_gte?: InputMaybe<Scalars['String']>;
  member_in?: InputMaybe<Array<Scalars['String']>>;
  member_lt?: InputMaybe<Scalars['String']>;
  member_lte?: InputMaybe<Scalars['String']>;
  member_not?: InputMaybe<Scalars['String']>;
  member_not_contains?: InputMaybe<Scalars['String']>;
  member_not_contains_nocase?: InputMaybe<Scalars['String']>;
  member_not_ends_with?: InputMaybe<Scalars['String']>;
  member_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  member_not_in?: InputMaybe<Array<Scalars['String']>>;
  member_not_starts_with?: InputMaybe<Scalars['String']>;
  member_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  member_starts_with?: InputMaybe<Scalars['String']>;
  member_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum GrantApplicationReviewer_OrderBy {
  AssignedAtS = 'assignedAtS',
  Id = 'id',
  Member = 'member'
}

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
  /** Version number of the grant application */
  version: Scalars['Int'];
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
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  actorId?: InputMaybe<Scalars['Bytes']>;
  actorId_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_not?: InputMaybe<Scalars['Bytes']>;
  actorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  application?: InputMaybe<Scalars['String']>;
  application_?: InputMaybe<GrantApplication_Filter>;
  application_contains?: InputMaybe<Scalars['String']>;
  application_contains_nocase?: InputMaybe<Scalars['String']>;
  application_ends_with?: InputMaybe<Scalars['String']>;
  application_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_gt?: InputMaybe<Scalars['String']>;
  application_gte?: InputMaybe<Scalars['String']>;
  application_in?: InputMaybe<Array<Scalars['String']>>;
  application_lt?: InputMaybe<Scalars['String']>;
  application_lte?: InputMaybe<Scalars['String']>;
  application_not?: InputMaybe<Scalars['String']>;
  application_not_contains?: InputMaybe<Scalars['String']>;
  application_not_contains_nocase?: InputMaybe<Scalars['String']>;
  application_not_ends_with?: InputMaybe<Scalars['String']>;
  application_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_not_in?: InputMaybe<Array<Scalars['String']>>;
  application_not_starts_with?: InputMaybe<Scalars['String']>;
  application_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  application_starts_with?: InputMaybe<Scalars['String']>;
  application_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  feedbackDao_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_gt?: InputMaybe<Scalars['String']>;
  feedbackDao_gte?: InputMaybe<Scalars['String']>;
  feedbackDao_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_lt?: InputMaybe<Scalars['String']>;
  feedbackDao_lte?: InputMaybe<Scalars['String']>;
  feedbackDao_not?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev?: InputMaybe<Scalars['String']>;
  feedbackDev_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_gt?: InputMaybe<Scalars['String']>;
  feedbackDev_gte?: InputMaybe<Scalars['String']>;
  feedbackDev_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_lt?: InputMaybe<Scalars['String']>;
  feedbackDev_lte?: InputMaybe<Scalars['String']>;
  feedbackDev_not?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  fields_?: InputMaybe<GrantFieldAnswer_Filter>;
  fields_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  fields_not?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  milestones?: InputMaybe<Array<Scalars['String']>>;
  milestones_?: InputMaybe<ApplicationMilestone_Filter>;
  milestones_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  milestones_not?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  state?: InputMaybe<ApplicationState>;
  state_in?: InputMaybe<Array<ApplicationState>>;
  state_not?: InputMaybe<ApplicationState>;
  state_not_in?: InputMaybe<Array<ApplicationState>>;
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  State = 'state',
  Version = 'version'
}

export type GrantApplication_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  applicantId?: InputMaybe<Scalars['Bytes']>;
  applicantId_contains?: InputMaybe<Scalars['Bytes']>;
  applicantId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  applicantId_not?: InputMaybe<Scalars['Bytes']>;
  applicantId_not_contains?: InputMaybe<Scalars['Bytes']>;
  applicantId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  applicationReviewers?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_?: InputMaybe<GrantApplicationReviewer_Filter>;
  applicationReviewers_contains?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_not?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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
  feedbackDao_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_gt?: InputMaybe<Scalars['String']>;
  feedbackDao_gte?: InputMaybe<Scalars['String']>;
  feedbackDao_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_lt?: InputMaybe<Scalars['String']>;
  feedbackDao_lte?: InputMaybe<Scalars['String']>;
  feedbackDao_not?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDao_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDao_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDao_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev?: InputMaybe<Scalars['String']>;
  feedbackDev_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_gt?: InputMaybe<Scalars['String']>;
  feedbackDev_gte?: InputMaybe<Scalars['String']>;
  feedbackDev_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_lt?: InputMaybe<Scalars['String']>;
  feedbackDev_lte?: InputMaybe<Scalars['String']>;
  feedbackDev_not?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains?: InputMaybe<Scalars['String']>;
  feedbackDev_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedbackDev_not_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with?: InputMaybe<Scalars['String']>;
  feedbackDev_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  fields_?: InputMaybe<GrantFieldAnswer_Filter>;
  fields_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  fields_not?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  grant?: InputMaybe<Scalars['String']>;
  grant_?: InputMaybe<Grant_Filter>;
  grant_contains?: InputMaybe<Scalars['String']>;
  grant_contains_nocase?: InputMaybe<Scalars['String']>;
  grant_ends_with?: InputMaybe<Scalars['String']>;
  grant_ends_with_nocase?: InputMaybe<Scalars['String']>;
  grant_gt?: InputMaybe<Scalars['String']>;
  grant_gte?: InputMaybe<Scalars['String']>;
  grant_in?: InputMaybe<Array<Scalars['String']>>;
  grant_lt?: InputMaybe<Scalars['String']>;
  grant_lte?: InputMaybe<Scalars['String']>;
  grant_not?: InputMaybe<Scalars['String']>;
  grant_not_contains?: InputMaybe<Scalars['String']>;
  grant_not_contains_nocase?: InputMaybe<Scalars['String']>;
  grant_not_ends_with?: InputMaybe<Scalars['String']>;
  grant_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  grant_not_in?: InputMaybe<Array<Scalars['String']>>;
  grant_not_starts_with?: InputMaybe<Scalars['String']>;
  grant_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  grant_starts_with?: InputMaybe<Scalars['String']>;
  grant_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  milestones?: InputMaybe<Array<Scalars['String']>>;
  milestones_?: InputMaybe<ApplicationMilestone_Filter>;
  milestones_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  milestones_not?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  pii?: InputMaybe<Array<Scalars['String']>>;
  pii_?: InputMaybe<PiiAnswer_Filter>;
  pii_contains?: InputMaybe<Array<Scalars['String']>>;
  pii_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  pii_not?: InputMaybe<Array<Scalars['String']>>;
  pii_not_contains?: InputMaybe<Array<Scalars['String']>>;
  pii_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  reviewers?: InputMaybe<Array<Scalars['String']>>;
  reviewers_?: InputMaybe<WorkspaceMember_Filter>;
  reviewers_contains?: InputMaybe<Array<Scalars['String']>>;
  reviewers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  reviewers_not?: InputMaybe<Array<Scalars['String']>>;
  reviewers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  reviewers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  reviews_?: InputMaybe<Review_Filter>;
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
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum GrantApplication_OrderBy {
  ApplicantId = 'applicantId',
  ApplicationReviewers = 'applicationReviewers',
  CreatedAtS = 'createdAtS',
  FeedbackDao = 'feedbackDao',
  FeedbackDev = 'feedbackDev',
  Fields = 'fields',
  Grant = 'grant',
  Id = 'id',
  Milestones = 'milestones',
  Pii = 'pii',
  Reviewers = 'reviewers',
  Reviews = 'reviews',
  State = 'state',
  UpdatedAtS = 'updatedAtS',
  Version = 'version'
}

export type GrantField = {
  __typename?: 'GrantField';
  id: Scalars['ID'];
  inputType: GrantFieldInputType;
  isPii: Scalars['Boolean'];
  possibleValues?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
};

export type GrantFieldAnswer = {
  __typename?: 'GrantFieldAnswer';
  field: GrantField;
  id: Scalars['ID'];
  values: Array<GrantFieldAnswerItem>;
};


export type GrantFieldAnswerValuesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantFieldAnswerItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantFieldAnswerItem_Filter>;
};

export type GrantFieldAnswerItem = {
  __typename?: 'GrantFieldAnswerItem';
  answer: GrantFieldAnswer;
  id: Scalars['ID'];
  value: Scalars['String'];
  walletId?: Maybe<Scalars['Bytes']>;
};

export type GrantFieldAnswerItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  answer?: InputMaybe<Scalars['String']>;
  answer_?: InputMaybe<GrantFieldAnswer_Filter>;
  answer_contains?: InputMaybe<Scalars['String']>;
  answer_contains_nocase?: InputMaybe<Scalars['String']>;
  answer_ends_with?: InputMaybe<Scalars['String']>;
  answer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  answer_gt?: InputMaybe<Scalars['String']>;
  answer_gte?: InputMaybe<Scalars['String']>;
  answer_in?: InputMaybe<Array<Scalars['String']>>;
  answer_lt?: InputMaybe<Scalars['String']>;
  answer_lte?: InputMaybe<Scalars['String']>;
  answer_not?: InputMaybe<Scalars['String']>;
  answer_not_contains?: InputMaybe<Scalars['String']>;
  answer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  answer_not_ends_with?: InputMaybe<Scalars['String']>;
  answer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  answer_not_in?: InputMaybe<Array<Scalars['String']>>;
  answer_not_starts_with?: InputMaybe<Scalars['String']>;
  answer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  answer_starts_with?: InputMaybe<Scalars['String']>;
  answer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  value?: InputMaybe<Scalars['String']>;
  value_contains?: InputMaybe<Scalars['String']>;
  value_contains_nocase?: InputMaybe<Scalars['String']>;
  value_ends_with?: InputMaybe<Scalars['String']>;
  value_ends_with_nocase?: InputMaybe<Scalars['String']>;
  value_gt?: InputMaybe<Scalars['String']>;
  value_gte?: InputMaybe<Scalars['String']>;
  value_in?: InputMaybe<Array<Scalars['String']>>;
  value_lt?: InputMaybe<Scalars['String']>;
  value_lte?: InputMaybe<Scalars['String']>;
  value_not?: InputMaybe<Scalars['String']>;
  value_not_contains?: InputMaybe<Scalars['String']>;
  value_not_contains_nocase?: InputMaybe<Scalars['String']>;
  value_not_ends_with?: InputMaybe<Scalars['String']>;
  value_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  value_not_in?: InputMaybe<Array<Scalars['String']>>;
  value_not_starts_with?: InputMaybe<Scalars['String']>;
  value_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  value_starts_with?: InputMaybe<Scalars['String']>;
  value_starts_with_nocase?: InputMaybe<Scalars['String']>;
  walletId?: InputMaybe<Scalars['Bytes']>;
  walletId_contains?: InputMaybe<Scalars['Bytes']>;
  walletId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  walletId_not?: InputMaybe<Scalars['Bytes']>;
  walletId_not_contains?: InputMaybe<Scalars['Bytes']>;
  walletId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum GrantFieldAnswerItem_OrderBy {
  Answer = 'answer',
  Id = 'id',
  Value = 'value',
  WalletId = 'walletId'
}

export type GrantFieldAnswer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  field?: InputMaybe<Scalars['String']>;
  field_?: InputMaybe<GrantField_Filter>;
  field_contains?: InputMaybe<Scalars['String']>;
  field_contains_nocase?: InputMaybe<Scalars['String']>;
  field_ends_with?: InputMaybe<Scalars['String']>;
  field_ends_with_nocase?: InputMaybe<Scalars['String']>;
  field_gt?: InputMaybe<Scalars['String']>;
  field_gte?: InputMaybe<Scalars['String']>;
  field_in?: InputMaybe<Array<Scalars['String']>>;
  field_lt?: InputMaybe<Scalars['String']>;
  field_lte?: InputMaybe<Scalars['String']>;
  field_not?: InputMaybe<Scalars['String']>;
  field_not_contains?: InputMaybe<Scalars['String']>;
  field_not_contains_nocase?: InputMaybe<Scalars['String']>;
  field_not_ends_with?: InputMaybe<Scalars['String']>;
  field_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  field_not_in?: InputMaybe<Array<Scalars['String']>>;
  field_not_starts_with?: InputMaybe<Scalars['String']>;
  field_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  field_starts_with?: InputMaybe<Scalars['String']>;
  field_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  values_?: InputMaybe<GrantFieldAnswerItem_Filter>;
};

export enum GrantFieldAnswer_OrderBy {
  Field = 'field',
  Id = 'id',
  Values = 'values'
}

export enum GrantFieldInputType {
  Array = 'array',
  LongForm = 'long_form',
  Numeric = 'numeric',
  ShortForm = 'short_form'
}

export type GrantField_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  isPii?: InputMaybe<Scalars['Boolean']>;
  isPii_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPii_not?: InputMaybe<Scalars['Boolean']>;
  isPii_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  possibleValues?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_contains?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_not?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_not_contains?: InputMaybe<Array<Scalars['String']>>;
  possibleValues_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum GrantField_OrderBy {
  Id = 'id',
  InputType = 'inputType',
  IsPii = 'isPii',
  PossibleValues = 'possibleValues',
  Title = 'title'
}

export type GrantManager = {
  __typename?: 'GrantManager';
  /** Grant for which this entity is the manager */
  grant: Grant;
  /** Globally unique ID of the member */
  id: Scalars['ID'];
  /** Workspace member */
  member?: Maybe<WorkspaceMember>;
};

export type GrantManager_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  grant?: InputMaybe<Scalars['String']>;
  grant_?: InputMaybe<Grant_Filter>;
  grant_contains?: InputMaybe<Scalars['String']>;
  grant_contains_nocase?: InputMaybe<Scalars['String']>;
  grant_ends_with?: InputMaybe<Scalars['String']>;
  grant_ends_with_nocase?: InputMaybe<Scalars['String']>;
  grant_gt?: InputMaybe<Scalars['String']>;
  grant_gte?: InputMaybe<Scalars['String']>;
  grant_in?: InputMaybe<Array<Scalars['String']>>;
  grant_lt?: InputMaybe<Scalars['String']>;
  grant_lte?: InputMaybe<Scalars['String']>;
  grant_not?: InputMaybe<Scalars['String']>;
  grant_not_contains?: InputMaybe<Scalars['String']>;
  grant_not_contains_nocase?: InputMaybe<Scalars['String']>;
  grant_not_ends_with?: InputMaybe<Scalars['String']>;
  grant_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  grant_not_in?: InputMaybe<Array<Scalars['String']>>;
  grant_not_starts_with?: InputMaybe<Scalars['String']>;
  grant_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  grant_starts_with?: InputMaybe<Scalars['String']>;
  grant_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  member?: InputMaybe<Scalars['String']>;
  member_?: InputMaybe<WorkspaceMember_Filter>;
  member_contains?: InputMaybe<Scalars['String']>;
  member_contains_nocase?: InputMaybe<Scalars['String']>;
  member_ends_with?: InputMaybe<Scalars['String']>;
  member_ends_with_nocase?: InputMaybe<Scalars['String']>;
  member_gt?: InputMaybe<Scalars['String']>;
  member_gte?: InputMaybe<Scalars['String']>;
  member_in?: InputMaybe<Array<Scalars['String']>>;
  member_lt?: InputMaybe<Scalars['String']>;
  member_lte?: InputMaybe<Scalars['String']>;
  member_not?: InputMaybe<Scalars['String']>;
  member_not_contains?: InputMaybe<Scalars['String']>;
  member_not_contains_nocase?: InputMaybe<Scalars['String']>;
  member_not_ends_with?: InputMaybe<Scalars['String']>;
  member_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  member_not_in?: InputMaybe<Array<Scalars['String']>>;
  member_not_starts_with?: InputMaybe<Scalars['String']>;
  member_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  member_starts_with?: InputMaybe<Scalars['String']>;
  member_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum GrantManager_OrderBy {
  Grant = 'grant',
  Id = 'id',
  Member = 'member'
}

export type Grant_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  acceptingApplications?: InputMaybe<Scalars['Boolean']>;
  acceptingApplications_in?: InputMaybe<Array<Scalars['Boolean']>>;
  acceptingApplications_not?: InputMaybe<Scalars['Boolean']>;
  acceptingApplications_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  applications_?: InputMaybe<GrantApplication_Filter>;
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
  deadlineS?: InputMaybe<Scalars['Int']>;
  deadlineS_gt?: InputMaybe<Scalars['Int']>;
  deadlineS_gte?: InputMaybe<Scalars['Int']>;
  deadlineS_in?: InputMaybe<Array<Scalars['Int']>>;
  deadlineS_lt?: InputMaybe<Scalars['Int']>;
  deadlineS_lte?: InputMaybe<Scalars['Int']>;
  deadlineS_not?: InputMaybe<Scalars['Int']>;
  deadlineS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  deadline_contains?: InputMaybe<Scalars['String']>;
  deadline_contains_nocase?: InputMaybe<Scalars['String']>;
  deadline_ends_with?: InputMaybe<Scalars['String']>;
  deadline_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deadline_gt?: InputMaybe<Scalars['String']>;
  deadline_gte?: InputMaybe<Scalars['String']>;
  deadline_in?: InputMaybe<Array<Scalars['String']>>;
  deadline_lt?: InputMaybe<Scalars['String']>;
  deadline_lte?: InputMaybe<Scalars['String']>;
  deadline_not?: InputMaybe<Scalars['String']>;
  deadline_not_contains?: InputMaybe<Scalars['String']>;
  deadline_not_contains_nocase?: InputMaybe<Scalars['String']>;
  deadline_not_ends_with?: InputMaybe<Scalars['String']>;
  deadline_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deadline_not_in?: InputMaybe<Array<Scalars['String']>>;
  deadline_not_starts_with?: InputMaybe<Scalars['String']>;
  deadline_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deadline_starts_with?: InputMaybe<Scalars['String']>;
  deadline_starts_with_nocase?: InputMaybe<Scalars['String']>;
  details?: InputMaybe<Scalars['String']>;
  details_contains?: InputMaybe<Scalars['String']>;
  details_contains_nocase?: InputMaybe<Scalars['String']>;
  details_ends_with?: InputMaybe<Scalars['String']>;
  details_ends_with_nocase?: InputMaybe<Scalars['String']>;
  details_gt?: InputMaybe<Scalars['String']>;
  details_gte?: InputMaybe<Scalars['String']>;
  details_in?: InputMaybe<Array<Scalars['String']>>;
  details_lt?: InputMaybe<Scalars['String']>;
  details_lte?: InputMaybe<Scalars['String']>;
  details_not?: InputMaybe<Scalars['String']>;
  details_not_contains?: InputMaybe<Scalars['String']>;
  details_not_contains_nocase?: InputMaybe<Scalars['String']>;
  details_not_ends_with?: InputMaybe<Scalars['String']>;
  details_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  details_not_in?: InputMaybe<Array<Scalars['String']>>;
  details_not_starts_with?: InputMaybe<Scalars['String']>;
  details_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  details_starts_with?: InputMaybe<Scalars['String']>;
  details_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  fields_?: InputMaybe<GrantField_Filter>;
  fields_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  fields_not?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains?: InputMaybe<Array<Scalars['String']>>;
  fields_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  fundTransfers_?: InputMaybe<FundsTransfer_Filter>;
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
  managers?: InputMaybe<Array<Scalars['String']>>;
  managers_?: InputMaybe<GrantManager_Filter>;
  managers_contains?: InputMaybe<Array<Scalars['String']>>;
  managers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  managers_not?: InputMaybe<Array<Scalars['String']>>;
  managers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  managers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  metadataHash?: InputMaybe<Scalars['String']>;
  metadataHash_contains?: InputMaybe<Scalars['String']>;
  metadataHash_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_gt?: InputMaybe<Scalars['String']>;
  metadataHash_gte?: InputMaybe<Scalars['String']>;
  metadataHash_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_lt?: InputMaybe<Scalars['String']>;
  metadataHash_lte?: InputMaybe<Scalars['String']>;
  metadataHash_not?: InputMaybe<Scalars['String']>;
  metadataHash_not_contains?: InputMaybe<Scalars['String']>;
  metadataHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_starts_with?: InputMaybe<Scalars['String']>;
  metadataHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  numberOfApplications?: InputMaybe<Scalars['Int']>;
  numberOfApplications_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplications_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not_in?: InputMaybe<Array<Scalars['Int']>>;
  reward?: InputMaybe<Scalars['String']>;
  reward_?: InputMaybe<Reward_Filter>;
  reward_contains?: InputMaybe<Scalars['String']>;
  reward_contains_nocase?: InputMaybe<Scalars['String']>;
  reward_ends_with?: InputMaybe<Scalars['String']>;
  reward_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reward_gt?: InputMaybe<Scalars['String']>;
  reward_gte?: InputMaybe<Scalars['String']>;
  reward_in?: InputMaybe<Array<Scalars['String']>>;
  reward_lt?: InputMaybe<Scalars['String']>;
  reward_lte?: InputMaybe<Scalars['String']>;
  reward_not?: InputMaybe<Scalars['String']>;
  reward_not_contains?: InputMaybe<Scalars['String']>;
  reward_not_contains_nocase?: InputMaybe<Scalars['String']>;
  reward_not_ends_with?: InputMaybe<Scalars['String']>;
  reward_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reward_not_in?: InputMaybe<Array<Scalars['String']>>;
  reward_not_starts_with?: InputMaybe<Scalars['String']>;
  reward_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reward_starts_with?: InputMaybe<Scalars['String']>;
  reward_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rubric?: InputMaybe<Scalars['String']>;
  rubric_?: InputMaybe<Rubric_Filter>;
  rubric_contains?: InputMaybe<Scalars['String']>;
  rubric_contains_nocase?: InputMaybe<Scalars['String']>;
  rubric_ends_with?: InputMaybe<Scalars['String']>;
  rubric_ends_with_nocase?: InputMaybe<Scalars['String']>;
  rubric_gt?: InputMaybe<Scalars['String']>;
  rubric_gte?: InputMaybe<Scalars['String']>;
  rubric_in?: InputMaybe<Array<Scalars['String']>>;
  rubric_lt?: InputMaybe<Scalars['String']>;
  rubric_lte?: InputMaybe<Scalars['String']>;
  rubric_not?: InputMaybe<Scalars['String']>;
  rubric_not_contains?: InputMaybe<Scalars['String']>;
  rubric_not_contains_nocase?: InputMaybe<Scalars['String']>;
  rubric_not_ends_with?: InputMaybe<Scalars['String']>;
  rubric_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  rubric_not_in?: InputMaybe<Array<Scalars['String']>>;
  rubric_not_starts_with?: InputMaybe<Scalars['String']>;
  rubric_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rubric_starts_with?: InputMaybe<Scalars['String']>;
  rubric_starts_with_nocase?: InputMaybe<Scalars['String']>;
  summary?: InputMaybe<Scalars['String']>;
  summary_contains?: InputMaybe<Scalars['String']>;
  summary_contains_nocase?: InputMaybe<Scalars['String']>;
  summary_ends_with?: InputMaybe<Scalars['String']>;
  summary_ends_with_nocase?: InputMaybe<Scalars['String']>;
  summary_gt?: InputMaybe<Scalars['String']>;
  summary_gte?: InputMaybe<Scalars['String']>;
  summary_in?: InputMaybe<Array<Scalars['String']>>;
  summary_lt?: InputMaybe<Scalars['String']>;
  summary_lte?: InputMaybe<Scalars['String']>;
  summary_not?: InputMaybe<Scalars['String']>;
  summary_not_contains?: InputMaybe<Scalars['String']>;
  summary_not_contains_nocase?: InputMaybe<Scalars['String']>;
  summary_not_ends_with?: InputMaybe<Scalars['String']>;
  summary_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  summary_not_in?: InputMaybe<Array<Scalars['String']>>;
  summary_not_starts_with?: InputMaybe<Scalars['String']>;
  summary_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  summary_starts_with?: InputMaybe<Scalars['String']>;
  summary_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtS?: InputMaybe<Scalars['Int']>;
  updatedAtS_gt?: InputMaybe<Scalars['Int']>;
  updatedAtS_gte?: InputMaybe<Scalars['Int']>;
  updatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtS_lt?: InputMaybe<Scalars['Int']>;
  updatedAtS_lte?: InputMaybe<Scalars['Int']>;
  updatedAtS_not?: InputMaybe<Scalars['Int']>;
  updatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  workspace?: InputMaybe<Scalars['String']>;
  workspace_?: InputMaybe<Workspace_Filter>;
  workspace_contains?: InputMaybe<Scalars['String']>;
  workspace_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_ends_with?: InputMaybe<Scalars['String']>;
  workspace_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_gt?: InputMaybe<Scalars['String']>;
  workspace_gte?: InputMaybe<Scalars['String']>;
  workspace_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_lt?: InputMaybe<Scalars['String']>;
  workspace_lte?: InputMaybe<Scalars['String']>;
  workspace_not?: InputMaybe<Scalars['String']>;
  workspace_not_contains?: InputMaybe<Scalars['String']>;
  workspace_not_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_not_starts_with?: InputMaybe<Scalars['String']>;
  workspace_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_starts_with?: InputMaybe<Scalars['String']>;
  workspace_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Grant_OrderBy {
  AcceptingApplications = 'acceptingApplications',
  Applications = 'applications',
  CreatedAtS = 'createdAtS',
  CreatorId = 'creatorId',
  Deadline = 'deadline',
  DeadlineS = 'deadlineS',
  Details = 'details',
  Fields = 'fields',
  FundTransfers = 'fundTransfers',
  Funding = 'funding',
  Id = 'id',
  Managers = 'managers',
  MetadataHash = 'metadataHash',
  NumberOfApplications = 'numberOfApplications',
  Reward = 'reward',
  Rubric = 'rubric',
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
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  actorId?: InputMaybe<Scalars['Bytes']>;
  actorId_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_not?: InputMaybe<Scalars['Bytes']>;
  actorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  content?: InputMaybe<Scalars['String']>;
  content_contains?: InputMaybe<Scalars['String']>;
  content_contains_nocase?: InputMaybe<Scalars['String']>;
  content_ends_with?: InputMaybe<Scalars['String']>;
  content_ends_with_nocase?: InputMaybe<Scalars['String']>;
  content_gt?: InputMaybe<Scalars['String']>;
  content_gte?: InputMaybe<Scalars['String']>;
  content_in?: InputMaybe<Array<Scalars['String']>>;
  content_lt?: InputMaybe<Scalars['String']>;
  content_lte?: InputMaybe<Scalars['String']>;
  content_not?: InputMaybe<Scalars['String']>;
  content_not_contains?: InputMaybe<Scalars['String']>;
  content_not_contains_nocase?: InputMaybe<Scalars['String']>;
  content_not_ends_with?: InputMaybe<Scalars['String']>;
  content_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  content_not_in?: InputMaybe<Array<Scalars['String']>>;
  content_not_starts_with?: InputMaybe<Scalars['String']>;
  content_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  content_starts_with?: InputMaybe<Scalars['String']>;
  content_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cursor?: InputMaybe<Scalars['String']>;
  cursor_contains?: InputMaybe<Scalars['String']>;
  cursor_contains_nocase?: InputMaybe<Scalars['String']>;
  cursor_ends_with?: InputMaybe<Scalars['String']>;
  cursor_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cursor_gt?: InputMaybe<Scalars['String']>;
  cursor_gte?: InputMaybe<Scalars['String']>;
  cursor_in?: InputMaybe<Array<Scalars['String']>>;
  cursor_lt?: InputMaybe<Scalars['String']>;
  cursor_lte?: InputMaybe<Scalars['String']>;
  cursor_not?: InputMaybe<Scalars['String']>;
  cursor_not_contains?: InputMaybe<Scalars['String']>;
  cursor_not_contains_nocase?: InputMaybe<Scalars['String']>;
  cursor_not_ends_with?: InputMaybe<Scalars['String']>;
  cursor_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  cursor_not_in?: InputMaybe<Array<Scalars['String']>>;
  cursor_not_starts_with?: InputMaybe<Scalars['String']>;
  cursor_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  cursor_starts_with?: InputMaybe<Scalars['String']>;
  cursor_starts_with_nocase?: InputMaybe<Scalars['String']>;
  entityId?: InputMaybe<Scalars['String']>;
  entityId_contains?: InputMaybe<Scalars['String']>;
  entityId_contains_nocase?: InputMaybe<Scalars['String']>;
  entityId_ends_with?: InputMaybe<Scalars['String']>;
  entityId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  entityId_gt?: InputMaybe<Scalars['String']>;
  entityId_gte?: InputMaybe<Scalars['String']>;
  entityId_in?: InputMaybe<Array<Scalars['String']>>;
  entityId_lt?: InputMaybe<Scalars['String']>;
  entityId_lte?: InputMaybe<Scalars['String']>;
  entityId_not?: InputMaybe<Scalars['String']>;
  entityId_not_contains?: InputMaybe<Scalars['String']>;
  entityId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  entityId_not_ends_with?: InputMaybe<Scalars['String']>;
  entityId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  entityId_not_in?: InputMaybe<Array<Scalars['String']>>;
  entityId_not_starts_with?: InputMaybe<Scalars['String']>;
  entityId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  entityId_starts_with?: InputMaybe<Scalars['String']>;
  entityId_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  recipientIds_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  recipientIds_not?: InputMaybe<Array<Scalars['Bytes']>>;
  recipientIds_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  recipientIds_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
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

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PiiAnswer = {
  __typename?: 'PIIAnswer';
  /** The encrypted data */
  data: Scalars['String'];
  id: Scalars['ID'];
  /** Grant manager who can access this encrypted info */
  manager?: Maybe<GrantManager>;
};

export type PiiAnswer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  data?: InputMaybe<Scalars['String']>;
  data_contains?: InputMaybe<Scalars['String']>;
  data_contains_nocase?: InputMaybe<Scalars['String']>;
  data_ends_with?: InputMaybe<Scalars['String']>;
  data_ends_with_nocase?: InputMaybe<Scalars['String']>;
  data_gt?: InputMaybe<Scalars['String']>;
  data_gte?: InputMaybe<Scalars['String']>;
  data_in?: InputMaybe<Array<Scalars['String']>>;
  data_lt?: InputMaybe<Scalars['String']>;
  data_lte?: InputMaybe<Scalars['String']>;
  data_not?: InputMaybe<Scalars['String']>;
  data_not_contains?: InputMaybe<Scalars['String']>;
  data_not_contains_nocase?: InputMaybe<Scalars['String']>;
  data_not_ends_with?: InputMaybe<Scalars['String']>;
  data_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  data_not_in?: InputMaybe<Array<Scalars['String']>>;
  data_not_starts_with?: InputMaybe<Scalars['String']>;
  data_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  data_starts_with?: InputMaybe<Scalars['String']>;
  data_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  manager?: InputMaybe<Scalars['String']>;
  manager_?: InputMaybe<GrantManager_Filter>;
  manager_contains?: InputMaybe<Scalars['String']>;
  manager_contains_nocase?: InputMaybe<Scalars['String']>;
  manager_ends_with?: InputMaybe<Scalars['String']>;
  manager_ends_with_nocase?: InputMaybe<Scalars['String']>;
  manager_gt?: InputMaybe<Scalars['String']>;
  manager_gte?: InputMaybe<Scalars['String']>;
  manager_in?: InputMaybe<Array<Scalars['String']>>;
  manager_lt?: InputMaybe<Scalars['String']>;
  manager_lte?: InputMaybe<Scalars['String']>;
  manager_not?: InputMaybe<Scalars['String']>;
  manager_not_contains?: InputMaybe<Scalars['String']>;
  manager_not_contains_nocase?: InputMaybe<Scalars['String']>;
  manager_not_ends_with?: InputMaybe<Scalars['String']>;
  manager_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  manager_not_in?: InputMaybe<Array<Scalars['String']>>;
  manager_not_starts_with?: InputMaybe<Scalars['String']>;
  manager_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  manager_starts_with?: InputMaybe<Scalars['String']>;
  manager_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum PiiAnswer_OrderBy {
  Data = 'data',
  Id = 'id',
  Manager = 'manager'
}

export type Partner = {
  __typename?: 'Partner';
  id: Scalars['ID'];
  industry: Scalars['String'];
  name: Scalars['String'];
  partnerImageHash?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type Partner_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  industry?: InputMaybe<Scalars['String']>;
  industry_contains?: InputMaybe<Scalars['String']>;
  industry_contains_nocase?: InputMaybe<Scalars['String']>;
  industry_ends_with?: InputMaybe<Scalars['String']>;
  industry_ends_with_nocase?: InputMaybe<Scalars['String']>;
  industry_gt?: InputMaybe<Scalars['String']>;
  industry_gte?: InputMaybe<Scalars['String']>;
  industry_in?: InputMaybe<Array<Scalars['String']>>;
  industry_lt?: InputMaybe<Scalars['String']>;
  industry_lte?: InputMaybe<Scalars['String']>;
  industry_not?: InputMaybe<Scalars['String']>;
  industry_not_contains?: InputMaybe<Scalars['String']>;
  industry_not_contains_nocase?: InputMaybe<Scalars['String']>;
  industry_not_ends_with?: InputMaybe<Scalars['String']>;
  industry_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  industry_not_in?: InputMaybe<Array<Scalars['String']>>;
  industry_not_starts_with?: InputMaybe<Scalars['String']>;
  industry_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  industry_starts_with?: InputMaybe<Scalars['String']>;
  industry_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  partnerImageHash?: InputMaybe<Scalars['String']>;
  partnerImageHash_contains?: InputMaybe<Scalars['String']>;
  partnerImageHash_contains_nocase?: InputMaybe<Scalars['String']>;
  partnerImageHash_ends_with?: InputMaybe<Scalars['String']>;
  partnerImageHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  partnerImageHash_gt?: InputMaybe<Scalars['String']>;
  partnerImageHash_gte?: InputMaybe<Scalars['String']>;
  partnerImageHash_in?: InputMaybe<Array<Scalars['String']>>;
  partnerImageHash_lt?: InputMaybe<Scalars['String']>;
  partnerImageHash_lte?: InputMaybe<Scalars['String']>;
  partnerImageHash_not?: InputMaybe<Scalars['String']>;
  partnerImageHash_not_contains?: InputMaybe<Scalars['String']>;
  partnerImageHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  partnerImageHash_not_ends_with?: InputMaybe<Scalars['String']>;
  partnerImageHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  partnerImageHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  partnerImageHash_not_starts_with?: InputMaybe<Scalars['String']>;
  partnerImageHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  partnerImageHash_starts_with?: InputMaybe<Scalars['String']>;
  partnerImageHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
  website_contains?: InputMaybe<Scalars['String']>;
  website_contains_nocase?: InputMaybe<Scalars['String']>;
  website_ends_with?: InputMaybe<Scalars['String']>;
  website_ends_with_nocase?: InputMaybe<Scalars['String']>;
  website_gt?: InputMaybe<Scalars['String']>;
  website_gte?: InputMaybe<Scalars['String']>;
  website_in?: InputMaybe<Array<Scalars['String']>>;
  website_lt?: InputMaybe<Scalars['String']>;
  website_lte?: InputMaybe<Scalars['String']>;
  website_not?: InputMaybe<Scalars['String']>;
  website_not_contains?: InputMaybe<Scalars['String']>;
  website_not_contains_nocase?: InputMaybe<Scalars['String']>;
  website_not_ends_with?: InputMaybe<Scalars['String']>;
  website_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  website_not_in?: InputMaybe<Array<Scalars['String']>>;
  website_not_starts_with?: InputMaybe<Scalars['String']>;
  website_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  website_starts_with?: InputMaybe<Scalars['String']>;
  website_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Partner_OrderBy {
  Id = 'id',
  Industry = 'industry',
  Name = 'name',
  PartnerImageHash = 'partnerImageHash',
  Website = 'website'
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
  grantApplicationReviewer?: Maybe<GrantApplicationReviewer>;
  grantApplicationReviewers: Array<GrantApplicationReviewer>;
  grantApplicationRevision?: Maybe<GrantApplicationRevision>;
  grantApplicationRevisions: Array<GrantApplicationRevision>;
  grantApplications: Array<GrantApplication>;
  grantField?: Maybe<GrantField>;
  grantFieldAnswer?: Maybe<GrantFieldAnswer>;
  grantFieldAnswerItem?: Maybe<GrantFieldAnswerItem>;
  grantFieldAnswerItems: Array<GrantFieldAnswerItem>;
  grantFieldAnswers: Array<GrantFieldAnswer>;
  grantFields: Array<GrantField>;
  grantManager?: Maybe<GrantManager>;
  grantManagers: Array<GrantManager>;
  grants: Array<Grant>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  partner?: Maybe<Partner>;
  partners: Array<Partner>;
  piianswer?: Maybe<PiiAnswer>;
  piianswers: Array<PiiAnswer>;
  review?: Maybe<Review>;
  reviews: Array<Review>;
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  rubric?: Maybe<Rubric>;
  rubricItem?: Maybe<RubricItem>;
  rubricItems: Array<RubricItem>;
  rubrics: Array<Rubric>;
  social?: Maybe<Social>;
  socials: Array<Social>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  workspace?: Maybe<Workspace>;
  workspaceMember?: Maybe<WorkspaceMember>;
  workspaceMembers: Array<WorkspaceMember>;
  workspaceSafe?: Maybe<WorkspaceSafe>;
  workspaceSafes: Array<WorkspaceSafe>;
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


export type QueryGrantApplicationReviewerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantApplicationReviewersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplicationReviewer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantApplicationReviewer_Filter>;
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


export type QueryGrantFieldAnswerItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantFieldAnswerItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantFieldAnswerItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantFieldAnswerItem_Filter>;
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


export type QueryGrantManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantManager_Filter>;
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


export type QueryPartnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPartnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Partner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Partner_Filter>;
};


export type QueryPiianswerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPiianswersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PiiAnswer_Filter>;
};


export type QueryReviewArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryReviewsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Review_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Review_Filter>;
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


export type QueryRubricArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRubricItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRubricItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RubricItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RubricItem_Filter>;
};


export type QueryRubricsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Rubric_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rubric_Filter>;
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


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
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


export type QueryWorkspaceSafeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWorkspaceSafesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WorkspaceSafe_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WorkspaceSafe_Filter>;
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

export type Review = {
  __typename?: 'Review';
  /** Application for which the review is */
  application: GrantApplication;
  /** created at S */
  createdAtS: Scalars['Int'];
  /** The encrypted data of the review */
  data: Array<PiiAnswer>;
  id: Scalars['ID'];
  /** IPFS Hash to the publicly accessible review */
  publicReviewDataHash?: Maybe<Scalars['String']>;
  /** Workspace member that reviewed the app */
  reviewer?: Maybe<WorkspaceMember>;
  /** ID of the reviewer */
  reviewerId: Scalars['String'];
};


export type ReviewDataArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PiiAnswer_Filter>;
};

export type Review_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  application?: InputMaybe<Scalars['String']>;
  application_?: InputMaybe<GrantApplication_Filter>;
  application_contains?: InputMaybe<Scalars['String']>;
  application_contains_nocase?: InputMaybe<Scalars['String']>;
  application_ends_with?: InputMaybe<Scalars['String']>;
  application_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_gt?: InputMaybe<Scalars['String']>;
  application_gte?: InputMaybe<Scalars['String']>;
  application_in?: InputMaybe<Array<Scalars['String']>>;
  application_lt?: InputMaybe<Scalars['String']>;
  application_lte?: InputMaybe<Scalars['String']>;
  application_not?: InputMaybe<Scalars['String']>;
  application_not_contains?: InputMaybe<Scalars['String']>;
  application_not_contains_nocase?: InputMaybe<Scalars['String']>;
  application_not_ends_with?: InputMaybe<Scalars['String']>;
  application_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  application_not_in?: InputMaybe<Array<Scalars['String']>>;
  application_not_starts_with?: InputMaybe<Scalars['String']>;
  application_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  application_starts_with?: InputMaybe<Scalars['String']>;
  application_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  data?: InputMaybe<Array<Scalars['String']>>;
  data_?: InputMaybe<PiiAnswer_Filter>;
  data_contains?: InputMaybe<Array<Scalars['String']>>;
  data_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  data_not?: InputMaybe<Array<Scalars['String']>>;
  data_not_contains?: InputMaybe<Array<Scalars['String']>>;
  data_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  publicReviewDataHash?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_contains?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_contains_nocase?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_ends_with?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_gt?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_gte?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_in?: InputMaybe<Array<Scalars['String']>>;
  publicReviewDataHash_lt?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_lte?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_not?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_not_contains?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_not_ends_with?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  publicReviewDataHash_not_starts_with?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_starts_with?: InputMaybe<Scalars['String']>;
  publicReviewDataHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reviewer?: InputMaybe<Scalars['String']>;
  reviewerId?: InputMaybe<Scalars['String']>;
  reviewerId_contains?: InputMaybe<Scalars['String']>;
  reviewerId_contains_nocase?: InputMaybe<Scalars['String']>;
  reviewerId_ends_with?: InputMaybe<Scalars['String']>;
  reviewerId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reviewerId_gt?: InputMaybe<Scalars['String']>;
  reviewerId_gte?: InputMaybe<Scalars['String']>;
  reviewerId_in?: InputMaybe<Array<Scalars['String']>>;
  reviewerId_lt?: InputMaybe<Scalars['String']>;
  reviewerId_lte?: InputMaybe<Scalars['String']>;
  reviewerId_not?: InputMaybe<Scalars['String']>;
  reviewerId_not_contains?: InputMaybe<Scalars['String']>;
  reviewerId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  reviewerId_not_ends_with?: InputMaybe<Scalars['String']>;
  reviewerId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reviewerId_not_in?: InputMaybe<Array<Scalars['String']>>;
  reviewerId_not_starts_with?: InputMaybe<Scalars['String']>;
  reviewerId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reviewerId_starts_with?: InputMaybe<Scalars['String']>;
  reviewerId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reviewer_?: InputMaybe<WorkspaceMember_Filter>;
  reviewer_contains?: InputMaybe<Scalars['String']>;
  reviewer_contains_nocase?: InputMaybe<Scalars['String']>;
  reviewer_ends_with?: InputMaybe<Scalars['String']>;
  reviewer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reviewer_gt?: InputMaybe<Scalars['String']>;
  reviewer_gte?: InputMaybe<Scalars['String']>;
  reviewer_in?: InputMaybe<Array<Scalars['String']>>;
  reviewer_lt?: InputMaybe<Scalars['String']>;
  reviewer_lte?: InputMaybe<Scalars['String']>;
  reviewer_not?: InputMaybe<Scalars['String']>;
  reviewer_not_contains?: InputMaybe<Scalars['String']>;
  reviewer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  reviewer_not_ends_with?: InputMaybe<Scalars['String']>;
  reviewer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reviewer_not_in?: InputMaybe<Array<Scalars['String']>>;
  reviewer_not_starts_with?: InputMaybe<Scalars['String']>;
  reviewer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reviewer_starts_with?: InputMaybe<Scalars['String']>;
  reviewer_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Review_OrderBy {
  Application = 'application',
  CreatedAtS = 'createdAtS',
  Data = 'data',
  Id = 'id',
  PublicReviewDataHash = 'publicReviewDataHash',
  Reviewer = 'reviewer',
  ReviewerId = 'reviewerId'
}

export type Reward = {
  __typename?: 'Reward';
  asset: Scalars['Bytes'];
  committed: Scalars['BigInt'];
  id: Scalars['ID'];
  token?: Maybe<Token>;
};

export type Reward_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Reward_OrderBy {
  Asset = 'asset',
  Committed = 'committed',
  Id = 'id',
  Token = 'token'
}

export type Rubric = {
  __typename?: 'Rubric';
  /** Who added this rubric */
  addedBy?: Maybe<WorkspaceMember>;
  /** Unix timestamp of when the rubric was created */
  createdAtS: Scalars['Int'];
  id: Scalars['ID'];
  /** Is private evaluation */
  isPrivate: Scalars['Boolean'];
  items: Array<RubricItem>;
  /** Unix timestamp of when the rubric was updated */
  updatedAtS: Scalars['Int'];
};


export type RubricItemsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RubricItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RubricItem_Filter>;
};

export type RubricItem = {
  __typename?: 'RubricItem';
  details: Scalars['String'];
  id: Scalars['ID'];
  maximumPoints: Scalars['Int'];
  title: Scalars['String'];
};

export type RubricItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  details?: InputMaybe<Scalars['String']>;
  details_contains?: InputMaybe<Scalars['String']>;
  details_contains_nocase?: InputMaybe<Scalars['String']>;
  details_ends_with?: InputMaybe<Scalars['String']>;
  details_ends_with_nocase?: InputMaybe<Scalars['String']>;
  details_gt?: InputMaybe<Scalars['String']>;
  details_gte?: InputMaybe<Scalars['String']>;
  details_in?: InputMaybe<Array<Scalars['String']>>;
  details_lt?: InputMaybe<Scalars['String']>;
  details_lte?: InputMaybe<Scalars['String']>;
  details_not?: InputMaybe<Scalars['String']>;
  details_not_contains?: InputMaybe<Scalars['String']>;
  details_not_contains_nocase?: InputMaybe<Scalars['String']>;
  details_not_ends_with?: InputMaybe<Scalars['String']>;
  details_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  details_not_in?: InputMaybe<Array<Scalars['String']>>;
  details_not_starts_with?: InputMaybe<Scalars['String']>;
  details_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  details_starts_with?: InputMaybe<Scalars['String']>;
  details_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maximumPoints?: InputMaybe<Scalars['Int']>;
  maximumPoints_gt?: InputMaybe<Scalars['Int']>;
  maximumPoints_gte?: InputMaybe<Scalars['Int']>;
  maximumPoints_in?: InputMaybe<Array<Scalars['Int']>>;
  maximumPoints_lt?: InputMaybe<Scalars['Int']>;
  maximumPoints_lte?: InputMaybe<Scalars['Int']>;
  maximumPoints_not?: InputMaybe<Scalars['Int']>;
  maximumPoints_not_in?: InputMaybe<Array<Scalars['Int']>>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum RubricItem_OrderBy {
  Details = 'details',
  Id = 'id',
  MaximumPoints = 'maximumPoints',
  Title = 'title'
}

export type Rubric_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedBy?: InputMaybe<Scalars['String']>;
  addedBy_?: InputMaybe<WorkspaceMember_Filter>;
  addedBy_contains?: InputMaybe<Scalars['String']>;
  addedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  addedBy_ends_with?: InputMaybe<Scalars['String']>;
  addedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  addedBy_gt?: InputMaybe<Scalars['String']>;
  addedBy_gte?: InputMaybe<Scalars['String']>;
  addedBy_in?: InputMaybe<Array<Scalars['String']>>;
  addedBy_lt?: InputMaybe<Scalars['String']>;
  addedBy_lte?: InputMaybe<Scalars['String']>;
  addedBy_not?: InputMaybe<Scalars['String']>;
  addedBy_not_contains?: InputMaybe<Scalars['String']>;
  addedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  addedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  addedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  addedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  addedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  addedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  addedBy_starts_with?: InputMaybe<Scalars['String']>;
  addedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  isPrivate_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPrivate_not?: InputMaybe<Scalars['Boolean']>;
  isPrivate_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  items?: InputMaybe<Array<Scalars['String']>>;
  items_?: InputMaybe<RubricItem_Filter>;
  items_contains?: InputMaybe<Array<Scalars['String']>>;
  items_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  items_not?: InputMaybe<Array<Scalars['String']>>;
  items_not_contains?: InputMaybe<Array<Scalars['String']>>;
  items_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  updatedAtS?: InputMaybe<Scalars['Int']>;
  updatedAtS_gt?: InputMaybe<Scalars['Int']>;
  updatedAtS_gte?: InputMaybe<Scalars['Int']>;
  updatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtS_lt?: InputMaybe<Scalars['Int']>;
  updatedAtS_lte?: InputMaybe<Scalars['Int']>;
  updatedAtS_not?: InputMaybe<Scalars['Int']>;
  updatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Rubric_OrderBy {
  AddedBy = 'addedBy',
  CreatedAtS = 'createdAtS',
  Id = 'id',
  IsPrivate = 'isPrivate',
  Items = 'items',
  UpdatedAtS = 'updatedAtS'
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
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
  value_contains?: InputMaybe<Scalars['String']>;
  value_contains_nocase?: InputMaybe<Scalars['String']>;
  value_ends_with?: InputMaybe<Scalars['String']>;
  value_ends_with_nocase?: InputMaybe<Scalars['String']>;
  value_gt?: InputMaybe<Scalars['String']>;
  value_gte?: InputMaybe<Scalars['String']>;
  value_in?: InputMaybe<Array<Scalars['String']>>;
  value_lt?: InputMaybe<Scalars['String']>;
  value_lte?: InputMaybe<Scalars['String']>;
  value_not?: InputMaybe<Scalars['String']>;
  value_not_contains?: InputMaybe<Scalars['String']>;
  value_not_contains_nocase?: InputMaybe<Scalars['String']>;
  value_not_ends_with?: InputMaybe<Scalars['String']>;
  value_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  value_not_in?: InputMaybe<Array<Scalars['String']>>;
  value_not_starts_with?: InputMaybe<Scalars['String']>;
  value_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  value_starts_with?: InputMaybe<Scalars['String']>;
  value_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  grantApplicationReviewer?: Maybe<GrantApplicationReviewer>;
  grantApplicationReviewers: Array<GrantApplicationReviewer>;
  grantApplicationRevision?: Maybe<GrantApplicationRevision>;
  grantApplicationRevisions: Array<GrantApplicationRevision>;
  grantApplications: Array<GrantApplication>;
  grantField?: Maybe<GrantField>;
  grantFieldAnswer?: Maybe<GrantFieldAnswer>;
  grantFieldAnswerItem?: Maybe<GrantFieldAnswerItem>;
  grantFieldAnswerItems: Array<GrantFieldAnswerItem>;
  grantFieldAnswers: Array<GrantFieldAnswer>;
  grantFields: Array<GrantField>;
  grantManager?: Maybe<GrantManager>;
  grantManagers: Array<GrantManager>;
  grants: Array<Grant>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  partner?: Maybe<Partner>;
  partners: Array<Partner>;
  piianswer?: Maybe<PiiAnswer>;
  piianswers: Array<PiiAnswer>;
  review?: Maybe<Review>;
  reviews: Array<Review>;
  reward?: Maybe<Reward>;
  rewards: Array<Reward>;
  rubric?: Maybe<Rubric>;
  rubricItem?: Maybe<RubricItem>;
  rubricItems: Array<RubricItem>;
  rubrics: Array<Rubric>;
  social?: Maybe<Social>;
  socials: Array<Social>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  workspace?: Maybe<Workspace>;
  workspaceMember?: Maybe<WorkspaceMember>;
  workspaceMembers: Array<WorkspaceMember>;
  workspaceSafe?: Maybe<WorkspaceSafe>;
  workspaceSafes: Array<WorkspaceSafe>;
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


export type SubscriptionGrantApplicationReviewerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantApplicationReviewersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplicationReviewer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantApplicationReviewer_Filter>;
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


export type SubscriptionGrantFieldAnswerItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantFieldAnswerItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantFieldAnswerItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantFieldAnswerItem_Filter>;
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


export type SubscriptionGrantManagerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantManagersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantManager_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantManager_Filter>;
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


export type SubscriptionPartnerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPartnersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Partner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Partner_Filter>;
};


export type SubscriptionPiianswerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPiianswersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PiiAnswer_Filter>;
};


export type SubscriptionReviewArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionReviewsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Review_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Review_Filter>;
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


export type SubscriptionRubricArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRubricItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRubricItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RubricItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RubricItem_Filter>;
};


export type SubscriptionRubricsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Rubric_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rubric_Filter>;
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


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
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


export type SubscriptionWorkspaceSafeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWorkspaceSafesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<WorkspaceSafe_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<WorkspaceSafe_Filter>;
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
  Chain_4 = 'chain_4',
  Chain_10 = 'chain_10',
  Chain_42 = 'chain_42',
  Chain_69 = 'chain_69',
  Chain_137 = 'chain_137',
  Chain_1001 = 'chain_1001',
  Chain_2153 = 'chain_2153',
  Chain_8217 = 'chain_8217',
  Chain_42220 = 'chain_42220',
  Chain_44787 = 'chain_44787',
  Chain_80001 = 'chain_80001',
  Chain_245022926 = 'chain_245022926',
  Chain_1313161555 = 'chain_1313161555',
  Chain_1666600000 = 'chain_1666600000',
  Chain_1666700000 = 'chain_1666700000'
}

export type Token = {
  __typename?: 'Token';
  address: Scalars['Bytes'];
  chainId?: Maybe<Scalars['BigInt']>;
  decimal: Scalars['Int'];
  iconHash: Scalars['String'];
  id: Scalars['ID'];
  label: Scalars['String'];
  workspace: Workspace;
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  chainId?: InputMaybe<Scalars['BigInt']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']>;
  chainId_not?: InputMaybe<Scalars['BigInt']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimal?: InputMaybe<Scalars['Int']>;
  decimal_gt?: InputMaybe<Scalars['Int']>;
  decimal_gte?: InputMaybe<Scalars['Int']>;
  decimal_in?: InputMaybe<Array<Scalars['Int']>>;
  decimal_lt?: InputMaybe<Scalars['Int']>;
  decimal_lte?: InputMaybe<Scalars['Int']>;
  decimal_not?: InputMaybe<Scalars['Int']>;
  decimal_not_in?: InputMaybe<Array<Scalars['Int']>>;
  iconHash?: InputMaybe<Scalars['String']>;
  iconHash_contains?: InputMaybe<Scalars['String']>;
  iconHash_contains_nocase?: InputMaybe<Scalars['String']>;
  iconHash_ends_with?: InputMaybe<Scalars['String']>;
  iconHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  iconHash_gt?: InputMaybe<Scalars['String']>;
  iconHash_gte?: InputMaybe<Scalars['String']>;
  iconHash_in?: InputMaybe<Array<Scalars['String']>>;
  iconHash_lt?: InputMaybe<Scalars['String']>;
  iconHash_lte?: InputMaybe<Scalars['String']>;
  iconHash_not?: InputMaybe<Scalars['String']>;
  iconHash_not_contains?: InputMaybe<Scalars['String']>;
  iconHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  iconHash_not_ends_with?: InputMaybe<Scalars['String']>;
  iconHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  iconHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  iconHash_not_starts_with?: InputMaybe<Scalars['String']>;
  iconHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  iconHash_starts_with?: InputMaybe<Scalars['String']>;
  iconHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  label?: InputMaybe<Scalars['String']>;
  label_contains?: InputMaybe<Scalars['String']>;
  label_contains_nocase?: InputMaybe<Scalars['String']>;
  label_ends_with?: InputMaybe<Scalars['String']>;
  label_ends_with_nocase?: InputMaybe<Scalars['String']>;
  label_gt?: InputMaybe<Scalars['String']>;
  label_gte?: InputMaybe<Scalars['String']>;
  label_in?: InputMaybe<Array<Scalars['String']>>;
  label_lt?: InputMaybe<Scalars['String']>;
  label_lte?: InputMaybe<Scalars['String']>;
  label_not?: InputMaybe<Scalars['String']>;
  label_not_contains?: InputMaybe<Scalars['String']>;
  label_not_contains_nocase?: InputMaybe<Scalars['String']>;
  label_not_ends_with?: InputMaybe<Scalars['String']>;
  label_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  label_not_in?: InputMaybe<Array<Scalars['String']>>;
  label_not_starts_with?: InputMaybe<Scalars['String']>;
  label_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  label_starts_with?: InputMaybe<Scalars['String']>;
  label_starts_with_nocase?: InputMaybe<Scalars['String']>;
  workspace?: InputMaybe<Scalars['String']>;
  workspace_?: InputMaybe<Workspace_Filter>;
  workspace_contains?: InputMaybe<Scalars['String']>;
  workspace_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_ends_with?: InputMaybe<Scalars['String']>;
  workspace_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_gt?: InputMaybe<Scalars['String']>;
  workspace_gte?: InputMaybe<Scalars['String']>;
  workspace_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_lt?: InputMaybe<Scalars['String']>;
  workspace_lte?: InputMaybe<Scalars['String']>;
  workspace_not?: InputMaybe<Scalars['String']>;
  workspace_not_contains?: InputMaybe<Scalars['String']>;
  workspace_not_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_not_starts_with?: InputMaybe<Scalars['String']>;
  workspace_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_starts_with?: InputMaybe<Scalars['String']>;
  workspace_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Token_OrderBy {
  Address = 'address',
  ChainId = 'chainId',
  Decimal = 'decimal',
  IconHash = 'iconHash',
  Id = 'id',
  Label = 'label',
  Workspace = 'workspace'
}

/** Schema for a Workspace or DAO */
export type Workspace = {
  __typename?: 'Workspace';
  /** General info about the workspace */
  about: Scalars['String'];
  /** Quick description of the workspace */
  bio: Scalars['String'];
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
  partners: Array<Partner>;
  /** Workpsace safe */
  safe?: Maybe<WorkspaceSafe>;
  /** List of social media handles of the workspace */
  socials: Array<Social>;
  /** List of supported networks of the workspace */
  supportedNetworks: Array<SupportedNetwork>;
  /** Title of the workspace */
  title: Scalars['String'];
  /** Custom tokens setup by the workspace */
  tokens: Array<Token>;
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
export type WorkspacePartnersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Partner_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Partner_Filter>;
};


/** Schema for a Workspace or DAO */
export type WorkspaceSocialsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Social_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Social_Filter>;
};


/** Schema for a Workspace or DAO */
export type WorkspaceTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Token_Filter>;
};

export type WorkspaceMember = {
  __typename?: 'WorkspaceMember';
  /** What permissions the member has on the workspace */
  accessLevel: WorkspaceMemberAccessLevel;
  /** the ID of the member itself */
  actorId: Scalars['Bytes'];
  /** When the member was added */
  addedAt: Scalars['Int'];
  /** Address of the workspace member who added this member */
  addedBy: WorkspaceMember;
  email?: Maybe<Scalars['String']>;
  /** Full name of the user */
  fullName?: Maybe<Scalars['String']>;
  /** Globally unique ID of the member */
  id: Scalars['ID'];
  /** Timestamp of when the last review was done */
  lastReviewSubmittedAt: Scalars['Int'];
  /** The review IDs for which this member is owed a payment */
  outstandingReviewIds: Array<Scalars['String']>;
  /** Hash of profile picture on IPFS */
  profilePictureIpfsHash?: Maybe<Scalars['String']>;
  /** Public key of the workspace member */
  publicKey?: Maybe<Scalars['String']>;
  /** If the member was removed, when */
  removedAt?: Maybe<Scalars['Int']>;
  /** Last update on member */
  updatedAt: Scalars['Int'];
  workspace: Workspace;
};

export enum WorkspaceMemberAccessLevel {
  Admin = 'admin',
  Member = 'member',
  Owner = 'owner',
  Reviewer = 'reviewer'
}

export type WorkspaceMember_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  addedAt?: InputMaybe<Scalars['Int']>;
  addedAt_gt?: InputMaybe<Scalars['Int']>;
  addedAt_gte?: InputMaybe<Scalars['Int']>;
  addedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  addedAt_lt?: InputMaybe<Scalars['Int']>;
  addedAt_lte?: InputMaybe<Scalars['Int']>;
  addedAt_not?: InputMaybe<Scalars['Int']>;
  addedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
  addedBy?: InputMaybe<Scalars['String']>;
  addedBy_?: InputMaybe<WorkspaceMember_Filter>;
  addedBy_contains?: InputMaybe<Scalars['String']>;
  addedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  addedBy_ends_with?: InputMaybe<Scalars['String']>;
  addedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  addedBy_gt?: InputMaybe<Scalars['String']>;
  addedBy_gte?: InputMaybe<Scalars['String']>;
  addedBy_in?: InputMaybe<Array<Scalars['String']>>;
  addedBy_lt?: InputMaybe<Scalars['String']>;
  addedBy_lte?: InputMaybe<Scalars['String']>;
  addedBy_not?: InputMaybe<Scalars['String']>;
  addedBy_not_contains?: InputMaybe<Scalars['String']>;
  addedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  addedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  addedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  addedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  addedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  addedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  addedBy_starts_with?: InputMaybe<Scalars['String']>;
  addedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  email_contains?: InputMaybe<Scalars['String']>;
  email_contains_nocase?: InputMaybe<Scalars['String']>;
  email_ends_with?: InputMaybe<Scalars['String']>;
  email_ends_with_nocase?: InputMaybe<Scalars['String']>;
  email_gt?: InputMaybe<Scalars['String']>;
  email_gte?: InputMaybe<Scalars['String']>;
  email_in?: InputMaybe<Array<Scalars['String']>>;
  email_lt?: InputMaybe<Scalars['String']>;
  email_lte?: InputMaybe<Scalars['String']>;
  email_not?: InputMaybe<Scalars['String']>;
  email_not_contains?: InputMaybe<Scalars['String']>;
  email_not_contains_nocase?: InputMaybe<Scalars['String']>;
  email_not_ends_with?: InputMaybe<Scalars['String']>;
  email_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  email_not_in?: InputMaybe<Array<Scalars['String']>>;
  email_not_starts_with?: InputMaybe<Scalars['String']>;
  email_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  email_starts_with?: InputMaybe<Scalars['String']>;
  email_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fullName?: InputMaybe<Scalars['String']>;
  fullName_contains?: InputMaybe<Scalars['String']>;
  fullName_contains_nocase?: InputMaybe<Scalars['String']>;
  fullName_ends_with?: InputMaybe<Scalars['String']>;
  fullName_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fullName_gt?: InputMaybe<Scalars['String']>;
  fullName_gte?: InputMaybe<Scalars['String']>;
  fullName_in?: InputMaybe<Array<Scalars['String']>>;
  fullName_lt?: InputMaybe<Scalars['String']>;
  fullName_lte?: InputMaybe<Scalars['String']>;
  fullName_not?: InputMaybe<Scalars['String']>;
  fullName_not_contains?: InputMaybe<Scalars['String']>;
  fullName_not_contains_nocase?: InputMaybe<Scalars['String']>;
  fullName_not_ends_with?: InputMaybe<Scalars['String']>;
  fullName_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fullName_not_in?: InputMaybe<Array<Scalars['String']>>;
  fullName_not_starts_with?: InputMaybe<Scalars['String']>;
  fullName_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fullName_starts_with?: InputMaybe<Scalars['String']>;
  fullName_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastReviewSubmittedAt?: InputMaybe<Scalars['Int']>;
  lastReviewSubmittedAt_gt?: InputMaybe<Scalars['Int']>;
  lastReviewSubmittedAt_gte?: InputMaybe<Scalars['Int']>;
  lastReviewSubmittedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  lastReviewSubmittedAt_lt?: InputMaybe<Scalars['Int']>;
  lastReviewSubmittedAt_lte?: InputMaybe<Scalars['Int']>;
  lastReviewSubmittedAt_not?: InputMaybe<Scalars['Int']>;
  lastReviewSubmittedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
  outstandingReviewIds?: InputMaybe<Array<Scalars['String']>>;
  outstandingReviewIds_contains?: InputMaybe<Array<Scalars['String']>>;
  outstandingReviewIds_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  outstandingReviewIds_not?: InputMaybe<Array<Scalars['String']>>;
  outstandingReviewIds_not_contains?: InputMaybe<Array<Scalars['String']>>;
  outstandingReviewIds_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  profilePictureIpfsHash?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_contains?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_contains_nocase?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_ends_with?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_gt?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_gte?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_in?: InputMaybe<Array<Scalars['String']>>;
  profilePictureIpfsHash_lt?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_lte?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_not?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_not_contains?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_not_ends_with?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  profilePictureIpfsHash_not_starts_with?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_starts_with?: InputMaybe<Scalars['String']>;
  profilePictureIpfsHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  publicKey?: InputMaybe<Scalars['String']>;
  publicKey_contains?: InputMaybe<Scalars['String']>;
  publicKey_contains_nocase?: InputMaybe<Scalars['String']>;
  publicKey_ends_with?: InputMaybe<Scalars['String']>;
  publicKey_ends_with_nocase?: InputMaybe<Scalars['String']>;
  publicKey_gt?: InputMaybe<Scalars['String']>;
  publicKey_gte?: InputMaybe<Scalars['String']>;
  publicKey_in?: InputMaybe<Array<Scalars['String']>>;
  publicKey_lt?: InputMaybe<Scalars['String']>;
  publicKey_lte?: InputMaybe<Scalars['String']>;
  publicKey_not?: InputMaybe<Scalars['String']>;
  publicKey_not_contains?: InputMaybe<Scalars['String']>;
  publicKey_not_contains_nocase?: InputMaybe<Scalars['String']>;
  publicKey_not_ends_with?: InputMaybe<Scalars['String']>;
  publicKey_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  publicKey_not_in?: InputMaybe<Array<Scalars['String']>>;
  publicKey_not_starts_with?: InputMaybe<Scalars['String']>;
  publicKey_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  publicKey_starts_with?: InputMaybe<Scalars['String']>;
  publicKey_starts_with_nocase?: InputMaybe<Scalars['String']>;
  removedAt?: InputMaybe<Scalars['Int']>;
  removedAt_gt?: InputMaybe<Scalars['Int']>;
  removedAt_gte?: InputMaybe<Scalars['Int']>;
  removedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  removedAt_lt?: InputMaybe<Scalars['Int']>;
  removedAt_lte?: InputMaybe<Scalars['Int']>;
  removedAt_not?: InputMaybe<Scalars['Int']>;
  removedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAt?: InputMaybe<Scalars['Int']>;
  updatedAt_gt?: InputMaybe<Scalars['Int']>;
  updatedAt_gte?: InputMaybe<Scalars['Int']>;
  updatedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAt_lt?: InputMaybe<Scalars['Int']>;
  updatedAt_lte?: InputMaybe<Scalars['Int']>;
  updatedAt_not?: InputMaybe<Scalars['Int']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
  workspace?: InputMaybe<Scalars['String']>;
  workspace_?: InputMaybe<Workspace_Filter>;
  workspace_contains?: InputMaybe<Scalars['String']>;
  workspace_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_ends_with?: InputMaybe<Scalars['String']>;
  workspace_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_gt?: InputMaybe<Scalars['String']>;
  workspace_gte?: InputMaybe<Scalars['String']>;
  workspace_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_lt?: InputMaybe<Scalars['String']>;
  workspace_lte?: InputMaybe<Scalars['String']>;
  workspace_not?: InputMaybe<Scalars['String']>;
  workspace_not_contains?: InputMaybe<Scalars['String']>;
  workspace_not_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_not_starts_with?: InputMaybe<Scalars['String']>;
  workspace_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_starts_with?: InputMaybe<Scalars['String']>;
  workspace_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum WorkspaceMember_OrderBy {
  AccessLevel = 'accessLevel',
  ActorId = 'actorId',
  AddedAt = 'addedAt',
  AddedBy = 'addedBy',
  Email = 'email',
  FullName = 'fullName',
  Id = 'id',
  LastReviewSubmittedAt = 'lastReviewSubmittedAt',
  OutstandingReviewIds = 'outstandingReviewIds',
  ProfilePictureIpfsHash = 'profilePictureIpfsHash',
  PublicKey = 'publicKey',
  RemovedAt = 'removedAt',
  UpdatedAt = 'updatedAt',
  Workspace = 'workspace'
}

export type WorkspaceSafe = {
  __typename?: 'WorkspaceSafe';
  /** Address of the safe */
  address: Scalars['Bytes'];
  /** Chain ID of the chain */
  chainId: Scalars['BigInt'];
  id: Scalars['ID'];
  /** Workspace of the space */
  workspace: Workspace;
};

export type WorkspaceSafe_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  chainId?: InputMaybe<Scalars['BigInt']>;
  chainId_gt?: InputMaybe<Scalars['BigInt']>;
  chainId_gte?: InputMaybe<Scalars['BigInt']>;
  chainId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  chainId_lt?: InputMaybe<Scalars['BigInt']>;
  chainId_lte?: InputMaybe<Scalars['BigInt']>;
  chainId_not?: InputMaybe<Scalars['BigInt']>;
  chainId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  workspace?: InputMaybe<Scalars['String']>;
  workspace_?: InputMaybe<Workspace_Filter>;
  workspace_contains?: InputMaybe<Scalars['String']>;
  workspace_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_ends_with?: InputMaybe<Scalars['String']>;
  workspace_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_gt?: InputMaybe<Scalars['String']>;
  workspace_gte?: InputMaybe<Scalars['String']>;
  workspace_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_lt?: InputMaybe<Scalars['String']>;
  workspace_lte?: InputMaybe<Scalars['String']>;
  workspace_not?: InputMaybe<Scalars['String']>;
  workspace_not_contains?: InputMaybe<Scalars['String']>;
  workspace_not_contains_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with?: InputMaybe<Scalars['String']>;
  workspace_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_not_in?: InputMaybe<Array<Scalars['String']>>;
  workspace_not_starts_with?: InputMaybe<Scalars['String']>;
  workspace_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  workspace_starts_with?: InputMaybe<Scalars['String']>;
  workspace_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum WorkspaceSafe_OrderBy {
  Address = 'address',
  ChainId = 'chainId',
  Id = 'id',
  Workspace = 'workspace'
}

export type Workspace_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  about?: InputMaybe<Scalars['String']>;
  about_contains?: InputMaybe<Scalars['String']>;
  about_contains_nocase?: InputMaybe<Scalars['String']>;
  about_ends_with?: InputMaybe<Scalars['String']>;
  about_ends_with_nocase?: InputMaybe<Scalars['String']>;
  about_gt?: InputMaybe<Scalars['String']>;
  about_gte?: InputMaybe<Scalars['String']>;
  about_in?: InputMaybe<Array<Scalars['String']>>;
  about_lt?: InputMaybe<Scalars['String']>;
  about_lte?: InputMaybe<Scalars['String']>;
  about_not?: InputMaybe<Scalars['String']>;
  about_not_contains?: InputMaybe<Scalars['String']>;
  about_not_contains_nocase?: InputMaybe<Scalars['String']>;
  about_not_ends_with?: InputMaybe<Scalars['String']>;
  about_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  about_not_in?: InputMaybe<Array<Scalars['String']>>;
  about_not_starts_with?: InputMaybe<Scalars['String']>;
  about_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  about_starts_with?: InputMaybe<Scalars['String']>;
  about_starts_with_nocase?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  bio_contains?: InputMaybe<Scalars['String']>;
  bio_contains_nocase?: InputMaybe<Scalars['String']>;
  bio_ends_with?: InputMaybe<Scalars['String']>;
  bio_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bio_gt?: InputMaybe<Scalars['String']>;
  bio_gte?: InputMaybe<Scalars['String']>;
  bio_in?: InputMaybe<Array<Scalars['String']>>;
  bio_lt?: InputMaybe<Scalars['String']>;
  bio_lte?: InputMaybe<Scalars['String']>;
  bio_not?: InputMaybe<Scalars['String']>;
  bio_not_contains?: InputMaybe<Scalars['String']>;
  bio_not_contains_nocase?: InputMaybe<Scalars['String']>;
  bio_not_ends_with?: InputMaybe<Scalars['String']>;
  bio_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bio_not_in?: InputMaybe<Array<Scalars['String']>>;
  bio_not_starts_with?: InputMaybe<Scalars['String']>;
  bio_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  bio_starts_with?: InputMaybe<Scalars['String']>;
  bio_starts_with_nocase?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_contains?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_contains_nocase?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_ends_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_gt?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_gte?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_in?: InputMaybe<Array<Scalars['String']>>;
  coverImageIpfsHash_lt?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_lte?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_contains?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_ends_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  coverImageIpfsHash_not_starts_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_starts_with?: InputMaybe<Scalars['String']>;
  coverImageIpfsHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  logoIpfsHash_contains_nocase?: InputMaybe<Scalars['String']>;
  logoIpfsHash_ends_with?: InputMaybe<Scalars['String']>;
  logoIpfsHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  logoIpfsHash_gt?: InputMaybe<Scalars['String']>;
  logoIpfsHash_gte?: InputMaybe<Scalars['String']>;
  logoIpfsHash_in?: InputMaybe<Array<Scalars['String']>>;
  logoIpfsHash_lt?: InputMaybe<Scalars['String']>;
  logoIpfsHash_lte?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_contains?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_ends_with?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  logoIpfsHash_not_starts_with?: InputMaybe<Scalars['String']>;
  logoIpfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  logoIpfsHash_starts_with?: InputMaybe<Scalars['String']>;
  logoIpfsHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  members_?: InputMaybe<WorkspaceMember_Filter>;
  metadataHash?: InputMaybe<Scalars['String']>;
  metadataHash_contains?: InputMaybe<Scalars['String']>;
  metadataHash_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_gt?: InputMaybe<Scalars['String']>;
  metadataHash_gte?: InputMaybe<Scalars['String']>;
  metadataHash_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_lt?: InputMaybe<Scalars['String']>;
  metadataHash_lte?: InputMaybe<Scalars['String']>;
  metadataHash_not?: InputMaybe<Scalars['String']>;
  metadataHash_not_contains?: InputMaybe<Scalars['String']>;
  metadataHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataHash_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataHash_starts_with?: InputMaybe<Scalars['String']>;
  metadataHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerId?: InputMaybe<Scalars['Bytes']>;
  ownerId_contains?: InputMaybe<Scalars['Bytes']>;
  ownerId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  ownerId_not?: InputMaybe<Scalars['Bytes']>;
  ownerId_not_contains?: InputMaybe<Scalars['Bytes']>;
  ownerId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  partners?: InputMaybe<Array<Scalars['String']>>;
  partners_?: InputMaybe<Partner_Filter>;
  partners_contains?: InputMaybe<Array<Scalars['String']>>;
  partners_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  partners_not?: InputMaybe<Array<Scalars['String']>>;
  partners_not_contains?: InputMaybe<Array<Scalars['String']>>;
  partners_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  safe_?: InputMaybe<WorkspaceSafe_Filter>;
  socials?: InputMaybe<Array<Scalars['String']>>;
  socials_?: InputMaybe<Social_Filter>;
  socials_contains?: InputMaybe<Array<Scalars['String']>>;
  socials_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  socials_not?: InputMaybe<Array<Scalars['String']>>;
  socials_not_contains?: InputMaybe<Array<Scalars['String']>>;
  socials_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  supportedNetworks?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_contains?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_contains_nocase?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_not?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_not_contains?: InputMaybe<Array<SupportedNetwork>>;
  supportedNetworks_not_contains_nocase?: InputMaybe<Array<SupportedNetwork>>;
  title?: InputMaybe<Scalars['String']>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokens_?: InputMaybe<Token_Filter>;
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
  Bio = 'bio',
  CoverImageIpfsHash = 'coverImageIpfsHash',
  CreatedAtS = 'createdAtS',
  Id = 'id',
  LogoIpfsHash = 'logoIpfsHash',
  Members = 'members',
  MetadataHash = 'metadataHash',
  OwnerId = 'ownerId',
  Partners = 'partners',
  Safe = 'safe',
  Socials = 'socials',
  SupportedNetworks = 'supportedNetworks',
  Title = 'title',
  Tokens = 'tokens',
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
  applicantId: Scalars['Bytes'];
  minDeadline: Scalars['Int'];
}>;


export type GetAllGrantsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, createdAtS: number, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, applications: Array<{ __typename?: 'GrantApplication', applicantId: string }> }> };

export type GetAllGrantsCountForCreatorQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  creatorId?: InputMaybe<Scalars['Bytes']>;
  workspaceId?: InputMaybe<Scalars['String']>;
}>;


export type GetAllGrantsCountForCreatorQuery = { __typename?: 'Query', liveGrants: Array<{ __typename?: 'Grant', id: string }>, archived: Array<{ __typename?: 'Grant', id: string }> };

export type GetAllGrantsForADaoQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  workspaceId: Scalars['String'];
  acceptingApplications: Scalars['Boolean'];
}>;


export type GetAllGrantsForADaoQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, createdAtS: number, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, applications: Array<{ __typename?: 'GrantApplication', id: string, state: ApplicationState, createdAtS: number, updatedAtS: number }> }> };

export type GetAllGrantsForAllDaoQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantId: Scalars['Bytes'];
  minDeadline: Scalars['Int'];
}>;


export type GetAllGrantsForAllDaoQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, createdAtS: number, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, applications: Array<{ __typename?: 'GrantApplication', id: string, state: ApplicationState, createdAtS: number, updatedAtS: number }> }> };

export type GetAllGrantsForCreatorQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  creatorId?: InputMaybe<Scalars['Bytes']>;
  workspaceId?: InputMaybe<Scalars['String']>;
  acceptingApplications?: InputMaybe<Array<Scalars['Boolean']> | Scalars['Boolean']>;
  minDeadline: Scalars['Int'];
  maxDeadline: Scalars['Int'];
}>;


export type GetAllGrantsForCreatorQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, acceptingApplications: boolean, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, rubric?: { __typename?: 'Rubric', isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null }> };

export type GetAllGrantsForReviewerQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  reviewerIDs?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type GetAllGrantsForReviewerQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, grant: { __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, acceptingApplications: boolean, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, rubric?: { __typename?: 'Rubric', isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null } }> };

export type GetAllWorkspacesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllWorkspacesQuery = { __typename?: 'Query', workspaces: Array<{ __typename?: 'Workspace', id: string, title: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork> }> };

export type GetApplicantsForAGrantQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  grantID: Scalars['String'];
}>;


export type GetApplicantsForAGrantQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, updatedAtS: number, grant: { __typename?: 'Grant', id: string, title: string, funding: string, acceptingApplications: boolean, reward: { __typename?: 'Reward', asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, supportedNetworks: Array<SupportedNetwork> } }, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, reviewers: Array<{ __typename?: 'WorkspaceMember', email?: string | null, id: string }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, state: MilestoneState, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDev?: string | null }> }> };

export type GetApplicantsForAGrantReviewerQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  grantID: Scalars['String'];
  reviewerIDs?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type GetApplicantsForAGrantReviewerQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, updatedAtS: number, grant: { __typename?: 'Grant', id: string, title: string, funding: string, acceptingApplications: boolean, reward: { __typename?: 'Reward', asset: string }, workspace: { __typename?: 'Workspace', id: string, supportedNetworks: Array<SupportedNetwork> } }, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, reviewers: Array<{ __typename?: 'WorkspaceMember', email?: string | null, id: string }>, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, reviewer?: { __typename?: 'WorkspaceMember', id: string } | null, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }> }> };

export type GetApplicationDetailsQueryVariables = Exact<{
  applicationID: Scalars['ID'];
}>;


export type GetApplicationDetailsQuery = { __typename?: 'Query', grantApplication?: { __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, feedbackDao?: string | null, feedbackDev?: string | null, createdAtS: number, updatedAtS: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, amount: string }>, grant: { __typename?: 'Grant', id: string, title: string, funding: string, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null }> }, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, fields: Array<{ __typename?: 'GrantField', id: string, title: string, isPii: boolean }>, rubric?: { __typename?: 'Rubric', isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null }, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, reviewer?: { __typename?: 'WorkspaceMember', id: string, email?: string | null } | null, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, reviewers: Array<{ __typename?: 'WorkspaceMember', email?: string | null, id: string }> } | null };

export type GetDaoGrantsQueryVariables = Exact<{
  workspaceId: Scalars['String'];
}>;


export type GetDaoGrantsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, applications: Array<{ __typename?: 'GrantApplication', id: string, reviews: Array<{ __typename?: 'Review', id: string }>, reviewers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, email?: string | null, lastReviewSubmittedAt: number, outstandingReviewIds: Array<string> }> }> }> };

export type GetApplicationMilestonesQueryVariables = Exact<{
  grantId: Scalars['ID'];
}>;


export type GetApplicationMilestonesQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', grant: { __typename?: 'Grant', reward: { __typename?: 'Reward', asset: string, token?: { __typename?: 'Token', label: string, address: string, decimal: number, iconHash: string } | null } }, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, state: MilestoneState, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDev?: string | null }>, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }> }> };

export type GetDaoDetailsQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
  daoID: Scalars['String'];
}>;


export type GetDaoDetailsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, bio: string, title: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork>, partners: Array<{ __typename?: 'Partner', name: string, industry: string, website?: string | null, partnerImageHash?: string | null }>, socials: Array<{ __typename?: 'Social', name: string, value: string }>, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }> } | null, grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, createdAtS: number, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } }> };

export type GetDaoNameQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
}>;


export type GetDaoNameQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, title: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null } | null };

export type GetFundSentforReviewerQueryVariables = Exact<{
  type?: InputMaybe<FundsTransferType>;
  to?: InputMaybe<Scalars['Bytes']>;
}>;


export type GetFundSentforReviewerQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, asset: string, review?: { __typename?: 'Review', id: string } | null }> };

export type GetFundSentforReviewsQueryVariables = Exact<{
  type?: InputMaybe<FundsTransferType>;
}>;


export type GetFundSentforReviewsQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, asset: string, review?: { __typename?: 'Review', id: string } | null }> };

export type GetFundSentDisburseQueryVariables = Exact<{
  type?: InputMaybe<FundsTransferType>;
}>;


export type GetFundSentDisburseQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, asset: string, review?: { __typename?: 'Review', id: string } | null, grant: { __typename?: 'Grant', id: string } }> };

export type GetFundSentDisburseforGrantQueryVariables = Exact<{
  type?: InputMaybe<FundsTransferType>;
  grant?: InputMaybe<Scalars['String']>;
}>;


export type GetFundSentDisburseforGrantQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, asset: string }> };

export type GetFundSentForApplicationQueryVariables = Exact<{
  applicationId?: InputMaybe<Scalars['String']>;
}>;


export type GetFundSentForApplicationQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, application?: { __typename?: 'GrantApplication', id: string } | null, milestone?: { __typename?: 'ApplicationMilestone', id: string, title: string } | null }> };

export type GetFundingQueryVariables = Exact<{
  grantId?: InputMaybe<Scalars['String']>;
}>;


export type GetFundingQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, grant: { __typename?: 'Grant', id: string }, application?: { __typename?: 'GrantApplication', id: string } | null, milestone?: { __typename?: 'ApplicationMilestone', id: string, title: string } | null }> };

export type GetFundsAndProfileDataQueryVariables = Exact<{
  type?: InputMaybe<FundsTransferType>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  workspaceId: Scalars['String'];
  acceptingApplications: Scalars['Boolean'];
}>;


export type GetFundsAndProfileDataQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, asset: string, review?: { __typename?: 'Review', id: string } | null, grant: { __typename?: 'Grant', id: string } }>, grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, createdAtS: number, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, applications: Array<{ __typename?: 'GrantApplication', id: string, state: ApplicationState, createdAtS: number, updatedAtS: number }> }> };

export type GetGrantApplicationQueryVariables = Exact<{
  grantID: Scalars['String'];
  applicantID: Scalars['Bytes'];
}>;


export type GetGrantApplicationQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, grant: { __typename?: 'Grant', id: string, title: string } }> };

export type GetGrantDetailsQueryVariables = Exact<{
  grantID: Scalars['ID'];
}>;


export type GetGrantDetailsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, deadline?: string | null, funding: string, acceptingApplications: boolean, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, isPii: boolean }>, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, email?: string | null }> }, rubric?: { __typename?: 'Rubric', isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null }> };

export type GetGrantsAppliedToQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantID: Scalars['Bytes'];
}>;


export type GetGrantsAppliedToQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, grant: { __typename?: 'Grant', id: string } }> };

export type GetMyApplicationsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantID: Scalars['Bytes'];
}>;


export type GetMyApplicationsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, updatedAtS: number, grant: { __typename?: 'Grant', id: string, title: string, funding: string, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, reward: { __typename?: 'Reward', asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null } } }> };

export type GetNumberOfApplicationsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantId: Scalars['Bytes'];
}>;


export type GetNumberOfApplicationsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string }> };

export type GetNumberOfGrantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  workspaceId: Scalars['String'];
}>;


export type GetNumberOfGrantsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string }> };

export type GetRubricsForWorkspaceMemberQueryQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type GetRubricsForWorkspaceMemberQueryQuery = { __typename?: 'Query', rubrics: Array<{ __typename?: 'Rubric', id: string }> };

export type GetWorkspaceDetailsQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
}>;


export type GetWorkspaceDetailsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, title: string, bio: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork>, partners: Array<{ __typename?: 'Partner', name: string, industry: string, website?: string | null, partnerImageHash?: string | null }>, socials: Array<{ __typename?: 'Social', name: string, value: string }>, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, email?: string | null, accessLevel: WorkspaceMemberAccessLevel, updatedAt: number, outstandingReviewIds: Array<string>, lastReviewSubmittedAt: number, addedBy: { __typename?: 'WorkspaceMember', id: string, actorId: string } }> } | null };

export type GetWorkspaceMemberExistsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetWorkspaceMemberExistsQuery = { __typename?: 'Query', workspaceMember?: { __typename?: 'WorkspaceMember', id: string } | null };

export type GetWorkspaceMembersQueryVariables = Exact<{
  actorId: Scalars['Bytes'];
}>;


export type GetWorkspaceMembersQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, workspace: { __typename?: 'Workspace', id: string, ownerId: string, logoIpfsHash: string, title: string, supportedNetworks: Array<SupportedNetwork>, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, email?: string | null, accessLevel: WorkspaceMemberAccessLevel, outstandingReviewIds: Array<string>, lastReviewSubmittedAt: number }> } }> };

export type GetWorkspaceMembersByWorkspaceIdQueryVariables = Exact<{
  workspaceId: Scalars['String'];
  accessLevelsIn: Array<WorkspaceMemberAccessLevel> | WorkspaceMemberAccessLevel;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetWorkspaceMembersByWorkspaceIdQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, addedAt: number }> };


export const GetAllGrantsDocument = gql`
    query getAllGrants($first: Int, $skip: Int, $applicantId: Bytes!, $minDeadline: Int!) {
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {acceptingApplications: true, deadlineS_gte: $minDeadline}
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
      token {
        address
        label
        decimal
        iconHash
      }
    }
    createdAtS
    workspace {
      id
      title
      logoIpfsHash
      supportedNetworks
    }
    deadline
    funding
    numberOfApplications
    applications(where: {applicantId: $applicantId}, first: 1) {
      applicantId
    }
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
 *      applicantId: // value for 'applicantId'
 *      minDeadline: // value for 'minDeadline'
 *   },
 * });
 */
export function useGetAllGrantsQuery(baseOptions: Apollo.QueryHookOptions<GetAllGrantsQuery, GetAllGrantsQueryVariables>) {
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
export const GetAllGrantsCountForCreatorDocument = gql`
    query getAllGrantsCountForCreator($first: Int, $skip: Int, $creatorId: Bytes, $workspaceId: String) {
  liveGrants: grants(
    subgraphError: allow
    where: {acceptingApplications: true, workspace: $workspaceId}
    first: 1
  ) {
    id
  }
  archived: grants(
    subgraphError: allow
    where: {acceptingApplications: false, workspace: $workspaceId}
    first: 1
  ) {
    id
  }
}
    `;

/**
 * __useGetAllGrantsCountForCreatorQuery__
 *
 * To run a query within a React component, call `useGetAllGrantsCountForCreatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGrantsCountForCreatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGrantsCountForCreatorQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      creatorId: // value for 'creatorId'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllGrantsCountForCreatorQuery(baseOptions?: Apollo.QueryHookOptions<GetAllGrantsCountForCreatorQuery, GetAllGrantsCountForCreatorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGrantsCountForCreatorQuery, GetAllGrantsCountForCreatorQueryVariables>(GetAllGrantsCountForCreatorDocument, options);
      }
export function useGetAllGrantsCountForCreatorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGrantsCountForCreatorQuery, GetAllGrantsCountForCreatorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGrantsCountForCreatorQuery, GetAllGrantsCountForCreatorQueryVariables>(GetAllGrantsCountForCreatorDocument, options);
        }
export type GetAllGrantsCountForCreatorQueryHookResult = ReturnType<typeof useGetAllGrantsCountForCreatorQuery>;
export type GetAllGrantsCountForCreatorLazyQueryHookResult = ReturnType<typeof useGetAllGrantsCountForCreatorLazyQuery>;
export type GetAllGrantsCountForCreatorQueryResult = Apollo.QueryResult<GetAllGrantsCountForCreatorQuery, GetAllGrantsCountForCreatorQueryVariables>;
export const GetAllGrantsForADaoDocument = gql`
    query getAllGrantsForADao($first: Int, $skip: Int, $workspaceId: String!, $acceptingApplications: Boolean!) {
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {workspace: $workspaceId, acceptingApplications: $acceptingApplications}
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
      token {
        address
        label
        decimal
        iconHash
      }
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
    applications {
      id
      state
      createdAtS
      updatedAtS
    }
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
 *      acceptingApplications: // value for 'acceptingApplications'
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
export const GetAllGrantsForAllDaoDocument = gql`
    query getAllGrantsForAllDao($first: Int, $skip: Int, $applicantId: Bytes!, $minDeadline: Int!) {
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {acceptingApplications: true, deadlineS_gte: $minDeadline}
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
      token {
        address
        label
        decimal
        iconHash
      }
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
    applications {
      id
      state
      createdAtS
      updatedAtS
    }
  }
}
    `;

/**
 * __useGetAllGrantsForAllDaoQuery__
 *
 * To run a query within a React component, call `useGetAllGrantsForAllDaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGrantsForAllDaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGrantsForAllDaoQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      applicantId: // value for 'applicantId'
 *      minDeadline: // value for 'minDeadline'
 *   },
 * });
 */
export function useGetAllGrantsForAllDaoQuery(baseOptions: Apollo.QueryHookOptions<GetAllGrantsForAllDaoQuery, GetAllGrantsForAllDaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGrantsForAllDaoQuery, GetAllGrantsForAllDaoQueryVariables>(GetAllGrantsForAllDaoDocument, options);
      }
export function useGetAllGrantsForAllDaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGrantsForAllDaoQuery, GetAllGrantsForAllDaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGrantsForAllDaoQuery, GetAllGrantsForAllDaoQueryVariables>(GetAllGrantsForAllDaoDocument, options);
        }
export type GetAllGrantsForAllDaoQueryHookResult = ReturnType<typeof useGetAllGrantsForAllDaoQuery>;
export type GetAllGrantsForAllDaoLazyQueryHookResult = ReturnType<typeof useGetAllGrantsForAllDaoLazyQuery>;
export type GetAllGrantsForAllDaoQueryResult = Apollo.QueryResult<GetAllGrantsForAllDaoQuery, GetAllGrantsForAllDaoQueryVariables>;
export const GetAllGrantsForCreatorDocument = gql`
    query getAllGrantsForCreator($first: Int, $skip: Int, $creatorId: Bytes, $workspaceId: String, $acceptingApplications: [Boolean!], $minDeadline: Int!, $maxDeadline: Int!) {
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {workspace: $workspaceId, acceptingApplications_in: $acceptingApplications, deadlineS_gte: $minDeadline, deadlineS_lte: $maxDeadline}
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
      token {
        address
        label
        decimal
        iconHash
      }
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
    acceptingApplications
    rubric {
      isPrivate
      items {
        id
        title
        details
        maximumPoints
      }
    }
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
 *      acceptingApplications: // value for 'acceptingApplications'
 *      minDeadline: // value for 'minDeadline'
 *      maxDeadline: // value for 'maxDeadline'
 *   },
 * });
 */
export function useGetAllGrantsForCreatorQuery(baseOptions: Apollo.QueryHookOptions<GetAllGrantsForCreatorQuery, GetAllGrantsForCreatorQueryVariables>) {
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
export const GetAllGrantsForReviewerDocument = gql`
    query getAllGrantsForReviewer($first: Int, $skip: Int, $reviewerIDs: [String!]) {
  grantApplications(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {reviewers_contains: $reviewerIDs}
  ) {
    id
    grant {
      id
      creatorId
      title
      summary
      details
      reward {
        committed
        id
        asset
        token {
          address
          label
          decimal
          iconHash
        }
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
      acceptingApplications
      rubric {
        isPrivate
        items {
          id
          title
          details
          maximumPoints
        }
      }
    }
  }
}
    `;

/**
 * __useGetAllGrantsForReviewerQuery__
 *
 * To run a query within a React component, call `useGetAllGrantsForReviewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGrantsForReviewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGrantsForReviewerQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      reviewerIDs: // value for 'reviewerIDs'
 *   },
 * });
 */
export function useGetAllGrantsForReviewerQuery(baseOptions?: Apollo.QueryHookOptions<GetAllGrantsForReviewerQuery, GetAllGrantsForReviewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGrantsForReviewerQuery, GetAllGrantsForReviewerQueryVariables>(GetAllGrantsForReviewerDocument, options);
      }
export function useGetAllGrantsForReviewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGrantsForReviewerQuery, GetAllGrantsForReviewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGrantsForReviewerQuery, GetAllGrantsForReviewerQueryVariables>(GetAllGrantsForReviewerDocument, options);
        }
export type GetAllGrantsForReviewerQueryHookResult = ReturnType<typeof useGetAllGrantsForReviewerQuery>;
export type GetAllGrantsForReviewerLazyQueryHookResult = ReturnType<typeof useGetAllGrantsForReviewerLazyQuery>;
export type GetAllGrantsForReviewerQueryResult = Apollo.QueryResult<GetAllGrantsForReviewerQuery, GetAllGrantsForReviewerQueryVariables>;
export const GetAllWorkspacesDocument = gql`
    query getAllWorkspaces {
  workspaces(subgraphError: allow) {
    id
    title
    about
    logoIpfsHash
    coverImageIpfsHash
    supportedNetworks
  }
}
    `;

/**
 * __useGetAllWorkspacesQuery__
 *
 * To run a query within a React component, call `useGetAllWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllWorkspacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllWorkspacesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllWorkspacesQuery, GetAllWorkspacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllWorkspacesQuery, GetAllWorkspacesQueryVariables>(GetAllWorkspacesDocument, options);
      }
export function useGetAllWorkspacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllWorkspacesQuery, GetAllWorkspacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllWorkspacesQuery, GetAllWorkspacesQueryVariables>(GetAllWorkspacesDocument, options);
        }
export type GetAllWorkspacesQueryHookResult = ReturnType<typeof useGetAllWorkspacesQuery>;
export type GetAllWorkspacesLazyQueryHookResult = ReturnType<typeof useGetAllWorkspacesLazyQuery>;
export type GetAllWorkspacesQueryResult = Apollo.QueryResult<GetAllWorkspacesQuery, GetAllWorkspacesQueryVariables>;
export const GetApplicantsForAGrantDocument = gql`
    query getApplicantsForAGrant($first: Int, $skip: Int, $grantID: String!) {
  grantApplications(first: $first, where: {grant: $grantID}, subgraphError: allow) {
    id
    grant {
      id
      title
      funding
      reward {
        asset
        token {
          address
          label
          decimal
          iconHash
        }
      }
      workspace {
        id
        supportedNetworks
      }
      acceptingApplications
    }
    applicantId
    state
    createdAtS
    updatedAtS
    fields {
      id
      values {
        value
      }
    }
    reviewers {
      email
      id
    }
    milestones {
      id
      state
      title
      amount
      amountPaid
      updatedAtS
      feedbackDao
      feedbackDev
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
export const GetApplicantsForAGrantReviewerDocument = gql`
    query getApplicantsForAGrantReviewer($first: Int, $skip: Int, $grantID: String!, $reviewerIDs: [String!]) {
  grantApplications(
    first: $first
    where: {grant: $grantID, reviewers_contains: $reviewerIDs}
    subgraphError: allow
  ) {
    id
    grant {
      id
      title
      funding
      reward {
        asset
      }
      workspace {
        id
        supportedNetworks
      }
      acceptingApplications
    }
    applicantId
    state
    createdAtS
    updatedAtS
    fields {
      id
      values {
        value
      }
    }
    reviewers {
      email
      id
    }
    reviews {
      reviewer {
        id
      }
      data {
        id
        manager {
          id
        }
        data
      }
      publicReviewDataHash
      id
    }
  }
}
    `;

/**
 * __useGetApplicantsForAGrantReviewerQuery__
 *
 * To run a query within a React component, call `useGetApplicantsForAGrantReviewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicantsForAGrantReviewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicantsForAGrantReviewerQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      grantID: // value for 'grantID'
 *      reviewerIDs: // value for 'reviewerIDs'
 *   },
 * });
 */
export function useGetApplicantsForAGrantReviewerQuery(baseOptions: Apollo.QueryHookOptions<GetApplicantsForAGrantReviewerQuery, GetApplicantsForAGrantReviewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicantsForAGrantReviewerQuery, GetApplicantsForAGrantReviewerQueryVariables>(GetApplicantsForAGrantReviewerDocument, options);
      }
export function useGetApplicantsForAGrantReviewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicantsForAGrantReviewerQuery, GetApplicantsForAGrantReviewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicantsForAGrantReviewerQuery, GetApplicantsForAGrantReviewerQueryVariables>(GetApplicantsForAGrantReviewerDocument, options);
        }
export type GetApplicantsForAGrantReviewerQueryHookResult = ReturnType<typeof useGetApplicantsForAGrantReviewerQuery>;
export type GetApplicantsForAGrantReviewerLazyQueryHookResult = ReturnType<typeof useGetApplicantsForAGrantReviewerLazyQuery>;
export type GetApplicantsForAGrantReviewerQueryResult = Apollo.QueryResult<GetApplicantsForAGrantReviewerQuery, GetApplicantsForAGrantReviewerQueryVariables>;
export const GetApplicationDetailsDocument = gql`
    query getApplicationDetails($applicationID: ID!) {
  grantApplication(id: $applicationID, subgraphError: allow) {
    id
    fields {
      id
      values {
        value
      }
    }
    pii {
      id
      manager {
        id
      }
      data
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
        members {
          id
          actorId
          publicKey
        }
      }
      reward {
        id
        asset
        committed
        token {
          address
          label
          decimal
          iconHash
        }
      }
      fields {
        id
        title
        isPii
      }
      rubric {
        isPrivate
        items {
          id
          title
          details
          maximumPoints
        }
      }
    }
    reviews {
      reviewer {
        id
        email
      }
      data {
        id
        manager {
          id
        }
        data
      }
      publicReviewDataHash
      id
    }
    reviewers {
      email
      id
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
export const GetDaoGrantsDocument = gql`
    query getDaoGrants($workspaceId: String!) {
  grants(
    subgraphError: allow
    where: {workspace: $workspaceId}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    creatorId
    applications {
      id
      reviews {
        id
      }
      reviewers {
        id
        actorId
        email
        lastReviewSubmittedAt
        outstandingReviewIds
      }
    }
  }
}
    `;

/**
 * __useGetDaoGrantsQuery__
 *
 * To run a query within a React component, call `useGetDaoGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDaoGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDaoGrantsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetDaoGrantsQuery(baseOptions: Apollo.QueryHookOptions<GetDaoGrantsQuery, GetDaoGrantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDaoGrantsQuery, GetDaoGrantsQueryVariables>(GetDaoGrantsDocument, options);
      }
export function useGetDaoGrantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDaoGrantsQuery, GetDaoGrantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDaoGrantsQuery, GetDaoGrantsQueryVariables>(GetDaoGrantsDocument, options);
        }
export type GetDaoGrantsQueryHookResult = ReturnType<typeof useGetDaoGrantsQuery>;
export type GetDaoGrantsLazyQueryHookResult = ReturnType<typeof useGetDaoGrantsLazyQuery>;
export type GetDaoGrantsQueryResult = Apollo.QueryResult<GetDaoGrantsQuery, GetDaoGrantsQueryVariables>;
export const GetApplicationMilestonesDocument = gql`
    query getApplicationMilestones($grantId: ID!) {
  grantApplications(where: {id: $grantId}) {
    grant {
      reward {
        asset
        token {
          label
          address
          decimal
          iconHash
        }
      }
    }
    milestones {
      id
      state
      title
      amount
      amountPaid
      updatedAtS
      feedbackDao
      feedbackDev
    }
    fields {
      id
      values {
        value
      }
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
    bio
    title
    about
    logoIpfsHash
    coverImageIpfsHash
    supportedNetworks
    partners {
      name
      industry
      website
      partnerImageHash
    }
    socials {
      name
      value
    }
    tokens {
      address
      label
      decimal
      iconHash
    }
  }
  grants(
    subgraphError: allow
    where: {workspace: $daoID, acceptingApplications: true}
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
      token {
        address
        label
        decimal
        iconHash
      }
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
export const GetDaoNameDocument = gql`
    query getDAOName($workspaceID: ID!) {
  workspace(id: $workspaceID) {
    id
    title
    about
    logoIpfsHash
    coverImageIpfsHash
  }
}
    `;

/**
 * __useGetDaoNameQuery__
 *
 * To run a query within a React component, call `useGetDaoNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDaoNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDaoNameQuery({
 *   variables: {
 *      workspaceID: // value for 'workspaceID'
 *   },
 * });
 */
export function useGetDaoNameQuery(baseOptions: Apollo.QueryHookOptions<GetDaoNameQuery, GetDaoNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDaoNameQuery, GetDaoNameQueryVariables>(GetDaoNameDocument, options);
      }
export function useGetDaoNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDaoNameQuery, GetDaoNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDaoNameQuery, GetDaoNameQueryVariables>(GetDaoNameDocument, options);
        }
export type GetDaoNameQueryHookResult = ReturnType<typeof useGetDaoNameQuery>;
export type GetDaoNameLazyQueryHookResult = ReturnType<typeof useGetDaoNameLazyQuery>;
export type GetDaoNameQueryResult = Apollo.QueryResult<GetDaoNameQuery, GetDaoNameQueryVariables>;
export const GetFundSentforReviewerDocument = gql`
    query getFundSentforReviewer($type: FundsTransferType, $to: Bytes) {
  fundsTransfers(
    where: {type: review_payment_done, to: $to}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    review {
      id
    }
    amount
    sender
    to
    createdAtS
    type
    asset
  }
}
    `;

/**
 * __useGetFundSentforReviewerQuery__
 *
 * To run a query within a React component, call `useGetFundSentforReviewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundSentforReviewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundSentforReviewerQuery({
 *   variables: {
 *      type: // value for 'type'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useGetFundSentforReviewerQuery(baseOptions?: Apollo.QueryHookOptions<GetFundSentforReviewerQuery, GetFundSentforReviewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundSentforReviewerQuery, GetFundSentforReviewerQueryVariables>(GetFundSentforReviewerDocument, options);
      }
export function useGetFundSentforReviewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundSentforReviewerQuery, GetFundSentforReviewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundSentforReviewerQuery, GetFundSentforReviewerQueryVariables>(GetFundSentforReviewerDocument, options);
        }
export type GetFundSentforReviewerQueryHookResult = ReturnType<typeof useGetFundSentforReviewerQuery>;
export type GetFundSentforReviewerLazyQueryHookResult = ReturnType<typeof useGetFundSentforReviewerLazyQuery>;
export type GetFundSentforReviewerQueryResult = Apollo.QueryResult<GetFundSentforReviewerQuery, GetFundSentforReviewerQueryVariables>;
export const GetFundSentforReviewsDocument = gql`
    query getFundSentforReviews($type: FundsTransferType) {
  fundsTransfers(
    where: {type: review_payment_done}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    review {
      id
    }
    amount
    sender
    to
    createdAtS
    type
    asset
  }
}
    `;

/**
 * __useGetFundSentforReviewsQuery__
 *
 * To run a query within a React component, call `useGetFundSentforReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundSentforReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundSentforReviewsQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetFundSentforReviewsQuery(baseOptions?: Apollo.QueryHookOptions<GetFundSentforReviewsQuery, GetFundSentforReviewsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundSentforReviewsQuery, GetFundSentforReviewsQueryVariables>(GetFundSentforReviewsDocument, options);
      }
export function useGetFundSentforReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundSentforReviewsQuery, GetFundSentforReviewsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundSentforReviewsQuery, GetFundSentforReviewsQueryVariables>(GetFundSentforReviewsDocument, options);
        }
export type GetFundSentforReviewsQueryHookResult = ReturnType<typeof useGetFundSentforReviewsQuery>;
export type GetFundSentforReviewsLazyQueryHookResult = ReturnType<typeof useGetFundSentforReviewsLazyQuery>;
export type GetFundSentforReviewsQueryResult = Apollo.QueryResult<GetFundSentforReviewsQuery, GetFundSentforReviewsQueryVariables>;
export const GetFundSentDisburseDocument = gql`
    query getFundSentDisburse($type: FundsTransferType) {
  fundsTransfers(
    where: {type: funds_disbursed}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    review {
      id
    }
    grant {
      id
    }
    amount
    sender
    to
    createdAtS
    type
    asset
  }
}
    `;

/**
 * __useGetFundSentDisburseQuery__
 *
 * To run a query within a React component, call `useGetFundSentDisburseQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundSentDisburseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundSentDisburseQuery({
 *   variables: {
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetFundSentDisburseQuery(baseOptions?: Apollo.QueryHookOptions<GetFundSentDisburseQuery, GetFundSentDisburseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundSentDisburseQuery, GetFundSentDisburseQueryVariables>(GetFundSentDisburseDocument, options);
      }
export function useGetFundSentDisburseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundSentDisburseQuery, GetFundSentDisburseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundSentDisburseQuery, GetFundSentDisburseQueryVariables>(GetFundSentDisburseDocument, options);
        }
export type GetFundSentDisburseQueryHookResult = ReturnType<typeof useGetFundSentDisburseQuery>;
export type GetFundSentDisburseLazyQueryHookResult = ReturnType<typeof useGetFundSentDisburseLazyQuery>;
export type GetFundSentDisburseQueryResult = Apollo.QueryResult<GetFundSentDisburseQuery, GetFundSentDisburseQueryVariables>;
export const GetFundSentDisburseforGrantDocument = gql`
    query getFundSentDisburseforGrant($type: FundsTransferType, $grant: String) {
  fundsTransfers(
    where: {type: funds_disbursed, grant: $grant}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    amount
    sender
    to
    createdAtS
    type
    asset
  }
}
    `;

/**
 * __useGetFundSentDisburseforGrantQuery__
 *
 * To run a query within a React component, call `useGetFundSentDisburseforGrantQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundSentDisburseforGrantQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundSentDisburseforGrantQuery({
 *   variables: {
 *      type: // value for 'type'
 *      grant: // value for 'grant'
 *   },
 * });
 */
export function useGetFundSentDisburseforGrantQuery(baseOptions?: Apollo.QueryHookOptions<GetFundSentDisburseforGrantQuery, GetFundSentDisburseforGrantQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundSentDisburseforGrantQuery, GetFundSentDisburseforGrantQueryVariables>(GetFundSentDisburseforGrantDocument, options);
      }
export function useGetFundSentDisburseforGrantLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundSentDisburseforGrantQuery, GetFundSentDisburseforGrantQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundSentDisburseforGrantQuery, GetFundSentDisburseforGrantQueryVariables>(GetFundSentDisburseforGrantDocument, options);
        }
export type GetFundSentDisburseforGrantQueryHookResult = ReturnType<typeof useGetFundSentDisburseforGrantQuery>;
export type GetFundSentDisburseforGrantLazyQueryHookResult = ReturnType<typeof useGetFundSentDisburseforGrantLazyQuery>;
export type GetFundSentDisburseforGrantQueryResult = Apollo.QueryResult<GetFundSentDisburseforGrantQuery, GetFundSentDisburseforGrantQueryVariables>;
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
export const GetFundsAndProfileDataDocument = gql`
    query getFundsAndProfileData($type: FundsTransferType, $first: Int, $skip: Int, $workspaceId: String!, $acceptingApplications: Boolean!) {
  fundsTransfers(
    where: {type: funds_disbursed}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    review {
      id
    }
    grant {
      id
    }
    amount
    sender
    to
    createdAtS
    type
    asset
  }
  grants(
    first: $first
    skip: $skip
    subgraphError: allow
    where: {workspace: $workspaceId, acceptingApplications: $acceptingApplications}
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
      token {
        address
        label
        decimal
        iconHash
      }
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
    applications {
      id
      state
      createdAtS
      updatedAtS
    }
  }
}
    `;

/**
 * __useGetFundsAndProfileDataQuery__
 *
 * To run a query within a React component, call `useGetFundsAndProfileDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundsAndProfileDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundsAndProfileDataQuery({
 *   variables: {
 *      type: // value for 'type'
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      workspaceId: // value for 'workspaceId'
 *      acceptingApplications: // value for 'acceptingApplications'
 *   },
 * });
 */
export function useGetFundsAndProfileDataQuery(baseOptions: Apollo.QueryHookOptions<GetFundsAndProfileDataQuery, GetFundsAndProfileDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFundsAndProfileDataQuery, GetFundsAndProfileDataQueryVariables>(GetFundsAndProfileDataDocument, options);
      }
export function useGetFundsAndProfileDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFundsAndProfileDataQuery, GetFundsAndProfileDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFundsAndProfileDataQuery, GetFundsAndProfileDataQueryVariables>(GetFundsAndProfileDataDocument, options);
        }
export type GetFundsAndProfileDataQueryHookResult = ReturnType<typeof useGetFundsAndProfileDataQuery>;
export type GetFundsAndProfileDataLazyQueryHookResult = ReturnType<typeof useGetFundsAndProfileDataLazyQuery>;
export type GetFundsAndProfileDataQueryResult = Apollo.QueryResult<GetFundsAndProfileDataQuery, GetFundsAndProfileDataQueryVariables>;
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
      isPii
    }
    reward {
      id
      asset
      committed
      token {
        address
        label
        decimal
        iconHash
      }
    }
    workspace {
      id
      title
      logoIpfsHash
      supportedNetworks
      members {
        id
        actorId
        publicKey
        email
      }
    }
    deadline
    funding
    acceptingApplications
    rubric {
      isPrivate
      items {
        id
        title
        details
        maximumPoints
      }
    }
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
export const GetGrantsAppliedToDocument = gql`
    query getGrantsAppliedTo($first: Int, $skip: Int, $applicantID: Bytes!) {
  grantApplications(
    first: $first
    skip: $skip
    where: {applicantId: $applicantID}
    subgraphError: allow
  ) {
    id
    grant {
      id
    }
  }
}
    `;

/**
 * __useGetGrantsAppliedToQuery__
 *
 * To run a query within a React component, call `useGetGrantsAppliedToQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantsAppliedToQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantsAppliedToQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      applicantID: // value for 'applicantID'
 *   },
 * });
 */
export function useGetGrantsAppliedToQuery(baseOptions: Apollo.QueryHookOptions<GetGrantsAppliedToQuery, GetGrantsAppliedToQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantsAppliedToQuery, GetGrantsAppliedToQueryVariables>(GetGrantsAppliedToDocument, options);
      }
export function useGetGrantsAppliedToLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantsAppliedToQuery, GetGrantsAppliedToQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantsAppliedToQuery, GetGrantsAppliedToQueryVariables>(GetGrantsAppliedToDocument, options);
        }
export type GetGrantsAppliedToQueryHookResult = ReturnType<typeof useGetGrantsAppliedToQuery>;
export type GetGrantsAppliedToLazyQueryHookResult = ReturnType<typeof useGetGrantsAppliedToLazyQuery>;
export type GetGrantsAppliedToQueryResult = Apollo.QueryResult<GetGrantsAppliedToQuery, GetGrantsAppliedToQueryVariables>;
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
      reward {
        asset
        token {
          address
          label
          decimal
          iconHash
        }
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
    query getNumberOfApplications($first: Int, $skip: Int, $applicantId: Bytes!) {
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
export function useGetNumberOfApplicationsQuery(baseOptions: Apollo.QueryHookOptions<GetNumberOfApplicationsQuery, GetNumberOfApplicationsQueryVariables>) {
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
    query getNumberOfGrants($first: Int, $skip: Int, $workspaceId: String!) {
  grants(where: {workspace: $workspaceId}, subgraphError: allow) {
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
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetNumberOfGrantsQuery(baseOptions: Apollo.QueryHookOptions<GetNumberOfGrantsQuery, GetNumberOfGrantsQueryVariables>) {
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
export const GetRubricsForWorkspaceMemberQueryDocument = gql`
    query getRubricsForWorkspaceMemberQuery($id: String) {
  rubrics(where: {addedBy_ends_with: $id}) {
    id
  }
}
    `;

/**
 * __useGetRubricsForWorkspaceMemberQueryQuery__
 *
 * To run a query within a React component, call `useGetRubricsForWorkspaceMemberQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRubricsForWorkspaceMemberQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRubricsForWorkspaceMemberQueryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRubricsForWorkspaceMemberQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetRubricsForWorkspaceMemberQueryQuery, GetRubricsForWorkspaceMemberQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRubricsForWorkspaceMemberQueryQuery, GetRubricsForWorkspaceMemberQueryQueryVariables>(GetRubricsForWorkspaceMemberQueryDocument, options);
      }
export function useGetRubricsForWorkspaceMemberQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRubricsForWorkspaceMemberQueryQuery, GetRubricsForWorkspaceMemberQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRubricsForWorkspaceMemberQueryQuery, GetRubricsForWorkspaceMemberQueryQueryVariables>(GetRubricsForWorkspaceMemberQueryDocument, options);
        }
export type GetRubricsForWorkspaceMemberQueryQueryHookResult = ReturnType<typeof useGetRubricsForWorkspaceMemberQueryQuery>;
export type GetRubricsForWorkspaceMemberQueryLazyQueryHookResult = ReturnType<typeof useGetRubricsForWorkspaceMemberQueryLazyQuery>;
export type GetRubricsForWorkspaceMemberQueryQueryResult = Apollo.QueryResult<GetRubricsForWorkspaceMemberQueryQuery, GetRubricsForWorkspaceMemberQueryQueryVariables>;
export const GetWorkspaceDetailsDocument = gql`
    query getWorkspaceDetails($workspaceID: ID!) {
  workspace(id: $workspaceID, subgraphError: allow) {
    id
    title
    bio
    about
    logoIpfsHash
    coverImageIpfsHash
    supportedNetworks
    partners {
      name
      industry
      website
      partnerImageHash
    }
    socials {
      name
      value
    }
    tokens {
      address
      label
      decimal
      iconHash
    }
    members {
      id
      actorId
      publicKey
      email
      accessLevel
      updatedAt
      outstandingReviewIds
      lastReviewSubmittedAt
      addedBy {
        id
        actorId
      }
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
export const GetWorkspaceMemberExistsDocument = gql`
    query getWorkspaceMemberExists($id: ID!) {
  workspaceMember(id: $id) {
    id
  }
}
    `;

/**
 * __useGetWorkspaceMemberExistsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceMemberExistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceMemberExistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceMemberExistsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetWorkspaceMemberExistsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceMemberExistsQuery, GetWorkspaceMemberExistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceMemberExistsQuery, GetWorkspaceMemberExistsQueryVariables>(GetWorkspaceMemberExistsDocument, options);
      }
export function useGetWorkspaceMemberExistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceMemberExistsQuery, GetWorkspaceMemberExistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceMemberExistsQuery, GetWorkspaceMemberExistsQueryVariables>(GetWorkspaceMemberExistsDocument, options);
        }
export type GetWorkspaceMemberExistsQueryHookResult = ReturnType<typeof useGetWorkspaceMemberExistsQuery>;
export type GetWorkspaceMemberExistsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceMemberExistsLazyQuery>;
export type GetWorkspaceMemberExistsQueryResult = Apollo.QueryResult<GetWorkspaceMemberExistsQuery, GetWorkspaceMemberExistsQueryVariables>;
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
      tokens {
        address
        label
        decimal
        iconHash
      }
      members {
        id
        actorId
        publicKey
        email
        accessLevel
        outstandingReviewIds
        lastReviewSubmittedAt
      }
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
export const GetWorkspaceMembersByWorkspaceIdDocument = gql`
    query getWorkspaceMembersByWorkspaceId($workspaceId: String!, $accessLevelsIn: [WorkspaceMemberAccessLevel!]!, $first: Int, $skip: Int) {
  workspaceMembers(
    where: {workspace: $workspaceId, accessLevel_in: $accessLevelsIn}
    first: $first
    skip: $skip
    subgraphError: allow
  ) {
    id
    actorId
    fullName
    profilePictureIpfsHash
    accessLevel
    addedAt
  }
}
    `;

/**
 * __useGetWorkspaceMembersByWorkspaceIdQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceMembersByWorkspaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceMembersByWorkspaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceMembersByWorkspaceIdQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      accessLevelsIn: // value for 'accessLevelsIn'
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetWorkspaceMembersByWorkspaceIdQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceMembersByWorkspaceIdQuery, GetWorkspaceMembersByWorkspaceIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceMembersByWorkspaceIdQuery, GetWorkspaceMembersByWorkspaceIdQueryVariables>(GetWorkspaceMembersByWorkspaceIdDocument, options);
      }
export function useGetWorkspaceMembersByWorkspaceIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceMembersByWorkspaceIdQuery, GetWorkspaceMembersByWorkspaceIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceMembersByWorkspaceIdQuery, GetWorkspaceMembersByWorkspaceIdQueryVariables>(GetWorkspaceMembersByWorkspaceIdDocument, options);
        }
export type GetWorkspaceMembersByWorkspaceIdQueryHookResult = ReturnType<typeof useGetWorkspaceMembersByWorkspaceIdQuery>;
export type GetWorkspaceMembersByWorkspaceIdLazyQueryHookResult = ReturnType<typeof useGetWorkspaceMembersByWorkspaceIdLazyQuery>;
export type GetWorkspaceMembersByWorkspaceIdQueryResult = Apollo.QueryResult<GetWorkspaceMembersByWorkspaceIdQuery, GetWorkspaceMembersByWorkspaceIdQueryVariables>;