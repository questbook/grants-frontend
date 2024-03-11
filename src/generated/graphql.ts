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

export type ApplicationAction = {
  __typename?: 'ApplicationAction';
  application: GrantApplication;
  feedback?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  state: ApplicationState;
  updatedAtS: Scalars['Int'];
  updatedBy: Scalars['Bytes'];
};

export type ApplicationAction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ApplicationAction_Filter>>>;
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
  feedback?: InputMaybe<Scalars['String']>;
  feedback_contains?: InputMaybe<Scalars['String']>;
  feedback_contains_nocase?: InputMaybe<Scalars['String']>;
  feedback_ends_with?: InputMaybe<Scalars['String']>;
  feedback_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedback_gt?: InputMaybe<Scalars['String']>;
  feedback_gte?: InputMaybe<Scalars['String']>;
  feedback_in?: InputMaybe<Array<Scalars['String']>>;
  feedback_lt?: InputMaybe<Scalars['String']>;
  feedback_lte?: InputMaybe<Scalars['String']>;
  feedback_not?: InputMaybe<Scalars['String']>;
  feedback_not_contains?: InputMaybe<Scalars['String']>;
  feedback_not_contains_nocase?: InputMaybe<Scalars['String']>;
  feedback_not_ends_with?: InputMaybe<Scalars['String']>;
  feedback_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  feedback_not_in?: InputMaybe<Array<Scalars['String']>>;
  feedback_not_starts_with?: InputMaybe<Scalars['String']>;
  feedback_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feedback_starts_with?: InputMaybe<Scalars['String']>;
  feedback_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<ApplicationAction_Filter>>>;
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
  updatedBy?: InputMaybe<Scalars['Bytes']>;
  updatedBy_contains?: InputMaybe<Scalars['Bytes']>;
  updatedBy_gt?: InputMaybe<Scalars['Bytes']>;
  updatedBy_gte?: InputMaybe<Scalars['Bytes']>;
  updatedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  updatedBy_lt?: InputMaybe<Scalars['Bytes']>;
  updatedBy_lte?: InputMaybe<Scalars['Bytes']>;
  updatedBy_not?: InputMaybe<Scalars['Bytes']>;
  updatedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  updatedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum ApplicationAction_OrderBy {
  Application = 'application',
  ApplicationApplicantId = 'application__applicantId',
  ApplicationApplicantPublicKey = 'application__applicantPublicKey',
  ApplicationCreatedAtS = 'application__createdAtS',
  ApplicationFeedbackDao = 'application__feedbackDao',
  ApplicationFeedbackDev = 'application__feedbackDev',
  ApplicationId = 'application__id',
  ApplicationState = 'application__state',
  ApplicationUpdatedAtS = 'application__updatedAtS',
  ApplicationVersion = 'application__version',
  ApplicationWalletAddress = 'application__walletAddress',
  Feedback = 'feedback',
  Id = 'id',
  State = 'state',
  UpdatedAtS = 'updatedAtS',
  UpdatedBy = 'updatedBy'
}

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
  and?: InputMaybe<Array<InputMaybe<ApplicationMilestone_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<ApplicationMilestone_Filter>>>;
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
  ApplicationApplicantId = 'application__applicantId',
  ApplicationApplicantPublicKey = 'application__applicantPublicKey',
  ApplicationCreatedAtS = 'application__createdAtS',
  ApplicationFeedbackDao = 'application__feedbackDao',
  ApplicationFeedbackDev = 'application__feedbackDev',
  ApplicationId = 'application__id',
  ApplicationState = 'application__state',
  ApplicationUpdatedAtS = 'application__updatedAtS',
  ApplicationVersion = 'application__version',
  ApplicationWalletAddress = 'application__walletAddress',
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
  Submitted = 'submitted',
  Review = 'review'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Claim = {
  __typename?: 'Claim';
  id: Scalars['ID'];
  link: Scalars['String'];
  title: Scalars['String'];
};

export type Claim_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Claim_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Claim_Filter>>>;
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

export enum Claim_OrderBy {
  Id = 'id',
  Link = 'link',
  Title = 'title'
}

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
  /** Denotes who added the comment */
  createdBy: Scalars['Bytes'];
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
  and?: InputMaybe<Array<InputMaybe<Comment_Filter>>>;
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
  createdBy?: InputMaybe<Scalars['Bytes']>;
  createdBy_contains?: InputMaybe<Scalars['Bytes']>;
  createdBy_gt?: InputMaybe<Scalars['Bytes']>;
  createdBy_gte?: InputMaybe<Scalars['Bytes']>;
  createdBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  createdBy_lt?: InputMaybe<Scalars['Bytes']>;
  createdBy_lte?: InputMaybe<Scalars['Bytes']>;
  createdBy_not?: InputMaybe<Scalars['Bytes']>;
  createdBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  createdBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  or?: InputMaybe<Array<InputMaybe<Comment_Filter>>>;
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
  ApplicationApplicantId = 'application__applicantId',
  ApplicationApplicantPublicKey = 'application__applicantPublicKey',
  ApplicationCreatedAtS = 'application__createdAtS',
  ApplicationFeedbackDao = 'application__feedbackDao',
  ApplicationFeedbackDev = 'application__feedbackDev',
  ApplicationId = 'application__id',
  ApplicationState = 'application__state',
  ApplicationUpdatedAtS = 'application__updatedAtS',
  ApplicationVersion = 'application__version',
  ApplicationWalletAddress = 'application__walletAddress',
  CommentsEncryptedData = 'commentsEncryptedData',
  CommentsPublicHash = 'commentsPublicHash',
  CreatedAt = 'createdAt',
  CreatedBy = 'createdBy',
  Grant = 'grant',
  GrantAcceptingApplications = 'grant__acceptingApplications',
  GrantCreatedAtS = 'grant__createdAtS',
  GrantCreatorId = 'grant__creatorId',
  GrantDeadline = 'grant__deadline',
  GrantDeadlineS = 'grant__deadlineS',
  GrantDetails = 'grant__details',
  GrantDocIpfsHash = 'grant__docIpfsHash',
  GrantFunding = 'grant__funding',
  GrantId = 'grant__id',
  GrantLink = 'grant__link',
  GrantMetadataHash = 'grant__metadataHash',
  GrantNumberOfApplications = 'grant__numberOfApplications',
  GrantNumberOfApplicationsAwaitingResubmission = 'grant__numberOfApplicationsAwaitingResubmission',
  GrantNumberOfApplicationsPending = 'grant__numberOfApplicationsPending',
  GrantNumberOfApplicationsRejected = 'grant__numberOfApplicationsRejected',
  GrantNumberOfApplicationsSelected = 'grant__numberOfApplicationsSelected',
  GrantPayoutType = 'grant__payoutType',
  GrantReviewType = 'grant__reviewType',
  GrantStartDate = 'grant__startDate',
  GrantStartDateS = 'grant__startDateS',
  GrantSummary = 'grant__summary',
  GrantTitle = 'grant__title',
  GrantTotalGrantFundingCommittedUsd = 'grant__totalGrantFundingCommittedUSD',
  GrantTotalGrantFundingDisbursedUsd = 'grant__totalGrantFundingDisbursedUSD',
  GrantUpdatedAtS = 'grant__updatedAtS',
  Id = 'id',
  IsPrivate = 'isPrivate',
  Workspace = 'workspace',
  WorkspaceAbout = 'workspace__about',
  WorkspaceBio = 'workspace__bio',
  WorkspaceCoverImageIpfsHash = 'workspace__coverImageIpfsHash',
  WorkspaceCreatedAtS = 'workspace__createdAtS',
  WorkspaceId = 'workspace__id',
  WorkspaceIsVisible = 'workspace__isVisible',
  WorkspaceLogoIpfsHash = 'workspace__logoIpfsHash',
  WorkspaceMetadataHash = 'workspace__metadataHash',
  WorkspaceMostRecentGrantPostedAtS = 'workspace__mostRecentGrantPostedAtS',
  WorkspaceOwnerId = 'workspace__ownerId',
  WorkspaceTitle = 'workspace__title',
  WorkspaceUpdatedAtS = 'workspace__updatedAtS'
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
  Cancelled = 'cancelled',
  Executed = 'executed',
  Queued = 'queued'
}

export enum FundsTransferType {
  FundsDeposited = 'funds_deposited',
  FundsDisbursed = 'funds_disbursed',
  FundsDisbursedFromSafe = 'funds_disbursed_from_safe',
  FundsDisbursedFromWallet = 'funds_disbursed_from_wallet',
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
  and?: InputMaybe<Array<InputMaybe<FundsTransfer_Filter>>>;
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
  asset_gt?: InputMaybe<Scalars['Bytes']>;
  asset_gte?: InputMaybe<Scalars['Bytes']>;
  asset_in?: InputMaybe<Array<Scalars['Bytes']>>;
  asset_lt?: InputMaybe<Scalars['Bytes']>;
  asset_lte?: InputMaybe<Scalars['Bytes']>;
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
  or?: InputMaybe<Array<InputMaybe<FundsTransfer_Filter>>>;
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
  sender_gt?: InputMaybe<Scalars['Bytes']>;
  sender_gte?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']>;
  sender_lte?: InputMaybe<Scalars['Bytes']>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  status?: InputMaybe<FundsTransferStatusType>;
  status_in?: InputMaybe<Array<FundsTransferStatusType>>;
  status_not?: InputMaybe<FundsTransferStatusType>;
  status_not_in?: InputMaybe<Array<FundsTransferStatusType>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
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
  ApplicationApplicantId = 'application__applicantId',
  ApplicationApplicantPublicKey = 'application__applicantPublicKey',
  ApplicationCreatedAtS = 'application__createdAtS',
  ApplicationFeedbackDao = 'application__feedbackDao',
  ApplicationFeedbackDev = 'application__feedbackDev',
  ApplicationId = 'application__id',
  ApplicationState = 'application__state',
  ApplicationUpdatedAtS = 'application__updatedAtS',
  ApplicationVersion = 'application__version',
  ApplicationWalletAddress = 'application__walletAddress',
  Asset = 'asset',
  CreatedAtS = 'createdAtS',
  ExecutionTimestamp = 'executionTimestamp',
  Grant = 'grant',
  GrantAcceptingApplications = 'grant__acceptingApplications',
  GrantCreatedAtS = 'grant__createdAtS',
  GrantCreatorId = 'grant__creatorId',
  GrantDeadline = 'grant__deadline',
  GrantDeadlineS = 'grant__deadlineS',
  GrantDetails = 'grant__details',
  GrantDocIpfsHash = 'grant__docIpfsHash',
  GrantFunding = 'grant__funding',
  GrantId = 'grant__id',
  GrantLink = 'grant__link',
  GrantMetadataHash = 'grant__metadataHash',
  GrantNumberOfApplications = 'grant__numberOfApplications',
  GrantNumberOfApplicationsAwaitingResubmission = 'grant__numberOfApplicationsAwaitingResubmission',
  GrantNumberOfApplicationsPending = 'grant__numberOfApplicationsPending',
  GrantNumberOfApplicationsRejected = 'grant__numberOfApplicationsRejected',
  GrantNumberOfApplicationsSelected = 'grant__numberOfApplicationsSelected',
  GrantPayoutType = 'grant__payoutType',
  GrantReviewType = 'grant__reviewType',
  GrantStartDate = 'grant__startDate',
  GrantStartDateS = 'grant__startDateS',
  GrantSummary = 'grant__summary',
  GrantTitle = 'grant__title',
  GrantTotalGrantFundingCommittedUsd = 'grant__totalGrantFundingCommittedUSD',
  GrantTotalGrantFundingDisbursedUsd = 'grant__totalGrantFundingDisbursedUSD',
  GrantUpdatedAtS = 'grant__updatedAtS',
  Id = 'id',
  Milestone = 'milestone',
  MilestoneAmount = 'milestone__amount',
  MilestoneAmountPaid = 'milestone__amountPaid',
  MilestoneFeedbackDao = 'milestone__feedbackDao',
  MilestoneFeedbackDaoUpdatedAtS = 'milestone__feedbackDaoUpdatedAtS',
  MilestoneFeedbackDev = 'milestone__feedbackDev',
  MilestoneFeedbackDevUpdatedAtS = 'milestone__feedbackDevUpdatedAtS',
  MilestoneId = 'milestone__id',
  MilestoneState = 'milestone__state',
  MilestoneTitle = 'milestone__title',
  MilestoneUpdatedAtS = 'milestone__updatedAtS',
  NonEvmAsset = 'nonEvmAsset',
  Review = 'review',
  ReviewCreatedAtS = 'review__createdAtS',
  ReviewId = 'review__id',
  ReviewPublicReviewDataHash = 'review__publicReviewDataHash',
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
  /** metadata hash that is used to fetch the grant details */
  metadataHash: Scalars['String'];
  /** milestones required */
  milestones?: Maybe<Array<Scalars['String']>>;
  /** Number of applications in the grant */
  numberOfApplications: Scalars['Int'];
  /** total number of applications awaiting resubmission in the grant program */
  numberOfApplicationsAwaitingResubmission: Scalars['Int'];
  /** total number of pending applications in the grant program */
  numberOfApplicationsPending: Scalars['Int'];
  /** total number of rejected applications in the grant program */
  numberOfApplicationsRejected: Scalars['Int'];
  /** total number of approved applications in the grant program */
  numberOfApplicationsSelected: Scalars['Int'];
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
  /** total grant funding committed in USD */
  totalGrantFundingCommittedUSD: Scalars['BigInt'];
  /** total grant funding committed in USD */
  totalGrantFundingDisbursedUSD: Scalars['BigInt'];
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
  /** Actions taken on an application */
  actions?: Maybe<Array<ApplicationAction>>;
  /** Address of the applicant */
  applicantId: Scalars['Bytes'];
  /** Public key of the applicant, used for PII */
  applicantPublicKey?: Maybe<Scalars['String']>;
  /** People who will review this grant application */
  applicationReviewers: Array<GrantApplicationReviewer>;
  claims?: Maybe<Array<Claim>>;
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
  /** Wallet Address of the applicant */
  walletAddress: Scalars['Bytes'];
};


