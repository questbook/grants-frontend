import { GetAllGrantsForMemberQuery, GetAllGrantsQuery, GetGrantProgramDetailsQuery, GetSectionGrantsQuery, GetWorkspacesAndBuilderGrantsQuery } from 'src/generated/graphql'
import { Roles } from 'src/types'

export type WorkspaceMemberType = Exclude<GetWorkspacesAndBuilderGrantsQuery['workspaceMembers'], null | undefined>
export type BuilderGrants = Exclude<GetWorkspacesAndBuilderGrantsQuery['grants'], null | undefined>
export type MemberGrants = Exclude<GetAllGrantsForMemberQuery['grants'], null | undefined>
export type AllGrants = Exclude<GetAllGrantsQuery['grants'], null | undefined>
export type Section = Exclude<GetSectionGrantsQuery['sections'][0], null|undefined>

export type SectionGrants = {[key: string]: Section}[]
export type RecentProposals = Exclude<GetSectionGrantsQuery['sections'][0], null|undefined>['grants'][number]['applications']

export type GrantType = (BuilderGrants[number] | MemberGrants[number] | AllGrants[number] | Section['grants'][number]) & {role: Roles} & {link?: string}

export type GrantProgramType = Exclude<GetGrantProgramDetailsQuery['grantProgram'], null | undefined>[number]

export type DiscoverContextType = {
    grantsForYou: GrantType[]
    grantsForAll: GrantType[]
    grantProgram: GrantProgramType | undefined
    sectionGrants: SectionGrants | undefined
    recentProposals: RecentProposals | undefined
    search: string
    setSearch: (search: string) => void
    isLoading: boolean
    safeBalances: {[key: string]: number}
    stats: StatsType
    buildersModal: boolean
    setBuildersModal: (value: boolean) => void
    isBuilder: boolean
}

export type FundTransfer = {
    amount: number
    asset: string
    type: string
    tokenUSDValue: number
    tokenName: string
    grant: {
        id: string
    }
}

export type StatsType = {
    builders: number
    proposals: number
    funds: number
}