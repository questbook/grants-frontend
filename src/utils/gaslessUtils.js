import { ethers } from 'ethers';
import axios from 'axios';

const EIP712_WALLET_TX_TYPE = {
    WalletTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "targetTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
    ]
}

export const signNonce = async (webwallet, nonce) => {
    let nonceHash = ethers.utils.hashMessage(nonce);
    let nonceSig = await webwallet.signMessage(nonce);
    nonceSig = ethers.utils.splitSignature(nonceSig);

    return { v: nonceSig.v, r: nonceSig.r, s: nonceSig.s, transactionHash: nonceHash };
}

export const getNonce = async (webwallet) => {
    let response = await axios.post("https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/get_nonce",
        {
            webwallet_address: webwallet.address
        });
    if (response.data && response.data.nonce !== "Token expired") {
        return response.data.nonce;
    }
    return false;
}

export const registerWebHook = async (authToken, apiKey) => {
    const url = "https://api.biconomy.io/api/v1/dapp/register-webhook";

    let formData = new URLSearchParams({
        "webHook": "https://2j6v8c5ee6.execute-api.ap-south-1.amazonaws.com/v0/check",
        "requestType": "post", // post or get
    })

    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded", "authToken": authToken, "apiKey": apiKey },
        body: formData
    };

    let response = await fetch(url, requestOptions);
    response = await response.json();
    let webHookId = false;

    try {
        webHookId = response.data.webHookId;
    }
    catch {
        throw Error("Couldn't register webhook for your app!");
    }

    return webHookId
}

export const addDapp = (dappName, networkId, authToken) => {
    const url = "https://api.biconomy.io/api/v1/dapp/public-api/create-dapp";

    let formData = new URLSearchParams({
        "dappName": dappName,
        "networkId": networkId,
        "enableBiconomyWallet": true
    })

    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded", "authToken": authToken },
        body: formData
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

export const deploySCW = async (webwallet, biconomyWalletClient) => {
    let { doesWalletExist, walletAddress } = await biconomyWalletClient.checkIfWalletExists({ eoa: webwallet.address });
    let scwAddress;

    if (!doesWalletExist) {
        console.log('Wallet does not exist');
        console.log('Deploying wallet');
        walletAddress = await biconomyWalletClient.checkIfWalletExistsAndDeploy({ eoa: webwallet.address }); // default index(salt) 0
        console.log('Wallet deployed at address', walletAddress);
        scwAddress = walletAddress;
    } 
    else {
        console.log(`Wallet already exists for: ${webwallet.address}`);
        console.log(`Wallet address: ${walletAddress}`);
        scwAddress = walletAddress;
    }
    return scwAddress;
}
export const sendGaslessTransaction = async (biconomy, targetContractObject, targetContractMethod,
    targetContractArgs, targetContractAddress, biconomyWalletClient,
    scwAddress, webwallet, chainId, webHookId) => {

    if (!biconomy) {
        alert('Biconomy is not ready! Please wait.');
        return;
    }
    const { data } = await targetContractObject.populateTransaction[targetContractMethod](...targetContractArgs);

    const safeTxBody = await biconomyWalletClient.buildExecTransaction({ data, to: targetContractAddress, walletAddress: scwAddress });


    const signature = await webwallet._signTypedData({ verifyingContract: scwAddress, chainId: ethers.BigNumber.from(chainId) }, EIP712_WALLET_TX_TYPE, safeTxBody)

    let newSignature = "0x";
    newSignature += signature.slice(2);

    let nonce = await getNonce(webwallet);

    if (!nonce) {
        setIsLoggedIn(false);
        return;
    }

    let signedNonce = await signNonce(webwallet, nonce);

    let webHookAttributes = {
        "webHookId": webHookId, // received from the webhook register API
        "webHookData": { // whatever data object to be passed to the webhook 
            "data": {
                "signedNonce": signedNonce,
                "nonce": nonce
            }
        },
    };
    const response = await biconomyWalletClient.sendBiconomyWalletTransaction({ execTransactionBody: safeTxBody, walletAddress: scwAddress, signature: newSignature, webHookAttributes }); // signature appended
    return response;
}