export type GrantApplicationActionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApplicationAction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ApplicationAction_Filter>;
};


export type GrantApplicationApplicationReviewersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GrantApplicationReviewer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<GrantApplicationReviewer_Filter>;
};


export type GrantApplicationClaimsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Claim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Claim_Filter>;
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
  and?: InputMaybe<Array<InputMaybe<GrantApplicationReviewer_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantApplicationReviewer_Filter>>>;
};

export enum GrantApplicationReviewer_OrderBy {
  AssignedAtS = 'assignedAtS',
  Id = 'id',
  Member = 'member',
  MemberAccessLevel = 'member__accessLevel',
  MemberActorId = 'member__actorId',
  MemberAddedAt = 'member__addedAt',
  MemberEmail = 'member__email',
  MemberEmailId = 'member__emailId',
  MemberEnabled = 'member__enabled',
  MemberFullName = 'member__fullName',
  MemberId = 'member__id',
  MemberLastKnownTxHash = 'member__lastKnownTxHash',
  MemberLastReviewSubmittedAt = 'member__lastReviewSubmittedAt',
  MemberProfilePictureIpfsHash = 'member__profilePictureIpfsHash',
  MemberPublicKey = 'member__publicKey',
  MemberRemovedAt = 'member__removedAt',
  MemberUpdatedAt = 'member__updatedAt'
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
  actorId_gt?: InputMaybe<Scalars['Bytes']>;
  actorId_gte?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_lt?: InputMaybe<Scalars['Bytes']>;
  actorId_lte?: InputMaybe<Scalars['Bytes']>;
  actorId_not?: InputMaybe<Scalars['Bytes']>;
  actorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<GrantApplicationRevision_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantApplicationRevision_Filter>>>;
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
  ApplicationApplicantId = 'application__applicantId',
  ApplicationApplicantPublicKey = 'application__applicantPublicKey',
  ApplicationCreatedAtS = 'application__createdAtS',
  ApplicationFeedbackDao = 'application__feedbackDao',
  ApplicationFeedbackDev = 'application__feedbackDev',
  ApplicationId = 'application__id',
  ApplicationState = 'application__state',
  ApplicationUpdatedAtS = 'application__updatedAtS',
  ApplicationVersion = 'application__version',
  ApplicationWalletAddress = 'application__walletAddress',
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
  actions_?: InputMaybe<ApplicationAction_Filter>;
  and?: InputMaybe<Array<InputMaybe<GrantApplication_Filter>>>;
  applicantId?: InputMaybe<Scalars['Bytes']>;
  applicantId_contains?: InputMaybe<Scalars['Bytes']>;
  applicantId_gt?: InputMaybe<Scalars['Bytes']>;
  applicantId_gte?: InputMaybe<Scalars['Bytes']>;
  applicantId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  applicantId_lt?: InputMaybe<Scalars['Bytes']>;
  applicantId_lte?: InputMaybe<Scalars['Bytes']>;
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
  claims?: InputMaybe<Array<Scalars['String']>>;
  claims_?: InputMaybe<Claim_Filter>;
  claims_contains?: InputMaybe<Array<Scalars['String']>>;
  claims_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  claims_not?: InputMaybe<Array<Scalars['String']>>;
  claims_not_contains?: InputMaybe<Array<Scalars['String']>>;
  claims_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantApplication_Filter>>>;
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
  walletAddress?: InputMaybe<Scalars['Bytes']>;
  walletAddress_contains?: InputMaybe<Scalars['Bytes']>;
  walletAddress_gt?: InputMaybe<Scalars['Bytes']>;
  walletAddress_gte?: InputMaybe<Scalars['Bytes']>;
  walletAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  walletAddress_lt?: InputMaybe<Scalars['Bytes']>;
  walletAddress_lte?: InputMaybe<Scalars['Bytes']>;
  walletAddress_not?: InputMaybe<Scalars['Bytes']>;
  walletAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  walletAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum GrantApplication_OrderBy {
  Actions = 'actions',
  ApplicantId = 'applicantId',
  ApplicantPublicKey = 'applicantPublicKey',
  ApplicationReviewers = 'applicationReviewers',
  Claims = 'claims',
  Comments = 'comments',
  CreatedAtS = 'createdAtS',
  DoneReviewerAddresses = 'doneReviewerAddresses',
  FeedbackDao = 'feedbackDao',
  FeedbackDev = 'feedbackDev',
  Fields = 'fields',
  Grant = 'grant',
  GrantAcceptingApplications = 'grant__acceptingApplications',
  GrantCreatedAtS = 'grant__createdAtS',
  GrantCreatorId = 'grant__creatorId',
  GrantDeadline = 'grant__deadline',
  GrantDeadlineS = 'grant__deadlineS',
  GrantDetails = 'grant__details',
  GrantDocIpfsHash = 'grant__docIpfsHash',
  GrantFunding = 'grant__funding',
  GrantId = 'grant__id',
  GrantLink = 'grant__link',
  GrantMetadataHash = 'grant__metadataHash',
  GrantNumberOfApplications = 'grant__numberOfApplications',
  GrantNumberOfApplicationsAwaitingResubmission = 'grant__numberOfApplicationsAwaitingResubmission',
  GrantNumberOfApplicationsPending = 'grant__numberOfApplicationsPending',
  GrantNumberOfApplicationsRejected = 'grant__numberOfApplicationsRejected',
  GrantNumberOfApplicationsSelected = 'grant__numberOfApplicationsSelected',
  GrantPayoutType = 'grant__payoutType',
  GrantReviewType = 'grant__reviewType',
  GrantStartDate = 'grant__startDate',
  GrantStartDateS = 'grant__startDateS',
  GrantSummary = 'grant__summary',
  GrantTitle = 'grant__title',
  GrantTotalGrantFundingCommittedUsd = 'grant__totalGrantFundingCommittedUSD',
  GrantTotalGrantFundingDisbursedUsd = 'grant__totalGrantFundingDisbursedUSD',
  GrantUpdatedAtS = 'grant__updatedAtS',
  Id = 'id',
  Milestones = 'milestones',
  PendingReviewerAddresses = 'pendingReviewerAddresses',
  Pii = 'pii',
  Reviewers = 'reviewers',
  Reviews = 'reviews',
  State = 'state',
  UpdatedAtS = 'updatedAtS',
  Version = 'version',
  WalletAddress = 'walletAddress'
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
  and?: InputMaybe<Array<InputMaybe<GrantFieldAnswerItem_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantFieldAnswerItem_Filter>>>;
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
  walletId_gt?: InputMaybe<Scalars['Bytes']>;
  walletId_gte?: InputMaybe<Scalars['Bytes']>;
  walletId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  walletId_lt?: InputMaybe<Scalars['Bytes']>;
  walletId_lte?: InputMaybe<Scalars['Bytes']>;
  walletId_not?: InputMaybe<Scalars['Bytes']>;
  walletId_not_contains?: InputMaybe<Scalars['Bytes']>;
  walletId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum GrantFieldAnswerItem_OrderBy {
  Answer = 'answer',
  AnswerId = 'answer__id',
  Id = 'id',
  Value = 'value',
  WalletId = 'walletId'
}

export type GrantFieldAnswer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GrantFieldAnswer_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantFieldAnswer_Filter>>>;
  values_?: InputMaybe<GrantFieldAnswerItem_Filter>;
};

export enum GrantFieldAnswer_OrderBy {
  Field = 'field',
  FieldId = 'field__id',
  FieldInputType = 'field__inputType',
  FieldIsPii = 'field__isPii',
  FieldTitle = 'field__title',
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
  and?: InputMaybe<Array<InputMaybe<GrantField_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantField_Filter>>>;
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
  and?: InputMaybe<Array<InputMaybe<GrantManager_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantManager_Filter>>>;
};

export enum GrantManager_OrderBy {
  Grant = 'grant',
  GrantAcceptingApplications = 'grant__acceptingApplications',
  GrantCreatedAtS = 'grant__createdAtS',
  GrantCreatorId = 'grant__creatorId',
  GrantDeadline = 'grant__deadline',
  GrantDeadlineS = 'grant__deadlineS',
  GrantDetails = 'grant__details',
  GrantDocIpfsHash = 'grant__docIpfsHash',
  GrantFunding = 'grant__funding',
  GrantId = 'grant__id',
  GrantLink = 'grant__link',
  GrantMetadataHash = 'grant__metadataHash',
  GrantNumberOfApplications = 'grant__numberOfApplications',
  GrantNumberOfApplicationsAwaitingResubmission = 'grant__numberOfApplicationsAwaitingResubmission',
  GrantNumberOfApplicationsPending = 'grant__numberOfApplicationsPending',
  GrantNumberOfApplicationsRejected = 'grant__numberOfApplicationsRejected',
  GrantNumberOfApplicationsSelected = 'grant__numberOfApplicationsSelected',
  GrantPayoutType = 'grant__payoutType',
  GrantReviewType = 'grant__reviewType',
  GrantStartDate = 'grant__startDate',
  GrantStartDateS = 'grant__startDateS',
  GrantSummary = 'grant__summary',
  GrantTitle = 'grant__title',
  GrantTotalGrantFundingCommittedUsd = 'grant__totalGrantFundingCommittedUSD',
  GrantTotalGrantFundingDisbursedUsd = 'grant__totalGrantFundingDisbursedUSD',
  GrantUpdatedAtS = 'grant__updatedAtS',
  Id = 'id',
  Member = 'member',
  MemberAccessLevel = 'member__accessLevel',
  MemberActorId = 'member__actorId',
  MemberAddedAt = 'member__addedAt',
  MemberEmail = 'member__email',
  MemberEmailId = 'member__emailId',
  MemberEnabled = 'member__enabled',
  MemberFullName = 'member__fullName',
  MemberId = 'member__id',
  MemberLastKnownTxHash = 'member__lastKnownTxHash',
  MemberLastReviewSubmittedAt = 'member__lastReviewSubmittedAt',
  MemberProfilePictureIpfsHash = 'member__profilePictureIpfsHash',
  MemberPublicKey = 'member__publicKey',
  MemberRemovedAt = 'member__removedAt',
  MemberUpdatedAt = 'member__updatedAt'
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
  and?: InputMaybe<Array<InputMaybe<GrantReviewerCounter_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<GrantReviewerCounter_Filter>>>;
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
  reviewerAddress_gt?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_gte?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  reviewerAddress_lt?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_lte?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_not?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  reviewerAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum GrantReviewerCounter_OrderBy {
  Counter = 'counter',
  DoneCounter = 'doneCounter',
  Grant = 'grant',
  GrantAcceptingApplications = 'grant__acceptingApplications',
  GrantCreatedAtS = 'grant__createdAtS',
  GrantCreatorId = 'grant__creatorId',
  GrantDeadline = 'grant__deadline',
  GrantDeadlineS = 'grant__deadlineS',
  GrantDetails = 'grant__details',
  GrantDocIpfsHash = 'grant__docIpfsHash',
  GrantFunding = 'grant__funding',
  GrantId = 'grant__id',
  GrantLink = 'grant__link',
  GrantMetadataHash = 'grant__metadataHash',
  GrantNumberOfApplications = 'grant__numberOfApplications',
  GrantNumberOfApplicationsAwaitingResubmission = 'grant__numberOfApplicationsAwaitingResubmission',
  GrantNumberOfApplicationsPending = 'grant__numberOfApplicationsPending',
  GrantNumberOfApplicationsRejected = 'grant__numberOfApplicationsRejected',
  GrantNumberOfApplicationsSelected = 'grant__numberOfApplicationsSelected',
  GrantPayoutType = 'grant__payoutType',
  GrantReviewType = 'grant__reviewType',
  GrantStartDate = 'grant__startDate',
  GrantStartDateS = 'grant__startDateS',
  GrantSummary = 'grant__summary',
  GrantTitle = 'grant__title',
  GrantTotalGrantFundingCommittedUsd = 'grant__totalGrantFundingCommittedUSD',
  GrantTotalGrantFundingDisbursedUsd = 'grant__totalGrantFundingDisbursedUSD',
  GrantUpdatedAtS = 'grant__updatedAtS',
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
  and?: InputMaybe<Array<InputMaybe<Grant_Filter>>>;
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
  creatorId_gt?: InputMaybe<Scalars['Bytes']>;
  creatorId_gte?: InputMaybe<Scalars['Bytes']>;
  creatorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  creatorId_lt?: InputMaybe<Scalars['Bytes']>;
  creatorId_lte?: InputMaybe<Scalars['Bytes']>;
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
  numberOfApplicationsAwaitingResubmission?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsAwaitingResubmission_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsAwaitingResubmission_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsAwaitingResubmission_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplicationsAwaitingResubmission_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsAwaitingResubmission_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsAwaitingResubmission_not?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsAwaitingResubmission_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplicationsPending?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsPending_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsPending_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsPending_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplicationsPending_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsPending_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsPending_not?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsPending_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplicationsRejected?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsRejected_gt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsRejected_gte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsRejected_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfApplicationsRejected_lt?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsRejected_lte?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsRejected_not?: InputMaybe<Scalars['Int']>;
  numberOfApplicationsRejected_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  or?: InputMaybe<Array<InputMaybe<Grant_Filter>>>;
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
  totalGrantFundingCommittedUSD?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingCommittedUSD_gt?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingCommittedUSD_gte?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingCommittedUSD_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalGrantFundingCommittedUSD_lt?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingCommittedUSD_lte?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingCommittedUSD_not?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingCommittedUSD_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalGrantFundingDisbursedUSD?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingDisbursedUSD_gt?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingDisbursedUSD_gte?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingDisbursedUSD_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalGrantFundingDisbursedUSD_lt?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingDisbursedUSD_lte?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingDisbursedUSD_not?: InputMaybe<Scalars['BigInt']>;
  totalGrantFundingDisbursedUSD_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  NumberOfApplicationsAwaitingResubmission = 'numberOfApplicationsAwaitingResubmission',
  NumberOfApplicationsPending = 'numberOfApplicationsPending',
  NumberOfApplicationsRejected = 'numberOfApplicationsRejected',
  NumberOfApplicationsSelected = 'numberOfApplicationsSelected',
  PayoutType = 'payoutType',
  ReviewType = 'reviewType',
  Reward = 'reward',
  RewardAsset = 'reward__asset',
  RewardCommitted = 'reward__committed',
  RewardId = 'reward__id',
  Rubric = 'rubric',
  RubricCreatedAtS = 'rubric__createdAtS',
  RubricId = 'rubric__id',
  RubricIsPrivate = 'rubric__isPrivate',
  RubricUpdatedAtS = 'rubric__updatedAtS',
  StartDate = 'startDate',
  StartDateS = 'startDateS',
  Summary = 'summary',
  Title = 'title',
  TotalGrantFundingCommittedUsd = 'totalGrantFundingCommittedUSD',
  TotalGrantFundingDisbursedUsd = 'totalGrantFundingDisbursedUSD',
  UpdatedAtS = 'updatedAtS',
  Workspace = 'workspace',
  WorkspaceAbout = 'workspace__about',
  WorkspaceBio = 'workspace__bio',
  WorkspaceCoverImageIpfsHash = 'workspace__coverImageIpfsHash',
  WorkspaceCreatedAtS = 'workspace__createdAtS',
  WorkspaceId = 'workspace__id',
  WorkspaceIsVisible = 'workspace__isVisible',
  WorkspaceLogoIpfsHash = 'workspace__logoIpfsHash',
  WorkspaceMetadataHash = 'workspace__metadataHash',
  WorkspaceMostRecentGrantPostedAtS = 'workspace__mostRecentGrantPostedAtS',
  WorkspaceOwnerId = 'workspace__ownerId',
  WorkspaceTitle = 'workspace__title',
  WorkspaceUpdatedAtS = 'workspace__updatedAtS'
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
  and?: InputMaybe<Array<InputMaybe<Migration_Filter>>>;
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
  fromWallet_gt?: InputMaybe<Scalars['Bytes']>;
  fromWallet_gte?: InputMaybe<Scalars['Bytes']>;
  fromWallet_in?: InputMaybe<Array<Scalars['Bytes']>>;
  fromWallet_lt?: InputMaybe<Scalars['Bytes']>;
  fromWallet_lte?: InputMaybe<Scalars['Bytes']>;
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
  or?: InputMaybe<Array<InputMaybe<Migration_Filter>>>;
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
  toWallet_gt?: InputMaybe<Scalars['Bytes']>;
  toWallet_gte?: InputMaybe<Scalars['Bytes']>;
  toWallet_in?: InputMaybe<Array<Scalars['Bytes']>>;
  toWallet_lt?: InputMaybe<Scalars['Bytes']>;
  toWallet_lte?: InputMaybe<Scalars['Bytes']>;
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
  ApplicationApplicantId = 'application__applicantId',
  ApplicationApplicantPublicKey = 'application__applicantPublicKey',
  ApplicationCreatedAtS = 'application__createdAtS',
  ApplicationFeedbackDao = 'application__feedbackDao',
  ApplicationFeedbackDev = 'application__feedbackDev',
  ApplicationId = 'application__id',
  ApplicationState = 'application__state',
  ApplicationUpdatedAtS = 'application__updatedAtS',
  ApplicationVersion = 'application__version',
  ApplicationWalletAddress = 'application__walletAddress',
  FromWallet = 'fromWallet',
  Id = 'id',
  Review = 'review',
  ReviewCreatedAtS = 'review__createdAtS',
  ReviewId = 'review__id',
  ReviewPublicReviewDataHash = 'review__publicReviewDataHash',
  Timestamp = 'timestamp',
  ToWallet = 'toWallet',
  TransactionHash = 'transactionHash',
  Type = 'type',
  Workspace = 'workspace',
  WorkspaceAbout = 'workspace__about',
  WorkspaceBio = 'workspace__bio',
  WorkspaceCoverImageIpfsHash = 'workspace__coverImageIpfsHash',
  WorkspaceCreatedAtS = 'workspace__createdAtS',
  WorkspaceId = 'workspace__id',
  WorkspaceIsVisible = 'workspace__isVisible',
  WorkspaceLogoIpfsHash = 'workspace__logoIpfsHash',
  WorkspaceMetadataHash = 'workspace__metadataHash',
  WorkspaceMostRecentGrantPostedAtS = 'workspace__mostRecentGrantPostedAtS',
  WorkspaceOwnerId = 'workspace__ownerId',
  WorkspaceTitle = 'workspace__title',
  WorkspaceUpdatedAtS = 'workspace__updatedAtS'
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
  cursor: Scalars['Int'];
  /** The IDs of the entity being affected */
  entityIds: Array<Scalars['String']>;
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
  CommentAdded = 'comment_added',
  FundsDeposited = 'funds_deposited',
  FundsDisbursed = 'funds_disbursed',
  FundsDisbursedFromSafe = 'funds_disbursed_from_safe',
  FundsDisbursedFromWallet = 'funds_disbursed_from_wallet',
  FundsWithdrawn = 'funds_withdrawn',
  MilestoneAccepted = 'milestone_accepted',
  MilestoneRejected = 'milestone_rejected',
  MilestoneRequested = 'milestone_requested',
  ReviewSubmitted = 'review_submitted'
}

export type Notification_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  actorId?: InputMaybe<Scalars['Bytes']>;
  actorId_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_gt?: InputMaybe<Scalars['Bytes']>;
  actorId_gte?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_lt?: InputMaybe<Scalars['Bytes']>;
  actorId_lte?: InputMaybe<Scalars['Bytes']>;
  actorId_not?: InputMaybe<Scalars['Bytes']>;
  actorId_not_contains?: InputMaybe<Scalars['Bytes']>;
  actorId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<Notification_Filter>>>;
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
  cursor?: InputMaybe<Scalars['Int']>;
  cursor_gt?: InputMaybe<Scalars['Int']>;
  cursor_gte?: InputMaybe<Scalars['Int']>;
  cursor_in?: InputMaybe<Array<Scalars['Int']>>;
  cursor_lt?: InputMaybe<Scalars['Int']>;
  cursor_lte?: InputMaybe<Scalars['Int']>;
  cursor_not?: InputMaybe<Scalars['Int']>;
  cursor_not_in?: InputMaybe<Array<Scalars['Int']>>;
  entityIds?: InputMaybe<Array<Scalars['String']>>;
  entityIds_contains?: InputMaybe<Array<Scalars['String']>>;
  entityIds_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  entityIds_not?: InputMaybe<Array<Scalars['String']>>;
  entityIds_not_contains?: InputMaybe<Array<Scalars['String']>>;
  entityIds_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<Notification_Filter>>>;
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
  EntityIds = 'entityIds',
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
  and?: InputMaybe<Array<InputMaybe<PiiAnswer_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PiiAnswer_Filter>>>;
};

export enum PiiAnswer_OrderBy {
  Data = 'data',
  Id = 'id',
  Manager = 'manager',
  ManagerId = 'manager__id'
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
  and?: InputMaybe<Array<InputMaybe<PiiData_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<PiiData_Filter>>>;
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
  and?: InputMaybe<Array<InputMaybe<Partner_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Partner_Filter>>>;
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
  and?: InputMaybe<Array<InputMaybe<QbAdmin_Filter>>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  or?: InputMaybe<Array<InputMaybe<QbAdmin_Filter>>>;
  walletAddress?: InputMaybe<Scalars['Bytes']>;
  walletAddress_contains?: InputMaybe<Scalars['Bytes']>;
  walletAddress_gt?: InputMaybe<Scalars['Bytes']>;
  walletAddress_gte?: InputMaybe<Scalars['Bytes']>;
  walletAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  walletAddress_lt?: InputMaybe<Scalars['Bytes']>;
  walletAddress_lte?: InputMaybe<Scalars['Bytes']>;
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
  applicationAction?: Maybe<ApplicationAction>;
  applicationActions: Array<ApplicationAction>;
  applicationMilestone?: Maybe<ApplicationMilestone>;
  applicationMilestones: Array<ApplicationMilestone>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
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
  section?: Maybe<Section>;
  sections: Array<Section>;
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


export type QueryApplicationActionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryApplicationActionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApplicationAction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ApplicationAction_Filter>;
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


export type QueryClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Claim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Claim_Filter>;
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


export type QuerySectionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySectionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Section_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Section_Filter>;
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
  and?: InputMaybe<Array<InputMaybe<Review_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Review_Filter>>>;
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
  ApplicationApplicantId = 'application__applicantId',
  ApplicationApplicantPublicKey = 'application__applicantPublicKey',
  ApplicationCreatedAtS = 'application__createdAtS',
  ApplicationFeedbackDao = 'application__feedbackDao',
  ApplicationFeedbackDev = 'application__feedbackDev',
  ApplicationId = 'application__id',
  ApplicationState = 'application__state',
  ApplicationUpdatedAtS = 'application__updatedAtS',
  ApplicationVersion = 'application__version',
  ApplicationWalletAddress = 'application__walletAddress',
  CreatedAtS = 'createdAtS',
  Data = 'data',
  Id = 'id',
  PublicReviewDataHash = 'publicReviewDataHash',
  Reviewer = 'reviewer',
  ReviewerAccessLevel = 'reviewer__accessLevel',
  ReviewerActorId = 'reviewer__actorId',
  ReviewerAddedAt = 'reviewer__addedAt',
  ReviewerEmail = 'reviewer__email',
  ReviewerEmailId = 'reviewer__emailId',
  ReviewerEnabled = 'reviewer__enabled',
  ReviewerFullName = 'reviewer__fullName',
  ReviewerId = 'reviewer__id',
  ReviewerLastKnownTxHash = 'reviewer__lastKnownTxHash',
  ReviewerLastReviewSubmittedAt = 'reviewer__lastReviewSubmittedAt',
  ReviewerProfilePictureIpfsHash = 'reviewer__profilePictureIpfsHash',
  ReviewerPublicKey = 'reviewer__publicKey',
  ReviewerRemovedAt = 'reviewer__removedAt',
  ReviewerUpdatedAt = 'reviewer__updatedAt'
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
  and?: InputMaybe<Array<InputMaybe<Reward_Filter>>>;
  asset?: InputMaybe<Scalars['Bytes']>;
  asset_contains?: InputMaybe<Scalars['Bytes']>;
  asset_gt?: InputMaybe<Scalars['Bytes']>;
  asset_gte?: InputMaybe<Scalars['Bytes']>;
  asset_in?: InputMaybe<Array<Scalars['Bytes']>>;
  asset_lt?: InputMaybe<Scalars['Bytes']>;
  asset_lte?: InputMaybe<Scalars['Bytes']>;
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
  or?: InputMaybe<Array<InputMaybe<Reward_Filter>>>;
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
  Token = 'token',
  TokenAddress = 'token__address',
  TokenChainId = 'token__chainId',
  TokenDecimal = 'token__decimal',
  TokenIconHash = 'token__iconHash',
  TokenId = 'token__id',
  TokenLabel = 'token__label'
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
  and?: InputMaybe<Array<InputMaybe<RubricItem_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<RubricItem_Filter>>>;
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
  and?: InputMaybe<Array<InputMaybe<Rubric_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Rubric_Filter>>>;
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
  AddedByAccessLevel = 'addedBy__accessLevel',
  AddedByActorId = 'addedBy__actorId',
  AddedByAddedAt = 'addedBy__addedAt',
  AddedByEmail = 'addedBy__email',
  AddedByEmailId = 'addedBy__emailId',
  AddedByEnabled = 'addedBy__enabled',
  AddedByFullName = 'addedBy__fullName',
  AddedById = 'addedBy__id',
  AddedByLastKnownTxHash = 'addedBy__lastKnownTxHash',
  AddedByLastReviewSubmittedAt = 'addedBy__lastReviewSubmittedAt',
  AddedByProfilePictureIpfsHash = 'addedBy__profilePictureIpfsHash',
  AddedByPublicKey = 'addedBy__publicKey',
  AddedByRemovedAt = 'addedBy__removedAt',
  AddedByUpdatedAt = 'addedBy__updatedAt',
  CreatedAtS = 'createdAtS',
  Id = 'id',
  IsPrivate = 'isPrivate',
  Items = 'items',
  UpdatedAtS = 'updatedAtS'
}

export type Section = {
  __typename?: 'Section';
  /** grants under this section */
  grants: Array<Grant>;
  id: Scalars['ID'];
  /** IPFS hash of the section logo */
  sectionLogoIpfsHash: Scalars['String'];
  /** Name of the section */
  sectionName: Scalars['String'];
};


export type SectionGrantsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Grant_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Grant_Filter>;
};

