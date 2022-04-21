import { SupportedChainId } from './chains';

type AddressMap = { [chainId: number]: string };

export const WORKSPACE_REGISTRY_ADDRESS: AddressMap = {
  // [SupportedChainId.POLYGON_MAINNET]: '0xafEEbeB8B2E2d9f649d292228514a70677e83117',
  [SupportedChainId.POLYGON_MAINNET]: '0x168A72b08FCFF48192E0B1A27486f4394a4F86e1',
};

export const APPLICATION_REGISTRY_ADDRESS: AddressMap = {
  // [SupportedChainId.POLYGON_MAINNET]: '0x921304fa17382FC009e2DDf286857a1b1ae5Db63',
  [SupportedChainId.POLYGON_MAINNET]: '0xE9d6c045232b7f4C07C151f368E747EBE46209E4',
};

export const APPLICATION_REVIEW_REGISTRY_ADDRESS: AddressMap = {
  // [SupportedChainId.POLYGON_MAINNET]: '0x921304fa17382FC009e2DDf286857a1b1ae5Db63',
  [SupportedChainId.POLYGON_MAINNET]: '0xdC5EbC9130a2e7Ad776E3503fa6Dcf16D80ca915',
};

export const GRANT_FACTORY_ADDRESS: AddressMap = {
  // [SupportedChainId.POLYGON_MAINNET]: '0x89497A254e886C229C370822b5fc2153B53A07Eb',
  [SupportedChainId.POLYGON_MAINNET]: '0xC6b6356FBdcf6CC6EA4Cb90Cd11B7E3c5848F312',
};
