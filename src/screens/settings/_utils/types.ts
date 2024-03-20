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
}

export type Workspace = GetWorkspaceDetailsQuery['workspace']
export type WorkspaceMembers = GetWorkspaceMembersByWorkspaceIdQuery['workspaceMembers']

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
    fundTransfer: { application: { id: string }, status: string, amount: number, milestone: { id: string } }[]
} []


export type GrantProgramForm = {
    title: string
    about: string
    bio: string
    socials?: SocialLinks[]
    synapsId?: string
    logoIpfsHash: string
}