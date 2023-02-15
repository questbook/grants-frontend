/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ApplicationRegistryAbi,
  ApplicationRegistryAbiInterface,
} from "../ApplicationRegistryAbi";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint96",
        name: "applicationId",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newApplicantAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "ApplicationMigrate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint96",
        name: "applicationId",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "address",
        name: "grant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadataHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "milestoneCount",
        type: "uint48",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "ApplicationSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint96",
        name: "applicationId",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "address",
        name: "grant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadataHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "milestoneCount",
        type: "uint48",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "walletAddress",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "ApplicationSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint96",
        name: "applicationId",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "metadataHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "enum ApplicationRegistry.ApplicationState",
        name: "state",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint48",
        name: "milestoneCount",
        type: "uint48",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "ApplicationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint96",
        name: "_id",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "uint96",
        name: "_milestoneId",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "enum ApplicationRegistry.MilestoneState",
        name: "_state",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_metadataHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "MilestoneUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint96",
        name: "applicationId",
        type: "uint96",
      },
      {
        indexed: false,
        internalType: "address",
        name: "grant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "walletAddress",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "WalletAddressUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "applicationCount",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
      {
        internalType: "uint48",
        name: "",
        type: "uint48",
      },
    ],
    name: "applicationMilestones",
    outputs: [
      {
        internalType: "enum ApplicationRegistry.MilestoneState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "applicationReviewReg",
    outputs: [
      {
        internalType: "contract IApplicationReviewRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    name: "applications",
    outputs: [
      {
        internalType: "uint96",
        name: "id",
        type: "uint96",
      },
      {
        internalType: "uint96",
        name: "workspaceId",
        type: "uint96",
      },
      {
        internalType: "address",
        name: "grant",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint48",
        name: "milestoneCount",
        type: "uint48",
      },
      {
        internalType: "uint48",
        name: "milestonesDone",
        type: "uint48",
      },
      {
        internalType: "string",
        name: "metadataHash",
        type: "string",
      },
      {
        internalType: "enum ApplicationRegistry.ApplicationState",
        name: "state",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
      {
        internalType: "uint48",
        name: "_milestoneId",
        type: "uint48",
      },
      {
        internalType: "uint96",
        name: "_workspaceId",
        type: "uint96",
      },
      {
        internalType: "string",
        name: "_reasonMetadataHash",
        type: "string",
      },
    ],
    name: "approveMilestone",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96[]",
        name: "_applicationIds",
        type: "uint96[]",
      },
      {
        internalType: "enum ApplicationRegistry.ApplicationState[]",
        name: "_applicationStates",
        type: "uint8[]",
      },
      {
        internalType: "uint96",
        name: "_workspaceId",
        type: "uint96",
      },
      {
        internalType: "string[]",
        name: "feedbackHashes",
        type: "string[]",
      },
    ],
    name: "batchUpdateApplicationState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
      {
        internalType: "uint96",
        name: "_workspaceId",
        type: "uint96",
      },
      {
        internalType: "string",
        name: "_reasonMetadataHash",
        type: "string",
      },
    ],
    name: "completeApplication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "eoaToScw",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
    ],
    name: "getApplicationGrant",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
    ],
    name: "getApplicationOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
    ],
    name: "getApplicationWorkspace",
    outputs: [
      {
        internalType: "uint96",
        name: "",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
    ],
    name: "isSubmittedApplication",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "fromWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "toWallet",
        type: "address",
      },
    ],
    name: "migrateWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
      {
        internalType: "uint48",
        name: "_milestoneId",
        type: "uint48",
      },
      {
        internalType: "string",
        name: "_reasonMetadataHash",
        type: "string",
      },
    ],
    name: "requestMilestoneApproval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IApplicationReviewRegistry",
        name: "_applicationReviewReg",
        type: "address",
      },
    ],
    name: "setApplicationReviewReg",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IWorkspaceRegistry",
        name: "_workspaceReg",
        type: "address",
      },
    ],
    name: "setWorkspaceReg",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_grant",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "_workspaceId",
        type: "uint96",
      },
      {
        internalType: "string",
        name: "_metadataHash",
        type: "string",
      },
      {
        internalType: "uint48",
        name: "_milestoneCount",
        type: "uint48",
      },
      {
        internalType: "bytes32",
        name: "_applicantAddress",
        type: "bytes32",
      },
    ],
    name: "submitApplication",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
      {
        internalType: "string",
        name: "_metadataHash",
        type: "string",
      },
      {
        internalType: "uint48",
        name: "_milestoneCount",
        type: "uint48",
      },
    ],
    name: "updateApplicationMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
      {
        internalType: "uint96",
        name: "_workspaceId",
        type: "uint96",
      },
      {
        internalType: "enum ApplicationRegistry.ApplicationState",
        name: "_state",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "_reasonMetadataHash",
        type: "string",
      },
    ],
    name: "updateApplicationState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "_applicationId",
        type: "uint96",
      },
      {
        internalType: "bytes32",
        name: "_applicantAddress",
        type: "bytes32",
      },
    ],
    name: "updateWalletAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "walletAddressMapping",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "workspaceReg",
    outputs: [
      {
        internalType: "contract IWorkspaceRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class ApplicationRegistryAbi__factory {
  static readonly abi = _abi;
  static createInterface(): ApplicationRegistryAbiInterface {
    return new utils.Interface(_abi) as ApplicationRegistryAbiInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ApplicationRegistryAbi {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ApplicationRegistryAbi;
  }
}
