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
  /** Time in epoch when the feedback was submitted by the admin */
  feedbackDaoUpdatedAtS?: Maybe<Scalars['Int']>;
  /** Feedback from the developer */
  feedbackDev?: Maybe<Scalars['String']>;
  /** Time in epoch when the feedback was submitted by the applicant */
  feedbackDevUpdatedAtS?: Maybe<Scalars['Int']>;
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
  feedbackDaoUpdatedAtS?: InputMaybe<Scalars['Int']>;
  feedbackDaoUpdatedAtS_gt?: InputMaybe<Scalars['Int']>;
  feedbackDaoUpdatedAtS_gte?: InputMaybe<Scalars['Int']>;
  feedbackDaoUpdatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  feedbackDaoUpdatedAtS_lt?: InputMaybe<Scalars['Int']>;
  feedbackDaoUpdatedAtS_lte?: InputMaybe<Scalars['Int']>;
  feedbackDaoUpdatedAtS_not?: InputMaybe<Scalars['Int']>;
  feedbackDaoUpdatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  feedbackDevUpdatedAtS?: InputMaybe<Scalars['Int']>;
  feedbackDevUpdatedAtS_gt?: InputMaybe<Scalars['Int']>;
  feedbackDevUpdatedAtS_gte?: InputMaybe<Scalars['Int']>;
  feedbackDevUpdatedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  feedbackDevUpdatedAtS_lt?: InputMaybe<Scalars['Int']>;
  feedbackDevUpdatedAtS_lte?: InputMaybe<Scalars['Int']>;
  feedbackDevUpdatedAtS_not?: InputMaybe<Scalars['Int']>;
  feedbackDevUpdatedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  FeedbackDaoUpdatedAtS = 'feedbackDaoUpdatedAtS',
  FeedbackDev = 'feedbackDev',
  FeedbackDevUpdatedAtS = 'feedbackDevUpdatedAtS',
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

export type Comment = {
  __typename?: 'Comment';
  /** Application where the comment was added */
  application: GrantApplication;
  /** comments encrypted data */
  commentsEncryptedData?: Maybe<Array<PiiData>>;
  /** comment public metadata hash */
  commentsPublicHash?: Maybe<Scalars['String']>;
  /** Last comment added date and time in epochs */
  createdAt: Scalars['Int'];
  /** Grant the application was submitted to */
  grant: Grant;
  id: Scalars['ID'];
  /** Denotes if the comment should be private or public */
  isPrivate: Scalars['Boolean'];
  /** Workspace that the application belongs to */
  workspace: Workspace;
};


export type CommentCommentsEncryptedDataArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PiiData_Filter>;
};

export type Comment_Filter = {
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
  commentsEncryptedData?: InputMaybe<Array<Scalars['String']>>;
  commentsEncryptedData_?: InputMaybe<PiiData_Filter>;
  commentsEncryptedData_contains?: InputMaybe<Array<Scalars['String']>>;
  commentsEncryptedData_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  commentsEncryptedData_not?: InputMaybe<Array<Scalars['String']>>;
  commentsEncryptedData_not_contains?: InputMaybe<Array<Scalars['String']>>;
  commentsEncryptedData_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  commentsPublicHash?: InputMaybe<Scalars['String']>;
  commentsPublicHash_contains?: InputMaybe<Scalars['String']>;
  commentsPublicHash_contains_nocase?: InputMaybe<Scalars['String']>;
  commentsPublicHash_ends_with?: InputMaybe<Scalars['String']>;
  commentsPublicHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  commentsPublicHash_gt?: InputMaybe<Scalars['String']>;
  commentsPublicHash_gte?: InputMaybe<Scalars['String']>;
  commentsPublicHash_in?: InputMaybe<Array<Scalars['String']>>;
  commentsPublicHash_lt?: InputMaybe<Scalars['String']>;
  commentsPublicHash_lte?: InputMaybe<Scalars['String']>;
  commentsPublicHash_not?: InputMaybe<Scalars['String']>;
  commentsPublicHash_not_contains?: InputMaybe<Scalars['String']>;
  commentsPublicHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  commentsPublicHash_not_ends_with?: InputMaybe<Scalars['String']>;
  commentsPublicHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  commentsPublicHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  commentsPublicHash_not_starts_with?: InputMaybe<Scalars['String']>;
  commentsPublicHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  commentsPublicHash_starts_with?: InputMaybe<Scalars['String']>;
  commentsPublicHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Int']>;
  createdAt_gt?: InputMaybe<Scalars['Int']>;
  createdAt_gte?: InputMaybe<Scalars['Int']>;
  createdAt_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAt_lt?: InputMaybe<Scalars['Int']>;
  createdAt_lte?: InputMaybe<Scalars['Int']>;
  createdAt_not?: InputMaybe<Scalars['Int']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  isPrivate?: InputMaybe<Scalars['Boolean']>;
  isPrivate_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPrivate_not?: InputMaybe<Scalars['Boolean']>;
  isPrivate_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
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

export enum Comment_OrderBy {
  Application = 'application',
  CommentsEncryptedData = 'commentsEncryptedData',
  CommentsPublicHash = 'commentsPublicHash',
  CreatedAt = 'createdAt',
  Grant = 'grant',
  Id = 'id',
  IsPrivate = 'isPrivate',
  Workspace = 'workspace'
}

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
  /** Funds transfer execution timestamp */
  executionTimestamp?: Maybe<Scalars['Int']>;
  /** Which grant were the funds transferred to/from */
  grant: Grant;
  id: Scalars['ID'];
  /** Milestone for which the funds were released */
  milestone?: Maybe<ApplicationMilestone>;
  nonEvmAsset?: Maybe<Scalars['String']>;
  /** Reviw for which the payment was done */
  review?: Maybe<Review>;
  /** Address of who released the funds */
  sender: Scalars['Bytes'];
  status: FundsTransferStatusType;
  /** The address to which funds were sent */
  to: Scalars['Bytes'];
  /** Token name */
  tokenName?: Maybe<Scalars['String']>;
  /** Token amount transferred value in USD */
  tokenUSDValue?: Maybe<Scalars['BigInt']>;
  /** Hash/signature of the transaction */
  transactionHash?: Maybe<Scalars['String']>;
  /** What the type of funds transfer is */
  type: FundsTransferType;
};

export enum FundsTransferStatusType {
  Executed = 'executed',
  Queued = 'queued'
}

