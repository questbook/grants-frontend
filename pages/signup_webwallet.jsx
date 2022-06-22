
import React, { ReactElement, useContext, useEffect } from 'react';
import { Wallet, getDefaultProvider, Contract } from 'ethers';
import {
    Flex,
    Grid,
    Heading,
    Image,
    Link,
    Text,
    Tooltip,
    Button
} from '@chakra-ui/react';
import { useRouter } from 'next/router'
import NavbarLayout from '../src/layout/navbarLayout';
import { WebwalletContext } from './_app';

import { Biconomy } from '@biconomy/mexa';


const getWebwalletLocally = () => {
    const webwalletPrivateKey = localStorage.getItem('webwalletPrivateKey');
    if (!webwalletPrivateKey) {
        return undefined;
    }
    try {
        const webwallet = new Wallet(webwalletPrivateKey);
        return webwallet;
    }
    catch {
        return undefined;
    }
}

const config = {
    apiKey: 'dfdg',
    contract: {
        address: "0xB32992b4110257a451Af3c2ED6AC78776DD8C26b",
        abi: [ { "inputs": [ { "internalType": "string", "name": "newQuote", "type": "string" } ], "name": "setQuote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getQuote", "outputs": [ { "internalType": "string", "name": "currentQuote", "type": "string" }, { "internalType": "address", "name": "currentOwner", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "quote", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]
    },
    walletFactory: {
        address: '0xB6D514655c1ed4A7ceeA2D717A3F37D7D8aEE90b',
        abi: [{"inputs":[{"internalType":"address","name":"_baseImpl","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_proxy","type":"address"},{"indexed":true,"internalType":"address","name":"_implementation","type":"address"},{"indexed":true,"internalType":"address","name":"_owner","type":"address"}],"name":"WalletCreated","type":"event"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_entryPoint","type":"address"},{"internalType":"address","name":"_handler","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"deployCounterFactualWallet","outputs":[{"internalType":"address","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_entryPoint","type":"address"},{"internalType":"address","name":"_handler","type":"address"}],"name":"deployWallet","outputs":[{"internalType":"address","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAddressForCounterfactualWallet","outputs":[{"internalType":"address","name":"_wallet","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isWalletExist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
    },
    apiKey: {
        test: "cNWqZcoBb.4e4c0990-26a8-4a45-b98e-08101f754119",
        prod: "zIH7h7lcK.e5a9aa8f-0acb-4ce9-ba1d-5097073c4ab4"
    },
    api: {
        test: "https://test-api.biconomy.io",
        prod: "https://api.biconomy.io"
    }
}

let biconomy;
let biconomyWalletClient;

function SignupWebwallet(props) {

    const { webwallet, setWebwallet } = useContext(WebwalletContext);

    const handleCreateWebwallet = () => {
        // @TODO: handle github oauth.
        // ...

        let newWebwallet;
        const localWebwallet = getWebwalletLocally();
        if (localWebwallet) {
            newWebwallet = localWebwallet;
        }
        else {
            newWebwallet = Wallet.createRandom();
        }
        console.log(newWebwallet);
        setWebwallet(newWebwallet);
    }

    const handleSendGaslessTransaction = () => {
        console.log(getDefaultProvider())
        console.log(window.ethereum);

        biconomy = new Biconomy(window.ethereum,
            {
                apiKey: config.apiKey,
                walletProvider: window.ethereum,
                debug: true
            });

        biconomyWalletClient = biconomy.biconomyWalletClient;
        contractInterface = new ethers.utils.Interface(config.contract.abi);
    }

    return (
        <Flex width='100%' flexDir='row' justifyContent='center'>

            {!webwallet && <Button
                onClick={handleCreateWebwallet}
                variant="primary"
                my={16}>
                Create webwallet
            </Button>}

            {webwallet && <Button
                onClick={handleSendGaslessTransaction}
                variant="primary"
                my={16}>
                Send gasless transaction
            </Button>}
        </Flex>
    )
}

SignupWebwallet.getLayout = function (page) {
    return (
        <NavbarLayout>
            {page}
        </NavbarLayout>
    )
}

export default SignupWebwallet;