export type Section_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Section_Filter>>>;
  grants?: InputMaybe<Array<Scalars['String']>>;
  grants_?: InputMaybe<Grant_Filter>;
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
  or?: InputMaybe<Array<InputMaybe<Section_Filter>>>;
  sectionLogoIpfsHash?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_contains?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_contains_nocase?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_ends_with?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_gt?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_gte?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_in?: InputMaybe<Array<Scalars['String']>>;
  sectionLogoIpfsHash_lt?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_lte?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_not?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_not_contains?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_not_ends_with?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  sectionLogoIpfsHash_not_starts_with?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_starts_with?: InputMaybe<Scalars['String']>;
  sectionLogoIpfsHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sectionName?: InputMaybe<Scalars['String']>;
  sectionName_contains?: InputMaybe<Scalars['String']>;
  sectionName_contains_nocase?: InputMaybe<Scalars['String']>;
  sectionName_ends_with?: InputMaybe<Scalars['String']>;
  sectionName_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sectionName_gt?: InputMaybe<Scalars['String']>;
  sectionName_gte?: InputMaybe<Scalars['String']>;
  sectionName_in?: InputMaybe<Array<Scalars['String']>>;
  sectionName_lt?: InputMaybe<Scalars['String']>;
  sectionName_lte?: InputMaybe<Scalars['String']>;
  sectionName_not?: InputMaybe<Scalars['String']>;
  sectionName_not_contains?: InputMaybe<Scalars['String']>;
  sectionName_not_contains_nocase?: InputMaybe<Scalars['String']>;
  sectionName_not_ends_with?: InputMaybe<Scalars['String']>;
  sectionName_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sectionName_not_in?: InputMaybe<Array<Scalars['String']>>;
  sectionName_not_starts_with?: InputMaybe<Scalars['String']>;
  sectionName_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sectionName_starts_with?: InputMaybe<Scalars['String']>;
  sectionName_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Section_OrderBy {
  Grants = 'grants',
  Id = 'id',
  SectionLogoIpfsHash = 'sectionLogoIpfsHash',
  SectionName = 'sectionName'
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
  and?: InputMaybe<Array<InputMaybe<Social_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Social_Filter>>>;
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
  applicationAction?: Maybe<ApplicationAction>;
  applicationActions: Array<ApplicationAction>;
  applicationMilestone?: Maybe<ApplicationMilestone>;
  applicationMilestones: Array<ApplicationMilestone>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
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
  section?: Maybe<Section>;
  sections: Array<Section>;
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


export type SubscriptionApplicationActionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionApplicationActionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApplicationAction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ApplicationAction_Filter>;
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


export type SubscriptionClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Claim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Claim_Filter>;
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


export type SubscriptionSectionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSectionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Section_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Section_Filter>;
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
  address_gt?: InputMaybe<Scalars['Bytes']>;
  address_gte?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_lt?: InputMaybe<Scalars['Bytes']>;
  address_lte?: InputMaybe<Scalars['Bytes']>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
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
  Workspace = 'workspace',
  WorkspaceAbout = 'workspace__about',
  WorkspaceBio = 'workspace__bio',
  WorkspaceCoverImageIpfsHash = 'workspace__coverImageIpfsHash',
  WorkspaceCreatedAtS = 'workspace__createdAtS',
  WorkspaceId = 'workspace__id',
  WorkspaceIsVisible = 'workspace__isVisible',
  WorkspaceLogoIpfsHash = 'workspace__logoIpfsHash',
  WorkspaceMetadataHash = 'workspace__metadataHash',
  WorkspaceMostRecentGrantPostedAtS = 'workspace__mostRecentGrantPostedAtS',
  WorkspaceOwnerId = 'workspace__ownerId',
  WorkspaceTitle = 'workspace__title',
  WorkspaceUpdatedAtS = 'workspace__updatedAtS'
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
  actorId_gt?: InputMaybe<Scalars['Bytes']>;
  actorId_gte?: InputMaybe<Scalars['Bytes']>;
  actorId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  actorId_lt?: InputMaybe<Scalars['Bytes']>;
  actorId_lte?: InputMaybe<Scalars['Bytes']>;
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
  and?: InputMaybe<Array<InputMaybe<WorkspaceMember_Filter>>>;
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
  lastKnownTxHash_gt?: InputMaybe<Scalars['Bytes']>;
  lastKnownTxHash_gte?: InputMaybe<Scalars['Bytes']>;
  lastKnownTxHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lastKnownTxHash_lt?: InputMaybe<Scalars['Bytes']>;
  lastKnownTxHash_lte?: InputMaybe<Scalars['Bytes']>;
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
  or?: InputMaybe<Array<InputMaybe<WorkspaceMember_Filter>>>;
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
  AddedByAccessLevel = 'addedBy__accessLevel',
  AddedByActorId = 'addedBy__actorId',
  AddedByAddedAt = 'addedBy__addedAt',
  AddedByEmail = 'addedBy__email',
  AddedByEmailId = 'addedBy__emailId',
  AddedByEnabled = 'addedBy__enabled',
  AddedByFullName = 'addedBy__fullName',
  AddedById = 'addedBy__id',
  AddedByLastKnownTxHash = 'addedBy__lastKnownTxHash',
  AddedByLastReviewSubmittedAt = 'addedBy__lastReviewSubmittedAt',
  AddedByProfilePictureIpfsHash = 'addedBy__profilePictureIpfsHash',
  AddedByPublicKey = 'addedBy__publicKey',
  AddedByRemovedAt = 'addedBy__removedAt',
  AddedByUpdatedAt = 'addedBy__updatedAt',
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
  Workspace = 'workspace',
  WorkspaceAbout = 'workspace__about',
  WorkspaceBio = 'workspace__bio',
  WorkspaceCoverImageIpfsHash = 'workspace__coverImageIpfsHash',
  WorkspaceCreatedAtS = 'workspace__createdAtS',
  WorkspaceId = 'workspace__id',
  WorkspaceIsVisible = 'workspace__isVisible',
  WorkspaceLogoIpfsHash = 'workspace__logoIpfsHash',
  WorkspaceMetadataHash = 'workspace__metadataHash',
  WorkspaceMostRecentGrantPostedAtS = 'workspace__mostRecentGrantPostedAtS',
  WorkspaceOwnerId = 'workspace__ownerId',
  WorkspaceTitle = 'workspace__title',
  WorkspaceUpdatedAtS = 'workspace__updatedAtS'
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
  and?: InputMaybe<Array<InputMaybe<WorkspaceSafe_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<WorkspaceSafe_Filter>>>;
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
  Workspace = 'workspace',
  WorkspaceAbout = 'workspace__about',
  WorkspaceBio = 'workspace__bio',
  WorkspaceCoverImageIpfsHash = 'workspace__coverImageIpfsHash',
  WorkspaceCreatedAtS = 'workspace__createdAtS',
  WorkspaceId = 'workspace__id',
  WorkspaceIsVisible = 'workspace__isVisible',
  WorkspaceLogoIpfsHash = 'workspace__logoIpfsHash',
  WorkspaceMetadataHash = 'workspace__metadataHash',
  WorkspaceMostRecentGrantPostedAtS = 'workspace__mostRecentGrantPostedAtS',
  WorkspaceOwnerId = 'workspace__ownerId',
  WorkspaceTitle = 'workspace__title',
  WorkspaceUpdatedAtS = 'workspace__updatedAtS'
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
  and?: InputMaybe<Array<InputMaybe<Workspace_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<Workspace_Filter>>>;
  ownerId?: InputMaybe<Scalars['Bytes']>;
  ownerId_contains?: InputMaybe<Scalars['Bytes']>;
  ownerId_gt?: InputMaybe<Scalars['Bytes']>;
  ownerId_gte?: InputMaybe<Scalars['Bytes']>;
  ownerId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  ownerId_lt?: InputMaybe<Scalars['Bytes']>;
  ownerId_lte?: InputMaybe<Scalars['Bytes']>;
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
  Grants = 'grants',
  Id = 'id',
  IsVisible = 'isVisible',
  LogoIpfsHash = 'logoIpfsHash',
  Members = 'members',
  MetadataHash = 'metadataHash',
  MostRecentGrantPostedAtS = 'mostRecentGrantPostedAtS',
  OwnerId = 'ownerId',
  Partners = 'partners',
  Safe = 'safe',
  SafeAddress = 'safe__address',
  SafeChainId = 'safe__chainId',
  SafeId = 'safe__id',
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
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
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

export type GetAdminPublicKeysQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type GetAdminPublicKeysQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, publicKey?: string | null }> } | null };

