import * as dotenv from "dotenv";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { getAccount, getContract } from "./scripts/helpers";
import fetch from "node-fetch";

dotenv.config();

const {
  ALCHEMY_KEY,
  ACCOUNT_PRIVATE_KEY,
  NFT_CONTRACT_ADDRESS,
  ALCHEMY_MUMBAI_KEY,
  NFT_NAME,
  NFT_SYMBOL,
  NFT_BASE_URI,
} = process.env;

// Tasks begin
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("check-balance", "Prints out the balance of your account").setAction(
  async function (taskArguments, hre) {
    const account = getAccount(hre);
    console.log(
      `Account balance for ${account.address}: ${hre.ethers.utils.formatEther(
        await account.getBalance()
      )} ether`
    );
  }
);

task("deploy", "Creates the NFT.sol contract").setAction(async function (
  taskArguments,
  hre
) {
  const nftContractFactory = await hre.ethers.getContractFactory(
    "Eggciting",
    getAccount(hre)
  );
  const nft = await hre.upgrades.deployProxy(nftContractFactory, [
    NFT_NAME,
    NFT_SYMBOL,
    NFT_BASE_URI,
  ]);
  console.log(`Contract deployed to address: ${nft.address}`);
});

task("upgrade", "Upgrades the NFT.sol contract").setAction(async function (
  taskArguments,
  hre
) {
  if (!NFT_CONTRACT_ADDRESS) {
    throw new Error("NFT_CONTRACT_ADDRESS is invalid!");
  }
  const nftContractFactory = await hre.ethers.getContractFactory(
    "Eggciting",
    getAccount(hre)
  );
  const nft = await hre.upgrades.upgradeProxy(
    NFT_CONTRACT_ADDRESS,
    nftContractFactory
  );
  console.log(`Contract deployed to address: ${nft.address}`);
});

task("mint", "Mints from the NFT contract")
  .addParam("address", "The address to receive a token")
  .addParam("number", "Number of tokens to mint")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("Eggciting", hre);
    const num = parseInt(taskArguments.number);
    for (let i = 1; i <= num; i++) {
      const transactionResponse = await contract.mint(taskArguments.address, {
        gasLimit: 500_000,
      });
      console.log(
        `${i} time mint Transaction Hash: ${transactionResponse.hash}`
      );
    }
  });

task("token-uri", "Fetches the token metadata for the given token ID")
  .addParam("tokenId", "The tokenID to fetch metadata for")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("Eggciting", hre);
    const response = await contract.tokenURI(taskArguments.tokenId, {
      gasLimit: 500_000,
    });

    const metadataUrl = response;
    console.log(`Metadata URL: ${metadataUrl}`);

    const metadata = await fetch(metadataUrl).then((res) => res.json());
    console.log(
      `Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`
    );
  });

// Tasks end

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    ethereum: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    maticmum: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
