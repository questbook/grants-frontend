import { GetWorkspaceDetailsQuery, GetWorkspaceMembersByWorkspaceIdQuery } from 'src/generated/graphql'
import { MinimalWorkspace } from 'src/types'

export type SettingsFormContextType = {
    workspace: MinimalWorkspace
    workspaceMembers: WorkspaceMembers
    grantProgramData: GrantProgramForm
    setGrantProgramData: (data: GrantProgramForm) => void
    safeURL: string
    refreshWorkspace: (refresh: boolean) => void
}

export type Workspace = GetWorkspaceDetailsQuery['workspace']
export type WorkspaceMembers = GetWorkspaceMembersByWorkspaceIdQuery['workspaceMembers']

export type SocialLinks = {
    name: string
    value: string
}

export type GrantProgramForm = {
    title: string
    about: string
    bio: string
    socials?: SocialLinks[]
    logoIpfsHash: string
}