export type GetApplicationDetailsQueryVariables = Exact<{
  applicationID: Scalars['ID'];
}>;


export type GetApplicationDetailsQuery = { __typename?: 'Query', grantApplication?: { __typename?: 'GrantApplication', id: string, pendingReviewerAddresses: Array<string>, doneReviewerAddresses: Array<string>, applicantId: string, applicantPublicKey?: string | null, state: ApplicationState, feedbackDao?: string | null, feedbackDev?: string | null, createdAtS: number, updatedAtS: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null, state: MilestoneState }>, grant: { __typename?: 'Grant', id: string, title: string, funding: string, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null }> }, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, fields: Array<{ __typename?: 'GrantField', id: string, title: string, isPii: boolean }>, rubric?: { __typename?: 'Rubric', isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null, fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, type: FundsTransferType, asset: string, nonEvmAsset?: string | null, transactionHash?: string | null, status: FundsTransferStatusType, createdAtS: number, milestone?: { __typename?: 'ApplicationMilestone', id: string, title: string, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null, state: MilestoneState } | null, application?: { __typename?: 'GrantApplication', applicantId: string, id: string, state: ApplicationState } | null }> }, reviews: Array<{ __typename?: 'Review', publicReviewDataHash?: string | null, id: string, createdAtS: number, reviewer: { __typename?: 'WorkspaceMember', actorId: string, id: string, email?: string | null, fullName?: string | null }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string } | null }> }>, reviewers: Array<{ __typename?: 'WorkspaceMember', actorId: string, email?: string | null, id: string, fullName?: string | null }> } | null };

