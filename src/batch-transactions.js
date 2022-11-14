const { connect, transactions, keyStores } = require("near-api-js");
const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const CREDENTIALS_DIR = ".near-credentials";
// NOTE: replace "example" with your accountId
const CONTRACT_NAME = "nft-example.tcoratger.testnet";


const WHITELIST_ACCOUNT_ID = "whitelisted-account.example.testnet";
const WASM_PATH = path.join(__dirname, "../utils/wasm-files/staking_pool_factory.wasm");

const credentialsPath = path.join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
// const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const config = {
    keyStore,
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
};

sendTransactions();

async function sendTransactions() {

    const near = await connect({ ...config, keyStore });
    const account = await near.account(CONTRACT_NAME);  

    const args = {
        token_id: "token-100", 
        metadata: {
            title: "My Non Fungible Team Token", 
            description: "The Team Most Certainly Goes :)", 
            media: "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif"
        }, 
        receiver_id: "tcoratger.testnet"
    };

    const result = await account.signAndSendTransaction({
        receiverId: CONTRACT_NAME,
        actions: [
            transactions.functionCall(
                "nft_mint",
                args,
                10000000000000,
                "6350000000000000000000"
            ),
        ],
    });

    console.log(result);
}
