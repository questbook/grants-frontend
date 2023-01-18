import { GetAllGrantsForMemberQuery, GetAllGrantsQuery, GetWorkspacesAndBuilderGrantsQuery } from 'src/generated/graphql'
import { Roles } from 'src/types'

export type BuilderGrants = Exclude<GetWorkspacesAndBuilderGrantsQuery['grants'], null | undefined>
export type MemberGrants = Exclude<GetAllGrantsForMemberQuery['grants'], null | undefined>
export type AllGrants = Exclude<GetAllGrantsQuery['grants'], null | undefined>

export type GrantType = (BuilderGrants[number] | MemberGrants[number] | AllGrants[number]) & {role: Roles}

export type DiscoverContextType = {
    grantsForYou: GrantType[]
    grantsForAll: GrantType[]
}