# Stackify

A decentralized micro-gigs marketplace built on the Stacks blockchain. Stackify enables trustless collaboration through smart contract managed escrow, milestone payments, and decentralized dispute resolution.

## Project Structure

- `contracts/`: Clarity smart contracts and deployment configurations.
- `frontend/`: (Upcoming) User interface for interacting with the protocol.
- `scripts/`: Integration and automation scripts.

## Core Protocol: BitTask

The heart of Stackify is the `bittask.clar` contract, which manages the lifecycle of micro-gigs:

1. **Escrow**: Funds are safely locked in the contract upon task creation.
2. **Milestones**: Break down large tasks into verifiable segments with partial payouts.
3. **Dispute Resolution**: Trusted oracle-mediated settlements for disagreements.
4. **Flexible Management**: Support for cancellations, extensions, and bounty increases.

## Quick Start

### For Contract Developers

```bash
cd contracts
npm install
npm test
```

For more details see [contracts/README](contracts/README.md).