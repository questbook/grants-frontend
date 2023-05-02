/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type All =
  | WorkspaceCreateRequest
  | WorkspaceUpdateRequest
  | WorkspaceMemberUpdate
  | GrantApplicationRequest
  | GrantUpdateRequest
  | GrantCreateRequest
  | RubricSetRequest
  | ReviewSetRequest
  | ApplicationMilestoneUpdate
  | string
  | GrantApplicationUpdate
  | PrivateCommentAddRequest;
/**
 * @maxItems 100
 */
export type GrantApplicationFieldAnswer = GrantApplicationFieldAnswerItem[];

export interface WorkspaceCreateRequest {
  title: string;
  bio?: string;
  about: string;
  partners?: Partner[];
  /**
   * IPFS hash of the logo of the workspace
   */
  logoIpfsHash: string;
  /**
   * IPFS hash of the cover of the workspace
   */
  coverImageIpfsHash?: string;
  creatorId: string;
  /**
   * The public encryption key associated with the account address
   */
  creatorPublicKey?: string;
  /**
   * @maxItems 25
   */
  supportedNetworks: ("42220" | "5" | "10" | "137")[];
  /**
   * @maxItems 10
   */
  socials: SocialItem[];
}
export interface Partner {
  /**
   * Partner name
   */
  name: string;
  /**
   * Partner industry
   */
  industry: string;
  /**
   * Partner website
   */
  website?: string;
  /**
   * IPFS hash of partner picture
   */
  partnerImageHash?: string;
  [k: string]: unknown;
}
export interface SocialItem {
  name: string;
  value: string;
}
export interface WorkspaceUpdateRequest {
  title?: string;
  bio?: string;
  about?: string;
  /**
   * IPFS hash of the logo of the workspace
   */
  logoIpfsHash?: string;
  partners?: Partner[];
  /**
   * IPFS hash of the cover of the workspace
   */
  coverImageIpfsHash?: string;
  /**
   * @maxItems 10
   */
  socials?: SocialItem[];
  /**
   * The public encryption key associated with the account address
   */
  publicKey?: string;
  tokens?: Token[];
}
export interface Token {
  /**
   * Token Symbol to be displayed
   */
  label: string;
  address: string;
  /**
   * The chain the token is on, leave undefined to denote same chain
   */
  chainId?: number;
  /**
   * Decimal for token
   */
  decimal: string;
  /**
   * IPFS hash of token icon
   */
  iconHash: string;
  [k: string]: unknown;
}
export interface WorkspaceMemberUpdate {
  pii?: PIIAnswers;
  [k: string]: unknown;
}
/**
 * Map of encrypted information mapped by the wallet ID, whose public key was used to map the specific information
 */
export interface PIIAnswers {
  /**
   * JSON serialized object, encrypted with a specific user's public key
   */
  [k: string]: string;
}
export interface GrantApplicationRequest {
  grantId: string;
  applicantId: string;
  /**
   * The public encryption key associated with the account address
   */
  applicantPublicKey?: string;
  fields: GrantApplicationFieldAnswers;
  pii?: PIIAnswers;
  /**
   * @maxItems 100
   */
  milestones: GrantProposedMilestone[];
}
/**
 * Maps ID of the field to the answer by the applicant
 */
export interface GrantApplicationFieldAnswers {
  [k: string]: GrantApplicationFieldAnswer;
}
export interface GrantApplicationFieldAnswerItem {
  value: string;
}
export interface GrantProposedMilestone {
  title: string;
  /**
   * Positive integer amount of currency. Is a string to allow bigint inputs
   */
  amount: string;
  [k: string]: unknown;
}
export interface GrantUpdateRequest {
  title?: string;
  /**
   * Start date for proposal acceptations
   */
  startDate?: string;
  /**
   * Deadline for proposal submission
   */
  endDate?: string;
  details?: string;
  /**
   * Link to any external document
   */
  link?: string;
  /**
   * IPFS hash of the document uploaded by grant admin
   */
  docIpfsHash?: string;
  reward?: GrantReward;
  payoutType?: "in_one_go" | "milestones";
  reviewType?: "voting" | "rubrics";
  creatorId?: string;
  /**
   * the workspace the grant is from
   */
  workspaceId?: string;
  fields?: GrantFieldMap;
  /**
   * @maxItems 20
   */
  milestones?: string[];
  /**
   * @minItems 1
   */
  grantManagers?: [string, ...string[]];
}
/**
 * Grant reward amount in USD
 */
