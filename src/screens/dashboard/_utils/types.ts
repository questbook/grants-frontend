import { GetGrantQuery, GetGrantsQuery } from 'src/generated/graphql'

export type DashboardContextType = {
    selectedGrant: GetGrantQuery['grant']
    setSelectedGrant: (grant: GetGrantQuery['grant']) => void
    grants: GetGrantsQuery['grants']
    selectedGrantIndex: number | undefined
    setSelectedGrantIndex: (index: number) => void
}