export type GetGrantQueryVariables = Exact<{
  grantId: Scalars['ID'];
  actorId: Scalars['Bytes'];
}>;


export type GetGrantQuery = { __typename?: 'Query', grant?: { __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, numberOfApplications: number, numberOfApplicationsSelected: number, numberOfApplicationsPending: number, link?: string | null, reviewType?: ReviewType | null, payoutType?: PayoutType | null, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, possibleValues?: Array<string> | null, isPii: boolean }>, applications: Array<{ __typename?: 'GrantApplication', id: string }>, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, rubric?: { __typename?: 'Rubric', id: string, isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null, myApplications: Array<{ __typename?: 'GrantApplication', id: string }>, workspace: { __typename?: 'Workspace', id: string, ownerId: string, logoIpfsHash: string, title: string, supportedNetworks: Array<SupportedNetwork>, safe?: { __typename?: 'WorkspaceSafe', id: string, chainId: string, address: string } | null, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, fullName?: string | null, email?: string | null, accessLevel: WorkspaceMemberAccessLevel, outstandingReviewIds: Array<string>, lastReviewSubmittedAt: number, profilePictureIpfsHash?: string | null, enabled: boolean, addedAt: number, updatedAt: number, pii: Array<{ __typename?: 'PIIData', id: string, data: string }> }> } } | null };

export type GetGrantManagersWithPublicKeyQueryVariables = Exact<{
  grantID: Scalars['String'];
}>;


export type GetGrantManagersWithPublicKeyQuery = { __typename?: 'Query', grantManagers: Array<{ __typename?: 'GrantManager', member?: { __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null, enabled: boolean } | null }> };

export type GetLatestBlockQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLatestBlockQuery = { __typename?: 'Query', _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', number: number } } | null };

export type GetMemberPublicKeysQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
  applicationIds: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GetMemberPublicKeysQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', members: Array<{ __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null }> } | null, grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', member: { __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null } }> }> };

export type GetQbAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetQbAdminsQuery = { __typename?: 'Query', qbadmins: Array<{ __typename?: 'QBAdmin', walletAddress: string }> };

export type GetWorkspaceMemberExistsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetWorkspaceMemberExistsQuery = { __typename?: 'Query', workspaceMember?: { __typename?: 'WorkspaceMember', id: string } | null };

export type GetWorkspaceMembersQueryVariables = Exact<{
  actorId: Scalars['Bytes'];
}>;


export type GetWorkspaceMembersQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, enabled: boolean, workspace: { __typename?: 'Workspace', id: string, ownerId: string, logoIpfsHash: string, title: string, supportedNetworks: Array<SupportedNetwork>, safe?: { __typename?: 'WorkspaceSafe', id: string, chainId: string, address: string } | null, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, fullName?: string | null, email?: string | null, accessLevel: WorkspaceMemberAccessLevel, outstandingReviewIds: Array<string>, lastReviewSubmittedAt: number, profilePictureIpfsHash?: string | null, pii: Array<{ __typename?: 'PIIData', id: string, data: string }> }> } }> };

export type GetWorkspaceMembersPublicKeysQueryVariables = Exact<{
  workspaceId: Scalars['String'];
}>;


export type GetWorkspaceMembersPublicKeysQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', actorId: string, publicKey?: string | null }> };

export type GetApplicationActionsQueryVariables = Exact<{
  grantId: Scalars['String'];
}>;


export type GetApplicationActionsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, actions?: Array<{ __typename?: 'ApplicationAction', id: string, updatedBy: string, updatedAtS: number, state: ApplicationState, feedback?: string | null }> | null, grant: { __typename?: 'Grant', id: string, workspace: { __typename?: 'Workspace', supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, publicKey?: string | null, accessLevel: WorkspaceMemberAccessLevel }> } } }> };

export type GetCommentsQueryVariables = Exact<{
  grantId: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments: Array<{ __typename?: 'Comment', id: string, isPrivate: boolean, commentsPublicHash?: string | null, createdAt: number, commentsEncryptedData?: Array<{ __typename?: 'PIIData', id: string, data: string }> | null, workspace: { __typename?: 'Workspace', supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, publicKey?: string | null, accessLevel: WorkspaceMemberAccessLevel }> }, application: { __typename?: 'GrantApplication', id: string, applicantPublicKey?: string | null, applicantId: string } }> };

export type GetGrantDetailsForSeoQueryVariables = Exact<{
  grantId: Scalars['ID'];
}>;


export type GetGrantDetailsForSeoQuery = { __typename?: 'Query', grant?: { __typename?: 'Grant', id: string, title: string, workspace: { __typename?: 'Workspace', id: string, logoIpfsHash: string } } | null };

export type GetPayoutsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  proposalID: Scalars['String'];
}>;