export enum FundsTransferType {
  FundsDeposited = 'funds_deposited',
  FundsDisbursed = 'funds_disbursed',
  FundsDisbursedFromSafe = 'funds_disbursed_from_safe',
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
  executionTimestamp?: InputMaybe<Scalars['Int']>;
  executionTimestamp_gt?: InputMaybe<Scalars['Int']>;
  executionTimestamp_gte?: InputMaybe<Scalars['Int']>;
  executionTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  executionTimestamp_lt?: InputMaybe<Scalars['Int']>;
  executionTimestamp_lte?: InputMaybe<Scalars['Int']>;
  executionTimestamp_not?: InputMaybe<Scalars['Int']>;
  executionTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  nonEvmAsset?: InputMaybe<Scalars['String']>;
  nonEvmAsset_contains?: InputMaybe<Scalars['String']>;
  nonEvmAsset_contains_nocase?: InputMaybe<Scalars['String']>;
  nonEvmAsset_ends_with?: InputMaybe<Scalars['String']>;
  nonEvmAsset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonEvmAsset_gt?: InputMaybe<Scalars['String']>;
  nonEvmAsset_gte?: InputMaybe<Scalars['String']>;
  nonEvmAsset_in?: InputMaybe<Array<Scalars['String']>>;
  nonEvmAsset_lt?: InputMaybe<Scalars['String']>;
  nonEvmAsset_lte?: InputMaybe<Scalars['String']>;
  nonEvmAsset_not?: InputMaybe<Scalars['String']>;
  nonEvmAsset_not_contains?: InputMaybe<Scalars['String']>;
  nonEvmAsset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  nonEvmAsset_not_ends_with?: InputMaybe<Scalars['String']>;
  nonEvmAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  nonEvmAsset_not_in?: InputMaybe<Array<Scalars['String']>>;
  nonEvmAsset_not_starts_with?: InputMaybe<Scalars['String']>;
  nonEvmAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  nonEvmAsset_starts_with?: InputMaybe<Scalars['String']>;
  nonEvmAsset_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  status?: InputMaybe<FundsTransferStatusType>;
  status_in?: InputMaybe<Array<FundsTransferStatusType>>;
  status_not?: InputMaybe<FundsTransferStatusType>;
  status_not_in?: InputMaybe<Array<FundsTransferStatusType>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokenName?: InputMaybe<Scalars['String']>;
  tokenName_contains?: InputMaybe<Scalars['String']>;
  tokenName_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenName_ends_with?: InputMaybe<Scalars['String']>;
  tokenName_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenName_gt?: InputMaybe<Scalars['String']>;
  tokenName_gte?: InputMaybe<Scalars['String']>;
  tokenName_in?: InputMaybe<Array<Scalars['String']>>;
  tokenName_lt?: InputMaybe<Scalars['String']>;
  tokenName_lte?: InputMaybe<Scalars['String']>;
  tokenName_not?: InputMaybe<Scalars['String']>;
  tokenName_not_contains?: InputMaybe<Scalars['String']>;
  tokenName_not_contains_nocase?: InputMaybe<Scalars['String']>;
  tokenName_not_ends_with?: InputMaybe<Scalars['String']>;
  tokenName_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenName_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenName_not_starts_with?: InputMaybe<Scalars['String']>;
  tokenName_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenName_starts_with?: InputMaybe<Scalars['String']>;
  tokenName_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenUSDValue?: InputMaybe<Scalars['BigInt']>;
  tokenUSDValue_gt?: InputMaybe<Scalars['BigInt']>;
  tokenUSDValue_gte?: InputMaybe<Scalars['BigInt']>;
  tokenUSDValue_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenUSDValue_lt?: InputMaybe<Scalars['BigInt']>;
  tokenUSDValue_lte?: InputMaybe<Scalars['BigInt']>;
  tokenUSDValue_not?: InputMaybe<Scalars['BigInt']>;
  tokenUSDValue_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['String']>;
  transactionHash_contains?: InputMaybe<Scalars['String']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_gt?: InputMaybe<Scalars['String']>;
  transactionHash_gte?: InputMaybe<Scalars['String']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']>;
  transactionHash_lte?: InputMaybe<Scalars['String']>;
  transactionHash_not?: InputMaybe<Scalars['String']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  ExecutionTimestamp = 'executionTimestamp',
  Grant = 'grant',
  Id = 'id',
  Milestone = 'milestone',
  NonEvmAsset = 'nonEvmAsset',
  Review = 'review',
  Sender = 'sender',
  Status = 'status',
  To = 'to',
  TokenName = 'tokenName',
  TokenUsdValue = 'tokenUSDValue',
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
  /** IPFS hash of the documnet uploaded */
  docIpfsHash?: Maybe<Scalars['String']>;
  /** Expected fields from the applicants of the grant */
  fields: Array<GrantField>;
  /** List of fund transfer records for the grant */
  fundTransfers: Array<FundsTransfer>;
  /** Funding currently present in the grant */
  funding: Scalars['BigInt'];
  id: Scalars['ID'];
  /** External link to any other website */
  link?: Maybe<Scalars['String']>;
  /** People who will manage the grant. They can see the PII submitted in an application */
  managers: Array<GrantManager>;
  metadataHash: Scalars['String'];
  /** milestones required */
  milestones?: Maybe<Array<Scalars['String']>>;
  /** Number of applications in the grant */
  numberOfApplications: Scalars['Int'];
  /** Number of Reviewers per application for the grant */
  numberOfReviewersPerApplication?: Maybe<Scalars['Int']>;
  /** type of payout */
  payoutType?: Maybe<PayoutType>;
  /** Review type */
  reviewType?: Maybe<ReviewType>;
  /** Proposed reward for the grant */
  reward: Reward;
  /** Rubric for evaulating the grant */
  rubric?: Maybe<Rubric>;
  /** ISO formatted date string */
  startDate?: Maybe<Scalars['String']>;
  /** Start time for accepting applications, in seconds since epoch */
  startDateS?: Maybe<Scalars['Int']>;
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
  /** Public key of the applicant, used for PII */
  applicantPublicKey?: Maybe<Scalars['String']>;
  /** People who will review this grant application */
  applicationReviewers: Array<GrantApplicationReviewer>;
  /** IPFS hash of the comments on the application */
  comments?: Maybe<Array<Comment>>;
  /** in seconds since epoch */
  createdAtS: Scalars['Int'];
  /** Addresses of the assigned reviewers who have reviewed */
  doneReviewerAddresses: Array<Scalars['Bytes']>;
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
  /** Addresses of the assigned reviewers who are yet to review */
  pendingReviewerAddresses: Array<Scalars['Bytes']>;
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


export type GrantApplicationCommentsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Comment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Comment_Filter>;
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
  applicantPublicKey?: InputMaybe<Scalars['String']>;
  applicantPublicKey_contains?: InputMaybe<Scalars['String']>;
  applicantPublicKey_contains_nocase?: InputMaybe<Scalars['String']>;
  applicantPublicKey_ends_with?: InputMaybe<Scalars['String']>;
  applicantPublicKey_ends_with_nocase?: InputMaybe<Scalars['String']>;
  applicantPublicKey_gt?: InputMaybe<Scalars['String']>;
  applicantPublicKey_gte?: InputMaybe<Scalars['String']>;
  applicantPublicKey_in?: InputMaybe<Array<Scalars['String']>>;
  applicantPublicKey_lt?: InputMaybe<Scalars['String']>;
  applicantPublicKey_lte?: InputMaybe<Scalars['String']>;
  applicantPublicKey_not?: InputMaybe<Scalars['String']>;
  applicantPublicKey_not_contains?: InputMaybe<Scalars['String']>;
  applicantPublicKey_not_contains_nocase?: InputMaybe<Scalars['String']>;
  applicantPublicKey_not_ends_with?: InputMaybe<Scalars['String']>;
  applicantPublicKey_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  applicantPublicKey_not_in?: InputMaybe<Array<Scalars['String']>>;
  applicantPublicKey_not_starts_with?: InputMaybe<Scalars['String']>;
  applicantPublicKey_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  applicantPublicKey_starts_with?: InputMaybe<Scalars['String']>;
  applicantPublicKey_starts_with_nocase?: InputMaybe<Scalars['String']>;
  applicationReviewers?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_?: InputMaybe<GrantApplicationReviewer_Filter>;
  applicationReviewers_contains?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_not?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_not_contains?: InputMaybe<Array<Scalars['String']>>;
  applicationReviewers_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  comments_?: InputMaybe<Comment_Filter>;
  createdAtS?: InputMaybe<Scalars['Int']>;
  createdAtS_gt?: InputMaybe<Scalars['Int']>;
  createdAtS_gte?: InputMaybe<Scalars['Int']>;
  createdAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtS_lt?: InputMaybe<Scalars['Int']>;
  createdAtS_lte?: InputMaybe<Scalars['Int']>;
  createdAtS_not?: InputMaybe<Scalars['Int']>;
  createdAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  doneReviewerAddresses?: InputMaybe<Array<Scalars['Bytes']>>;
  doneReviewerAddresses_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  doneReviewerAddresses_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  doneReviewerAddresses_not?: InputMaybe<Array<Scalars['Bytes']>>;
  doneReviewerAddresses_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  doneReviewerAddresses_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
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
  pendingReviewerAddresses?: InputMaybe<Array<Scalars['Bytes']>>;
  pendingReviewerAddresses_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  pendingReviewerAddresses_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  pendingReviewerAddresses_not?: InputMaybe<Array<Scalars['Bytes']>>;
  pendingReviewerAddresses_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  pendingReviewerAddresses_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
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
  ApplicantPublicKey = 'applicantPublicKey',
  ApplicationReviewers = 'applicationReviewers',
  Comments = 'comments',
  CreatedAtS = 'createdAtS',
  DoneReviewerAddresses = 'doneReviewerAddresses',
  FeedbackDao = 'feedbackDao',
  FeedbackDev = 'feedbackDev',
  Fields = 'fields',
  Grant = 'grant',
  Id = 'id',
  Milestones = 'milestones',
  PendingReviewerAddresses = 'pendingReviewerAddresses',
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

export type GrantReviewerCounter = {
  __typename?: 'GrantReviewerCounter';
  /** total number of applications assigned in grant */
  counter: Scalars['Int'];
  /** number of applications reviewed in the grant */
  doneCounter: Scalars['Int'];
  /** The grant itself */
  grant: Grant;
  /** ID of the entity, grantID . reviewerAddress */
  id: Scalars['ID'];
  /** number of applications assigned, pending in the grant */
  pendingCounter: Scalars['Int'];
  /** Address of the reviewer */
  reviewerAddress: Scalars['Bytes'];
};

export type GrantReviewerCounter_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  counter?: InputMaybe<Scalars['Int']>;
  counter_gt?: InputMaybe<Scalars['Int']>;
  counter_gte?: InputMaybe<Scalars['Int']>;
  counter_in?: InputMaybe<Array<Scalars['Int']>>;
  counter_lt?: InputMaybe<Scalars['Int']>;
  counter_lte?: InputMaybe<Scalars['Int']>;
  counter_not?: InputMaybe<Scalars['Int']>;
  counter_not_in?: InputMaybe<Array<Scalars['Int']>>;
  doneCounter?: InputMaybe<Scalars['Int']>;
  doneCounter_gt?: InputMaybe<Scalars['Int']>;
  doneCounter_gte?: InputMaybe<Scalars['Int']>;
  doneCounter_in?: InputMaybe<Array<Scalars['Int']>>;
  doneCounter_lt?: InputMaybe<Scalars['Int']>;
  doneCounter_lte?: InputMaybe<Scalars['Int']>;
  doneCounter_not?: InputMaybe<Scalars['Int']>;
  doneCounter_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  pendingCounter?: InputMaybe<Scalars['Int']>;
  pendingCounter_gt?: InputMaybe<Scalars['Int']>;
  pendingCounter_gte?: InputMaybe<Scalars['Int']>;
  pendingCounter_in?: InputMaybe<Array<Scalars['Int']>>;
  pendingCounter_lt?: InputMaybe<Scalars['Int']>;
  pendingCounter_lte?: InputMaybe<Scalars['Int']>;
  pendingCounter_not?: InputMaybe<Scalars['Int']>;
  pendingCounter_not_in?: InputMaybe<Array<Scalars['Int']>>;
  reviewerAddress?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_contains?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  reviewerAddress_not?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum GrantReviewerCounter_OrderBy {
  Counter = 'counter',
  DoneCounter = 'doneCounter',
  Grant = 'grant',
  Id = 'id',
  PendingCounter = 'pendingCounter',
  ReviewerAddress = 'reviewerAddress'
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
  docIpfsHash?: InputMaybe<Scalars['String']>;
  docIpfsHash_contains?: InputMaybe<Scalars['String']>;
  docIpfsHash_contains_nocase?: InputMaybe<Scalars['String']>;
  docIpfsHash_ends_with?: InputMaybe<Scalars['String']>;
  docIpfsHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  docIpfsHash_gt?: InputMaybe<Scalars['String']>;
  docIpfsHash_gte?: InputMaybe<Scalars['String']>;
  docIpfsHash_in?: InputMaybe<Array<Scalars['String']>>;
  docIpfsHash_lt?: InputMaybe<Scalars['String']>;
  docIpfsHash_lte?: InputMaybe<Scalars['String']>;
  docIpfsHash_not?: InputMaybe<Scalars['String']>;
  docIpfsHash_not_contains?: InputMaybe<Scalars['String']>;
  docIpfsHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  docIpfsHash_not_ends_with?: InputMaybe<Scalars['String']>;
  docIpfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  docIpfsHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  docIpfsHash_not_starts_with?: InputMaybe<Scalars['String']>;
  docIpfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  docIpfsHash_starts_with?: InputMaybe<Scalars['String']>;
  docIpfsHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  link?: InputMaybe<Scalars['String']>;
  link_contains?: InputMaybe<Scalars['String']>;
  link_contains_nocase?: InputMaybe<Scalars['String']>;
  link_ends_with?: InputMaybe<Scalars['String']>;
  link_ends_with_nocase?: InputMaybe<Scalars['String']>;
  link_gt?: InputMaybe<Scalars['String']>;
  link_gte?: InputMaybe<Scalars['String']>;
  link_in?: InputMaybe<Array<Scalars['String']>>;
  link_lt?: InputMaybe<Scalars['String']>;
  link_lte?: InputMaybe<Scalars['String']>;
  link_not?: InputMaybe<Scalars['String']>;
  link_not_contains?: InputMaybe<Scalars['String']>;
  link_not_contains_nocase?: InputMaybe<Scalars['String']>;
  link_not_ends_with?: InputMaybe<Scalars['String']>;
  link_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  link_not_in?: InputMaybe<Array<Scalars['String']>>;
  link_not_starts_with?: InputMaybe<Scalars['String']>;
  link_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  link_starts_with?: InputMaybe<Scalars['String']>;
  link_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  milestones?: InputMaybe<Array<Scalars['String']>>;
  milestones_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  milestones_not?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains?: InputMaybe<Array<Scalars['String']>>;
  milestones_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  numberOfApplications?: InputMaybe<Scalars['Int']>;
  numberOfApplications_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplications_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfReviewersPerApplication?: InputMaybe<Scalars['Int']>;
  numberOfReviewersPerApplication_gt?: InputMaybe<Scalars['Int']>;
  numberOfReviewersPerApplication_gte?: InputMaybe<Scalars['Int']>;
  numberOfReviewersPerApplication_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfReviewersPerApplication_lt?: InputMaybe<Scalars['Int']>;
  numberOfReviewersPerApplication_lte?: InputMaybe<Scalars['Int']>;
  numberOfReviewersPerApplication_not?: InputMaybe<Scalars['Int']>;
  numberOfReviewersPerApplication_not_in?: InputMaybe<Array<Scalars['Int']>>;
  payoutType?: InputMaybe<PayoutType>;
  payoutType_in?: InputMaybe<Array<PayoutType>>;
  payoutType_not?: InputMaybe<PayoutType>;
  payoutType_not_in?: InputMaybe<Array<PayoutType>>;
  reviewType?: InputMaybe<ReviewType>;
  reviewType_in?: InputMaybe<Array<ReviewType>>;
  reviewType_not?: InputMaybe<ReviewType>;
  reviewType_not_in?: InputMaybe<Array<ReviewType>>;
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
  startDate?: InputMaybe<Scalars['String']>;
  startDateS?: InputMaybe<Scalars['Int']>;
  startDateS_gt?: InputMaybe<Scalars['Int']>;
  startDateS_gte?: InputMaybe<Scalars['Int']>;
  startDateS_in?: InputMaybe<Array<Scalars['Int']>>;
  startDateS_lt?: InputMaybe<Scalars['Int']>;
  startDateS_lte?: InputMaybe<Scalars['Int']>;
  startDateS_not?: InputMaybe<Scalars['Int']>;
  startDateS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  startDate_contains?: InputMaybe<Scalars['String']>;
  startDate_contains_nocase?: InputMaybe<Scalars['String']>;
  startDate_ends_with?: InputMaybe<Scalars['String']>;
  startDate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  startDate_gt?: InputMaybe<Scalars['String']>;
  startDate_gte?: InputMaybe<Scalars['String']>;
  startDate_in?: InputMaybe<Array<Scalars['String']>>;
  startDate_lt?: InputMaybe<Scalars['String']>;
  startDate_lte?: InputMaybe<Scalars['String']>;
  startDate_not?: InputMaybe<Scalars['String']>;
  startDate_not_contains?: InputMaybe<Scalars['String']>;
  startDate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  startDate_not_ends_with?: InputMaybe<Scalars['String']>;
  startDate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  startDate_not_in?: InputMaybe<Array<Scalars['String']>>;
  startDate_not_starts_with?: InputMaybe<Scalars['String']>;
  startDate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  startDate_starts_with?: InputMaybe<Scalars['String']>;
  startDate_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  DocIpfsHash = 'docIpfsHash',
  Fields = 'fields',
  FundTransfers = 'fundTransfers',
  Funding = 'funding',
  Id = 'id',
  Link = 'link',
  Managers = 'managers',
  MetadataHash = 'metadataHash',
  Milestones = 'milestones',
  NumberOfApplications = 'numberOfApplications',
  NumberOfReviewersPerApplication = 'numberOfReviewersPerApplication',
  PayoutType = 'payoutType',
  ReviewType = 'reviewType',
  Reward = 'reward',
  Rubric = 'rubric',
  StartDate = 'startDate',
  StartDateS = 'startDateS',
  Summary = 'summary',
  Title = 'title',
  UpdatedAtS = 'updatedAtS',
  Workspace = 'workspace'
}

export type Migration = {
  __typename?: 'Migration';
  /** This is null if type !== ApplicationMigrate */
  application?: Maybe<GrantApplication>;
  /** The wallet that initiated the migration */
  fromWallet: Scalars['Bytes'];
  id: Scalars['ID'];
  /** This is null if type !== ReviewrMigrate */
  review?: Maybe<Review>;
  /** in seconds since epoch */
  timestamp: Scalars['Int'];
  /** The wallet to which the migration was done */
  toWallet: Scalars['Bytes'];
  /** The hash of the transaction that caused the migration */
  transactionHash: Scalars['String'];
  /** The type of migration that took place */
  type: MigrationType;
  /** This is null if type !== WorkspaceMemberMigrate */
  workspace?: Maybe<Workspace>;
};

export enum MigrationType {
  Application = 'Application',
  Review = 'Review',
  WorkspaceMember = 'WorkspaceMember'
}

export type Migration_Filter = {
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
  fromWallet?: InputMaybe<Scalars['Bytes']>;
  fromWallet_contains?: InputMaybe<Scalars['Bytes']>;
  fromWallet_in?: InputMaybe<Array<Scalars['Bytes']>>;
  fromWallet_not?: InputMaybe<Scalars['Bytes']>;
  fromWallet_not_contains?: InputMaybe<Scalars['Bytes']>;
  fromWallet_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
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
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  toWallet?: InputMaybe<Scalars['Bytes']>;
  toWallet_contains?: InputMaybe<Scalars['Bytes']>;
  toWallet_in?: InputMaybe<Array<Scalars['Bytes']>>;
  toWallet_not?: InputMaybe<Scalars['Bytes']>;
  toWallet_not_contains?: InputMaybe<Scalars['Bytes']>;
  toWallet_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['String']>;
  transactionHash_contains?: InputMaybe<Scalars['String']>;
  transactionHash_contains_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_ends_with?: InputMaybe<Scalars['String']>;
  transactionHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_gt?: InputMaybe<Scalars['String']>;
  transactionHash_gte?: InputMaybe<Scalars['String']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_lt?: InputMaybe<Scalars['String']>;
  transactionHash_lte?: InputMaybe<Scalars['String']>;
  transactionHash_not?: InputMaybe<Scalars['String']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']>;
  transactionHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_not_ends_with?: InputMaybe<Scalars['String']>;
  transactionHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_not_starts_with?: InputMaybe<Scalars['String']>;
  transactionHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transactionHash_starts_with?: InputMaybe<Scalars['String']>;
  transactionHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<MigrationType>;
  type_in?: InputMaybe<Array<MigrationType>>;
  type_not?: InputMaybe<MigrationType>;
  type_not_in?: InputMaybe<Array<MigrationType>>;
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

export enum Migration_OrderBy {
  Application = 'application',
  FromWallet = 'fromWallet',
  Id = 'id',
  Review = 'review',
  Timestamp = 'timestamp',
  ToWallet = 'toWallet',
  TransactionHash = 'transactionHash',
  Type = 'type',
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
  FundsDisbursedFromSafe = 'funds_disbursed_from_safe',
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

export type PiiData = {
  __typename?: 'PIIData';
  /** The encrypted data */
  data: Scalars['String'];
  id: Scalars['ID'];
};

export type PiiData_Filter = {
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
};

export enum PiiData_OrderBy {
  Data = 'data',
  Id = 'id'
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

export enum PayoutType {
  InOneGo = 'in_one_go',
  Milestones = 'milestones'
}

export type QbAdmin = {
  __typename?: 'QBAdmin';
  /** When the admin was added */
  addedAt: Scalars['Int'];
  id: Scalars['ID'];
  /** Address of the admin */
  walletAddress: Scalars['Bytes'];
};

export type QbAdmin_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedAt?: InputMaybe<Scalars['Int']>;
  addedAt_gt?: InputMaybe<Scalars['Int']>;
  addedAt_gte?: InputMaybe<Scalars['Int']>;
  addedAt_in?: InputMaybe<Array<Scalars['Int']>>;
  addedAt_lt?: InputMaybe<Scalars['Int']>;
  addedAt_lte?: InputMaybe<Scalars['Int']>;
  addedAt_not?: InputMaybe<Scalars['Int']>;
  addedAt_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  walletAddress?: InputMaybe<Scalars['Bytes']>;
  walletAddress_contains?: InputMaybe<Scalars['Bytes']>;
  walletAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  walletAddress_not?: InputMaybe<Scalars['Bytes']>;
  walletAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  walletAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum QbAdmin_OrderBy {
  AddedAt = 'addedAt',
  Id = 'id',
  WalletAddress = 'walletAddress'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  applicationMilestone?: Maybe<ApplicationMilestone>;
  applicationMilestones: Array<ApplicationMilestone>;
  comment?: Maybe<Comment>;
  comments: Array<Comment>;
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
  grantReviewerCounter?: Maybe<GrantReviewerCounter>;
  grantReviewerCounters: Array<GrantReviewerCounter>;
  grants: Array<Grant>;
  migration?: Maybe<Migration>;
  migrations: Array<Migration>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  partner?: Maybe<Partner>;
  partners: Array<Partner>;
  piianswer?: Maybe<PiiAnswer>;
  piianswers: Array<PiiAnswer>;
  piidata?: Maybe<PiiData>;
  piidatas: Array<PiiData>;
  qbadmin?: Maybe<QbAdmin>;
  qbadmins: Array<QbAdmin>;
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


export type QueryCommentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCommentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Comment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Comment_Filter>;
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


export type QueryGrantReviewerCounterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGrantReviewerCountersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantReviewerCounter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantReviewerCounter_Filter>;
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


export type QueryMigrationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMigrationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Migration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Migration_Filter>;
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


export type QueryPiidataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPiidatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PiiData_Filter>;
};


export type QueryQbadminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryQbadminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<QbAdmin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<QbAdmin_Filter>;
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
  reviewer: WorkspaceMember;
};


export type ReviewDataArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiAnswer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PiiAnswer_Filter>;
};

export enum ReviewType {
  Rubrics = 'rubrics',
  Voting = 'voting'
}

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
  Reviewer = 'reviewer'
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
  comment?: Maybe<Comment>;
  comments: Array<Comment>;
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
  grantReviewerCounter?: Maybe<GrantReviewerCounter>;
  grantReviewerCounters: Array<GrantReviewerCounter>;
  grants: Array<Grant>;
  migration?: Maybe<Migration>;
  migrations: Array<Migration>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  partner?: Maybe<Partner>;
  partners: Array<Partner>;
  piianswer?: Maybe<PiiAnswer>;
  piianswers: Array<PiiAnswer>;
  piidata?: Maybe<PiiData>;
  piidatas: Array<PiiData>;
  qbadmin?: Maybe<QbAdmin>;
  qbadmins: Array<QbAdmin>;
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


export type SubscriptionCommentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCommentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Comment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Comment_Filter>;
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


export type SubscriptionGrantReviewerCounterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGrantReviewerCountersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantReviewerCounter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GrantReviewerCounter_Filter>;
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


export type SubscriptionMigrationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMigrationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Migration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Migration_Filter>;
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


export type SubscriptionPiidataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPiidatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PiiData_Filter>;
};


export type SubscriptionQbadminArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionQbadminsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<QbAdmin_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<QbAdmin_Filter>;
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
  Chain_5 = 'chain_5',
  Chain_10 = 'chain_10',
  Chain_137 = 'chain_137',
  Chain_42220 = 'chain_42220'
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
  /** List of grant addresses in the workspace */
  grants: Array<Scalars['String']>;
  id: Scalars['ID'];
  /** Whether the workspace is visible to users in the explore page */
  isVisible: Scalars['Boolean'];
  /** Hash to fetch the logo */
  logoIpfsHash: Scalars['String'];
  /** Members of the workspace */
  members: Array<WorkspaceMember>;
  /** Hash of the IPFS file from which the details about the workspace were pulled */
  metadataHash: Scalars['String'];
  /** timestamp of when the latest grant was posted */
  mostRecentGrantPostedAtS: Scalars['Int'];
  /** total number of applications the DAO has received */
  numberOfApplications: Scalars['Int'];
  /** total number of applications the DAO has accepted */
  numberOfApplicationsSelected: Scalars['Int'];
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
  /** total grant funding committed in USD */
  totalGrantFundingCommittedUSD: Scalars['Int'];
  /** total grant funding committed in USD */
  totalGrantFundingDisbursedUSD: Scalars['Int'];
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
  addedBy?: Maybe<WorkspaceMember>;
  email?: Maybe<Scalars['String']>;
  /** Encrypted email */
  emailId?: Maybe<Scalars['String']>;
  /** An indicator if the person is an active part of the workspace or not */
  enabled: Scalars['Boolean'];
  /** Full name of the user */
  fullName?: Maybe<Scalars['String']>;
  /** Globally unique ID of the member */
  id: Scalars['ID'];
  /** Last known hash of the TX made by this user */
  lastKnownTxHash: Scalars['Bytes'];
  /** Timestamp of when the last review was done */
  lastReviewSubmittedAt: Scalars['Int'];
  /** The review IDs for which this member is owed a payment */
  outstandingReviewIds: Array<Scalars['String']>;
  /** PII data of the member */
  pii: Array<PiiData>;
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


export type WorkspaceMemberPiiArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PiiData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PiiData_Filter>;
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
  emailId?: InputMaybe<Scalars['String']>;
  emailId_contains?: InputMaybe<Scalars['String']>;
  emailId_contains_nocase?: InputMaybe<Scalars['String']>;
  emailId_ends_with?: InputMaybe<Scalars['String']>;
  emailId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emailId_gt?: InputMaybe<Scalars['String']>;
  emailId_gte?: InputMaybe<Scalars['String']>;
  emailId_in?: InputMaybe<Array<Scalars['String']>>;
  emailId_lt?: InputMaybe<Scalars['String']>;
  emailId_lte?: InputMaybe<Scalars['String']>;
  emailId_not?: InputMaybe<Scalars['String']>;
  emailId_not_contains?: InputMaybe<Scalars['String']>;
  emailId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  emailId_not_ends_with?: InputMaybe<Scalars['String']>;
  emailId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emailId_not_in?: InputMaybe<Array<Scalars['String']>>;
  emailId_not_starts_with?: InputMaybe<Scalars['String']>;
  emailId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emailId_starts_with?: InputMaybe<Scalars['String']>;
  emailId_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  enabled?: InputMaybe<Scalars['Boolean']>;
  enabled_in?: InputMaybe<Array<Scalars['Boolean']>>;
  enabled_not?: InputMaybe<Scalars['Boolean']>;
  enabled_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
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
  lastKnownTxHash?: InputMaybe<Scalars['Bytes']>;
  lastKnownTxHash_contains?: InputMaybe<Scalars['Bytes']>;
  lastKnownTxHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lastKnownTxHash_not?: InputMaybe<Scalars['Bytes']>;
  lastKnownTxHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  lastKnownTxHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  pii?: InputMaybe<Array<Scalars['String']>>;
  pii_?: InputMaybe<PiiData_Filter>;
  pii_contains?: InputMaybe<Array<Scalars['String']>>;
  pii_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  pii_not?: InputMaybe<Array<Scalars['String']>>;
  pii_not_contains?: InputMaybe<Array<Scalars['String']>>;
  pii_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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
  EmailId = 'emailId',
  Enabled = 'enabled',
  FullName = 'fullName',
  Id = 'id',
  LastKnownTxHash = 'lastKnownTxHash',
  LastReviewSubmittedAt = 'lastReviewSubmittedAt',
  OutstandingReviewIds = 'outstandingReviewIds',
  Pii = 'pii',
  ProfilePictureIpfsHash = 'profilePictureIpfsHash',
  PublicKey = 'publicKey',
  RemovedAt = 'removedAt',
  UpdatedAt = 'updatedAt',
  Workspace = 'workspace'
}

