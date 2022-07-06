
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Wallet, getDefaultProvider, Contract } from 'ethers';
import {
    Flex,
    Input,
    Grid,
    Heading,
    Image,
    Link,
    Text,
    Tooltip,
    Button
} from '@chakra-ui/react';
import NavbarLayout from '../src/layout/navbarLayout';
import { GitHubTokenContext, WebwalletContext } from './_app';
import axios from 'axios';
import { ethers } from 'ethers';
import { Biconomy } from '@biconomy/mexa';
import redirect from 'nextjs-redirect'
import { getSignedNonce, registerWebHook, sendGaslessTransaction } from '../src/utils/gaslessUtils';
import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';

const config = {
    contract: {
        address: "0xf2A2E064Fd0BE4Eb287df20B9b24A0cDAE4A0328",
        abi: [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "setValue",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "value",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    },
    walletFactory: {
        address: '0xB6D514655c1ed4A7ceeA2D717A3F37D7D8aEE90b',
        abi: [{ "inputs": [{ "internalType": "address", "name": "_baseImpl", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "_proxy", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_implementation", "type": "address" }, { "indexed": true, "internalType": "address", "name": "_owner", "type": "address" }], "name": "WalletCreated", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "address", "name": "_entryPoint", "type": "address" }, { "internalType": "address", "name": "_handler", "type": "address" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "deployCounterFactualWallet", "outputs": [{ "internalType": "address", "name": "proxy", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "address", "name": "_entryPoint", "type": "address" }, { "internalType": "address", "name": "_handler", "type": "address" }], "name": "deployWallet", "outputs": [{ "internalType": "address", "name": "proxy", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "uint256", "name": "_index", "type": "uint256" }], "name": "getAddressForCounterfactualWallet", "outputs": [{ "internalType": "address", "name": "_wallet", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isWalletExist", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }]
    },
    apiKey: {
        test: "_0I8gBue9.771c0dc8-5cad-4bf9-99d8-49895fde873a",
        prod: "_0I8gBue9.771c0dc8-5cad-4bf9-99d8-49895fde873a"
    },
    api: {
        test: "https://test-api.biconomy.io",
        prod: "https://api.biconomy.io"
    }
}

let biconomy;
let biconomyWalletClient;
let contract;
let scwAddress;

// const getWebwalletLocally = () => {
//     const webwalletPrivateKey = localStorage.getItem('webwalletPrivateKey');
//     if (!webwalletPrivateKey) {
//         return undefined;
//     }
//     try {
//         const webwallet = new Wallet(webwalletPrivateKey);
//         return webwallet;
//     }
//     catch {
//         return undefined;
//     }
// }
const jsonRpcProvider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/lfupuQhoZXWzMzn_OJ_zD9RHK0exz_b4");

const authToken = 'ce87a0be-951a-4475-ad2a-b5b5f93f278a' // authToken from the dashboard
const apiKey = 'qPZRgkerc.afb7905a-12b8-4c90-8e6b-48479f9e58d1' // apiKey from the dashboard
const webHookId = 'b8400628-c963-4761-9369-a14ec9ca2e6f'


function SignupWebwallet(props) {

    const { webwallet, setWebwallet } = useContext(WebwalletContext);
    const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext);

    const [nonce, setNonce] = useState();
    const [currentNumber, setCurrentNumber] = useState(31);

    useEffect(async () => {
        // localStorage.removeItem("webwalletPrivateKey");
        // registerWebHook(authToken, apiKey)
        if (webwallet) {
            let res = await
                axios.post("https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/get_nonce",
                    {
                        webwallet_address: webwallet.address
                    });
            console.log(res);
            if (res.data) {
                console.log("THIS IS DATA", res.data);
                if (res.data.nonce === "Token expired")
                    setIsLoggedIn(false);
                else {
                    let _nonce = res.data.nonce;
                    setNonce(_nonce);
                    setIsLoggedIn(true);
                }
                // let res2 = await axios.post("http://localhost:3001/v0/check",
                //     {
                //         data: {
                //             signedNonce: signedNonce,
                //             nonce: _nonce,
                //             webwallet_address: "0x38FC46E8f99E337C580A7B90889aF9f1E4B3A0EC"
                //         }
                //     })
                // console.log("THIS IS RES222", res2);

            }
        }


    }, [webwallet]);

    useEffect(() => {
        console.log("HERE ARE THE STATES", isLoggedIn, webwallet, biconomy);
        
        if(!webwallet){
            setWebwallet(Wallet.createRandom());
        }

        if (!isLoggedIn && webwallet) {
            window.location.replace(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
        }

    }, [isLoggedIn, webwallet])

    const initiateBiconomy = async () => {
        console.log(webwallet, isLoggedIn, biconomy);
        if (webwallet && isLoggedIn && !biconomy) {

            biconomy = new Biconomy(jsonRpcProvider,
                {
                    apiKey: apiKey,
                    debug: true
                });

            biconomy.onEvent(biconomy.READY, async () => {
                console.log('Inside biconomy ready event');

                // here should change the contract
                contract = new ethers.Contract(
                    config.contract.address,
                    config.contract.abi,
                    webwallet
                );

                biconomyWalletClient = biconomy.biconomyWalletClient;

                console.log("CLIENT WALLET", biconomyWalletClient)

                let walletAddress = await deploySCW(webwallet, biconomyWalletClient);
                scwAddress = walletAddress;

            }).onEvent(biconomy.ERROR, (error, message) => {
                console.log(message);
                console.log(error);
            });
        }
    }

    const handleSendGaslessTransaction = async (e) => {
        e.preventDefault();

        await initiateBiconomy();

        let transactionHash = await sendGaslessTransaction(biconomy, contract, 'setValue', [22], config.contract.address, biconomyWalletClient,
            scwAddress, webwallet, "80001", webHookId);
        console.log(transactionHash);
    }


    return (
        <Flex width='100%' flexDir='row' justifyContent='center'>
            {webwallet &&
                <form onSubmit={handleSendGaslessTransaction}>
                    <Input
                        id='number'
                        type='number'
                        placeholder='31'
                        value={currentNumber}
                        onChange={() => setCurrentNumber(parseInt(currentNumber))}
                    />
                    <Button mt={4} colorScheme='teal' type='submit'>
                        Submit
                    </Button>
                </form>
            }
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
