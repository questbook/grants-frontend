import SupportedChainId from 'src/generated/SupportedChainId'
import { ApplicantDetailsFieldType } from 'src/types'

export type RFPFormContextType = {
    rfpFormType: RFPFormType
    rfpData: RFPForm
    setRFPData: (data: RFPForm) => void
    grantId: string
    setGrantId: (id: string) => void
    workspaceId: string
    chainId: SupportedChainId
    executionType: RFPFormType | undefined
    setExecutionType: (type: RFPFormType | undefined) => void
}

export type RFPForm = {
    proposalName: string
    startDate: string
    endDate: string
    allApplicantDetails: ApplicantDetailsFieldType[] | undefined
    link: string
    doc: string
    reviewMechanism: string
    rubrics: string[]
    payoutMode: string
    amount: string
    milestones: string[]
}

export type GrantFields = {
    title: string
    startDate: string
    endDate: string
    fields: { [key: string]: ApplicantDetailsFieldType }
    link: string
    docIpfsHash: string
    payoutType: string
    reward: {
        asset: string
        committed: string
        token: {
            label: string
            address: string
            decimal: string
            iconHash: string
        }
    }
    creatorId: string
    workspaceId: string
    reviewType?: string
    milestones?: string[]
    grantManagers?: string[]
}

export type RubricType = { [key: number]: { title: string, details: string, maximumPoints: number } }

export type DropdownOption = {
    label: string
    value: string
    isDisabled?: boolean
}

export type RFPFormType = 'submit' | 'edit'

export type RubricsType = {
    [key: number]: { title: string, details: string, maximumPoints: number }
}