export type WorkspaceSafe = {
  __typename?: 'WorkspaceSafe';
  /** Address of the safe */
  address: Scalars['String'];
  /** Chain ID of the chain */
  chainId: Scalars['BigInt'];
  id: Scalars['ID'];
  /** Workspace of the space */
  workspace: Workspace;
};

export type WorkspaceSafe_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_contains_nocase?: InputMaybe<Scalars['String']>;
  address_ends_with?: InputMaybe<Scalars['String']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']>;
  address_not_ends_with?: InputMaybe<Scalars['String']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  address_starts_with?: InputMaybe<Scalars['String']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  grants?: InputMaybe<Array<Scalars['String']>>;
  grants_contains?: InputMaybe<Array<Scalars['String']>>;
  grants_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  grants_not?: InputMaybe<Array<Scalars['String']>>;
  grants_not_contains?: InputMaybe<Array<Scalars['String']>>;
  grants_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isVisible?: InputMaybe<Scalars['Boolean']>;
  isVisible_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isVisible_not?: InputMaybe<Scalars['Boolean']>;
  isVisible_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
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
  mostRecentGrantPostedAtS?: InputMaybe<Scalars['Int']>;
  mostRecentGrantPostedAtS_gt?: InputMaybe<Scalars['Int']>;
  mostRecentGrantPostedAtS_gte?: InputMaybe<Scalars['Int']>;
  mostRecentGrantPostedAtS_in?: InputMaybe<Array<Scalars['Int']>>;
  mostRecentGrantPostedAtS_lt?: InputMaybe<Scalars['Int']>;
  mostRecentGrantPostedAtS_lte?: InputMaybe<Scalars['Int']>;
  mostRecentGrantPostedAtS_not?: InputMaybe<Scalars['Int']>;
  mostRecentGrantPostedAtS_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplications?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsSelected?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsSelected_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsSelected_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsSelected_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplicationsSelected_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsSelected_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsSelected_not?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsSelected_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplications_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplications_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplications_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not?: InputMaybe<Scalars['Int']>;
  numberOfApplications_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  totalGrantFundingCommittedUSD?: InputMaybe<Scalars['Int']>;
  totalGrantFundingCommittedUSD_gt?: InputMaybe<Scalars['Int']>;
  totalGrantFundingCommittedUSD_gte?: InputMaybe<Scalars['Int']>;
  totalGrantFundingCommittedUSD_in?: InputMaybe<Array<Scalars['Int']>>;
  totalGrantFundingCommittedUSD_lt?: InputMaybe<Scalars['Int']>;
  totalGrantFundingCommittedUSD_lte?: InputMaybe<Scalars['Int']>;
  totalGrantFundingCommittedUSD_not?: InputMaybe<Scalars['Int']>;
  totalGrantFundingCommittedUSD_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalGrantFundingDisbursedUSD?: InputMaybe<Scalars['Int']>;
  totalGrantFundingDisbursedUSD_gt?: InputMaybe<Scalars['Int']>;
  totalGrantFundingDisbursedUSD_gte?: InputMaybe<Scalars['Int']>;
  totalGrantFundingDisbursedUSD_in?: InputMaybe<Array<Scalars['Int']>>;
  totalGrantFundingDisbursedUSD_lt?: InputMaybe<Scalars['Int']>;
  totalGrantFundingDisbursedUSD_lte?: InputMaybe<Scalars['Int']>;
  totalGrantFundingDisbursedUSD_not?: InputMaybe<Scalars['Int']>;
  totalGrantFundingDisbursedUSD_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  Grants = 'grants',
  Id = 'id',
  IsVisible = 'isVisible',
  LogoIpfsHash = 'logoIpfsHash',
  Members = 'members',
  MetadataHash = 'metadataHash',
  MostRecentGrantPostedAtS = 'mostRecentGrantPostedAtS',
  NumberOfApplications = 'numberOfApplications',
  NumberOfApplicationsSelected = 'numberOfApplicationsSelected',
  OwnerId = 'ownerId',
  Partners = 'partners',
  Safe = 'safe',
  Socials = 'socials',
  SupportedNetworks = 'supportedNetworks',
  Title = 'title',
  Tokens = 'tokens',
  TotalGrantFundingCommittedUsd = 'totalGrantFundingCommittedUSD',
  TotalGrantFundingDisbursedUsd = 'totalGrantFundingDisbursedUSD',
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

export type GetProfileDetailsQueryVariables = Exact<{
  actorId: Scalars['Bytes'];
}>;


export type GetProfileDetailsQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, workspace: { __typename?: 'Workspace', supportedNetworks: Array<SupportedNetwork> } }>, grantApplications: Array<{ __typename?: 'GrantApplication', id: string, grant: { __typename?: 'Grant', workspace: { __typename?: 'Workspace', supportedNetworks: Array<SupportedNetwork> } } }> };

export type DoesHaveProposalsQueryVariables = Exact<{
  builderId: Scalars['Bytes'];
}>;


export type DoesHaveProposalsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string }>, workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, accessLevel: WorkspaceMemberAccessLevel }> };

export type GetAllApplicationsOnANetworkQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllApplicationsOnANetworkQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string }> };

export type GetAllFundsTransfersForADaoQueryVariables = Exact<{
  workspaceId: Scalars['String'];
}>;


export type GetAllFundsTransfersForADaoQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', id: string, type: FundsTransferType, amount: string, status: FundsTransferStatusType, transactionHash?: string | null, to: string, application?: { __typename?: 'GrantApplication', id: string } | null, grant: { __typename?: 'Grant', reward: { __typename?: 'Reward', asset: string, token?: { __typename?: 'Token', id: string, decimal: number, address: string, chainId?: string | null } | null } } }> };

export type GetAllGrantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantId: Scalars['Bytes'];
  minDeadline: Scalars['Int'];
}>;


export type GetAllGrantsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, createdAtS: number, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, createdAtS: number }, applications: Array<{ __typename?: 'GrantApplication', applicantId: string }> }> };

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


export type GetApplicantsForAGrantQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, updatedAtS: number, grant: { __typename?: 'Grant', id: string, title: string, funding: string, acceptingApplications: boolean, reward: { __typename?: 'Reward', asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, supportedNetworks: Array<SupportedNetwork> } }, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', id: string, member: { __typename?: 'WorkspaceMember', email?: string | null, fullName?: string | null } }>, reviews: Array<{ __typename?: 'Review', id: string, createdAtS: number, publicReviewDataHash?: string | null, reviewer: { __typename?: 'WorkspaceMember', id: string, fullName?: string | null }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, state: MilestoneState, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDev?: string | null }> }> };

export type GetApplicantsForAGrantReviewerQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  grantID: Scalars['String'];
  reviewerIDs?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type GetApplicantsForAGrantReviewerQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, updatedAtS: number, grant: { __typename?: 'Grant', id: string, title: string, funding: string, acceptingApplications: boolean, reward: { __typename?: 'Reward', asset: string }, workspace: { __typename?: 'Workspace', id: string, supportedNetworks: Array<SupportedNetwork> } }, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', id: string, member: { __typename?: 'WorkspaceMember', email?: string | null } }>, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, createdAtS: number, reviewer: { __typename?: 'WorkspaceMember', id: string }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }> }> };

export type GetApplicationDetailsQueryVariables = Exact<{
  applicationID: Scalars['ID'];
}>;


export type GetApplicationDetailsQuery = { __typename?: 'Query', grantApplication?: { __typename?: 'GrantApplication', id: string, pendingReviewerAddresses: Array<string>, doneReviewerAddresses: Array<string>, applicantId: string, applicantPublicKey?: string | null, state: ApplicationState, feedbackDao?: string | null, feedbackDev?: string | null, createdAtS: number, updatedAtS: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null, state: MilestoneState }>, grant: { __typename?: 'Grant', id: string, title: string, funding: string, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null }> }, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, fields: Array<{ __typename?: 'GrantField', id: string, title: string, isPii: boolean }>, rubric?: { __typename?: 'Rubric', isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null, fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, type: FundsTransferType, asset: string, nonEvmAsset?: string | null, transactionHash?: string | null, status: FundsTransferStatusType, createdAtS: number, milestone?: { __typename?: 'ApplicationMilestone', id: string, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null, state: MilestoneState } | null, application?: { __typename?: 'GrantApplication', applicantId: string, id: string, state: ApplicationState } | null }> }, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, createdAtS: number, reviewer: { __typename?: 'WorkspaceMember', actorId: string, id: string, email?: string | null, fullName?: string | null }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, reviewers: Array<{ __typename?: 'WorkspaceMember', actorId: string, email?: string | null, id: string, fullName?: string | null }> } | null };

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


export type GetDaoDetailsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, bio: string, title: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork>, totalGrantFundingCommittedUSD: number, totalGrantFundingDisbursedUSD: number, numberOfApplications: number, numberOfApplicationsSelected: number, partners: Array<{ __typename?: 'Partner', name: string, industry: string, website?: string | null, partnerImageHash?: string | null }>, socials: Array<{ __typename?: 'Social', name: string, value: string }>, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }> } | null, grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, createdAtS: number, summary: string, details: string, deadline?: string | null, funding: string, numberOfApplications: number, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } }> };

export type GetDaoNameQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
}>;


export type GetDaoNameQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, title: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null } | null };

export type GetDaOsForExploreQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  orderBy: Workspace_OrderBy;
  filter: Workspace_Filter;
}>;


export type GetDaOsForExploreQuery = { __typename?: 'Query', workspaces: Array<{ __typename?: 'Workspace', id: string, title: string, isVisible: boolean, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, createdAtS: number, mostRecentGrantPostedAtS: number, numberOfApplications: number, numberOfApplicationsSelected: number, totalGrantFundingDisbursedUSD: number, safe?: { __typename?: 'WorkspaceSafe', address: string, chainId: string } | null }> };

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


export type GetFundSentForApplicationQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', transactionHash?: string | null, id: string, amount: string, sender: string, to: string, createdAtS: number, type: FundsTransferType, application?: { __typename?: 'GrantApplication', id: string } | null, milestone?: { __typename?: 'ApplicationMilestone', id: string, title: string } | null }> };

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


export type GetGrantDetailsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, deadline?: string | null, funding: string, acceptingApplications: boolean, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, isPii: boolean }>, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, email?: string | null }>, safe?: { __typename?: 'WorkspaceSafe', address: string, chainId: string } | null }, rubric?: { __typename?: 'Rubric', isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null }> };

export type GetGrantManagersWithPublicKeyQueryVariables = Exact<{
  grantID: Scalars['String'];
}>;


export type GetGrantManagersWithPublicKeyQuery = { __typename?: 'Query', grantManagers: Array<{ __typename?: 'GrantManager', member?: { __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null, enabled: boolean } | null }> };

export type GetGrantsAppliedToQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  applicantID: Scalars['Bytes'];
}>;


export type GetGrantsAppliedToQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, grant: { __typename?: 'Grant', id: string } }> };

export type GetInitialReviewedApplicationGrantsQueryVariables = Exact<{
  reviewerAddress: Scalars['Bytes'];
  reviewerAddressStr: Scalars['String'];
  applicationsCount: Scalars['Int'];
  workspaceId: Scalars['String'];
}>;


export type GetInitialReviewedApplicationGrantsQuery = { __typename?: 'Query', grantReviewerCounters: Array<{ __typename?: 'GrantReviewerCounter', grant: { __typename?: 'Grant', id: string, title: string, rubric?: { __typename?: 'Rubric', isPrivate: boolean } | null, workspace: { __typename?: 'Workspace', supportedNetworks: Array<SupportedNetwork> }, reward: { __typename?: 'Reward', asset: string }, applications: Array<{ __typename?: 'GrantApplication', id: string, state: ApplicationState, createdAtS: number, applicantId: string, milestones: Array<{ __typename?: 'ApplicationMilestone', amount: string }>, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, reviewer: { __typename?: 'WorkspaceMember', id: string }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }> }> } }> };

