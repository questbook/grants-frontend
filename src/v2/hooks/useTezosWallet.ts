import { BeaconWallet } from '@taquito/beacon-wallet';
// import { NetworkType } from '@airgap/beacon-types'
import { DAppClient } from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";

const dAppClient = new DAppClient({ name: "Beacon Docs" });

// const Tezos = new TezosToolkit('https://ghostnet.tezos.marigold.dev/');

// const options = {
//     name: 'QuestbookApp',
//     iconUrl: 'https://tezostaquito.io/img/favicon.svg',
//     preferredNetwork: NetworkType.GHOSTNET,
//     eventHandlers: {
//         PERMISSION_REQUEST_SUCCESS: {
//             handler: async (data: any) => {
//                 console.log('permission data:', data);
//             },
//         },
//     },
// };

debugger
// const wallet = new BeaconWallet({ name: "Beacon Docs Taquito" });

// Tezos.setWalletProvider(wallet);

// async function getUserAddress() {
//     try {
//         console.log("Requesting permissions...");
//         const permissions = await dAppClient.requestPermissions();
//         console.log("Got permissions:", permissions.address);
//       } catch (error) {
//         console.log("Got error:", error);
//       }
// }

// async function connectTz() {
//     try {
//         console.log("Requesting permissions...");
//         const permissions = await wallet.client.requestPermissions();
//         console.log("Got permissions:", permissions.address);
//       } catch (error) {
//         console.log("Got error:", error);
//       }
// }

export default function useTezosWallet() {
    // getUserAddress()
    // connect()
    return {tzWallet: dAppClient}
}