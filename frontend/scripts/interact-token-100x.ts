import {
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    uintCV,
    principalCV,
    getAddressFromPrivateKey,
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: path.join(__dirname, '../../.env') });

/**
 * Interact Token 100x Script
 * Generates 100 mint transactions for the bit-token contract.
 * Fee is set to 0.007 STX (7000 micro-STX).
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const CONTRACT_ADDRESS = 'SP2N00STXH4K1GBPHC5AM62BP4AJ7STS4XJXCD2D4';
const CONTRACT_NAME = 'bit-token';
const NETWORK_TYPE = process.env.STACKS_NETWORK || 'mainnet';
const network = NETWORK_TYPE === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
const txVersion = NETWORK_TYPE === 'mainnet' ? 'mainnet' : 'testnet';

const FEE = 4000; // 0.004 STX in micro-STX
const ITERATIONS = 100;

async function generateTransactions() {
    if (!PRIVATE_KEY) {
        console.error('ERROR: PRIVATE_KEY not found in .env');
        return;
    }

    const address = getAddressFromPrivateKey(PRIVATE_KEY, txVersion as any);
    console.log(`Sender Address: ${address}`);
    console.log(`Generating ${ITERATIONS} transactions with fee ${FEE} micro-STX...`);

    try {
        // Fetch initial nonce
        const apiUrl = NETWORK_TYPE === 'mainnet' ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so';

        async function getNonceFromAPI() {
            const resp = await fetch(`${apiUrl}/v2/accounts/${address}`);
            const data = await resp.json();
            return BigInt(data.nonce);
        }

        async function getMempoolCount() {
            try {
                const resp = await fetch(`${apiUrl}/extended/v1/address/${address}/mempool`);
                const data = await resp.json();
                return data.total || 0;
            } catch (e) {
                return 25; // Safety fallback
            }
        }

        let nonce = await getNonceFromAPI();
        console.log(`Starting with Nonce: ${nonce}`);

        for (let i = 0; i < ITERATIONS; i++) {
            // Check mempool depth
            let mempoolCount = await getMempoolCount();
            while (mempoolCount >= 20) {
                process.stdout.write(`\rMempool full (${mempoolCount}/20). Waiting 30s to clear...`);
                await new Promise(resolve => setTimeout(resolve, 30000));
                mempoolCount = await getMempoolCount();
                // Refresh nonce just in case some were confirmed
                nonce = await getNonceFromAPI();
            }

            process.stdout.write(`\rBroadcasting transaction ${i + 1}/${ITERATIONS} (Nonce: ${nonce})...`);

            const txOptions = {
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'mint',
                functionArgs: [
                    uintCV(1), // Mint 1 token
                    principalCV(address), // To sender
                ],
                senderKey: PRIVATE_KEY,
                validateWithAbi: true,
                network,
                anchorMode: AnchorMode.Any,
                postConditionMode: PostConditionMode.Allow,
                fee: BigInt(FEE),
                nonce: nonce,
            };

            const transaction = await makeContractCall(txOptions);

            try {
                const broadcastResponse = await broadcastTransaction({ transaction });
                if ((broadcastResponse as any).error) {
                    console.error(`\nFAILED to broadcast transaction ${i + 1}:`, (broadcastResponse as any).error);
                    // If nonce is too low, we might need to skip or update
                    if ((broadcastResponse as any).reason === 'NonceAlreadyUsed') {
                        nonce++;
                        continue;
                    }
                    break;
                }
                nonce++;
            } catch (e: any) {
                if (e.message?.includes('Rate limit')) {
                    console.log('\nRate limit hit. Waiting 60s...');
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    i--; // Retry this iteration
                    continue;
                }
                throw e;
            }

            // Regular delay between successful broadcasts
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('\nAll transactions processed.');
    } catch (error) {
        console.error('\nERROR during transaction generation:', error);
    }
}

generateTransactions().catch(console.error);
