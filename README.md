# Decentralised Grant Orchestration Tool Frontend

This repository contains all the code for the Questbook grant orchestration tool.
The grants tool is a decentralised application that helps protocols manage their grant programs on-chain, without having to pay any gas fees.

Website: <https://questbook.app>

Some of our top partners include:

1. [Compound Finance](https://compound.finance)
2. [Climate Collective](https://medium.com/@ClimateCollective/introducing-the-climate-collectives-new-grants-program-2ec76b97318c)
3. [Prezenti](https://prezenti.xyz/about-us)

## Installation and Setup

1. Clone the repo
2. Install the dependencies using `npm i --legacy-peer-deps`
3. Create a `.env` file in the root directory and add the following variables:

```
NEXT_PUBLIC_IS_TEST=true | false
NEXT_PUBLIC_INFURA_ID=my-infura-id
BICO_AUTH_TOKEN=my-biconomy-auth-token
SOLANA_RPC=my-solana-rpc-url
SENTRY_LOG_LEVEL=debug
SENTRY_AUTH_TOKEN=sentry-auth-token
API_ENDPOINT=https://api.questbook.app
NOTIF_BOT_USERNAME=qb_notif_bot
```

4. Run the app using `npm run dev`

## Usage

The main flows of the app are described below.

### Landing page

### Creating a grant program

### Editing the details of a grant program

### Adding reviewers to a grant program

### Submitting reviews as a reviewer

### Adding a multisig to fund the program

### Initiating payout to a builder

### Submitting a proposal to a grant program

### Resubmitting a proposal

## How does it work?

## Project Structure

## Contributing
