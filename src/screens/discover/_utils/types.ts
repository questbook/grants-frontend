import { GetAllGrantsForMemberQuery, GetAllGrantsQuery, GetGrantProgramDetailsQuery, GetWorkspacesAndBuilderGrantsQuery } from 'src/generated/graphql'
import { Roles } from 'src/types'

export type WorkspaceMemberType = Exclude<GetWorkspacesAndBuilderGrantsQuery['workspaceMembers'], null | undefined>
export type BuilderGrants = Exclude<GetWorkspacesAndBuilderGrantsQuery['grants'], null | undefined>
export type MemberGrants = Exclude<GetAllGrantsForMemberQuery['grants'], null | undefined>
export type AllGrants = Exclude<GetAllGrantsQuery['grants'], null | undefined>

export type GrantType = (BuilderGrants[number] | MemberGrants[number] | AllGrants[number]) & {role: Roles}

export type GrantProgramType = Exclude<GetGrantProgramDetailsQuery['grantProgram'], null | undefined>[number]

export type DiscoverContextType = {
    grantsForYou: GrantType[]
    grantsForAll: GrantType[]
    grantProgram: GrantProgramType | undefined
    search: string
    setSearch: (search: string) => void
}