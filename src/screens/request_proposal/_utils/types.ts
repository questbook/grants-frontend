import { ApplicantDetailsFieldType } from 'src/types'

export type RFPFormContextType = {
    rfpData: RFPForm
    setRFPData: (data: RFPForm) => void
    rfpFormType: RFPFormType
    grantId: string
    workspaceId: string
    RFPEditFormData: RFPForm
    setRFPEditFormData: (data: RFPForm) => void
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
    fields: any
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