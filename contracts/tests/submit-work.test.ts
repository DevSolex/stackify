
import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe('submit-work', () => {
    it('should submit work successfully', () => {
        const deadline = simnet.blockHeight + 50;

        // Create task
        simnet.callPublicFn('bittask', 'create-task', [
            Cl.stringAscii("Task"), Cl.stringAscii("Desc"), Cl.uint(1000), Cl.uint(deadline)
        ], wallet1);

        // Accept task
        simnet.callPublicFn('bittask', 'accept-task', [Cl.uint(1)], wallet2);

        // Submit work
        const { result } = simnet.callPublicFn(
            'bittask',
            'submit-work',
            [Cl.uint(1), Cl.stringAscii("https://github.com/Cyberking99/BitTask")],
            wallet2
        );

        expect(result).toBeOk(Cl.bool(true));

        // Verify status
        const task = simnet.callReadOnlyFn('bittask', 'get-task', [Cl.uint(1)], deployer);
        expect(task.result).toBeSome(expect.objectContaining({
            status: Cl.stringAscii("submitted"),
            submission: Cl.some(Cl.stringAscii("https://github.com/Cyberking99/BitTask"))
        }));
    });

    it('should fail if task is not in progress', () => {
        const deadline = simnet.blockHeight + 50;
        simnet.callPublicFn('bittask', 'create-task', [
            Cl.stringAscii("Task"), Cl.stringAscii("Desc"), Cl.uint(1000), Cl.uint(deadline)
        ], wallet1);

        // Try submit without accepting
        const { result } = simnet.callPublicFn(
            'bittask',
            'submit-work',
            [Cl.uint(1), Cl.stringAscii("link")],
            wallet2
        );

        expect(result).toBeErr(Cl.uint(108)); // ERR-NOT-IN-PROGRESS
    });

    it('should fail if caller is not the worker', () => {
        const deadline = simnet.blockHeight + 50;
        simnet.callPublicFn('bittask', 'create-task', [
            Cl.stringAscii("Task"), Cl.stringAscii("Desc"), Cl.uint(1000), Cl.uint(deadline)
        ], wallet1);

        simnet.callPublicFn('bittask', 'accept-task', [Cl.uint(1)], wallet2);

        // Try submit with wallet1 (creator)
        const { result } = simnet.callPublicFn(
            'bittask',
            'submit-work',
            [Cl.uint(1), Cl.stringAscii("link")],
            wallet1
        );

        expect(result).toBeErr(Cl.uint(109)); // ERR-NOT-WORKER
    });
});