export interface GrantReward {
  /**
   * Positive integer amount of currency. Is a string to allow bigint inputs
   */
  committed: string;
  asset: string;
  token?: Token;
}
export interface GrantFieldMap {
  applicantName: GrantField;
  applicantEmail: GrantField;
  projectName: GrantField;
  projectDetails: GrantField;
  fundingBreakdown?: GrantField;
  [k: string]: GrantField;
}
export interface GrantField {
  /**
   * field id if any
   */
  id?: string;
  /**
   * Human readable title of the field
   */
  title: string;
  /**
   * Denotes if the field is required
   */
  required?: boolean;
  inputType: "short-form" | "long-form" | "numeric" | "array";
  /**
   * Constraint possible inputs for this field
   *
   * @maxItems 20
   */
  enum?: string[];
  /**
   * Whether this field is PII (personally identifiable information) or not
   */
  pii?: boolean;
}
export interface GrantCreateRequest {
  title: string;
  summary?: string;
  /**
   * Start date for proposal acceptations
   */
  startDate?: string;
  /**
   * Deadline for proposal submission
   */
  endDate?: string;
  /**
   * same as endDate property. Introduced this field for backward compatibility
   */
  deadline?: string;
  details?: string;
  /**
   * Link to any external document
   */
  link?: string;
  /**
   * IPFS hash of the document uploaded by grant admin
   */
  docIpfsHash?: string;
  reward: GrantReward1;
  payoutType?: "in_one_go" | "milestones";
  reviewType?: "voting" | "rubrics";
  creatorId: string;
  /**
   * the workspace the grant is from
   */
  workspaceId: string;
  fields: GrantFieldMap;
  /**
   * @maxItems 20
   */
  milestones?: string[];
  /**
   * @minItems 1
   */
  grantManagers?: [string, ...string[]];
}
/**
 * Grant reward amount in USD
 */
export interface GrantReward1 {
  /**
   * Positive integer amount of currency. Is a string to allow bigint inputs
   */
  committed: string;
  asset: string;
  token?: Token;
}
export interface RubricSetRequest {
  reviewType?: "voting" | "rubrics";
  rubric: Rubric;
}
/**
 * Map of evaluation rubric ID to rubric data
 */
export interface Rubric {
  isPrivate: boolean;
  rubric: {
    [k: string]: RubricItem;
  };
  [k: string]: unknown;
}
export interface RubricItem {
  title: string;
  /**
   * Details about the evaluatation rubric
   */
  details?: string;
  maximumPoints: number;
}
export interface ReviewSetRequest {
  reviewer: string;
  /**
   * The public encryption key associated with the account address
   */
  reviewerPublicKey?: string;
  publicReviewDataHash?: string;
  /**
   * Encrypted review data. Map of the grant manager address => IPFS hash of the review encrypted with their public key
   */
  encryptedReview: {
    [k: string]: string;
  };
  [k: string]: unknown;
}
export interface ApplicationMilestoneUpdate {
  text: string;
}
export interface GrantApplicationUpdate {
  fields?: GrantApplicationFieldAnswers;
  pii?: PIIAnswers;
  /**
   * @maxItems 100
   */
  milestones?: GrantProposedMilestone[];
  feedback?: string;
  /**
   * The public encryption key associated with the account address
   */
  applicantPublicKey?: string;
}
export interface PrivateCommentAddRequest {
  pii: PIIAnswers;
  [k: string]: unknown;
}
