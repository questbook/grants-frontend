# Web3 Grant Orchestration Tool

## Overview

This repository contains all the code for the Questbook grant orchestration tool. The grants tool is a web application that helps grant creators manage their grant programs with ease. 


## Installation

1. Clone the repository:
```bash
git clone https://github.com/questbook/grants-frontend.git
cd grants-frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```
## Project Structure

```
├── src/
│   ├── constants/     # Application constants and configurations
│   ├── contexts/      # React context providers
│   ├── contracts/     # Smart contract interactions
│   ├── generated/     # Auto-generated files (GraphQL, etc.)
│   ├── graphql/       # GraphQL queries and mutations
│   ├── libraries/     # Shared libraries and utilities
│   ├── pages/         # Next.js pages
│   ├── screens/       # Screen components
│   ├── theme/         # UI theme configurations
│   └── types/         # TypeScript type definitions
├── public/
│   ├── chain_assets/  # Blockchain-related assets
│   ├── fonts/         # Custom fonts
│   └── v2/           # Version 2 static assets
├── styles/
│   └── globals.css   # Global CSS styles
├── codegen.yaml      # GraphQL codegen configuration
├── next.config.js    # Next.js configuration
├── sentry.*.config.ts # Sentry error tracking setup
└── tsconfig.json     # TypeScript configuration
```


## Key Features

### For Grant DAOs & Ecosystem
- 🏗️ **Customizable Grant Programs**
  - Create grant programs instantly without permissions
  - Design comprehensive evaluation frameworks with custom rubrics
  - Implement flexible voting and governance systems
  - Configure sophisticated multi-stage review workflows
  - Manage reviewer roles and permissions with fine-grained controls

- 💳 **Flexible Payout Options**
  - Gnosis Safe multi-sig integration
  - TONkeeper wallet support
  - Multiple wallet compatibility (Keplr, Argent, Brave, OpenMask, etc.)

- 🔒 **Compliance & Security**
  - Built-in Synaps KYC/KYB verification
  - DocuSign integration for legal documentation
  - Secure multi-signature transactions

### For Grant Applicants
- 📝 **Proposal Management**
  - User-friendly proposal submission
  - Progress tracking and milestone updates
  - Direct communication with grant providers

- 👥 **Review Process**
  - Transparent evaluation criteria
  - Real-time feedback from reviewers
  - Status tracking and notifications (Telegram, Email)

## Supported Integrations

### Wallets
- Gnosis Safe (Multi-sig)
- TONkeeper
- Keplr (Cosmos)
- Argent (Account Abstraction)
- Brave Wallet
- OpenMask

### Services
- Synaps (KYC/KYB)
- DocuSign
- Multi-sig Solutions
- Telegram/Email Notifications

## Tech Stack

- **Frontend**: Next.js, React, Chakra UI
- **Authentication**: Wallet-based with KYC integration
- **State Management**: React Query, Apollo Client
- **Security**: Multi-sig transaction handling



## How to Contribute

We welcome contributions from the community! To contribute:

1. Fork, clone, and set up the project: `git clone https://github.com/YOUR_USERNAME/grants-frontend.git && npm install --legacy-peer-deps`
2. Make your changes following our code style and testing guidelines
3. Submit a PR with clear description and reference any related issues

Need help? Join our [Discord](https://discord.com/invite/tWg7Mb7KM7) or contact maintainers.

## Support

- Discord: [Join our community](https://discord.com/invite/tWg7Mb7KM7)
- Warpcast: [Join our community](https://warpcast.com/questbook)
- Twitter: [@questbookapp](https://twitter.com/questbookapp)

## Security

If you discover any security-related issues, please contact us at security@questbook.app.
