import { SupportedChainId } from './chains';

type AddressMap = { [chainId: number]: string };

export const WORKSPACE_REGISTRY_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON_MAINNET]: '0xafEEbeB8B2E2d9f649d292228514a70677e83117',
  // [SupportedChainId.POLYGON_MAINNET]: '0xeDb10f503E128e9167a31c612aDeF4E098Da717e',
};

export const APPLICATION_REGISTRY_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON_MAINNET]: '0x921304fa17382FC009e2DDf286857a1b1ae5Db63',
  // [SupportedChainId.POLYGON_MAINNET]: '0x2dB223158288B2299480aF577eDF30D5a533F137',
};

export const GRANT_FACTORY_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON_MAINNET]: '0x89497A254e886C229C370822b5fc2153B53A07Eb',
  // [SupportedChainId.POLYGON_MAINNET]: '0x6D0f81BDA11995f25921aAd5B43359630E65Ca96',
};
