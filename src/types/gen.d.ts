/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type All =
  | GrantApplicationRequest
  | GrantUpdateRequest
  | GrantCreateRequest
  | RubricSetRequest
  | ReviewSetRequest
  | ApplicationMilestoneUpdate
  | Address
  | Amount;
export type OwnerID = string;
/**
 * The public encryption key associated with the account address
 */
export type PublicKey = string;
/**
 * @maxItems 100
 */
export type GrantApplicationFieldAnswer = GrantApplicationFieldAnswerItem[];
/**
 * JSON serialized object, encrypted with a specific user's public key
 */
export type PIIAnswer = string;
/**
 * Positive integer amount of currency. Is a string to allow bigint inputs
 */
export type Amount = string;
export type Address = string;

export interface GrantApplicationRequest {
  grantId: string
  applicantId: OwnerID
  applicantPublicKey?: PublicKey
  fields: GrantApplicationFieldAnswers
  pii?: PIIAnswers
  /**
   * @maxItems 100
   */
  milestones: GrantProposedMilestone[]
}
/**
 * Maps ID of the field to the answer by the applicant
 */
export interface GrantApplicationFieldAnswers {
  [k: string]: GrantApplicationFieldAnswer
}
export interface GrantApplicationFieldAnswerItem {
  value: string
}
/**
 * Map of encrypted information mapped by the wallet ID, whose public key was used to map the specific information
 */
export interface PIIAnswers {
  [k: string]: PIIAnswer
}
export interface GrantProposedMilestone {
  title: string
  amount: Amount
  [k: string]: unknown
}
export interface GrantUpdateRequest {
  title?: string
  /**
   * Start date for proposal acceptations
   */
  startDate?: string
  /**
   * Deadline for proposal submission
   */
  endDate?: string
  details?: string
  reward?: Amount
  payoutType?: 'in-one-go' | 'milestones'
  reviewType?: 'voting' | 'rubrics'
  creatorId?: OwnerID
  /**
   * the workspace the grant is from
   */
  workspaceId?: string
  fields?: GrantFieldMap
  /**
   * @minItems 1
   */
  grantManagers?: [Address, ...Address[]]
}
export interface GrantFieldMap {
  applicantName: GrantField
  applicantEmail: GrantField
  projectName: GrantField
  projectDetails: GrantField
  fundingBreakdown?: GrantField
  [k: string]: GrantField
}
export interface GrantField {
  /**
   * Human readable title of the field
   */
  title: string
  inputType: 'short-form' | 'long-form' | 'numeric' | 'array'
  /**
   * Constraint possible inputs for this field
   *
   * @maxItems 20
   */
  enum?:
    | []
    | [string]
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
    | [string, string, string, string, string]
    | [string, string, string, string, string, string]
    | [string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string, string, string, string]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]
  /**
   * Whether this field is PII (personally identifiable information) or not
   */
  pii?: boolean
}
export interface GrantCreateRequest {
  title: string
  /**
   * Start date for proposal acceptations
   */
  startDate: string
  /**
   * Deadline for proposal submission
   */
  endDate: string
  details: string
  /**
   * Link to sny external document
   */
  link?: string
  /**
   * IPFS hash of the document uploaded by grant admin
   */
  docIpfsHash?: string
  /**
   * Positive integer amount of currency. Is a string to allow bigint inputs
   */
  reward: string
  payoutType: 'in one go' | 'milestone'
  reviewType: 'voting' | 'rubric'
  creatorId: OwnerID
  /**
   * the workspace the grant is from
   */
  workspaceId: string
  fields: GrantFieldMap
  /**
   * @minItems 1
   */
  grantManagers?: [Address, ...Address[]]
}
export interface RubricSetRequest {
  rubric: Rubric
}
/**
 * Map of evaluation rubric ID to rubric data
 */
export interface Rubric {
  isPrivate: boolean
  rubric: {
    [k: string]: RubricItem
  }
  [k: string]: unknown
}
export interface RubricItem {
  title: string
  /**
   * Details about the evaluatation rubric
   */
  details?: string
  maximumPoints: number
}
export interface ReviewSetRequest {
  reviewer: Address
  reviewerPublicKey?: PublicKey
  publicReviewDataHash?: string
  /**
   * Encrypted review data. Map of the grant manager address => IPFS hash of the review encrypted with their public key
   */
  encryptedReview: {
    [k: string]: string
  }
  [k: string]: unknown
}
export interface ApplicationMilestoneUpdate {
  text: string
}
