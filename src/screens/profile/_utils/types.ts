export type BuilderProposals = {
    id: string
    name: { values: { value: string }[] }[]
    grant: {
        id: string
        title: string
        workspace: {
            logoIpfsHash: string
        }
    }
    state: 'approved' | 'rejected' | 'resubmit' | 'submitted' | 'open' | 'review' | 'cancelled'
    milestones: {
        id: string
        amount: string
        amountPaid: string
    }[]
}

export type ProfileContextType = {
    proposals: BuilderProposals[] | undefined
    isLoading: boolean
    builder: BuilderInfoType | undefined
    refresh: (refresh: boolean) => void
}


export type BuilderInfoType = {
    _id: string
    telegram: string
    github: string
    twitter: string
    username: string
    imageURL: string
    proofs: string[]
}

export type GrantStatsType = {
    totalProposals: number
    totalProposalsAccepted: number
    fundsAllocated: number
    fundsPaidOut: number
    milestones: number
    milestonesCompleted: number
}


export type ProfileDataType = {
	address: string
}