import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@airgap/beacon-types'

const options = {
    name: 'QuestbookApp',
    iconUrl: 'https://tezostaquito.io/img/favicon.svg',
    preferredNetwork: NetworkType.GHOSTNET,
    eventHandlers: {
        PERMISSION_REQUEST_SUCCESS: {
            handler: async (data: any) => {
                console.log('permission data:', data);
            },
        },
    },
};
const wallet = new BeaconWallet(options);

async function getUserAddress() {
    wallet
        .requestPermissions({ network: {type: NetworkType.GHOSTNET} })
        .then((_) => wallet.getPKH())
        .then((address) => console.log(`Your address: ${address}`));
    // const userAddress = await wallet.getPKH();
    // console.log('user address', userAddress)
    // return userAddress
}


export default function useTezosWallet() {
    // getUserAddress()
    return {tzWallet: wallet}
}