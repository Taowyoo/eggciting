# Eggciting NFT project

Eggciting is a developing and growing NFT collection of algorithmically generated cute eggs. The 1st generation of egg will be created from 11 different traits including body colors, faces, props. Each egg comes with ownership and commercial usage rights.

## Author

- Ssu-Yu(Kaitlyn) Ning
- Yuxiang Cao

## How to compile and install dependencies

```shell
# install deps
yarn
# compile contract
yarn hardhat compile
```

## Setup `.env` file

You must create a `.env` file under project root folder to provide necessary info before using hardhat to depoly/upgrade/... the contract

Here is an example file:
```
# .env
ALCHEMY_KEY="YOUR_ALCHEMY_KEY_FOR_RINKEBY_OR_MAINNET"
ALCHEMY_MUMBAI_KEY="YOUR_ALCHEMY_MUMBAI_KEY"
ACCOUNT_PRIVATE_KEY="YOUR_ACCOUNT_PRIVATE_KEY"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
NFT_NAME="Eggciting"
NFT_SYMBOL="EGG"
NFT_BASE_URI="https://ipfs.io/ipfs/QmQBdvMiyZcr1q3A1cuVHAPMNa1zFjV3kqKff2rjmutjG9/"
NFT_CONTRACT_ADDRESS="PUT_ADDRESS_HERE_AFTER_DEPLOY"
```

## How to deploy or upgrade

**Notice, you need to update the `NFT_CONTRACT_ADDRESS` in `.env` file before upgrading**

```shell
# deploy to blockchain
yarn hardhat --network rinkeby deploy
# upgrade, remember to recompile the changed contract
yarn hardhat --network rinkeby upgrade
```

You could change the `rinkeby` above to following currently support networks:

- `rinkeby`
- `maticmum` (Polygon testnet)
- `ethereum`

## How to mint

**Notice, you need to update the `NFT_CONTRACT_ADDRESS` in `.env` file before minting**

```shell
yarn hardhat --network rinkeby mint RECIPIENT_ADDRESS --number MINT_TIMES
```

For example: `yarn hardhat --network rinkeby mint --address 0x9739e1524fA3D33f6119ce9Eeb77f7b424759c83 --number 10`

## Current depoied Eggciting on Rinkeby

Address: 0x75f8d757EA2D87FFcb2fE2c0C8c505f333Bb573f

Opensea: https://testnets.opensea.io/collection/eggciting

Rarible: https://rinkeby.rarible.com/collection/0x75f8d757ea2d87ffcb2fe2c0c8c505f333bb573f/items

## Eggciting on Mumbai(old)

Address: 0xD099eE422b2bd3B5547ddAecE94EaB4cc08c619a


