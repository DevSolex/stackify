import {
    makeContractDeploy,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    getNonce,
    getAddressFromPrivateKey,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: path.join(__dirname, '../../.env') });

/**
 * Deploy Token Contract Script
 * Deploys the Clarity token contract to the Stacks network.
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const CONTRACT_NAME = 'bit-token'; // Using a hyphenated name as is standard
const NETWORK_TYPE = process.env.STACKS_NETWORK || 'testnet';
const network = NETWORK_TYPE === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

// Adjusted path to find the contract file from frontend/scripts
const CONTRACT_FILE_PATH = path.join(__dirname, '../../contracts/contracts/token.clar');

async function deployToken() {
    if (!PRIVATE_KEY) {
        console.error('ERROR: PRIVATE_KEY not found in .env');
        return;
    }

    const codeBody = fs.readFileSync(CONTRACT_FILE_PATH, 'utf8');
    console.log(`Deploying ${CONTRACT_NAME} to ${NETWORK_TYPE}...`);

    try {
        // Derive address from private key 
        const txVersion = NETWORK_TYPE === 'mainnet' ? 'mainnet' : 'testnet';
        const address = getAddressFromPrivateKey(PRIVATE_KEY, txVersion as any);
        console.log(`Sender Address: ${address}`);

        // Try to get account info to find nonce using a public Hiro API URL
        const apiUrl = NETWORK_TYPE === 'mainnet' ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so';
        const response = await fetch(`${apiUrl}/v2/accounts/${address}`);
        const accountInfo = await response.json();
        const nonce = accountInfo.nonce;
        console.log(`Fetched Nonce: ${nonce}`);

        const txOptions = {
            contractName: CONTRACT_NAME,
            codeBody: codeBody,
            senderKey: PRIVATE_KEY,
            network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
            nonce: BigInt(nonce),
        };

        const transaction = await makeContractDeploy(txOptions);
        console.log(`Transaction created.`);

        // broadcastTransaction expects { transaction } in some versions
        const broadcastResponse = await broadcastTransaction({ transaction });

        if (broadcastResponse.error) {
            console.error(`FAILED to broadcast deployment:`, broadcastResponse.error);
        } else {
            console.log(`SUCCESS! Contract deployment broadcasted.`);
            console.log(`Transaction ID: ${broadcastResponse.txid}`);
            console.log(`Contract Identifier: ${broadcastResponse.txid}.${CONTRACT_NAME}`);
            console.log(`Explorer Link: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=${NETWORK_TYPE}`);
        }
    } catch (error) {
        console.error(`ERROR during deployment:`, error);
    }
}

deployToken().catch(console.error);