export type GetPayoutsQuery = { __typename?: 'Query', fundsTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, asset: string, type: FundsTransferType, createdAtS: number, to: string, transactionHash?: string | null, status: FundsTransferStatusType, executionTimestamp?: number | null, milestone?: { __typename?: 'ApplicationMilestone', id: string } | null, grant: { __typename?: 'Grant', reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', id: string, label: string, address: string, decimal: number, chainId?: string | null, iconHash: string } | null } } }> };

export type GetProposalDetailsForSeoQueryVariables = Exact<{
  proposalId: Scalars['ID'];
}>;


export type GetProposalDetailsForSeoQuery = { __typename?: 'Query', grantApplication?: { __typename?: 'GrantApplication', id: string, title: Array<{ __typename?: 'GrantFieldAnswer', values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, grant: { __typename?: 'Grant', id: string, title: string, workspace: { __typename?: 'Workspace', id: string, logoIpfsHash: string } } } | null };

export type GetProposalsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  grantID: Scalars['String'];
}>;


export type GetProposalsQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, state: ApplicationState, createdAtS: number, updatedAtS: number, feedbackDao?: string | null, feedbackDev?: string | null, pendingReviewerAddresses: Array<string>, doneReviewerAddresses: Array<string>, version: number, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', id: string, value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }>, milestones: Array<{ __typename?: 'ApplicationMilestone', id: string, title: string, state: MilestoneState, amount: string, amountPaid: string, updatedAtS?: number | null, feedbackDao?: string | null, feedbackDaoUpdatedAtS?: number | null, feedbackDev?: string | null, feedbackDevUpdatedAtS?: number | null }>, reviews: Array<{ __typename?: 'Review', id: string, createdAtS: number, publicReviewDataHash?: string | null, reviewer: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean }, data: Array<{ __typename?: 'PIIAnswer', id: string, data: string, manager?: { __typename?: 'GrantManager', id: string, member?: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } | null } | null }> }>, applicationReviewers: Array<{ __typename?: 'GrantApplicationReviewer', id: string, assignedAtS: number, member: { __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, publicKey?: string | null, addedAt: number, updatedAt: number, enabled: boolean } }>, grant: { __typename?: 'Grant', id: string, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> } } }> };

export type GetAllGrantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  searchString: Scalars['String'];
}>;


export type GetAllGrantsQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, deadlineS: number, deadline?: string | null, numberOfApplications: number, numberOfApplicationsSelected: number, numberOfApplicationsPending: number, createdAtS: number, updatedAtS?: number | null, totalGrantFundingDisbursedUSD: string, applications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState }>, fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, type: FundsTransferType, tokenUSDValue?: string | null, asset: string, tokenName?: string | null }>, workspace: { __typename?: 'Workspace', id: string, title: string, isVisible: boolean, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, accessLevel: WorkspaceMemberAccessLevel }>, safe?: { __typename?: 'WorkspaceSafe', chainId: string, address: string } | null }, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null } }> };

export type GetAllGrantsForMemberQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  workspaces: Array<Scalars['String']> | Scalars['String'];
  supportedNetwork: Array<SupportedNetwork> | SupportedNetwork;
  actorId: Scalars['Bytes'];
}>;


export type GetAllGrantsForMemberQuery = { __typename?: 'Query', grants: Array<{ __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, deadlineS: number, deadline?: string | null, numberOfApplications: number, numberOfApplicationsSelected: number, numberOfApplicationsPending: number, createdAtS: number, updatedAtS?: number | null, totalGrantFundingDisbursedUSD: string, applications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState }>, fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, type: FundsTransferType, tokenUSDValue?: string | null, asset: string, tokenName?: string | null }>, workspace: { __typename?: 'Workspace', id: string, title: string, isVisible: boolean, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, accessLevel: WorkspaceMemberAccessLevel }>, safe?: { __typename?: 'WorkspaceSafe', chainId: string, address: string } | null }, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null } }> };

export type GetGrantProgramDetailsQueryVariables = Exact<{
  workspaceID: Scalars['String'];
}>;


export type GetGrantProgramDetailsQuery = { __typename?: 'Query', grantProgram: Array<{ __typename?: 'Grant', id: string, title: string, workspace: { __typename?: 'Workspace', id: string, title: string } }> };

export type GetSectionGrantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSectionGrantsQuery = { __typename?: 'Query', sections: Array<{ __typename?: 'Section', sectionName: string, sectionLogoIpfsHash: string, id: string, grants: Array<{ __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, deadlineS: number, deadline?: string | null, numberOfApplications: number, numberOfApplicationsSelected: number, numberOfApplicationsPending: number, createdAtS: number, updatedAtS?: number | null, totalGrantFundingDisbursedUSD: string, applications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState, createdAtS: number, updatedAtS: number, milestones: Array<{
    __typename?: 'ApplicationMilestone', id: string, amount: string,  amountPaid: string
}>, name: Array<{ __typename?: 'GrantFieldAnswer', values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, author: Array<{ __typename?: 'GrantFieldAnswer', values: Array<{ __typename?: 'GrantFieldAnswerItem', value: string }> }>, grant: { __typename?: 'Grant', id: string, title: string, workspace: { __typename?: 'Workspace', logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork> }, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', id: string, label: string, address: string, decimal: number, chainId?: string | null, iconHash: string } | null } } }>, fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, type: FundsTransferType, tokenUSDValue?: string | null, asset: string, tokenName?: string | null }>, workspace: { __typename?: 'Workspace', id: string, title: string, isVisible: boolean, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, safe?: { __typename?: 'WorkspaceSafe', chainId: string, address: string } | null }, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null } }> }> };

export type GetWorkspacesAndBuilderGrantsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  actorId: Scalars['Bytes'];
}>;


export type GetWorkspacesAndBuilderGrantsQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, accessLevel: WorkspaceMemberAccessLevel, enabled: boolean, workspace: { __typename?: 'Workspace', id: string, title: string, supportedNetworks: Array<SupportedNetwork>, grants: Array<string> } }>, grants: Array<{ __typename?: 'Grant', id: string, title: string, acceptingApplications: boolean, deadlineS: number, deadline?: string | null, numberOfApplications: number, numberOfApplicationsSelected: number, numberOfApplicationsPending: number, createdAtS: number, updatedAtS?: number | null, totalGrantFundingDisbursedUSD: string, applications: Array<{ __typename?: 'GrantApplication', id: string, applicantId: string, state: ApplicationState }>, fundTransfers: Array<{ __typename?: 'FundsTransfer', amount: string, type: FundsTransferType, tokenUSDValue?: string | null, asset: string, tokenName?: string | null }>, workspace: { __typename?: 'Workspace', id: string, title: string, isVisible: boolean, logoIpfsHash: string, supportedNetworks: Array<SupportedNetwork>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, accessLevel: WorkspaceMemberAccessLevel }>, safe?: { __typename?: 'WorkspaceSafe', chainId: string, address: string } | null }, reward: { __typename?: 'Reward', committed: string, id: string, asset: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null } }> };

export type GrantDetailsQueryVariables = Exact<{
  grantId: Scalars['ID'];
}>;


export type GrantDetailsQuery = { __typename?: 'Query', grant?: { __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, startDate?: string | null, deadline?: string | null, startDateS?: number | null, deadlineS: number, payoutType?: PayoutType | null, reviewType?: ReviewType | null, link?: string | null, docIpfsHash?: string | null, acceptingApplications: boolean, metadataHash: string, funding: string, milestones?: Array<string> | null, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', id: string, label: string, address: string, decimal: number, iconHash: string, chainId?: string | null } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, supportedNetworks: Array<SupportedNetwork>, logoIpfsHash: string, safe?: { __typename?: 'WorkspaceSafe', address: string, chainId: string } | null }, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, possibleValues?: Array<string> | null, isPii: boolean }> } | null };

export type ProposalDetailsQueryVariables = Exact<{
  proposalId: Scalars['ID'];
}>;


export type ProposalDetailsQuery = { __typename?: 'Query', grantApplication?: { __typename?: 'GrantApplication', id: string, applicantId: string, applicantPublicKey?: string | null, fields: Array<{ __typename?: 'GrantFieldAnswer', id: string, values: Array<{ __typename?: 'GrantFieldAnswerItem', id: string, value: string }> }>, pii: Array<{ __typename?: 'PIIAnswer', id: string, data: string }>, milestones: Array<{ __typename?: 'ApplicationMilestone', title: string, amount: string }>, grant: { __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, startDate?: string | null, deadline?: string | null, startDateS?: number | null, deadlineS: number, payoutType?: PayoutType | null, reviewType?: ReviewType | null, link?: string | null, docIpfsHash?: string | null, acceptingApplications: boolean, metadataHash: string, funding: string, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', id: string, label: string, address: string, decimal: number, iconHash: string, chainId?: string | null } | null }, workspace: { __typename?: 'Workspace', id: string, title: string, supportedNetworks: Array<SupportedNetwork>, logoIpfsHash: string, safe?: { __typename?: 'WorkspaceSafe', address: string, chainId: string } | null }, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, possibleValues?: Array<string> | null, isPii: boolean }> } } | null };

export type WalletAddressCheckerQueryVariables = Exact<{
  grantId: Scalars['String'];
  walletAddress: Scalars['Bytes'];
}>;


export type WalletAddressCheckerQuery = { __typename?: 'Query', grantApplications: Array<{ __typename?: 'GrantApplication', id: string, walletAddress: string, applicantId: string }> };

export type GetGrantDetailsByIdQueryVariables = Exact<{
  grantID: Scalars['ID'];
}>;


export type GetGrantDetailsByIdQuery = { __typename?: 'Query', grant?: { __typename?: 'Grant', id: string, creatorId: string, title: string, summary: string, details: string, link?: string | null, docIpfsHash?: string | null, payoutType?: PayoutType | null, reviewType?: ReviewType | null, startDate?: string | null, deadline?: string | null, funding: string, acceptingApplications: boolean, milestones?: Array<string> | null, rubric?: { __typename?: 'Rubric', id: string, isPrivate: boolean, items: Array<{ __typename?: 'RubricItem', id: string, title: string, details: string, maximumPoints: number }> } | null, fields: Array<{ __typename?: 'GrantField', id: string, title: string, inputType: GrantFieldInputType, isPii: boolean }>, reward: { __typename?: 'Reward', id: string, asset: string, committed: string, token?: { __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string } | null } } | null };

export type GetWorkspaceDetailsQueryVariables = Exact<{
  workspaceID: Scalars['ID'];
}>;


export type GetWorkspaceDetailsQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', id: string, title: string, bio: string, about: string, logoIpfsHash: string, coverImageIpfsHash?: string | null, supportedNetworks: Array<SupportedNetwork>, safe?: { __typename?: 'WorkspaceSafe', address: string, chainId: string } | null, partners: Array<{ __typename?: 'Partner', name: string, industry: string, website?: string | null, partnerImageHash?: string | null }>, socials: Array<{ __typename?: 'Social', name: string, value: string }>, tokens: Array<{ __typename?: 'Token', address: string, label: string, decimal: number, iconHash: string }>, members: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, publicKey?: string | null, email?: string | null, accessLevel: WorkspaceMemberAccessLevel, updatedAt: number, outstandingReviewIds: Array<string>, lastReviewSubmittedAt: number, enabled: boolean, addedBy?: { __typename?: 'WorkspaceMember', id: string, actorId: string } | null }> } | null };

export type GetWorkspaceMembersByWorkspaceIdQueryVariables = Exact<{
  workspaceId: Scalars['String'];
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type GetWorkspaceMembersByWorkspaceIdQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, actorId: string, fullName?: string | null, profilePictureIpfsHash?: string | null, accessLevel: WorkspaceMemberAccessLevel, addedAt: number, publicKey?: string | null, email?: string | null, enabled: boolean, pii: Array<{ __typename?: 'PIIData', id: string, data: string }> }> };


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
export const GetGrantDocument = gql`
    query getGrant($grantId: ID!, $actorId: Bytes!) {
  grant(id: $grantId) {
    id
    title
    acceptingApplications
    numberOfApplications
    numberOfApplicationsSelected
    numberOfApplicationsPending
    link
    fields {
      id
      title
      inputType
      possibleValues
      isPii
    }
    applications(first: 1) {
      id
    }
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
    myApplications: applications(where: {applicantId: $actorId}) {
      id
    }
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
        enabled
        addedAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useGetGrantQuery__
 *
 * To run a query within a React component, call `useGetGrantQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *      actorId: // value for 'actorId'
 *   },
 * });
 */
export function useGetGrantQuery(baseOptions: Apollo.QueryHookOptions<GetGrantQuery, GetGrantQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantQuery, GetGrantQueryVariables>(GetGrantDocument, options);
      }
export function useGetGrantLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantQuery, GetGrantQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantQuery, GetGrantQueryVariables>(GetGrantDocument, options);
        }
export type GetGrantQueryHookResult = ReturnType<typeof useGetGrantQuery>;
export type GetGrantLazyQueryHookResult = ReturnType<typeof useGetGrantLazyQuery>;
export type GetGrantQueryResult = Apollo.QueryResult<GetGrantQuery, GetGrantQueryVariables>;
export function refetchGetGrantQuery(variables: GetGrantQueryVariables) {
      return { query: GetGrantDocument, variables: variables }
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
export const GetMemberPublicKeysDocument = gql`
    query getMemberPublicKeys($workspaceId: ID!, $applicationIds: [ID!]!) {
  workspace(id: $workspaceId) {
    members(where: {accessLevel_not: reviewer, enabled: true}) {
      actorId
      publicKey
    }
  }
  grantApplications(where: {id_in: $applicationIds}) {
    id
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
 *      applicationIds: // value for 'applicationIds'
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
    orderBy: addedAt
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
export const GetApplicationActionsDocument = gql`
    query getApplicationActions($grantId: String!) {
  grantApplications(where: {grant: $grantId}) {
    id
    applicantId
    applicantPublicKey
    actions {
      id
      updatedBy
      updatedAtS
      state
      feedback
    }
    grant {
      id
      workspace {
        members {
          actorId
          fullName
          profilePictureIpfsHash
          publicKey
          accessLevel
        }
        supportedNetworks
      }
    }
  }
}
    `;

/**
 * __useGetApplicationActionsQuery__
 *
 * To run a query within a React component, call `useGetApplicationActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationActionsQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *   },
 * });
 */
