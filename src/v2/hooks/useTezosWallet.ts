import { BeaconWallet } from '@taquito/beacon-wallet';
// import { NetworkType } from '@airgap/beacon-types'
// import { DAppClient } from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";
import { useEffect, useState } from 'react';

// const dAppClient = new DAppClient({ name: "Beacon Docs" });

// const Tezos = new TezosToolkit('https://ghostnet.tezos.marigold.dev/');
// const wallet = new BeaconWallet({ name: "Beacon Docs Taquito" });

// Tezos.setWalletProvider(wallet);


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
//     } catch (error) {
//         console.log("Got error:", error);
//     }
// }

export default function useTezosWallet() {
    const [wallet, setWallet] = useState<null | BeaconWallet>(null);

    const [Tezos, setTezos] = useState(new TezosToolkit("https://ghostnet.tezos.marigold.dev/"))

    useEffect(() => {
        (async () => {
          if (wallet === null) {
            const _wallet = new (await import("@taquito/beacon-wallet")).BeaconWallet({ name: "Demo" });
            setWallet(_wallet)
            Tezos.setWalletProvider(_wallet);
          }
        })();
      }, []);
    // getUserAddress()
    // connect()
    return { tzWallet: wallet }
}