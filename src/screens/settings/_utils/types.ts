import { GetWorkspaceDetailsQuery, GetWorkspaceMembersByWorkspaceIdQuery } from 'src/generated/graphql'
import { MinimalWorkspace } from 'src/types'

export type SettingsFormContextType = {
    workspace: MinimalWorkspace
    workspaceMembers: WorkspaceMembers
    grantProgramData: GrantProgramForm
    setGrantProgramData: (data: GrantProgramForm) => void
    safeURL: string
    refreshWorkspace: (refresh: boolean) => void
    showAdminTable: boolean
    setShowAdminTable: (show: boolean) => void
    adminTable: adminTable
    pendingTx: FundTransfer[]
    setPendingTx: (tx: FundTransfer[]) => void
    showPendingTx: boolean
    setShowPendingTx: (show: boolean) => void
}

export type Workspace = GetWorkspaceDetailsQuery['workspace']
export type WorkspaceMembers = GetWorkspaceMembersByWorkspaceIdQuery['workspaceMembers']
export type FundTransfer = { application: { id: string, name: { values: { value: string }[] }[] }, status: string, transactionHash: string, amount: number, milestone: { id: string, title: string } }
export type SocialLinks = {
    name: string
    value: string
}

export type adminTable = {
    id: string
    name: { values: { value: string }[] }[]
    state: string
    synapsStatus: string
    helloSignStatus: string
    milestones: { id: string, title: string, amount: number, amountPaid: number, milestoneState: string }[]
    notes: string
    fundTransfer: { application: { id: string }, status: string, amount: number, milestone: { id: string }, transactionHash: string }[]
    updatedAtS: number
} []


export type GrantProgramForm = {
    title: string
    about: string
    bio: string
    socials?: SocialLinks[]
    synapsId?: string
    docuSign?: string
    logoIpfsHash: string
}