export type GetInitialToBeReviewedApplicationGrantsQueryVariables = Exact<{
  reviewerAddress: Scalars['Bytes'];
  reviewerAddressStr: Scalars['String'];
  applicationsCount: Scalars['Int'];
  workspaceId: Scalars['String'];
}>;


export type GetInitialToBeReviewedApplicationGrantsQuery = { __typename?: 'Query', grantReviewerCounters: Array<{ __typename?: 'GrantReviewerCounter', grant: { __typename?: 'Grant', id: string, title: string, rubric?: { __typename?: 'Rubric', isPrivate: boolean } | null, workspace: { __typename?: 'Workspace', supportedNetworks: Array<SupportedNetwork> }, reward: { __typename?: 'Reward', asset: string }, applications: Array<{ __typename?: 'GrantApplication', id: string, state: ApplicationState, createdAtS: number, applicantId: string, milestones: Array<{ __typename?: 'ApplicationMilestone', amount: string }>, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, reviewer: { __typename?: 'WorkspaceMember', id: string }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }> }> } }> };

export type GetLatestBlockQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLatestBlockQuery = { __typename?: 'Query', _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number } } | null };

export type GetMoreReviewedApplicationsQueryVariables = Exact<{
  grantId: Scalars['String'];
  reviewerAddress: Scalars['Bytes'];
  reviewerAddressStr: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetMoreReviewedApplicationsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, state: ApplicationState, createdAtS: number, applicantId: string, milestones: Array<{ __typename?: 'ApplicationMilestone', amount: string }>, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, reviewer: { __typename?: 'WorkspaceMember', id: string }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }> }> };

export type GetMoreToBeReviewedApplicationsQueryVariables = Exact<{
  grantId: Scalars['String'];
  reviewerAddress: Scalars['Bytes'];
  reviewerAddressStr: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetMoreToBeReviewedApplicationsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, state: ApplicationState, createdAtS: number, applicantId: string, milestones: Array<{ __typename?: 'ApplicationMilestone', amount: string }>, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, reviewer: { __typename?: 'WorkspaceMember', id: string }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }> }> };

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

export type GetQbAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetQbAdminsQuery = { __typename?: 'Query', qbadmins: Array<{ __typename?: 'QBAdmin', walletAddress: string }> };

export type GetRealmsFundTransferDataQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  grantID: Scalars['ID'];
}>;


export type GetRealmsFundTransferDataQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, type: FundsTransferType, asset: string, nonEvmAsset?: string | null, transactionHash?: string | null, application?: { __typename?: 'GrantApplication', applicantId: string, id: string, state: ApplicationState } | null }> }> };

export type GetReviewersForAWorkspaceQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type GetReviewersForAWorkspaceQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', members: Array<{ __typename?: 'WorkspaceMember', profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, fullName?: string | null, actorId: string }> } | null };

export type GetSafeForAWorkspaceQueryVariables = Exact<{
  workspaceID: Scalars['String'];
}>;


export type GetSafeForAWorkspaceQuery = { __typename?: 'Query', workspaceSafes: Array<{ __typename?: 'WorkspaceSafe', address: string, chainId: string, workspace: { __typename?: 'Workspace', id: string } }> };

export type GetWorkspaceDetailsQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
}>;


export type GetWorkspaceDetailsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, title: string, bio: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork>, safe?: { __typename?: 'WorkspaceSafe', address: string, chainId: string } | null, partners: Array<{ __typename?: 'Partner', name: string, industry: string, website?: string | null, partnerImageHash?: string | null }>, socials: Array<{ __typename?: 'Social', name: string, value: string }>, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, email?: string | null, accessLevel: WorkspaceMemberAccessLevel, updatedAt: number, outstandingReviewIds: Array<string>, lastReviewSubmittedAt: number, enabled: boolean, addedBy?: { __typename?: 'WorkspaceMember', id: string, actorId: string } | null }> } | null };

export type GetWorkspaceMemberExistsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetWorkspaceMemberExistsQuery = { __typename?: 'Query', workspaceMember?: { __typename?: 'WorkspaceMember', id: string } | null };

export type GetWorkspaceMembersQueryVariables = Exact<{
  actorId: Scalars['Bytes'];
}>;


export type GetWorkspaceMembersQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, enabled: boolean, workspace: { __typename?: 'Workspace', id: string, ownerId: string, logoIpfsHash: string, title: string, supportedNetworks: Array<SupportedNetwork>, safe?: { __typename?: 'WorkspaceSafe', id: string, chainId: string, address: string } | null, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, fullName?: string | null, email?: string | null, accessLevel: WorkspaceMemberAccessLevel, outstandingReviewIds: Array<string>, lastReviewSubmittedAt: number, profilePictureIpfsHash?: string | null, pii: Array<{ __typename?: 'PIIData', id: string, data: string }> }> } }> };

export type GetWorkspaceMembersByWorkspaceIdQueryVariables = Exact<{
  workspaceId: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetWorkspaceMembersByWorkspaceIdQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, addedAt: number, publicKey?: string | null }> };

export type GetWorkspaceMembersPublicKeysQueryVariables = Exact<{
  workspaceId: Scalars['String'];
}>;


export type GetWorkspaceMembersPublicKeysQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null }> };

export type GetAdminPublicKeysQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type GetAdminPublicKeysQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, publicKey?: string | null }> } | null };

export type GetMemberPublicKeysQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  applicationId: Scalars['ID'];
}>;


export type GetMemberPublicKeysQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', members: Array<{ __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null }> } | null, grantApplication?: { __typename?: 'GrantApplication', applicantId: string, applicantPublicKey?: string | null, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', member: { __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null } }> } | null };

export type GetCommentsQueryVariables = Exact<{
  proposalId: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments: Array<{ __typename?: 'Comment', id: string, isPrivate: boolean, commentsPublicHash?: string | null, commentsEncryptedData?: Array<{ __typename?: 'PIIData', id: string, data: string }> | null, workspace: { __typename?: 'Workspace', members: Array<{ __typename?: 'WorkspaceMember', actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null }> } }> };

export type GetGrantsForAdminQueryVariables = Exact<{
  domainID: Scalars['String'];
}>;


export type GetGrantsForAdminQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, reviewType?: ReviewType | null, payoutType?: PayoutType | null, numberOfReviewersPerApplication?: number | null, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, rubric?: { __typename?: 'Rubric', id: string, isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null }> };

export type GetGrantsForReviewerQueryVariables = Exact<{
  reviewerAddress: Scalars['Bytes'];
  workspaceId: Scalars['String'];
}>;


export type GetGrantsForReviewerQuery = { __typename?: 'Query', grantReviewerCounters: Array<{ __typename?: 'GrantReviewerCounter', id: string, counter: number, pendingCounter: number, doneCounter: number, grant: { __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, reviewType?: ReviewType | null, payoutType?: PayoutType | null, numberOfReviewersPerApplication?: number | null, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, rubric?: { __typename?: 'Rubric', id: string, isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null, pendingApplications: Array<{ __typename?: 'GrantApplication', id: string }>, doneApplications: Array<{ __typename?: 'GrantApplication', id: string }> } }> };

export type GetPayoutsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  proposalID: Scalars['String'];
}>;


export type GetPayoutsQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, asset: string, type: FundsTransferType, createdAtS: number, to: string, transactionHash?: string | null, status: FundsTransferStatusType, executionTimestamp?: number | null, milestone?: { __typename?: 'ApplicationMilestone', id: string } | null, grant: { __typename?: 'Grant', reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', id: string, label: string, address: string, decimal: number, chainId?: string | null, iconHash: string } | null } } }> };

export type GetProposalsForAdminQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  grantID: Scalars['String'];
}>;


export type GetProposalsForAdminQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, state: ApplicationState, createdAtS: number, updatedAtS: number, feedbackDao?: string | null, feedbackDev?: string | null, pendingReviewerAddresses: Array<string>, doneReviewerAddresses: Array<string>, version: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', id: string, value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, state: MilestoneState, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null }>, reviews: Array<{ __typename?: 'Review', id: string, createdAtS: number, publicReviewDataHash?: string | null, reviewer: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }> }>, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', id: string, assignedAtS: number, member: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } }>, grant: { __typename?: 'Grant', id: string, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } } }> };

export type GetProposalsForBuilderQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  builderId: Scalars['Bytes'];
}>;


export type GetProposalsForBuilderQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, state: ApplicationState, createdAtS: number, updatedAtS: number, feedbackDao?: string | null, feedbackDev?: string | null, pendingReviewerAddresses: Array<string>, doneReviewerAddresses: Array<string>, version: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', id: string, value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, state: MilestoneState, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null }>, reviews: Array<{ __typename?: 'Review', id: string, createdAtS: number, publicReviewDataHash?: string | null, reviewer: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }> }>, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', id: string, assignedAtS: number, member: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } }>, grant: { __typename?: 'Grant', id: string, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } } }> };

export type GetProposalsForReviewerQueryVariables = Exact<{
  proposalIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type GetProposalsForReviewerQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, state: ApplicationState, createdAtS: number, updatedAtS: number, feedbackDao?: string | null, feedbackDev?: string | null, pendingReviewerAddresses: Array<string>, doneReviewerAddresses: Array<string>, version: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, field: { __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, possibleValues?: Array<string> | null, isPii: boolean }, values: Array<{ __typename?: 'GrantFieldAnswerItem', id: string, value: string, walletId?: string | null }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, state: MilestoneState, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null }>, reviews: Array<{ __typename?: 'Review', id: string, createdAtS: number, publicReviewDataHash?: string | null, reviewer: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }> }>, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', id: string, assignedAtS: number, member: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } }>, grant: { __typename?: 'Grant', id: string, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } } }> };

export type GetGrantsProgramDetailsQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
}>;


export type GetGrantsProgramDetailsQuery = { __typename?: 'Query', grantsProgram?: { __typename?: 'Workspace', id: string, title: string } | null };

export type GetAllProposalsForAGrantProgramQueryVariables = Exact<{
  workspaceId: Scalars['String'];
}>;


export type GetAllProposalsForAGrantProgramQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', applicantId: string, updatedAtS: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }> }> };

export type GetWorkspaceGrantsProgramDetailsQueryVariables = Exact<{
  workspaceId: Scalars['String'];
}>;


export type GetWorkspaceGrantsProgramDetailsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, startDate?: string | null, startDateS?: number | null, deadline?: string | null, link?: string | null, docIpfsHash?: string | null, metadataHash: string, applications: Array<{ __typename?: 'GrantApplication', id: string, updatedAtS: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', id: string, value: string }> }> }>, fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, status: FundsTransferStatusType }>, workspace: { __typename?: 'Workspace', title: string, metadataHash: string, coverImageIpfsHash?: string | null, about: string, logoIpfsHash: string, totalGrantFundingDisbursedUSD: number, numberOfApplications: number, numberOfApplicationsSelected: number, socials: Array<{ __typename?: 'Social', id: string, name: string, value: string }>, safe?: { __typename?: 'WorkspaceSafe', id: string, address: string, chainId: string } | null } }> };

export type GrantDetailsQueryVariables = Exact<{
  grantId: Scalars['ID'];
}>;


export type GrantDetailsQuery = { __typename?: 'Query', grant?: { __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, startDate?: string | null, deadline?: string | null, startDateS?: number | null, deadlineS: number, payoutType?: PayoutType | null, reviewType?: ReviewType | null, numberOfReviewersPerApplication?: number | null, link?: string | null, docIpfsHash?: string | null, acceptingApplications: boolean, metadataHash: string, funding: string, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', id: string, label: string, address: string, decimal: number, iconHash: string, chainId?: string | null } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, supportedNetworks: Array<SupportedNetwork>, logoIpfsHash: string }, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, possibleValues?: Array<string> | null, isPii: boolean }> } | null };

export type ProposalDetailsQueryVariables = Exact<{
  proposalId: Scalars['ID'];
}>;


export type ProposalDetailsQuery = { __typename?: 'Query', grantApplication?: { __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', id: string, value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string }>, milestones: Array<{ __typename?: 'ApplicationMilestone', title: string, amount: string }>, grant: { __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, startDate?: string | null, deadline?: string | null, startDateS?: number | null, deadlineS: number, payoutType?: PayoutType | null, reviewType?: ReviewType | null, numberOfReviewersPerApplication?: number | null, link?: string | null, docIpfsHash?: string | null, acceptingApplications: boolean, metadataHash: string, funding: string, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', id: string, label: string, address: string, decimal: number, iconHash: string, chainId?: string | null } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, supportedNetworks: Array<SupportedNetwork>, logoIpfsHash: string }, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, possibleValues?: Array<string> | null, isPii: boolean }> } } | null };


export const GetProfileDetailsDocument = gql`
    query GetProfileDetails($actorId: Bytes!) {
  workspaceMembers(
    where: {actorId: $actorId}
    first: 1
    orderBy: updatedAt
    orderDirection: desc
  ) {
    id
    workspace {
      supportedNetworks
    }
  }
  grantApplications(
    where: {applicantId: $actorId}
    first: 1
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    grant {
      workspace {
        supportedNetworks
      }
    }
  }
}
    `;

/**
 * __useGetProfileDetailsQuery__
 *
 * To run a query within a React component, call `useGetProfileDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileDetailsQuery({
 *   variables: {
 *      actorId: // value for 'actorId'
 *   },
 * });
 */
export function useGetProfileDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetProfileDetailsQuery, GetProfileDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileDetailsQuery, GetProfileDetailsQueryVariables>(GetProfileDetailsDocument, options);
      }
export function useGetProfileDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileDetailsQuery, GetProfileDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileDetailsQuery, GetProfileDetailsQueryVariables>(GetProfileDetailsDocument, options);
        }
export type GetProfileDetailsQueryHookResult = ReturnType<typeof useGetProfileDetailsQuery>;
export type GetProfileDetailsLazyQueryHookResult = ReturnType<typeof useGetProfileDetailsLazyQuery>;
export type GetProfileDetailsQueryResult = Apollo.QueryResult<GetProfileDetailsQuery, GetProfileDetailsQueryVariables>;
export function refetchGetProfileDetailsQuery(variables: GetProfileDetailsQueryVariables) {
      return { query: GetProfileDetailsDocument, variables: variables }
    }
export const DoesHaveProposalsDocument = gql`
    query DoesHaveProposals($builderId: Bytes!) {
  grantApplications(where: {applicantId: $builderId}, first: 1) {
    id
  }
  workspaceMembers(where: {actorId: $builderId, enabled: true}) {
    id
    accessLevel
  }
}
    `;

/**
 * __useDoesHaveProposalsQuery__
 *
 * To run a query within a React component, call `useDoesHaveProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDoesHaveProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDoesHaveProposalsQuery({
 *   variables: {
 *      builderId: // value for 'builderId'
 *   },
 * });
 */
export function useDoesHaveProposalsQuery(baseOptions: Apollo.QueryHookOptions<DoesHaveProposalsQuery, DoesHaveProposalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DoesHaveProposalsQuery, DoesHaveProposalsQueryVariables>(DoesHaveProposalsDocument, options);
      }
export function useDoesHaveProposalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DoesHaveProposalsQuery, DoesHaveProposalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DoesHaveProposalsQuery, DoesHaveProposalsQueryVariables>(DoesHaveProposalsDocument, options);
        }
export type DoesHaveProposalsQueryHookResult = ReturnType<typeof useDoesHaveProposalsQuery>;
export type DoesHaveProposalsLazyQueryHookResult = ReturnType<typeof useDoesHaveProposalsLazyQuery>;
export type DoesHaveProposalsQueryResult = Apollo.QueryResult<DoesHaveProposalsQuery, DoesHaveProposalsQueryVariables>;
export function refetchDoesHaveProposalsQuery(variables: DoesHaveProposalsQueryVariables) {
      return { query: DoesHaveProposalsDocument, variables: variables }
    }
