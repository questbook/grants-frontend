import { GetWorkspaceDetailsQuery, GetWorkspaceMembersByWorkspaceIdQuery, GetWorkspaceMembersQuery } from 'src/generated/graphql'

export type SettingsFormContextType = {
    workspace: Workspace
    workspaceMembers: WorkspaceMembers
}

export type Workspace = GetWorkspaceDetailsQuery['workspace']
export type WorkspaceMembers = GetWorkspaceMembersByWorkspaceIdQuery['workspaceMembers']