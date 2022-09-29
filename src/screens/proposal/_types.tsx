import { ApplicationState, GetApplicationDetailsQuery } from 'src/generated/graphql'
import { ChainInfo, CustomField } from 'src/types'

export type Proposal = {
    id: string
    name: string
	applicantName: string
	applicantAddress: string
	applicantEmail: string
	createdAt: string
	updatedAt: string
	links: {link: string}[]
	details: string
	goals: string
	milestones: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>['milestones']
	fundingBreakdown: string
	teamMembers: string[]
	memberDetails: string[]
    customFields: CustomField[]
	token: ChainInfo['supportedCurrencies'][string]
    state: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>['state']
	feedbackDao: string
    grant: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>['grant']
}

export type ActionPanelType = {
    state: ApplicationState
	rejectionDate: string
	rejectionReason: string
	onSendFundClick: () => void
	onAcceptClick: () => void
	onRejectClick: () => void
}

export type MilestoneItemType = {
    milestone: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>['milestones'][number]
	disbursedMilestones: Exclude<GetApplicationDetailsQuery['grantApplication'], null | undefined>['grant']['fundTransfers']
	token: ChainInfo['supportedCurrencies'][string]
	proposalStatus: ApplicationState
	index: number
    onModalOpen: () => void
}

export type ActionItemType = {
	type: 'fund_sent' | 'feedback_dao' | 'feedback_dev'
	amount?: string
    feedback?: string
	time: number
}

export type UpdateApplicationStateData = { state: number, comment: string }