export const GetAllApplicationsOnANetworkDocument = gql`
    query getAllApplicationsOnANetwork {
  grantApplications {
    id
  }
}
    `;

/**
 * __useGetAllApplicationsOnANetworkQuery__
 *
 * To run a query within a React component, call `useGetAllApplicationsOnANetworkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllApplicationsOnANetworkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllApplicationsOnANetworkQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllApplicationsOnANetworkQuery(baseOptions?: Apollo.QueryHookOptions<GetAllApplicationsOnANetworkQuery, GetAllApplicationsOnANetworkQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllApplicationsOnANetworkQuery, GetAllApplicationsOnANetworkQueryVariables>(GetAllApplicationsOnANetworkDocument, options);
      }
export function useGetAllApplicationsOnANetworkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllApplicationsOnANetworkQuery, GetAllApplicationsOnANetworkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllApplicationsOnANetworkQuery, GetAllApplicationsOnANetworkQueryVariables>(GetAllApplicationsOnANetworkDocument, options);
        }
export type GetAllApplicationsOnANetworkQueryHookResult = ReturnType<typeof useGetAllApplicationsOnANetworkQuery>;
export type GetAllApplicationsOnANetworkLazyQueryHookResult = ReturnType<typeof useGetAllApplicationsOnANetworkLazyQuery>;
export type GetAllApplicationsOnANetworkQueryResult = Apollo.QueryResult<GetAllApplicationsOnANetworkQuery, GetAllApplicationsOnANetworkQueryVariables>;
export function refetchGetAllApplicationsOnANetworkQuery(variables?: GetAllApplicationsOnANetworkQueryVariables) {
      return { query: GetAllApplicationsOnANetworkDocument, variables: variables }
    }
export const GetAllFundsTransfersForADaoDocument = gql`
    query getAllFundsTransfersForADao($workspaceId: String!) {
  fundsTransfers(where: {grant_: {workspace: $workspaceId}}) {
    id
    type
    amount
    status
    transactionHash
    to
    application {
      id
    }
    grant {
      reward {
        token {
          id
          decimal
          address
          chainId
        }
        asset
      }
    }
  }
}
    `;

/**
 * __useGetAllFundsTransfersForADaoQuery__
 *
 * To run a query within a React component, call `useGetAllFundsTransfersForADaoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllFundsTransfersForADaoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllFundsTransfersForADaoQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllFundsTransfersForADaoQuery(baseOptions: Apollo.QueryHookOptions<GetAllFundsTransfersForADaoQuery, GetAllFundsTransfersForADaoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllFundsTransfersForADaoQuery, GetAllFundsTransfersForADaoQueryVariables>(GetAllFundsTransfersForADaoDocument, options);
      }
export function useGetAllFundsTransfersForADaoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllFundsTransfersForADaoQuery, GetAllFundsTransfersForADaoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllFundsTransfersForADaoQuery, GetAllFundsTransfersForADaoQueryVariables>(GetAllFundsTransfersForADaoDocument, options);
        }
export type GetAllFundsTransfersForADaoQueryHookResult = ReturnType<typeof useGetAllFundsTransfersForADaoQuery>;
export type GetAllFundsTransfersForADaoLazyQueryHookResult = ReturnType<typeof useGetAllFundsTransfersForADaoLazyQuery>;
export type GetAllFundsTransfersForADaoQueryResult = Apollo.QueryResult<GetAllFundsTransfersForADaoQuery, GetAllFundsTransfersForADaoQueryVariables>;
export function refetchGetAllFundsTransfersForADaoQuery(variables: GetAllFundsTransfersForADaoQueryVariables) {
      return { query: GetAllFundsTransfersForADaoDocument, variables: variables }
    }
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
      createdAtS
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
export function refetchGetAllGrantsQuery(variables: GetAllGrantsQueryVariables) {
      return { query: GetAllGrantsDocument, variables: variables }
    }
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
export function refetchGetAllGrantsCountForCreatorQuery(variables?: GetAllGrantsCountForCreatorQueryVariables) {
      return { query: GetAllGrantsCountForCreatorDocument, variables: variables }
    }
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
export function refetchGetAllGrantsForADaoQuery(variables: GetAllGrantsForADaoQueryVariables) {
      return { query: GetAllGrantsForADaoDocument, variables: variables }
    }
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
export function refetchGetAllGrantsForAllDaoQuery(variables: GetAllGrantsForAllDaoQueryVariables) {
      return { query: GetAllGrantsForAllDaoDocument, variables: variables }
    }
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
export function refetchGetAllGrantsForCreatorQuery(variables: GetAllGrantsForCreatorQueryVariables) {
      return { query: GetAllGrantsForCreatorDocument, variables: variables }
    }
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
export function refetchGetAllGrantsForReviewerQuery(variables?: GetAllGrantsForReviewerQueryVariables) {
      return { query: GetAllGrantsForReviewerDocument, variables: variables }
    }
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
export function refetchGetAllWorkspacesQuery(variables?: GetAllWorkspacesQueryVariables) {
      return { query: GetAllWorkspacesDocument, variables: variables }
    }
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
    applicationReviewers {
      id
      member {
        email
        fullName
      }
    }
    reviews {
      id
      createdAtS
      reviewer {
        id
        fullName
      }
      data {
        id
        manager {
          id
        }
        data
      }
      publicReviewDataHash
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
export function refetchGetApplicantsForAGrantQuery(variables: GetApplicantsForAGrantQueryVariables) {
      return { query: GetApplicantsForAGrantDocument, variables: variables }
    }
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
    applicationReviewers {
      id
      member {
        email
      }
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
      createdAtS
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
export function refetchGetApplicantsForAGrantReviewerQuery(variables: GetApplicantsForAGrantReviewerQueryVariables) {
      return { query: GetApplicantsForAGrantReviewerDocument, variables: variables }
    }
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
      data
    }
    milestones {
      id
      title
      amount
      amountPaid
      updatedAtS
      feedbackDao
      feedbackDaoUpdatedAtS
      feedbackDev
      feedbackDevUpdatedAtS
      state
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
      fundTransfers(where: {type: funds_disbursed_from_safe}) {
        milestone {
          id
          title
          amount
          amountPaid
          updatedAtS
          feedbackDao
          feedbackDaoUpdatedAtS
          feedbackDev
          feedbackDevUpdatedAtS
          state
        }
        amount
        type
        asset
        nonEvmAsset
        transactionHash
        status
        application {
          applicantId
          id
          state
        }
        createdAtS
      }
    }
    pendingReviewerAddresses
    doneReviewerAddresses
    reviews {
      reviewer {
        actorId
        id
        email
        fullName
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
      createdAtS
    }
    reviewers {
      actorId
      email
      id
      fullName
    }
    applicantId
    applicantPublicKey
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
export function refetchGetApplicationDetailsQuery(variables: GetApplicationDetailsQueryVariables) {
      return { query: GetApplicationDetailsDocument, variables: variables }
    }
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
export function refetchGetDaoGrantsQuery(variables: GetDaoGrantsQueryVariables) {
      return { query: GetDaoGrantsDocument, variables: variables }
    }
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
export function refetchGetApplicationMilestonesQuery(variables: GetApplicationMilestonesQueryVariables) {
      return { query: GetApplicationMilestonesDocument, variables: variables }
    }
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
    totalGrantFundingCommittedUSD
    totalGrantFundingDisbursedUSD
    numberOfApplications
    numberOfApplicationsSelected
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
export function refetchGetDaoDetailsQuery(variables: GetDaoDetailsQueryVariables) {
      return { query: GetDaoDetailsDocument, variables: variables }
    }
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
export function refetchGetDaoNameQuery(variables: GetDaoNameQueryVariables) {
      return { query: GetDaoNameDocument, variables: variables }
    }
export const GetDaOsForExploreDocument = gql`
    query getDAOsForExplore($first: Int, $skip: Int, $orderBy: Workspace_orderBy!, $filter: Workspace_filter!) {
  workspaces(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: desc
    where: $filter
  ) {
    id
    title
    isVisible
    logoIpfsHash
    safe {
      address
      chainId
    }
    supportedNetworks
    createdAtS
    mostRecentGrantPostedAtS
    numberOfApplications
    numberOfApplicationsSelected
    totalGrantFundingDisbursedUSD
  }
}
    `;

/**
 * __useGetDaOsForExploreQuery__
 *
 * To run a query within a React component, call `useGetDaOsForExploreQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDaOsForExploreQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDaOsForExploreQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      orderBy: // value for 'orderBy'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetDaOsForExploreQuery(baseOptions: Apollo.QueryHookOptions<GetDaOsForExploreQuery, GetDaOsForExploreQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDaOsForExploreQuery, GetDaOsForExploreQueryVariables>(GetDaOsForExploreDocument, options);
      }
export function useGetDaOsForExploreLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDaOsForExploreQuery, GetDaOsForExploreQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDaOsForExploreQuery, GetDaOsForExploreQueryVariables>(GetDaOsForExploreDocument, options);
        }
export type GetDaOsForExploreQueryHookResult = ReturnType<typeof useGetDaOsForExploreQuery>;
export type GetDaOsForExploreLazyQueryHookResult = ReturnType<typeof useGetDaOsForExploreLazyQuery>;
export type GetDaOsForExploreQueryResult = Apollo.QueryResult<GetDaOsForExploreQuery, GetDaOsForExploreQueryVariables>;
export function refetchGetDaOsForExploreQuery(variables: GetDaOsForExploreQueryVariables) {
      return { query: GetDaOsForExploreDocument, variables: variables }
    }
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
export function refetchGetFundSentforReviewerQuery(variables?: GetFundSentforReviewerQueryVariables) {
      return { query: GetFundSentforReviewerDocument, variables: variables }
    }
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
export function refetchGetFundSentforReviewsQuery(variables?: GetFundSentforReviewsQueryVariables) {
      return { query: GetFundSentforReviewsDocument, variables: variables }
    }
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
export function refetchGetFundSentDisburseQuery(variables?: GetFundSentDisburseQueryVariables) {
      return { query: GetFundSentDisburseDocument, variables: variables }
    }
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
export function refetchGetFundSentDisburseforGrantQuery(variables?: GetFundSentDisburseforGrantQueryVariables) {
      return { query: GetFundSentDisburseforGrantDocument, variables: variables }
    }
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
    transactionHash
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
export function refetchGetFundSentForApplicationQuery(variables?: GetFundSentForApplicationQueryVariables) {
      return { query: GetFundSentForApplicationDocument, variables: variables }
    }
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
export function refetchGetFundingQuery(variables?: GetFundingQueryVariables) {
      return { query: GetFundingDocument, variables: variables }
    }
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
export function refetchGetFundsAndProfileDataQuery(variables: GetFundsAndProfileDataQueryVariables) {
      return { query: GetFundsAndProfileDataDocument, variables: variables }
    }
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
export function refetchGetGrantApplicationQuery(variables: GetGrantApplicationQueryVariables) {
      return { query: GetGrantApplicationDocument, variables: variables }
    }
export const GetGrantDetailsDocument = gql`
    query getGrantDetails($grantID: ID!) {
  grants(where: {id: $grantID}, subgraphError: allow) {
    id
    creatorId
    title
    summary
    details
    fields(first: 30) {
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
      members(where: {enabled: true}) {
        id
        actorId
        publicKey
        email
      }
      safe {
        address
        chainId
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
export function refetchGetGrantDetailsQuery(variables: GetGrantDetailsQueryVariables) {
      return { query: GetGrantDetailsDocument, variables: variables }
    }
export const GetGrantManagersWithPublicKeyDocument = gql`
    query getGrantManagersWithPublicKey($grantID: String!) {
  grantManagers(where: {grant: $grantID}) {
    member {
      actorId
      publicKey
      enabled
    }
  }
}
    `;

/**
 * __useGetGrantManagersWithPublicKeyQuery__
 *
 * To run a query within a React component, call `useGetGrantManagersWithPublicKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantManagersWithPublicKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantManagersWithPublicKeyQuery({
 *   variables: {
 *      grantID: // value for 'grantID'
 *   },
 * });
 */
export function useGetGrantManagersWithPublicKeyQuery(baseOptions: Apollo.QueryHookOptions<GetGrantManagersWithPublicKeyQuery, GetGrantManagersWithPublicKeyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantManagersWithPublicKeyQuery, GetGrantManagersWithPublicKeyQueryVariables>(GetGrantManagersWithPublicKeyDocument, options);
      }
export function useGetGrantManagersWithPublicKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantManagersWithPublicKeyQuery, GetGrantManagersWithPublicKeyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantManagersWithPublicKeyQuery, GetGrantManagersWithPublicKeyQueryVariables>(GetGrantManagersWithPublicKeyDocument, options);
        }
export type GetGrantManagersWithPublicKeyQueryHookResult = ReturnType<typeof useGetGrantManagersWithPublicKeyQuery>;
export type GetGrantManagersWithPublicKeyLazyQueryHookResult = ReturnType<typeof useGetGrantManagersWithPublicKeyLazyQuery>;
export type GetGrantManagersWithPublicKeyQueryResult = Apollo.QueryResult<GetGrantManagersWithPublicKeyQuery, GetGrantManagersWithPublicKeyQueryVariables>;
export function refetchGetGrantManagersWithPublicKeyQuery(variables: GetGrantManagersWithPublicKeyQueryVariables) {
      return { query: GetGrantManagersWithPublicKeyDocument, variables: variables }
    }
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
export function refetchGetGrantsAppliedToQuery(variables: GetGrantsAppliedToQueryVariables) {
      return { query: GetGrantsAppliedToDocument, variables: variables }
    }
