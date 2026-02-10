# BitTask Smart Contracts

This directory contains the Clarity smart contracts for the BitTask platform.

## Contracts

- `bittask.clar`: The main marketplace contract handling task creation, acceptance, submission, and approvals.

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet)
- [Node.js](https://nodejs.org/) (for running tests)

## Testing

We use Vitest for testing to ensure better integration with our TypeScript frontend tooling.

### Running Tests

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run all tests:
    ```bash
    npm test
    ```

3.  Run specific test file:
    ```bash
    npm test tests/accept-task.test.ts
    ```

### Test Coverage

The tests cover the following scenarios:
- **Task Creation**: Verifying funds locking and data storage.
- **Task Acceptance**: Worker assignment and status updates.
- **Work Submission**: Storing submission details.
- **Approval & Payout**: Releasing funds to the worker.
- **Expiration handling**: Reclaiming funds from expired tasks.
- **[NEW] Dispute Resolution**: Flagging disputes and resolving with oracle mediation.
- **[NEW] Task Management**: Creating, cancelling, extending deadlines, and increasing rewards.

## Core Features (Contract Functions)

The `bittask.clar` contract provides the following public interface:

- `create-task`: Create a new microgig and lock funds in escrow.
- `accept-task`: Assign a worker to an open task.
- `submit-work`: Record proof of completion for review.
- `approve-work`: Creator confirms work and releases funds to worker.
- `reject-work`: Creator rejects work and reclaims funds (returns to open).
- `reclaim-expired`: Creator reclaims funds if a task expires without assignment.
- `cancel-task`: Creator cancels an open task to reclaim funds.
- `extend-deadline`: Creator extends the completion window for a task.
- `increase-task-reward`: Creator adds more STX to the bounty of an open task.
- `dispute-task`: Worker or creator flags a task for mediation.
- `resolve-dispute`: Oracle settles a dispute by splitting the escrowed funds.
- `add-milestone`/`approve-milestone`: Manage partial payments for complex tasks.

## Deployment

To deploy to Testnet:

```bash
clarinet deploy --config Clarinet.toml --settings settings/Testnet.toml
```

Ensure you have your private key configured in the settings file.
