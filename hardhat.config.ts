import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-ethers";
import { getAccount, getContract } from "./scripts/helpers";
dotenv.config();

const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("check-balance", "Prints out the balance of your account").setAction(
  async function (taskArguments, hre) {
    const account = getAccount();
    console.log(
      `Account balance for ${account.address}: ${await account.getBalance()}`
    );
  }
);

task("deploy", "Deploys the NFT.sol contract").setAction(async function (
  taskArguments,
  hre
) {
  const nftContractFactory = await hre.ethers.getContractFactory(
    "NFT",
    getAccount()
  );
  const nft = await nftContractFactory.deploy();
  console.log(`Contract deployed to address: ${nft.address}`);
});

task("mint", "Mints from the NFT contract")
  .addParam("address", "The address to receive a token")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const transactionResponse = await contract.mintTo(taskArguments.address, {
      gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
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
