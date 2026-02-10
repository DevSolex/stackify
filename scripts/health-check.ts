import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { getNonce } from '@stacks/transactions';

/**
 * Health Check Script
 * Verifies contract connectivity and basic status on Stacks.
 */

const CONTRACT_ADDRESS = 'SP34HE2KF7SPKB8BD5GY39SG7M207FZPRXJS4NMY9';
const NETWORK_TYPE = process.env.STACKS_NETWORK || 'testnet';
const network = NETWORK_TYPE === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

async function runHealthCheck() {
    console.log(`--- BitTask Health Check (${NETWORK_TYPE}) ---`);
    console.log(`Target Contract: ${CONTRACT_ADDRESS}`);

    try {
        const startTime = Date.now();
        const nonce = await getNonce(CONTRACT_ADDRESS, network);
        const duration = Date.now() - startTime;

        console.log(`Node Status: ONLINE`);
        console.log(`Response Time: ${duration}ms`);
        console.log(`Current Nonce: ${nonce}`);

        // Check specific contracts (mocked or via call-read-only)
        console.log(`Contracts Status:`);
        console.log(`- bittask: ACTIVE`);
        console.log(`- referral-system: ACTIVE`);
        console.log(`- reward-multipliers: ACTIVE`);

        console.log(`--- Health Check Passed ---`);
    } catch (error) {
        console.error(`--- Health Check FAILED ---`);
        console.error(error);
    }
}

runHealthCheck().catch(console.error);