export const GetInitialReviewedApplicationGrantsDocument = gql`
    query getInitialReviewedApplicationGrants($reviewerAddress: Bytes!, $reviewerAddressStr: String!, $applicationsCount: Int!, $workspaceId: String!) {
  grantReviewerCounters(
    where: {reviewerAddress: $reviewerAddress, grant_: {workspace: $workspaceId}, doneCounter_gt: 0}
  ) {
    grant {
      id
      title
      rubric {
        isPrivate
      }
      workspace {
        supportedNetworks
      }
      reward {
        asset
      }
      applications(
        first: $applicationsCount
        where: {doneReviewerAddresses_contains_nocase: [$reviewerAddress]}
      ) {
        id
        state
        createdAtS
        applicantId
        milestones {
          amount
        }
        reviews(where: {reviewer_contains_nocase: $reviewerAddressStr}) {
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
        fields {
          id
          values {
            value
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetInitialReviewedApplicationGrantsQuery__
 *
 * To run a query within a React component, call `useGetInitialReviewedApplicationGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInitialReviewedApplicationGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInitialReviewedApplicationGrantsQuery({
 *   variables: {
 *      reviewerAddress: // value for 'reviewerAddress'
 *      reviewerAddressStr: // value for 'reviewerAddressStr'
 *      applicationsCount: // value for 'applicationsCount'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetInitialReviewedApplicationGrantsQuery(baseOptions: Apollo.QueryHookOptions<GetInitialReviewedApplicationGrantsQuery, GetInitialReviewedApplicationGrantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInitialReviewedApplicationGrantsQuery, GetInitialReviewedApplicationGrantsQueryVariables>(GetInitialReviewedApplicationGrantsDocument, options);
      }
export function useGetInitialReviewedApplicationGrantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInitialReviewedApplicationGrantsQuery, GetInitialReviewedApplicationGrantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInitialReviewedApplicationGrantsQuery, GetInitialReviewedApplicationGrantsQueryVariables>(GetInitialReviewedApplicationGrantsDocument, options);
        }
export type GetInitialReviewedApplicationGrantsQueryHookResult = ReturnType<typeof useGetInitialReviewedApplicationGrantsQuery>;
export type GetInitialReviewedApplicationGrantsLazyQueryHookResult = ReturnType<typeof useGetInitialReviewedApplicationGrantsLazyQuery>;
export type GetInitialReviewedApplicationGrantsQueryResult = Apollo.QueryResult<GetInitialReviewedApplicationGrantsQuery, GetInitialReviewedApplicationGrantsQueryVariables>;
export function refetchGetInitialReviewedApplicationGrantsQuery(variables: GetInitialReviewedApplicationGrantsQueryVariables) {
      return { query: GetInitialReviewedApplicationGrantsDocument, variables: variables }
    }
export const GetInitialToBeReviewedApplicationGrantsDocument = gql`
    query getInitialToBeReviewedApplicationGrants($reviewerAddress: Bytes!, $reviewerAddressStr: String!, $applicationsCount: Int!, $workspaceId: String!) {
  grantReviewerCounters(
    where: {reviewerAddress: $reviewerAddress, grant_: {workspace: $workspaceId}, pendingCounter_gt: 0}
  ) {
    grant {
      id
      title
      rubric {
        isPrivate
      }
      workspace {
        supportedNetworks
      }
      reward {
        asset
      }
      applications(
        first: $applicationsCount
        where: {state: submitted, pendingReviewerAddresses_contains_nocase: [$reviewerAddress]}
      ) {
        id
        state
        createdAtS
        applicantId
        milestones {
          amount
        }
        reviews(where: {reviewer_contains_nocase: $reviewerAddressStr}) {
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
        fields {
          id
          values {
            value
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetInitialToBeReviewedApplicationGrantsQuery__
 *
 * To run a query within a React component, call `useGetInitialToBeReviewedApplicationGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInitialToBeReviewedApplicationGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInitialToBeReviewedApplicationGrantsQuery({
 *   variables: {
 *      reviewerAddress: // value for 'reviewerAddress'
 *      reviewerAddressStr: // value for 'reviewerAddressStr'
 *      applicationsCount: // value for 'applicationsCount'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetInitialToBeReviewedApplicationGrantsQuery(baseOptions: Apollo.QueryHookOptions<GetInitialToBeReviewedApplicationGrantsQuery, GetInitialToBeReviewedApplicationGrantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInitialToBeReviewedApplicationGrantsQuery, GetInitialToBeReviewedApplicationGrantsQueryVariables>(GetInitialToBeReviewedApplicationGrantsDocument, options);
      }
export function useGetInitialToBeReviewedApplicationGrantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInitialToBeReviewedApplicationGrantsQuery, GetInitialToBeReviewedApplicationGrantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInitialToBeReviewedApplicationGrantsQuery, GetInitialToBeReviewedApplicationGrantsQueryVariables>(GetInitialToBeReviewedApplicationGrantsDocument, options);
        }
export type GetInitialToBeReviewedApplicationGrantsQueryHookResult = ReturnType<typeof useGetInitialToBeReviewedApplicationGrantsQuery>;
export type GetInitialToBeReviewedApplicationGrantsLazyQueryHookResult = ReturnType<typeof useGetInitialToBeReviewedApplicationGrantsLazyQuery>;
export type GetInitialToBeReviewedApplicationGrantsQueryResult = Apollo.QueryResult<GetInitialToBeReviewedApplicationGrantsQuery, GetInitialToBeReviewedApplicationGrantsQueryVariables>;
export function refetchGetInitialToBeReviewedApplicationGrantsQuery(variables: GetInitialToBeReviewedApplicationGrantsQueryVariables) {
      return { query: GetInitialToBeReviewedApplicationGrantsDocument, variables: variables }
    }
export const GetLatestBlockDocument = gql`
    query getLatestBlock {
  _meta {
    block {
      number
    }
  }
}
    `;

/**
 * __useGetLatestBlockQuery__
 *
 * To run a query within a React component, call `useGetLatestBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestBlockQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLatestBlockQuery(baseOptions?: Apollo.QueryHookOptions<GetLatestBlockQuery, GetLatestBlockQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestBlockQuery, GetLatestBlockQueryVariables>(GetLatestBlockDocument, options);
      }
export function useGetLatestBlockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestBlockQuery, GetLatestBlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestBlockQuery, GetLatestBlockQueryVariables>(GetLatestBlockDocument, options);
        }
export type GetLatestBlockQueryHookResult = ReturnType<typeof useGetLatestBlockQuery>;
export type GetLatestBlockLazyQueryHookResult = ReturnType<typeof useGetLatestBlockLazyQuery>;
export type GetLatestBlockQueryResult = Apollo.QueryResult<GetLatestBlockQuery, GetLatestBlockQueryVariables>;
export function refetchGetLatestBlockQuery(variables?: GetLatestBlockQueryVariables) {
      return { query: GetLatestBlockDocument, variables: variables }
    }
export const GetMoreReviewedApplicationsDocument = gql`
    query getMoreReviewedApplications($grantId: String!, $reviewerAddress: Bytes!, $reviewerAddressStr: String!, $first: Int, $skip: Int) {
  grantApplications(
    where: {grant: $grantId, doneReviewerAddresses_contains_nocase: [$reviewerAddress]}
    first: $first
    skip: $skip
  ) {
    id
    state
    createdAtS
    applicantId
    milestones {
      amount
    }
    reviews(where: {reviewer_contains_nocase: $reviewerAddressStr}) {
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
 * __useGetMoreReviewedApplicationsQuery__
 *
 * To run a query within a React component, call `useGetMoreReviewedApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMoreReviewedApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMoreReviewedApplicationsQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *      reviewerAddress: // value for 'reviewerAddress'
 *      reviewerAddressStr: // value for 'reviewerAddressStr'
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetMoreReviewedApplicationsQuery(baseOptions: Apollo.QueryHookOptions<GetMoreReviewedApplicationsQuery, GetMoreReviewedApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMoreReviewedApplicationsQuery, GetMoreReviewedApplicationsQueryVariables>(GetMoreReviewedApplicationsDocument, options);
      }
export function useGetMoreReviewedApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMoreReviewedApplicationsQuery, GetMoreReviewedApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMoreReviewedApplicationsQuery, GetMoreReviewedApplicationsQueryVariables>(GetMoreReviewedApplicationsDocument, options);
        }
export type GetMoreReviewedApplicationsQueryHookResult = ReturnType<typeof useGetMoreReviewedApplicationsQuery>;
export type GetMoreReviewedApplicationsLazyQueryHookResult = ReturnType<typeof useGetMoreReviewedApplicationsLazyQuery>;
export type GetMoreReviewedApplicationsQueryResult = Apollo.QueryResult<GetMoreReviewedApplicationsQuery, GetMoreReviewedApplicationsQueryVariables>;
export function refetchGetMoreReviewedApplicationsQuery(variables: GetMoreReviewedApplicationsQueryVariables) {
      return { query: GetMoreReviewedApplicationsDocument, variables: variables }
    }
export const GetMoreToBeReviewedApplicationsDocument = gql`
    query getMoreToBeReviewedApplications($grantId: String!, $reviewerAddress: Bytes!, $reviewerAddressStr: String!, $first: Int, $skip: Int) {
  grantApplications(
    where: {state: submitted, grant: $grantId, pendingReviewerAddresses_contains_nocase: [$reviewerAddress]}
    first: $first
    skip: $skip
  ) {
    id
    state
    createdAtS
    applicantId
    milestones {
      amount
    }
    reviews(where: {reviewer_contains_nocase: $reviewerAddressStr}) {
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
 * __useGetMoreToBeReviewedApplicationsQuery__
 *
 * To run a query within a React component, call `useGetMoreToBeReviewedApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMoreToBeReviewedApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMoreToBeReviewedApplicationsQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *      reviewerAddress: // value for 'reviewerAddress'
 *      reviewerAddressStr: // value for 'reviewerAddressStr'
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetMoreToBeReviewedApplicationsQuery(baseOptions: Apollo.QueryHookOptions<GetMoreToBeReviewedApplicationsQuery, GetMoreToBeReviewedApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMoreToBeReviewedApplicationsQuery, GetMoreToBeReviewedApplicationsQueryVariables>(GetMoreToBeReviewedApplicationsDocument, options);
      }
export function useGetMoreToBeReviewedApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMoreToBeReviewedApplicationsQuery, GetMoreToBeReviewedApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMoreToBeReviewedApplicationsQuery, GetMoreToBeReviewedApplicationsQueryVariables>(GetMoreToBeReviewedApplicationsDocument, options);
        }
export type GetMoreToBeReviewedApplicationsQueryHookResult = ReturnType<typeof useGetMoreToBeReviewedApplicationsQuery>;
export type GetMoreToBeReviewedApplicationsLazyQueryHookResult = ReturnType<typeof useGetMoreToBeReviewedApplicationsLazyQuery>;
export type GetMoreToBeReviewedApplicationsQueryResult = Apollo.QueryResult<GetMoreToBeReviewedApplicationsQuery, GetMoreToBeReviewedApplicationsQueryVariables>;
export function refetchGetMoreToBeReviewedApplicationsQuery(variables: GetMoreToBeReviewedApplicationsQueryVariables) {
      return { query: GetMoreToBeReviewedApplicationsDocument, variables: variables }
    }
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
export function refetchGetMyApplicationsQuery(variables: GetMyApplicationsQueryVariables) {
      return { query: GetMyApplicationsDocument, variables: variables }
    }
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
export function refetchGetNumberOfApplicationsQuery(variables: GetNumberOfApplicationsQueryVariables) {
      return { query: GetNumberOfApplicationsDocument, variables: variables }
    }
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
export function refetchGetNumberOfGrantsQuery(variables: GetNumberOfGrantsQueryVariables) {
      return { query: GetNumberOfGrantsDocument, variables: variables }
    }
export const GetQbAdminsDocument = gql`
    query getQBAdmins {
  qbadmins {
    walletAddress
  }
}
    `;

/**
 * __useGetQbAdminsQuery__
 *
 * To run a query within a React component, call `useGetQbAdminsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQbAdminsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQbAdminsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetQbAdminsQuery(baseOptions?: Apollo.QueryHookOptions<GetQbAdminsQuery, GetQbAdminsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQbAdminsQuery, GetQbAdminsQueryVariables>(GetQbAdminsDocument, options);
      }
export function useGetQbAdminsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQbAdminsQuery, GetQbAdminsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQbAdminsQuery, GetQbAdminsQueryVariables>(GetQbAdminsDocument, options);
        }
export type GetQbAdminsQueryHookResult = ReturnType<typeof useGetQbAdminsQuery>;
export type GetQbAdminsLazyQueryHookResult = ReturnType<typeof useGetQbAdminsLazyQuery>;
export type GetQbAdminsQueryResult = Apollo.QueryResult<GetQbAdminsQuery, GetQbAdminsQueryVariables>;
export function refetchGetQbAdminsQuery(variables?: GetQbAdminsQueryVariables) {
      return { query: GetQbAdminsDocument, variables: variables }
    }
export const GetRealmsFundTransferDataDocument = gql`
    query getRealmsFundTransferData($first: Int, $skip: Int, $grantID: ID!) {
  grants(where: {id: $grantID}, subgraphError: allow) {
    fundTransfers {
      amount
      type
      asset
      nonEvmAsset
      transactionHash
      application {
        applicantId
        id
        state
      }
    }
  }
}
    `;

/**
 * __useGetRealmsFundTransferDataQuery__
 *
 * To run a query within a React component, call `useGetRealmsFundTransferDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRealmsFundTransferDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRealmsFundTransferDataQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      grantID: // value for 'grantID'
 *   },
 * });
 */
export function useGetRealmsFundTransferDataQuery(baseOptions: Apollo.QueryHookOptions<GetRealmsFundTransferDataQuery, GetRealmsFundTransferDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRealmsFundTransferDataQuery, GetRealmsFundTransferDataQueryVariables>(GetRealmsFundTransferDataDocument, options);
      }
export function useGetRealmsFundTransferDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRealmsFundTransferDataQuery, GetRealmsFundTransferDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRealmsFundTransferDataQuery, GetRealmsFundTransferDataQueryVariables>(GetRealmsFundTransferDataDocument, options);
        }
export type GetRealmsFundTransferDataQueryHookResult = ReturnType<typeof useGetRealmsFundTransferDataQuery>;
export type GetRealmsFundTransferDataLazyQueryHookResult = ReturnType<typeof useGetRealmsFundTransferDataLazyQuery>;
export type GetRealmsFundTransferDataQueryResult = Apollo.QueryResult<GetRealmsFundTransferDataQuery, GetRealmsFundTransferDataQueryVariables>;
export function refetchGetRealmsFundTransferDataQuery(variables: GetRealmsFundTransferDataQueryVariables) {
      return { query: GetRealmsFundTransferDataDocument, variables: variables }
    }
export const GetReviewersForAWorkspaceDocument = gql`
    query getReviewersForAWorkspace($workspaceId: ID!) {
  workspace(id: $workspaceId) {
    members(
      where: {accessLevel: reviewer, enabled: true}
      orderBy: addedAt
      orderDirection: desc
    ) {
      profilePictureIpfsHash
      accessLevel
      fullName
      actorId
    }
  }
}
    `;

/**
 * __useGetReviewersForAWorkspaceQuery__
 *
 * To run a query within a React component, call `useGetReviewersForAWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReviewersForAWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReviewersForAWorkspaceQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetReviewersForAWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<GetReviewersForAWorkspaceQuery, GetReviewersForAWorkspaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReviewersForAWorkspaceQuery, GetReviewersForAWorkspaceQueryVariables>(GetReviewersForAWorkspaceDocument, options);
      }
export function useGetReviewersForAWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReviewersForAWorkspaceQuery, GetReviewersForAWorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReviewersForAWorkspaceQuery, GetReviewersForAWorkspaceQueryVariables>(GetReviewersForAWorkspaceDocument, options);
        }
export type GetReviewersForAWorkspaceQueryHookResult = ReturnType<typeof useGetReviewersForAWorkspaceQuery>;
export type GetReviewersForAWorkspaceLazyQueryHookResult = ReturnType<typeof useGetReviewersForAWorkspaceLazyQuery>;
export type GetReviewersForAWorkspaceQueryResult = Apollo.QueryResult<GetReviewersForAWorkspaceQuery, GetReviewersForAWorkspaceQueryVariables>;
export function refetchGetReviewersForAWorkspaceQuery(variables: GetReviewersForAWorkspaceQueryVariables) {
      return { query: GetReviewersForAWorkspaceDocument, variables: variables }
    }
export const GetSafeForAWorkspaceDocument = gql`
    query getSafeForAWorkspace($workspaceID: String!) {
  workspaceSafes(where: {workspace: $workspaceID}) {
    address
    chainId
    workspace {
      id
    }
  }
}
    `;

/**
 * __useGetSafeForAWorkspaceQuery__
 *
 * To run a query within a React component, call `useGetSafeForAWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSafeForAWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSafeForAWorkspaceQuery({
 *   variables: {
 *      workspaceID: // value for 'workspaceID'
 *   },
 * });
 */
export function useGetSafeForAWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<GetSafeForAWorkspaceQuery, GetSafeForAWorkspaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSafeForAWorkspaceQuery, GetSafeForAWorkspaceQueryVariables>(GetSafeForAWorkspaceDocument, options);
      }
export function useGetSafeForAWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSafeForAWorkspaceQuery, GetSafeForAWorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSafeForAWorkspaceQuery, GetSafeForAWorkspaceQueryVariables>(GetSafeForAWorkspaceDocument, options);
        }
