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
  state:
    | 'approved'
    | 'rejected'
    | 'resubmit'
    | 'submitted'
    | 'open'
    | 'review'
    | 'cancelled'
  milestones: {
    id: string
    amount: string
    amountPaid: string
  }[]
};

export type ProfileContextType = {
  proposals: BuilderProposals[] | undefined
  isLoading: boolean
  builder: BuilderInfoType | undefined
  refresh: (refresh: boolean) => void
  isQrModalOpen: boolean
  setIsQrModalOpen: (isOpen: boolean) => void
  providerName: string
  setProviderName: (providerName: string) => void
  qrCode: string
  setQrCode: (qrCode: string) => void
};

export type Proof = {
  identifier: string
  claimData: object
  witnesses: string[]
  signatures: string[]
  extractedParameters: { badge_count?: string, username?: string }
};

export type BuilderInfoType = {
  _id: string
  address: string
  telegram: string
  github: Proof
  twitter: Proof
  username: string
  imageURL: string
  arbitrum: Proof
  compound: Proof
  axelar: Proof
  polygon: Proof
  ens: Proof
};

export type GrantStatsType = {
  totalProposals: number
  totalProposalsAccepted: number
  fundsAllocated: number
  fundsPaidOut: number
  milestones: number
  milestonesCompleted: number
};

export type ProfileDataType = {
  address: string
};