export function useGetApplicationActionsQuery(baseOptions: Apollo.QueryHookOptions<GetApplicationActionsQuery, GetApplicationActionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetApplicationActionsQuery, GetApplicationActionsQueryVariables>(GetApplicationActionsDocument, options);
      }
export function useGetApplicationActionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationActionsQuery, GetApplicationActionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetApplicationActionsQuery, GetApplicationActionsQueryVariables>(GetApplicationActionsDocument, options);
        }
export type GetApplicationActionsQueryHookResult = ReturnType<typeof useGetApplicationActionsQuery>;
export type GetApplicationActionsLazyQueryHookResult = ReturnType<typeof useGetApplicationActionsLazyQuery>;
export type GetApplicationActionsQueryResult = Apollo.QueryResult<GetApplicationActionsQuery, GetApplicationActionsQueryVariables>;
export function refetchGetApplicationActionsQuery(variables: GetApplicationActionsQueryVariables) {
      return { query: GetApplicationActionsDocument, variables: variables }
    }
export const GetCommentsDocument = gql`
    query getComments($grantId: String!, $first: Int, $skip: Int) {
  comments(
    first: $first
    skip: $skip
    where: {grant: $grantId}
    orderBy: createdAt
    orderDirection: asc
  ) {
    id
    isPrivate
    commentsPublicHash
    createdAt
    commentsEncryptedData {
      id
      data
    }
    workspace {
      members {
        actorId
        fullName
        profilePictureIpfsHash
        publicKey
        accessLevel
      }
      supportedNetworks
    }
    application {
      id
      applicantPublicKey
      applicantId
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
 *      grantId: // value for 'grantId'
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
export const GetGrantDetailsForSeoDocument = gql`
    query getGrantDetailsForSEO($grantId: ID!) {
  grant(id: $grantId) {
    id
    title
    workspace {
      id
      logoIpfsHash
    }
  }
}
    `;

/**
 * __useGetGrantDetailsForSeoQuery__
 *
 * To run a query within a React component, call `useGetGrantDetailsForSeoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantDetailsForSeoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantDetailsForSeoQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *   },
 * });
 */
export function useGetGrantDetailsForSeoQuery(baseOptions: Apollo.QueryHookOptions<GetGrantDetailsForSeoQuery, GetGrantDetailsForSeoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantDetailsForSeoQuery, GetGrantDetailsForSeoQueryVariables>(GetGrantDetailsForSeoDocument, options);
      }
export function useGetGrantDetailsForSeoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantDetailsForSeoQuery, GetGrantDetailsForSeoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantDetailsForSeoQuery, GetGrantDetailsForSeoQueryVariables>(GetGrantDetailsForSeoDocument, options);
        }
export type GetGrantDetailsForSeoQueryHookResult = ReturnType<typeof useGetGrantDetailsForSeoQuery>;
export type GetGrantDetailsForSeoLazyQueryHookResult = ReturnType<typeof useGetGrantDetailsForSeoLazyQuery>;
export type GetGrantDetailsForSeoQueryResult = Apollo.QueryResult<GetGrantDetailsForSeoQuery, GetGrantDetailsForSeoQueryVariables>;
export function refetchGetGrantDetailsForSeoQuery(variables: GetGrantDetailsForSeoQueryVariables) {
      return { query: GetGrantDetailsForSeoDocument, variables: variables }
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
export const GetProposalDetailsForSeoDocument = gql`
    query getProposalDetailsForSEO($proposalId: ID!) {
  grantApplication(id: $proposalId) {
    id
    title: fields(where: {field_ends_with: "projectName"}) {
      values {
        value
      }
    }
    grant {
      id
      title
      workspace {
        id
        logoIpfsHash
      }
    }
  }
}
    `;

/**
 * __useGetProposalDetailsForSeoQuery__
 *
 * To run a query within a React component, call `useGetProposalDetailsForSeoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalDetailsForSeoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalDetailsForSeoQuery({
 *   variables: {
 *      proposalId: // value for 'proposalId'
 *   },
 * });
 */
export function useGetProposalDetailsForSeoQuery(baseOptions: Apollo.QueryHookOptions<GetProposalDetailsForSeoQuery, GetProposalDetailsForSeoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProposalDetailsForSeoQuery, GetProposalDetailsForSeoQueryVariables>(GetProposalDetailsForSeoDocument, options);
      }
export function useGetProposalDetailsForSeoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalDetailsForSeoQuery, GetProposalDetailsForSeoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProposalDetailsForSeoQuery, GetProposalDetailsForSeoQueryVariables>(GetProposalDetailsForSeoDocument, options);
        }
export type GetProposalDetailsForSeoQueryHookResult = ReturnType<typeof useGetProposalDetailsForSeoQuery>;
export type GetProposalDetailsForSeoLazyQueryHookResult = ReturnType<typeof useGetProposalDetailsForSeoLazyQuery>;
export type GetProposalDetailsForSeoQueryResult = Apollo.QueryResult<GetProposalDetailsForSeoQuery, GetProposalDetailsForSeoQueryVariables>;
export function refetchGetProposalDetailsForSeoQuery(variables: GetProposalDetailsForSeoQueryVariables) {
      return { query: GetProposalDetailsForSeoDocument, variables: variables }
    }
export const GetProposalsDocument = gql`
    query getProposals($first: Int, $skip: Int, $grantID: String!) {
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
 * __useGetProposalsQuery__
 *
 * To run a query within a React component, call `useGetProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      grantID: // value for 'grantID'
 *   },
 * });
 */
export function useGetProposalsQuery(baseOptions: Apollo.QueryHookOptions<GetProposalsQuery, GetProposalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProposalsQuery, GetProposalsQueryVariables>(GetProposalsDocument, options);
      }
export function useGetProposalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProposalsQuery, GetProposalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProposalsQuery, GetProposalsQueryVariables>(GetProposalsDocument, options);
        }
export type GetProposalsQueryHookResult = ReturnType<typeof useGetProposalsQuery>;
export type GetProposalsLazyQueryHookResult = ReturnType<typeof useGetProposalsLazyQuery>;
export type GetProposalsQueryResult = Apollo.QueryResult<GetProposalsQuery, GetProposalsQueryVariables>;
export function refetchGetProposalsQuery(variables: GetProposalsQueryVariables) {
      return { query: GetProposalsDocument, variables: variables }
    }
export const GetAllGrantsDocument = gql`
    query GetAllGrants($first: Int, $skip: Int, $searchString: String!) {
  grants(
    first: $first
    skip: $skip
    orderBy: createdAtS
    orderDirection: desc
    where: {workspace_: {isVisible: true}, title_contains: $searchString}
  ) {
    id
    title
    applications(first: 1) {
      id
      applicantId
      state
    }
    acceptingApplications
    fundTransfers {
      amount
      type
      tokenUSDValue
      asset
      tokenName
    }
    workspace {
      id
      title
      isVisible
      logoIpfsHash
      supportedNetworks
      members(first: 1) {
        id
        actorId
        accessLevel
      }
      safe {
        chainId
        address
      }
    }
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
    deadlineS
    deadline
    numberOfApplications
    numberOfApplicationsSelected
    numberOfApplicationsPending
    createdAtS
    updatedAtS
    totalGrantFundingDisbursedUSD
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
 *      searchString: // value for 'searchString'
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
export const GetAllGrantsForMemberDocument = gql`
    query getAllGrantsForMember($first: Int, $skip: Int, $workspaces: [String!]!, $supportedNetwork: [SupportedNetwork!]!, $actorId: Bytes!) {
  grants(
    where: {workspace_in: $workspaces, workspace_: {supportedNetworks: $supportedNetwork}}
    first: $first
    skip: $skip
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    title
    applications(where: {applicantId: $actorId}) {
      id
      applicantId
      state
    }
    acceptingApplications
    fundTransfers {
      amount
      type
      tokenUSDValue
      asset
      tokenName
    }
    workspace {
      id
      title
      isVisible
      logoIpfsHash
      supportedNetworks
      members(where: {actorId: $actorId}) {
        id
        actorId
        accessLevel
      }
      safe {
        chainId
        address
      }
    }
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
    deadlineS
    deadline
    numberOfApplications
    numberOfApplicationsSelected
    numberOfApplicationsPending
    createdAtS
    updatedAtS
    totalGrantFundingDisbursedUSD
  }
}
    `;

/**
 * __useGetAllGrantsForMemberQuery__
 *
 * To run a query within a React component, call `useGetAllGrantsForMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGrantsForMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGrantsForMemberQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      workspaces: // value for 'workspaces'
 *      supportedNetwork: // value for 'supportedNetwork'
 *      actorId: // value for 'actorId'
 *   },
 * });
 */
export function useGetAllGrantsForMemberQuery(baseOptions: Apollo.QueryHookOptions<GetAllGrantsForMemberQuery, GetAllGrantsForMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGrantsForMemberQuery, GetAllGrantsForMemberQueryVariables>(GetAllGrantsForMemberDocument, options);
      }
export function useGetAllGrantsForMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGrantsForMemberQuery, GetAllGrantsForMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGrantsForMemberQuery, GetAllGrantsForMemberQueryVariables>(GetAllGrantsForMemberDocument, options);
        }