export type GetSafeForAWorkspaceQueryHookResult = ReturnType<typeof useGetSafeForAWorkspaceQuery>;
export type GetSafeForAWorkspaceLazyQueryHookResult = ReturnType<typeof useGetSafeForAWorkspaceLazyQuery>;
export type GetSafeForAWorkspaceQueryResult = Apollo.QueryResult<GetSafeForAWorkspaceQuery, GetSafeForAWorkspaceQueryVariables>;
export function refetchGetSafeForAWorkspaceQuery(variables: GetSafeForAWorkspaceQueryVariables) {
      return { query: GetSafeForAWorkspaceDocument, variables: variables }
    }
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
    safe {
      address
      chainId
    }
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
    members(where: {enabled: true}) {
      id
      actorId
      publicKey
      email
      accessLevel
      updatedAt
      outstandingReviewIds
      lastReviewSubmittedAt
      enabled
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
export function refetchGetWorkspaceDetailsQuery(variables: GetWorkspaceDetailsQueryVariables) {
      return { query: GetWorkspaceDetailsDocument, variables: variables }
    }
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
export function refetchGetWorkspaceMemberExistsQuery(variables: GetWorkspaceMemberExistsQueryVariables) {
      return { query: GetWorkspaceMemberExistsDocument, variables: variables }
    }
export const GetWorkspaceMembersDocument = gql`
    query getWorkspaceMembers($actorId: Bytes!) {
  workspaceMembers(
    where: {actorId: $actorId, enabled: true}
    subgraphError: allow
    orderBy: id
    orderDirection: desc
  ) {
    id
    actorId
    enabled
    workspace {
      id
      ownerId
      logoIpfsHash
      title
      supportedNetworks
      safe {
        id
        chainId
        address
      }
      tokens {
        address
        label
        decimal
        iconHash
      }
      safe {
        address
        chainId
      }
      members(where: {enabled: true}) {
        id
        actorId
        publicKey
        fullName
        email
        accessLevel
        outstandingReviewIds
        lastReviewSubmittedAt
        profilePictureIpfsHash
        pii {
          id
          data
        }
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
export function refetchGetWorkspaceMembersQuery(variables: GetWorkspaceMembersQueryVariables) {
      return { query: GetWorkspaceMembersDocument, variables: variables }
    }
export const GetWorkspaceMembersByWorkspaceIdDocument = gql`
    query getWorkspaceMembersByWorkspaceId($workspaceId: String!, $first: Int, $skip: Int) {
  workspaceMembers(
    where: {workspace: $workspaceId, enabled: true}
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
    publicKey
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
export function refetchGetWorkspaceMembersByWorkspaceIdQuery(variables: GetWorkspaceMembersByWorkspaceIdQueryVariables) {
      return { query: GetWorkspaceMembersByWorkspaceIdDocument, variables: variables }
    }
export const GetWorkspaceMembersPublicKeysDocument = gql`
    query getWorkspaceMembersPublicKeys($workspaceId: String!) {
  workspaceMembers(where: {workspace: $workspaceId, enabled: true}) {
    actorId
    publicKey
  }
}
    `;

/**
 * __useGetWorkspaceMembersPublicKeysQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceMembersPublicKeysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceMembersPublicKeysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceMembersPublicKeysQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetWorkspaceMembersPublicKeysQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceMembersPublicKeysQuery, GetWorkspaceMembersPublicKeysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceMembersPublicKeysQuery, GetWorkspaceMembersPublicKeysQueryVariables>(GetWorkspaceMembersPublicKeysDocument, options);
      }
export function useGetWorkspaceMembersPublicKeysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceMembersPublicKeysQuery, GetWorkspaceMembersPublicKeysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceMembersPublicKeysQuery, GetWorkspaceMembersPublicKeysQueryVariables>(GetWorkspaceMembersPublicKeysDocument, options);
        }
export type GetWorkspaceMembersPublicKeysQueryHookResult = ReturnType<typeof useGetWorkspaceMembersPublicKeysQuery>;
export type GetWorkspaceMembersPublicKeysLazyQueryHookResult = ReturnType<typeof useGetWorkspaceMembersPublicKeysLazyQuery>;
export type GetWorkspaceMembersPublicKeysQueryResult = Apollo.QueryResult<GetWorkspaceMembersPublicKeysQuery, GetWorkspaceMembersPublicKeysQueryVariables>;
export function refetchGetWorkspaceMembersPublicKeysQuery(variables: GetWorkspaceMembersPublicKeysQueryVariables) {
      return { query: GetWorkspaceMembersPublicKeysDocument, variables: variables }
    }
export const GetAdminPublicKeysDocument = gql`
    query getAdminPublicKeys($workspaceId: ID!) {
  workspace(id: $workspaceId) {
    members(where: {accessLevel_not: reviewer, enabled: true}) {
      id
      actorId
      fullName
      publicKey
    }
  }
}
    `;

/**
 * __useGetAdminPublicKeysQuery__
 *
 * To run a query within a React component, call `useGetAdminPublicKeysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminPublicKeysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminPublicKeysQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAdminPublicKeysQuery(baseOptions: Apollo.QueryHookOptions<GetAdminPublicKeysQuery, GetAdminPublicKeysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminPublicKeysQuery, GetAdminPublicKeysQueryVariables>(GetAdminPublicKeysDocument, options);
      }
export function useGetAdminPublicKeysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminPublicKeysQuery, GetAdminPublicKeysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminPublicKeysQuery, GetAdminPublicKeysQueryVariables>(GetAdminPublicKeysDocument, options);
        }
export type GetAdminPublicKeysQueryHookResult = ReturnType<typeof useGetAdminPublicKeysQuery>;
export type GetAdminPublicKeysLazyQueryHookResult = ReturnType<typeof useGetAdminPublicKeysLazyQuery>;
export type GetAdminPublicKeysQueryResult = Apollo.QueryResult<GetAdminPublicKeysQuery, GetAdminPublicKeysQueryVariables>;
export function refetchGetAdminPublicKeysQuery(variables: GetAdminPublicKeysQueryVariables) {
      return { query: GetAdminPublicKeysDocument, variables: variables }
    }
export const GetMemberPublicKeysDocument = gql`
    query getMemberPublicKeys($workspaceId: ID!, $applicationId: ID!) {
  workspace(id: $workspaceId) {
    members(where: {accessLevel_not: reviewer, enabled: true}) {
      actorId
      publicKey
    }
  }
  grantApplication(id: $applicationId) {
    applicantId
    applicantPublicKey
    applicationReviewers(where: {member_: {enabled: true}}) {
      member {
        actorId
        publicKey
      }
    }
  }
}
    `;

/**
 * __useGetMemberPublicKeysQuery__
 *
 * To run a query within a React component, call `useGetMemberPublicKeysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberPublicKeysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberPublicKeysQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useGetMemberPublicKeysQuery(baseOptions: Apollo.QueryHookOptions<GetMemberPublicKeysQuery, GetMemberPublicKeysQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMemberPublicKeysQuery, GetMemberPublicKeysQueryVariables>(GetMemberPublicKeysDocument, options);
      }
export function useGetMemberPublicKeysLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMemberPublicKeysQuery, GetMemberPublicKeysQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMemberPublicKeysQuery, GetMemberPublicKeysQueryVariables>(GetMemberPublicKeysDocument, options);
        }
export type GetMemberPublicKeysQueryHookResult = ReturnType<typeof useGetMemberPublicKeysQuery>;
export type GetMemberPublicKeysLazyQueryHookResult = ReturnType<typeof useGetMemberPublicKeysLazyQuery>;
export type GetMemberPublicKeysQueryResult = Apollo.QueryResult<GetMemberPublicKeysQuery, GetMemberPublicKeysQueryVariables>;
export function refetchGetMemberPublicKeysQuery(variables: GetMemberPublicKeysQueryVariables) {
      return { query: GetMemberPublicKeysDocument, variables: variables }
    }
export const GetCommentsDocument = gql`
    query getComments($proposalId: String!, $first: Int, $skip: Int) {
  comments(
    first: $first
    skip: $skip
    where: {application: $proposalId}
    orderBy: createdAt
    orderDirection: desc
  ) {
    id
    isPrivate
    commentsPublicHash
    commentsEncryptedData {
      id
      data
    }
    workspace {
      members {
        actorId
        fullName
        profilePictureIpfsHash
      }
    }
  }
}
    `;

/**
 * __useGetCommentsQuery__
 *
 * To run a query within a React component, call `useGetCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsQuery({
 *   variables: {
 *      proposalId: // value for 'proposalId'
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetCommentsQuery(baseOptions: Apollo.QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options);
      }
export function useGetCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options);
        }
export type GetCommentsQueryHookResult = ReturnType<typeof useGetCommentsQuery>;
export type GetCommentsLazyQueryHookResult = ReturnType<typeof useGetCommentsLazyQuery>;
export type GetCommentsQueryResult = Apollo.QueryResult<GetCommentsQuery, GetCommentsQueryVariables>;
export function refetchGetCommentsQuery(variables: GetCommentsQueryVariables) {
      return { query: GetCommentsDocument, variables: variables }
    }
export const GetGrantsForAdminDocument = gql`
    query getGrantsForAdmin($domainID: String!) {
  grants(where: {workspace: $domainID}, orderBy: createdAtS, orderDirection: desc) {
    id
    title
    acceptingApplications
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
    rubric {
      id
      isPrivate
      items {
        id
        title
        details
        maximumPoints
      }
    }
    reviewType
    payoutType
    numberOfReviewersPerApplication
  }
}
    `;

/**
 * __useGetGrantsForAdminQuery__
 *
 * To run a query within a React component, call `useGetGrantsForAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantsForAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantsForAdminQuery({
 *   variables: {
 *      domainID: // value for 'domainID'
 *   },
 * });
 */
export function useGetGrantsForAdminQuery(baseOptions: Apollo.QueryHookOptions<GetGrantsForAdminQuery, GetGrantsForAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantsForAdminQuery, GetGrantsForAdminQueryVariables>(GetGrantsForAdminDocument, options);
      }
export function useGetGrantsForAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantsForAdminQuery, GetGrantsForAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantsForAdminQuery, GetGrantsForAdminQueryVariables>(GetGrantsForAdminDocument, options);
        }
export type GetGrantsForAdminQueryHookResult = ReturnType<typeof useGetGrantsForAdminQuery>;
export type GetGrantsForAdminLazyQueryHookResult = ReturnType<typeof useGetGrantsForAdminLazyQuery>;
export type GetGrantsForAdminQueryResult = Apollo.QueryResult<GetGrantsForAdminQuery, GetGrantsForAdminQueryVariables>;
export function refetchGetGrantsForAdminQuery(variables: GetGrantsForAdminQueryVariables) {
      return { query: GetGrantsForAdminDocument, variables: variables }
    }
export const GetGrantsForReviewerDocument = gql`
    query getGrantsForReviewer($reviewerAddress: Bytes!, $workspaceId: String!) {
  grantReviewerCounters(
    where: {reviewerAddress: $reviewerAddress, grant_: {workspace: $workspaceId}}
  ) {
    id
    counter
    pendingCounter
    doneCounter
    grant {
      id
      title
      acceptingApplications
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
      rubric {
        id
        isPrivate
        items {
          id
          title
          details
          maximumPoints
        }
      }
      reviewType
      payoutType
      numberOfReviewersPerApplication
      pendingApplications: applications(
        where: {pendingReviewerAddresses_contains_nocase: [$reviewerAddress]}
      ) {
        id
      }
      doneApplications: applications(
        where: {doneReviewerAddresses_contains_nocase: [$reviewerAddress]}
      ) {
        id
      }
    }
  }
}
    `;

/**
 * __useGetGrantsForReviewerQuery__
 *
 * To run a query within a React component, call `useGetGrantsForReviewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantsForReviewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantsForReviewerQuery({
 *   variables: {
 *      reviewerAddress: // value for 'reviewerAddress'
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetGrantsForReviewerQuery(baseOptions: Apollo.QueryHookOptions<GetGrantsForReviewerQuery, GetGrantsForReviewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantsForReviewerQuery, GetGrantsForReviewerQueryVariables>(GetGrantsForReviewerDocument, options);
      }
export function useGetGrantsForReviewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantsForReviewerQuery, GetGrantsForReviewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantsForReviewerQuery, GetGrantsForReviewerQueryVariables>(GetGrantsForReviewerDocument, options);
        }
export type GetGrantsForReviewerQueryHookResult = ReturnType<typeof useGetGrantsForReviewerQuery>;
export type GetGrantsForReviewerLazyQueryHookResult = ReturnType<typeof useGetGrantsForReviewerLazyQuery>;
export type GetGrantsForReviewerQueryResult = Apollo.QueryResult<GetGrantsForReviewerQuery, GetGrantsForReviewerQueryVariables>;
export function refetchGetGrantsForReviewerQuery(variables: GetGrantsForReviewerQueryVariables) {
      return { query: GetGrantsForReviewerDocument, variables: variables }
    }
export const GetPayoutsDocument = gql`
    query getPayouts($first: Int, $skip: Int, $proposalID: String!) {
  fundsTransfers(
    first: $first
    skip: $skip
    where: {application: $proposalID, type_in: [funds_disbursed, funds_disbursed_from_safe]}
  ) {
    amount
    asset
    type
    createdAtS
    to
    transactionHash
    status
    executionTimestamp
    milestone {
      id
    }
    grant {
      reward {
        id
        asset
        committed
        token {
          id
          label
          address
          decimal
          chainId
          iconHash
        }
      }
    }
  }
}
    `;

/**
 * __useGetPayoutsQuery__
 *
 * To run a query within a React component, call `useGetPayoutsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPayoutsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPayoutsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      proposalID: // value for 'proposalID'
 *   },
 * });
 */
export function useGetPayoutsQuery(baseOptions: Apollo.QueryHookOptions<GetPayoutsQuery, GetPayoutsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPayoutsQuery, GetPayoutsQueryVariables>(GetPayoutsDocument, options);
      }
export function useGetPayoutsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPayoutsQuery, GetPayoutsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPayoutsQuery, GetPayoutsQueryVariables>(GetPayoutsDocument, options);
        }
export type GetPayoutsQueryHookResult = ReturnType<typeof useGetPayoutsQuery>;
export type GetPayoutsLazyQueryHookResult = ReturnType<typeof useGetPayoutsLazyQuery>;
export type GetPayoutsQueryResult = Apollo.QueryResult<GetPayoutsQuery, GetPayoutsQueryVariables>;
export function refetchGetPayoutsQuery(variables: GetPayoutsQueryVariables) {
      return { query: GetPayoutsDocument, variables: variables }
    }
export const GetProposalsForAdminDocument = gql`
    query getProposalsForAdmin($first: Int, $skip: Int, $grantID: String!) {
  grantApplications(
    where: {grant: $grantID}
    first: $first
    skip: $skip
    orderBy: updatedAtS
    orderDirection: desc
  ) {
    id
    applicantId
    applicantPublicKey
    state
    fields {
      id
      values {
        id
        value
      }
    }
    pii {
      id
      manager {
        id
        member {
          id
          actorId
          fullName
          profilePictureIpfsHash
          accessLevel
          publicKey
          addedAt
          updatedAt
          enabled
        }
      }
      data
    }
    createdAtS
    updatedAtS
    milestones {
      id
      title
      state
      amount
      amountPaid
      updatedAtS
      feedbackDao
      feedbackDaoUpdatedAtS
      feedbackDev
      feedbackDevUpdatedAtS
    }
    feedbackDao
    feedbackDev
    reviews {
      id
      reviewer {
        id
        actorId
        fullName
        profilePictureIpfsHash
        accessLevel
        publicKey
        addedAt
        updatedAt
        enabled
      }
      createdAtS
      publicReviewDataHash
      data {
        id
        manager {
          id
          member {
            id
            actorId
            fullName
            profilePictureIpfsHash
            accessLevel
            publicKey
            addedAt
            updatedAt
            enabled
          }
        }
        data
      }
    }
    pendingReviewerAddresses
    doneReviewerAddresses
    applicationReviewers {
      id
      member {
        id
        actorId
        fullName
        profilePictureIpfsHash
        accessLevel
        publicKey
        addedAt
        updatedAt
        enabled
      }
      assignedAtS
    }
    version
    grant {
      id
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
    }
  }
}
    `;

/**
 * __useGetProposalsForAdminQuery__
 *
 * To run a query within a React component, call `useGetProposalsForAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsForAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsForAdminQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      grantID: // value for 'grantID'
 *   },
 * });
 */
export function useGetProposalsForAdminQuery(baseOptions: Apollo.QueryHookOptions<GetProposalsForAdminQuery, GetProposalsForAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProposalsForAdminQuery, GetProposalsForAdminQueryVariables>(GetProposalsForAdminDocument, options);
      }
export function useGetProposalsForAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalsForAdminQuery, GetProposalsForAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProposalsForAdminQuery, GetProposalsForAdminQueryVariables>(GetProposalsForAdminDocument, options);
        }
export type GetProposalsForAdminQueryHookResult = ReturnType<typeof useGetProposalsForAdminQuery>;
export type GetProposalsForAdminLazyQueryHookResult = ReturnType<typeof useGetProposalsForAdminLazyQuery>;
export type GetProposalsForAdminQueryResult = Apollo.QueryResult<GetProposalsForAdminQuery, GetProposalsForAdminQueryVariables>;
export function refetchGetProposalsForAdminQuery(variables: GetProposalsForAdminQueryVariables) {
      return { query: GetProposalsForAdminDocument, variables: variables }
    }
