import { EditorState } from 'draft-js'
import { GrantDetailsQuery, GrantField, ProposalDetailsQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'

export type FormType = 'submit' | 'resubmit'

export type ProposalFormContextType = {
    grant: Grant
    proposal: Proposal
    chainId: SupportedChainId
    form: Form
    setForm: (form: Form) => void
    type: FormType
    error?: string
}

export type Grant = GrantDetailsQuery['grant']
export type Proposal = ProposalDetailsQuery['grantApplication']

export type FormField = {
    id: string
    value: string
} & GrantField

export type MilestoneType = {
    index: number
    title: string
    amount: number
}

export type Form = {
    fields: FormField[]
    milestones: MilestoneType[]
    members: string[]
    details: EditorState
}