import {
    uintCV,
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    FungibleConditionCode,
    createAssetInfo,
    makeStandardFungiblePostCondition
} from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

const STAKING_CONTRACT_NAME = 'staking';
const TOKEN_CONTRACT_NAME = 'bit-token';
const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

export interface StakeInfo {
    amount: bigint;
    lastStakeBlock: bigint;
    accumulatedRewards: bigint;
    multiplier: bigint;
}

/**
 * Stakes BTK tokens in the staking contract
 */
export async function stakeTokens(amount: number, senderAddress: string, userSession: any) {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

    // Post-condition: ensure amount is transferred from user
    const postCondition = makeStandardFungiblePostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        BigInt(amount),
        createAssetInfo(contractAddress, TOKEN_CONTRACT_NAME, 'bittoken')
    );

    const txOptions = {
        contractAddress,
        contractName: STAKING_CONTRACT_NAME,
        functionName: 'stake',
        functionArgs: [uintCV(amount)],
        network: NETWORK,
        postConditions: [postCondition],
        postConditionMode: PostConditionMode.Deny,
        anchorMode: AnchorMode.Any,
    };

    try {
        const result = await userSession.signTransaction(txOptions);
        console.log('Staking transaction signed:', result);
        return result;
    } catch (error) {
        console.error('Error staking tokens:', error);
        throw error;
    }
}

/**
 * Unstakes tokens and claims rewards
 */
export async function unstakeTokens(userSession: any) {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

    const txOptions = {
        contractAddress,
        contractName: STAKING_CONTRACT_NAME,
        functionName: 'unstake',
        functionArgs: [],
        network: NETWORK,
        postConditionMode: PostConditionMode.Allow,
        anchorMode: AnchorMode.Any,
    };

    try {
        const result = await userSession.signTransaction(txOptions);
        console.log('Unstaking transaction signed:', result);
        return result;
    } catch (error) {
        console.error('Error unstaking tokens:', error);
        throw error;
    }
}

/**
 * Fetches stake information for a user
 */
export async function fetchStakeInfo(address: string) {
    // Use read-only call to get stake info
    // Implementation depends on the stacks-connect or custom fetch
    console.log(`Fetching stake info for ${address}`);
    return null;
}
