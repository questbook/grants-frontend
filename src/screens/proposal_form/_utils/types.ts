import { EditorState } from 'draft-js'
import { GrantDetailsQuery, GrantField } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'

export type ProposalFormContextType = {
    grant: Grant
    chainId: SupportedChainId
    form: Form
    setForm: (form: Form) => void
    error?: string
}

export type Grant = GrantDetailsQuery['grant']

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