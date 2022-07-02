
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
import { WebwalletContext } from './_app';
import axios from 'axios';
import { ethers } from 'ethers';
import { Biconomy } from '@biconomy/mexa';


const EIP712_SAFE_TX_TYPE = {
    // "SafeTx(address to,uint256 value,bytes data,uint8 operation,uint256 safeTxGas,uint256 baseGas,uint256 gasPrice,address gasToken,address refundReceiver,uint256 nonce)"
    SafeTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]
}
import { route } from 'next/dist/server/router';


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
    contract: {
        address: "0x755910743B41377d4BE29600a7429eC3Bc9f8b25",
        abi: [
            {
                "inputs": [],
                "name": "retrieve",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "num",
                        "type": "uint256"
                    }
                ],
                "name": "store",
                "outputs": [],
                "stateMutability": "nonpayable",
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

export const createWebwallet = () => {
    const localWebwallet = getWebwalletLocally();
    if (localWebwallet) {
        return localWebwallet;
    }
    else {
        newWebwallet = Wallet.createRandom();
    }
    console.log(newWebwallet);
}

function SignupWebwallet(props) {

    // const { webwallet, setWebwallet } = useContext(WebwalletContext);
    const [ webwallet, setWebwallet ] = useState(null);
    const [currentNumber, setCurrentNumber] = useState(31);
    const [loggedInGitHub, setLoggedInGitHub] = useState(true);

    useEffect(async () => {
        let newWebwallet = createWebwallet();
        let res = await axios.post("https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/get_nonce",
        {
            webwallet_address: newWebwallet.address
        });
        let res2 = await axios.post("https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/check",
        {
            data : { 
                signedNonce: {v: 2, r: "2", s: "4", transactionHash: "0x111"},
                nonce: "1112",
                webwallet_address: "0x111"
            }
        })
        console.log("THIS IS RES", res2);
        if(res.data){
            if(res.data.nonce === "Token expired")
                setLoggedInGitHub(false); 
            else setLoggedInGitHub(true);
        }
    }, [])

    useEffect(() => {
        console.log("HERE ARE STATES", loggedInGitHub, webwallet)
        if(!loggedInGitHub && webwallet){
            console.log("THIS IS WEBWALLET", webwallet);
            window.location.replace(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`);
        }
    }, [loggedInGitHub, webwallet])

    const getNumberFromContract = async () => {
        let result = await contract.retrieve();
        if (result !== 0 && result) {
            setCurrentNumber(parseInt(currentNumber));
        } else {
            alert(result);
        }
    };

    const handleCreateWebwallet = async () => {
        // @TODO: handle github oauth.
        // ...

        let newWebwallet = createWebwallet();
        setWebwallet(newWebwallet);

        let jsonRpcProvider = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/dfaf304639664a2e900ce55509038cb2");

        biconomy = new Biconomy(jsonRpcProvider,
            {
                apiKey: config.apiKey.test,
                debug: true
            });

        biconomy.onEvent(biconomy.READY, async () => {
            console.log('Inside biconomy ready event');
            // Initialize your dapp here like getting user accounts etc
            contract = new ethers.Contract(
                config.contract.address,
                config.contract.abi,
                newWebwallet
            );

            walletContract = new ethers.Contract(
                config.walletFactory.address,
                config.walletFactory.abi,
                newWebwallet
            );

            biconomyWalletClient = biconomy.biconomyWalletClient;
            console.log("CLIENT WALLET", biconomyWalletClient)
            contractInterface = new ethers.utils.Interface(config.contract.abi);
            await deploySCW();
            getNumberFromContract();
        }).onEvent(biconomy.ERROR, (error, message) => {
            // Handle error while initializing mexa
            console.log(message);
            console.log(error);
        });
    }

    const deploySCW = async () => {
        const { doesWalletExist, walletAddress } = await biconomyWalletClient.checkIfWalletExists({ eoa: webwallet.address });
        if (!doesWalletExist) {
            console.log('Wallet does not exist');
            console.log('Deploying wallet');
            const walletAddress = await biconomyWalletClient.checkIfWalletExistsAndDeploy({ eoa: webwallet.address }); // default index(salt) 0
            console.log('Wallet deployed at address', walletAddress);
            setSCWAddress(walletAddress);
        } else {
            console.log(`Wallet already exists for: ${webwallet.address}`);
            console.log(`Wallet address: ${walletAddress}`);
            setSCWAddress(walletAddress);
        }
    }

    const handleSendGaslessTransaction = async () => {
        console.log(getDefaultProvider())
        console.log(window.ethereum);
        if (!biconomy) {
            alert('Biconomy is not ready! Please wait.');
            return;
        }

        const { data } = await contract.populateTransaction.store(newNumber);
        const safeTxBody = await biconomyWalletClient.buildExecTransaction({ data, to: config.contract.address, walletAddress: scwAddress });
        const signature = await webwallet._signTypedData({ verifyingContract: scwAddress, chainId: ethers.BigNumber.from("42") }, EIP712_SAFE_TX_TYPE, safeTxBody)
        let newSignature = "0x";
        newSignature += signature.slice(2);

        //contact us for personal sign code snippet

        const result = await biconomyWalletClient.sendBiconomyWalletTransaction({ execTransactionBody: safeTxBody, walletAddress: scwAddress, signature: newSignature }); // signature appended
        console.log(result);
    }

    return (
        <Flex width='100%' flexDir='row' justifyContent='center'>

            {!webwallet && <Button
                onClick={handleCreateWebwallet}
                variant="primary"
                my={16}>
                Create webwallet
            </Button>}

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
