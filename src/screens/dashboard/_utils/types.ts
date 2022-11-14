import { GetGrantQuery } from 'src/generated/graphql'

export type DashboardContextType = {
    grant: GetGrantQuery['grant']
    setGrant: (grant: GetGrantQuery['grant']) => void
}