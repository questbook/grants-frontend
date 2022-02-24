/* eslint-disable no-underscore-dangle */
import { SupportedNetwork as SupportedValidatorNetwork } from '@questbook/service-validator-client/dist/api';
import { ethers } from 'ethers';
import { SupportedChainId } from 'src/constants/chains';
import { SupportedNetwork } from 'src/generated/graphql';
import { MinimalWorkspace } from 'src/types';

const isValidAddress = (address: string) => ethers.utils.isAddress(address);
const isValidEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
};

const getSupportedChainIdFromWorkspace = (workspace?: MinimalWorkspace) => {
  if (!workspace) {
    return undefined;
  }
  const chainId = workspace.supportedNetworks[0] as SupportedNetwork;
  if (chainId === SupportedNetwork.Chain_4) {
    return SupportedChainId.RINKEBY;
  }
  // @TODO: needs type for harmony
  // if (chainId === SupportedNetwork.Chain_80001) {
  //   return SupportedChainId.HARMONY_TESTNET_S0;
  // }
  return SupportedChainId.HARMONY_TESTNET_S0;
  // cannot return undefined ?
  // return undefined;
};

const getSupportedValidatorNetworkFromChainId = (chainId: SupportedChainId) => {
  if (chainId === SupportedChainId.RINKEBY) {
    return SupportedValidatorNetwork._4;
  }
  // @TODO: needs type for harmony
  // if (chainId === SupportedNetwork.Chain_80001) {
  //   return SupportedChainId.HARMONY_TESTNET_S0;
  // }
  return SupportedValidatorNetwork._4;
};

export {
  isValidAddress,
  isValidEmail,
  getSupportedChainIdFromWorkspace,
  getSupportedValidatorNetworkFromChainId,
};