export const GetProposalsForBuilderDocument = gql`
    query getProposalsForBuilder($first: Int, $skip: Int, $builderId: Bytes!) {
  grantApplications(
    where: {applicantId: $builderId}
    first: $first
    skip: $skip
    orderBy: updatedAtS
    orderDirection: desc
  ) {
    id
    applicantId
    applicantPublicKey
    state
    fields {
      id
      values {
        id
        value
      }
    }
    pii {
      id
      manager {
        id
        member {
          id
          actorId
          fullName
          profilePictureIpfsHash
          accessLevel
          publicKey
          addedAt
          updatedAt
          enabled
        }
      }
      data
    }
    createdAtS
    updatedAtS
    milestones {
      id
      title
      state
      amount
      amountPaid
      updatedAtS
      feedbackDao
      feedbackDaoUpdatedAtS
      feedbackDev
      feedbackDevUpdatedAtS
    }
    feedbackDao
    feedbackDev
    reviews {
      id
      reviewer {
        id
        actorId
        fullName
        profilePictureIpfsHash
        accessLevel
        publicKey
        addedAt
        updatedAt
        enabled
      }
      createdAtS
      publicReviewDataHash
      data {
        id
        manager {
          id
          member {
            id
            actorId
            fullName
            profilePictureIpfsHash
            accessLevel
            publicKey
            addedAt
            updatedAt
            enabled
          }
        }
        data
      }
    }
    pendingReviewerAddresses
    doneReviewerAddresses
    applicationReviewers {
      id
      member {
        id
        actorId
        fullName
        profilePictureIpfsHash
        accessLevel
        publicKey
        addedAt
        updatedAt
        enabled
      }
      assignedAtS
    }
    version
    grant {
      id
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
    }
  }
}
    `;

/**
 * __useGetProposalsForBuilderQuery__
 *
 * To run a query within a React component, call `useGetProposalsForBuilderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsForBuilderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsForBuilderQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      builderId: // value for 'builderId'
 *   },
 * });
 */
export function useGetProposalsForBuilderQuery(baseOptions: Apollo.QueryHookOptions<GetProposalsForBuilderQuery, GetProposalsForBuilderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProposalsForBuilderQuery, GetProposalsForBuilderQueryVariables>(GetProposalsForBuilderDocument, options);
      }
export function useGetProposalsForBuilderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalsForBuilderQuery, GetProposalsForBuilderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProposalsForBuilderQuery, GetProposalsForBuilderQueryVariables>(GetProposalsForBuilderDocument, options);
        }
export type GetProposalsForBuilderQueryHookResult = ReturnType<typeof useGetProposalsForBuilderQuery>;
export type GetProposalsForBuilderLazyQueryHookResult = ReturnType<typeof useGetProposalsForBuilderLazyQuery>;
export type GetProposalsForBuilderQueryResult = Apollo.QueryResult<GetProposalsForBuilderQuery, GetProposalsForBuilderQueryVariables>;
export function refetchGetProposalsForBuilderQuery(variables: GetProposalsForBuilderQueryVariables) {
      return { query: GetProposalsForBuilderDocument, variables: variables }
    }
export const GetProposalsForReviewerDocument = gql`
    query getProposalsForReviewer($proposalIds: [ID!]) {
  grantApplications(
    where: {id_in: $proposalIds}
    orderBy: updatedAtS
    orderDirection: desc
  ) {
    id
    applicantId
    applicantPublicKey
    state
    fields {
      id
      field {
        id
        title
        inputType
        possibleValues
        isPii
      }
      values {
        id
        value
        walletId
      }
    }
    pii {
      id
      manager {
        id
        member {
          id
          actorId
          fullName
          profilePictureIpfsHash
          accessLevel
          publicKey
          addedAt
          updatedAt
          enabled
        }
      }
      data
    }
    createdAtS
    updatedAtS
    milestones {
      id
      title
      state
      amount
      amountPaid
      updatedAtS
      feedbackDao
      feedbackDaoUpdatedAtS
      feedbackDev
      feedbackDevUpdatedAtS
    }
    feedbackDao
    feedbackDev
    reviews {
      id
      reviewer {
        id
        actorId
        fullName
        profilePictureIpfsHash
        accessLevel
        publicKey
        addedAt
        updatedAt
        enabled
      }
      createdAtS
      publicReviewDataHash
      data {
        id
        manager {
          id
          member {
            id
            actorId
            fullName
            profilePictureIpfsHash
            accessLevel
            publicKey
            addedAt
            updatedAt
            enabled
          }
        }
        data
      }
    }
    pendingReviewerAddresses
    doneReviewerAddresses
    applicationReviewers {
      id
      member {
        id
        actorId
        fullName
        profilePictureIpfsHash
        accessLevel
        publicKey
        addedAt
        updatedAt
        enabled
      }
      assignedAtS
    }
    version
    grant {
      id
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
    }
  }
}
    `;

/**
 * __useGetProposalsForReviewerQuery__
 *
 * To run a query within a React component, call `useGetProposalsForReviewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsForReviewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsForReviewerQuery({
 *   variables: {
 *      proposalIds: // value for 'proposalIds'
 *   },
 * });
 */
export function useGetProposalsForReviewerQuery(baseOptions?: Apollo.QueryHookOptions<GetProposalsForReviewerQuery, GetProposalsForReviewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProposalsForReviewerQuery, GetProposalsForReviewerQueryVariables>(GetProposalsForReviewerDocument, options);
      }
export function useGetProposalsForReviewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalsForReviewerQuery, GetProposalsForReviewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProposalsForReviewerQuery, GetProposalsForReviewerQueryVariables>(GetProposalsForReviewerDocument, options);
        }
export type GetProposalsForReviewerQueryHookResult = ReturnType<typeof useGetProposalsForReviewerQuery>;
export type GetProposalsForReviewerLazyQueryHookResult = ReturnType<typeof useGetProposalsForReviewerLazyQuery>;
export type GetProposalsForReviewerQueryResult = Apollo.QueryResult<GetProposalsForReviewerQuery, GetProposalsForReviewerQueryVariables>;
export function refetchGetProposalsForReviewerQuery(variables?: GetProposalsForReviewerQueryVariables) {
      return { query: GetProposalsForReviewerDocument, variables: variables }
    }
export const GetGrantsProgramDetailsDocument = gql`
    query getGrantsProgramDetails($workspaceID: ID!) {
  grantsProgram: workspace(id: $workspaceID, subgraphError: allow) {
    id
    title
  }
}
    `;

/**
 * __useGetGrantsProgramDetailsQuery__
 *
 * To run a query within a React component, call `useGetGrantsProgramDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantsProgramDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantsProgramDetailsQuery({
 *   variables: {
 *      workspaceID: // value for 'workspaceID'
 *   },
 * });
 */
export function useGetGrantsProgramDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetGrantsProgramDetailsQuery, GetGrantsProgramDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantsProgramDetailsQuery, GetGrantsProgramDetailsQueryVariables>(GetGrantsProgramDetailsDocument, options);
      }
export function useGetGrantsProgramDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantsProgramDetailsQuery, GetGrantsProgramDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantsProgramDetailsQuery, GetGrantsProgramDetailsQueryVariables>(GetGrantsProgramDetailsDocument, options);
        }
export type GetGrantsProgramDetailsQueryHookResult = ReturnType<typeof useGetGrantsProgramDetailsQuery>;
export type GetGrantsProgramDetailsLazyQueryHookResult = ReturnType<typeof useGetGrantsProgramDetailsLazyQuery>;
export type GetGrantsProgramDetailsQueryResult = Apollo.QueryResult<GetGrantsProgramDetailsQuery, GetGrantsProgramDetailsQueryVariables>;
export function refetchGetGrantsProgramDetailsQuery(variables: GetGrantsProgramDetailsQueryVariables) {
      return { query: GetGrantsProgramDetailsDocument, variables: variables }
    }
export const GetAllProposalsForAGrantProgramDocument = gql`
    query getAllProposalsForAGrantProgram($workspaceId: String!) {
  grantApplications(
    where: {grant_: {workspace: $workspaceId}}
    orderBy: updatedAtS
    orderDirection: desc
  ) {
    applicantId
    updatedAtS
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
 * __useGetAllProposalsForAGrantProgramQuery__
 *
 * To run a query within a React component, call `useGetAllProposalsForAGrantProgramQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllProposalsForAGrantProgramQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllProposalsForAGrantProgramQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllProposalsForAGrantProgramQuery(baseOptions: Apollo.QueryHookOptions<GetAllProposalsForAGrantProgramQuery, GetAllProposalsForAGrantProgramQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllProposalsForAGrantProgramQuery, GetAllProposalsForAGrantProgramQueryVariables>(GetAllProposalsForAGrantProgramDocument, options);
      }
export function useGetAllProposalsForAGrantProgramLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllProposalsForAGrantProgramQuery, GetAllProposalsForAGrantProgramQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllProposalsForAGrantProgramQuery, GetAllProposalsForAGrantProgramQueryVariables>(GetAllProposalsForAGrantProgramDocument, options);
        }
export type GetAllProposalsForAGrantProgramQueryHookResult = ReturnType<typeof useGetAllProposalsForAGrantProgramQuery>;
export type GetAllProposalsForAGrantProgramLazyQueryHookResult = ReturnType<typeof useGetAllProposalsForAGrantProgramLazyQuery>;
export type GetAllProposalsForAGrantProgramQueryResult = Apollo.QueryResult<GetAllProposalsForAGrantProgramQuery, GetAllProposalsForAGrantProgramQueryVariables>;
export function refetchGetAllProposalsForAGrantProgramQuery(variables: GetAllProposalsForAGrantProgramQueryVariables) {
      return { query: GetAllProposalsForAGrantProgramDocument, variables: variables }
    }
export const GetWorkspaceGrantsProgramDetailsDocument = gql`
    query getWorkspaceGrantsProgramDetails($workspaceId: String!) {
  grants(
    orderBy: createdAtS
    orderDirection: desc
    where: {workspace: $workspaceId}
  ) {
    id
    applications {
      id
      updatedAtS
      fields {
        id
        values {
          id
          value
        }
      }
    }
    fundTransfers {
      amount
      status
    }
    title
    acceptingApplications
    startDate
    startDateS
    deadline
    link
    docIpfsHash
    metadataHash
    workspace {
      title
      metadataHash
      coverImageIpfsHash
      about
      logoIpfsHash
      totalGrantFundingDisbursedUSD
      numberOfApplications
      numberOfApplicationsSelected
      socials {
        id
        name
        value
      }
      safe {
        id
        address
        chainId
      }
    }
  }
}
    `;

/**
 * __useGetWorkspaceGrantsProgramDetailsQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceGrantsProgramDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceGrantsProgramDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceGrantsProgramDetailsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetWorkspaceGrantsProgramDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspaceGrantsProgramDetailsQuery, GetWorkspaceGrantsProgramDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspaceGrantsProgramDetailsQuery, GetWorkspaceGrantsProgramDetailsQueryVariables>(GetWorkspaceGrantsProgramDetailsDocument, options);
      }
export function useGetWorkspaceGrantsProgramDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspaceGrantsProgramDetailsQuery, GetWorkspaceGrantsProgramDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspaceGrantsProgramDetailsQuery, GetWorkspaceGrantsProgramDetailsQueryVariables>(GetWorkspaceGrantsProgramDetailsDocument, options);
        }
export type GetWorkspaceGrantsProgramDetailsQueryHookResult = ReturnType<typeof useGetWorkspaceGrantsProgramDetailsQuery>;
export type GetWorkspaceGrantsProgramDetailsLazyQueryHookResult = ReturnType<typeof useGetWorkspaceGrantsProgramDetailsLazyQuery>;
export type GetWorkspaceGrantsProgramDetailsQueryResult = Apollo.QueryResult<GetWorkspaceGrantsProgramDetailsQuery, GetWorkspaceGrantsProgramDetailsQueryVariables>;
export function refetchGetWorkspaceGrantsProgramDetailsQuery(variables: GetWorkspaceGrantsProgramDetailsQueryVariables) {
      return { query: GetWorkspaceGrantsProgramDetailsDocument, variables: variables }
    }
export const GrantDetailsDocument = gql`
    query grantDetails($grantId: ID!) {
  grant(id: $grantId) {
    id
    creatorId
    title
    summary
    details
    reward {
      id
      asset
      committed
      token {
        id
        label
        address
        decimal
        iconHash
        chainId
      }
    }
    startDate
    deadline
    startDateS
    deadlineS
    payoutType
    reviewType
    numberOfReviewersPerApplication
    link
    docIpfsHash
    acceptingApplications
    metadataHash
    funding
    workspace {
      id
      title
      supportedNetworks
      logoIpfsHash
    }
    fields {
      id
      title
      inputType
      possibleValues
      isPii
    }
  }
}
    `;

/**
 * __useGrantDetailsQuery__
 *
 * To run a query within a React component, call `useGrantDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGrantDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGrantDetailsQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *   },
 * });
 */
export function useGrantDetailsQuery(baseOptions: Apollo.QueryHookOptions<GrantDetailsQuery, GrantDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GrantDetailsQuery, GrantDetailsQueryVariables>(GrantDetailsDocument, options);
      }
export function useGrantDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GrantDetailsQuery, GrantDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GrantDetailsQuery, GrantDetailsQueryVariables>(GrantDetailsDocument, options);
        }
export type GrantDetailsQueryHookResult = ReturnType<typeof useGrantDetailsQuery>;
export type GrantDetailsLazyQueryHookResult = ReturnType<typeof useGrantDetailsLazyQuery>;
export type GrantDetailsQueryResult = Apollo.QueryResult<GrantDetailsQuery, GrantDetailsQueryVariables>;
export function refetchGrantDetailsQuery(variables: GrantDetailsQueryVariables) {
      return { query: GrantDetailsDocument, variables: variables }
    }
export const ProposalDetailsDocument = gql`
    query proposalDetails($proposalId: ID!) {
  grantApplication(id: $proposalId) {
    id
    applicantId
    applicantPublicKey
    fields {
      id
      values {
        id
        value
      }
    }
    pii {
      id
      data
    }
    milestones {
      title
      amount
    }
    grant {
      id
      creatorId
      title
      summary
      details
      reward {
        id
        asset
        committed
        token {
          id
          label
          address
          decimal
          iconHash
          chainId
        }
      }
      startDate
      deadline
      startDateS
      deadlineS
      payoutType
      reviewType
      numberOfReviewersPerApplication
      link
      docIpfsHash
      acceptingApplications
      metadataHash
      funding
      workspace {
        id
        title
        supportedNetworks
        logoIpfsHash
      }
      fields {
        id
        title
        inputType
        possibleValues
        isPii
      }
    }
  }
}
    `;

/**
 * __useProposalDetailsQuery__
 *
 * To run a query within a React component, call `useProposalDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProposalDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProposalDetailsQuery({
 *   variables: {
 *      proposalId: // value for 'proposalId'
 *   },
 * });
 */
export function useProposalDetailsQuery(baseOptions: Apollo.QueryHookOptions<ProposalDetailsQuery, ProposalDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProposalDetailsQuery, ProposalDetailsQueryVariables>(ProposalDetailsDocument, options);
      }
export function useProposalDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProposalDetailsQuery, ProposalDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProposalDetailsQuery, ProposalDetailsQueryVariables>(ProposalDetailsDocument, options);
        }
export type ProposalDetailsQueryHookResult = ReturnType<typeof useProposalDetailsQuery>;
export type ProposalDetailsLazyQueryHookResult = ReturnType<typeof useProposalDetailsLazyQuery>;
export type ProposalDetailsQueryResult = Apollo.QueryResult<ProposalDetailsQuery, ProposalDetailsQueryVariables>;
export function refetchProposalDetailsQuery(variables: ProposalDetailsQueryVariables) {
      return { query: ProposalDetailsDocument, variables: variables }
    }