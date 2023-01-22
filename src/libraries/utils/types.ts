import { ValidationApi } from '@questbook/service-validator-client'
import { Wallet } from 'ethers'
import SupportedChainId from 'src/generated/SupportedChainId'
import SubgraphClient from 'src/graphql/subgraph'
import { InviteInfo } from 'src/libraries/utils/invite'
import { MinimalWorkspace } from 'src/types'
import { BiconomyWalletClient } from 'src/types/gasless'

export type PIIForCommentType = {
  sender?: string
  message?: string
  timestamp?: number
  role?: string
  tag?: string
  pii?: { [key: string]: string }
};

export type ApiClientsContextType = {
  validatorApi: ValidationApi
  workspace?: MinimalWorkspace
  setWorkspace: (workspace: MinimalWorkspace) => void
  chainId: SupportedChainId
  subgraphClients: { [chainId: string]: SubgraphClient }
  inviteInfo: InviteInfo | undefined
  setInviteInfo: (inviteInfo: InviteInfo) => void
  isNewUser: boolean
  setIsNewUser: (isNewUser: boolean) => void
};

export type WebwalletContextType = {
  webwallet?: Wallet
  setWebwallet: (webwallet?: Wallet) => void

  network: SupportedChainId
  switchNetwork: (newNetwork?: SupportedChainId) => void

  scwAddress?: string
  setScwAddress: (scwAddress?: string) => void
  waitForScwAddress: Promise<string>

  nonce?: string
  setNonce: (nonce?: string) => void

  loadingNonce: boolean
  setLoadingNonce: (loadingNonce: boolean) => void
};

export type BiconomyContextType = {
    biconomyDaoObjs?: { [key: string]: any }
    setBiconomyDaoObjs: (biconomyDaoObjs: any) => void
    initiateBiconomy: (
      chainId: string,
    ) => Promise<InitiateBiconomyReturnType | undefined>
    loadingBiconomyMap: { [_: string]: boolean }
    biconomyWalletClients?: { [key: string]: BiconomyWalletClient }
    setBiconomyWalletClients: (biconomyWalletClients?: {
      [key: string]: BiconomyWalletClient
    }) => void
  };

export type InitiateBiconomyReturnType = {
  biconomyDaoObj: BiconomyContextType
  biconomyWalletClient: BiconomyWalletClient
};


