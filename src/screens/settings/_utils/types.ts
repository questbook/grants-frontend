import { GetWorkspaceDetailsQuery, GetWorkspaceMembersByWorkspaceIdQuery } from 'src/generated/graphql'
import { Proposals } from 'src/screens/dashboard/_utils/types'
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
    listAllGrants: boolean
    setListAllGrants: (list: boolean) => void
    allGrantsAdminTable: adminTable
    setProposals: (proposals: Proposals) => void
    setSelectedProposals: (proposals: Set<string>) => void
    isFundingMethodModalOpen: boolean
    setIsFundingMethodModalOpen: (open: boolean) => void
    proposals: Proposals
    selectedProposals: Set<string>
}

export type Workspace = GetWorkspaceDetailsQuery['workspace']
export type WorkspaceMembers = GetWorkspaceMembersByWorkspaceIdQuery['workspaceMembers']

export type SocialLinks = {
    name: string
    value: string
}

export type adminTable = {
    grantId?: string
    grantTitle?: string
    id: string
    name: { values: { value: string }[] }[]
    author: { values: { value: string }[] }[]
    state: string
    synapsStatus: string
    synapsId: string
    synapsType: string
    synapsCountry: string
    synapsName: string
    helloSignStatus: string
    helloSignId: string
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
    docuSign?: string
    logoIpfsHash: string
}