export type GetAllGrantsForMemberQueryHookResult = ReturnType<typeof useGetAllGrantsForMemberQuery>;
export type GetAllGrantsForMemberLazyQueryHookResult = ReturnType<typeof useGetAllGrantsForMemberLazyQuery>;
export type GetAllGrantsForMemberQueryResult = Apollo.QueryResult<GetAllGrantsForMemberQuery, GetAllGrantsForMemberQueryVariables>;
export function refetchGetAllGrantsForMemberQuery(variables: GetAllGrantsForMemberQueryVariables) {
      return { query: GetAllGrantsForMemberDocument, variables: variables }
    }
export const GetGrantProgramDetailsDocument = gql`
    query getGrantProgramDetails($workspaceID: String!) {
  grantProgram: grants(
    where: {workspace: $workspaceID}
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    title
    workspace {
      id
      title
    }
  }
}
    `;

/**
 * __useGetGrantProgramDetailsQuery__
 *
 * To run a query within a React component, call `useGetGrantProgramDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantProgramDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantProgramDetailsQuery({
 *   variables: {
 *      workspaceID: // value for 'workspaceID'
 *   },
 * });
 */
export function useGetGrantProgramDetailsQuery(baseOptions: Apollo.QueryHookOptions<GetGrantProgramDetailsQuery, GetGrantProgramDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantProgramDetailsQuery, GetGrantProgramDetailsQueryVariables>(GetGrantProgramDetailsDocument, options);
      }
export function useGetGrantProgramDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantProgramDetailsQuery, GetGrantProgramDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantProgramDetailsQuery, GetGrantProgramDetailsQueryVariables>(GetGrantProgramDetailsDocument, options);
        }
export type GetGrantProgramDetailsQueryHookResult = ReturnType<typeof useGetGrantProgramDetailsQuery>;
export type GetGrantProgramDetailsLazyQueryHookResult = ReturnType<typeof useGetGrantProgramDetailsLazyQuery>;
export type GetGrantProgramDetailsQueryResult = Apollo.QueryResult<GetGrantProgramDetailsQuery, GetGrantProgramDetailsQueryVariables>;
export function refetchGetGrantProgramDetailsQuery(variables: GetGrantProgramDetailsQueryVariables) {
      return { query: GetGrantProgramDetailsDocument, variables: variables }
    }
export const GetSectionGrantsDocument = gql`
    query getSectionGrants {
  sections {
    grants(orderBy: numberOfApplications, orderDirection: desc) {
      id
      title
      applications(
        where: {state: approved}
        orderBy: updatedAtS
        orderDirection: desc
      ) {
        id
        applicantId
        state
        createdAtS
        updatedAtS
        milestones {
          id
          amount
        }
        name: fields(where: {field_contains: "projectName"}) {
          values {
            value
          }
        }
        author: fields(where: {field_contains: "applicantName"}) {
          values {
            value
          }
        }
        grant {
          id
          title
          workspace {
            logoIpfsHash
            supportedNetworks
          }
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
      acceptingApplications
      fundTransfers {
        amount
        type
        tokenUSDValue
        asset
        tokenName
      }
      workspace {
        id
        title
        isVisible
        logoIpfsHash
        supportedNetworks
        safe {
          chainId
          address
        }
      }
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
      deadlineS
      deadline
      numberOfApplications
      numberOfApplicationsSelected
      numberOfApplicationsPending
      createdAtS
      updatedAtS
      totalGrantFundingDisbursedUSD
    }
    sectionName
    sectionLogoIpfsHash
    id
  }
}
    `;

/**
 * __useGetSectionGrantsQuery__
 *
 * To run a query within a React component, call `useGetSectionGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSectionGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSectionGrantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSectionGrantsQuery(baseOptions?: Apollo.QueryHookOptions<GetSectionGrantsQuery, GetSectionGrantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSectionGrantsQuery, GetSectionGrantsQueryVariables>(GetSectionGrantsDocument, options);
      }
export function useGetSectionGrantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSectionGrantsQuery, GetSectionGrantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSectionGrantsQuery, GetSectionGrantsQueryVariables>(GetSectionGrantsDocument, options);
        }
export type GetSectionGrantsQueryHookResult = ReturnType<typeof useGetSectionGrantsQuery>;
export type GetSectionGrantsLazyQueryHookResult = ReturnType<typeof useGetSectionGrantsLazyQuery>;
export type GetSectionGrantsQueryResult = Apollo.QueryResult<GetSectionGrantsQuery, GetSectionGrantsQueryVariables>;
export function refetchGetSectionGrantsQuery(variables?: GetSectionGrantsQueryVariables) {
      return { query: GetSectionGrantsDocument, variables: variables }
    }
export const GetWorkspacesAndBuilderGrantsDocument = gql`
    query getWorkspacesAndBuilderGrants($first: Int, $skip: Int, $actorId: Bytes!) {
  workspaceMembers(
    where: {actorId: $actorId, workspace_: {grants_not: []}}
    orderBy: addedAt
    orderDirection: desc
    first: $first
    skip: $skip
    subgraphError: allow
  ) {
    id
    accessLevel
    enabled
    workspace {
      id
      title
      supportedNetworks
      grants
    }
  }
  grants(
    where: {applications_: {applicantId: $actorId}}
    first: $first
    skip: $skip
    orderBy: createdAtS
    orderDirection: desc
  ) {
    id
    title
    applications(where: {applicantId: $actorId}) {
      id
      applicantId
      state
    }
    acceptingApplications
    fundTransfers {
      amount
      type
      tokenUSDValue
      asset
      tokenName
    }
    workspace {
      id
      title
      isVisible
      logoIpfsHash
      supportedNetworks
      members(first: 1) {
        id
        actorId
        accessLevel
      }
      safe {
        chainId
        address
      }
    }
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
    deadlineS
    deadline
    numberOfApplications
    numberOfApplicationsSelected
    numberOfApplicationsPending
    createdAtS
    updatedAtS
    totalGrantFundingDisbursedUSD
  }
}
    `;

/**
 * __useGetWorkspacesAndBuilderGrantsQuery__
 *
 * To run a query within a React component, call `useGetWorkspacesAndBuilderGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspacesAndBuilderGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspacesAndBuilderGrantsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      skip: // value for 'skip'
 *      actorId: // value for 'actorId'
 *   },
 * });
 */
export function useGetWorkspacesAndBuilderGrantsQuery(baseOptions: Apollo.QueryHookOptions<GetWorkspacesAndBuilderGrantsQuery, GetWorkspacesAndBuilderGrantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWorkspacesAndBuilderGrantsQuery, GetWorkspacesAndBuilderGrantsQueryVariables>(GetWorkspacesAndBuilderGrantsDocument, options);
      }
export function useGetWorkspacesAndBuilderGrantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWorkspacesAndBuilderGrantsQuery, GetWorkspacesAndBuilderGrantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWorkspacesAndBuilderGrantsQuery, GetWorkspacesAndBuilderGrantsQueryVariables>(GetWorkspacesAndBuilderGrantsDocument, options);
        }
export type GetWorkspacesAndBuilderGrantsQueryHookResult = ReturnType<typeof useGetWorkspacesAndBuilderGrantsQuery>;
export type GetWorkspacesAndBuilderGrantsLazyQueryHookResult = ReturnType<typeof useGetWorkspacesAndBuilderGrantsLazyQuery>;
export type GetWorkspacesAndBuilderGrantsQueryResult = Apollo.QueryResult<GetWorkspacesAndBuilderGrantsQuery, GetWorkspacesAndBuilderGrantsQueryVariables>;
export function refetchGetWorkspacesAndBuilderGrantsQuery(variables: GetWorkspacesAndBuilderGrantsQueryVariables) {
      return { query: GetWorkspacesAndBuilderGrantsDocument, variables: variables }
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
      safe {
        address
        chainId
      }
    }
    fields {
      id
      title
      inputType
      possibleValues
      isPii
    }
    milestones
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
        safe {
          address
          chainId
        }
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
export const WalletAddressCheckerDocument = gql`
    query walletAddressChecker($grantId: String!, $walletAddress: Bytes!) {
  grantApplications(where: {grant: $grantId, walletAddress: $walletAddress}) {
    id
    walletAddress
    applicantId
  }
}
    `;

/**
 * __useWalletAddressCheckerQuery__
 *
 * To run a query within a React component, call `useWalletAddressCheckerQuery` and pass it any options that fit your needs.
 * When your component renders, `useWalletAddressCheckerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWalletAddressCheckerQuery({
 *   variables: {
 *      grantId: // value for 'grantId'
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useWalletAddressCheckerQuery(baseOptions: Apollo.QueryHookOptions<WalletAddressCheckerQuery, WalletAddressCheckerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WalletAddressCheckerQuery, WalletAddressCheckerQueryVariables>(WalletAddressCheckerDocument, options);
      }
export function useWalletAddressCheckerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WalletAddressCheckerQuery, WalletAddressCheckerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WalletAddressCheckerQuery, WalletAddressCheckerQueryVariables>(WalletAddressCheckerDocument, options);
        }
export type WalletAddressCheckerQueryHookResult = ReturnType<typeof useWalletAddressCheckerQuery>;
export type WalletAddressCheckerLazyQueryHookResult = ReturnType<typeof useWalletAddressCheckerLazyQuery>;
export type WalletAddressCheckerQueryResult = Apollo.QueryResult<WalletAddressCheckerQuery, WalletAddressCheckerQueryVariables>;
export function refetchWalletAddressCheckerQuery(variables: WalletAddressCheckerQueryVariables) {
      return { query: WalletAddressCheckerDocument, variables: variables }
    }
export const GetGrantDetailsByIdDocument = gql`
    query getGrantDetailsById($grantID: ID!) {
  grant(subgraphError: allow, id: $grantID) {
    id
    creatorId
    title
    summary
    details
    link
    docIpfsHash
    payoutType
    reviewType
    rubric {
      id
    }
    fields {
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
    startDate
    deadline
    funding
    acceptingApplications
    milestones
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
 * __useGetGrantDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetGrantDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGrantDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGrantDetailsByIdQuery({
 *   variables: {
 *      grantID: // value for 'grantID'
 *   },
 * });
 */
export function useGetGrantDetailsByIdQuery(baseOptions: Apollo.QueryHookOptions<GetGrantDetailsByIdQuery, GetGrantDetailsByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGrantDetailsByIdQuery, GetGrantDetailsByIdQueryVariables>(GetGrantDetailsByIdDocument, options);
      }
export function useGetGrantDetailsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGrantDetailsByIdQuery, GetGrantDetailsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGrantDetailsByIdQuery, GetGrantDetailsByIdQueryVariables>(GetGrantDetailsByIdDocument, options);
        }
export type GetGrantDetailsByIdQueryHookResult = ReturnType<typeof useGetGrantDetailsByIdQuery>;
export type GetGrantDetailsByIdLazyQueryHookResult = ReturnType<typeof useGetGrantDetailsByIdLazyQuery>;
export type GetGrantDetailsByIdQueryResult = Apollo.QueryResult<GetGrantDetailsByIdQuery, GetGrantDetailsByIdQueryVariables>;
export function refetchGetGrantDetailsByIdQuery(variables: GetGrantDetailsByIdQueryVariables) {
      return { query: GetGrantDetailsByIdDocument, variables: variables }
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
export const GetWorkspaceMembersByWorkspaceIdDocument = gql`
    query getWorkspaceMembersByWorkspaceId($workspaceId: String!, $first: Int, $skip: Int) {
  workspaceMembers(
    where: {workspace: $workspaceId}
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
    email
    enabled
    pii {
      id
      data
    }
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