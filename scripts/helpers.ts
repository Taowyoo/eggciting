import { ethers } from "ethers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Helper method for fetching environment variables from .env
function getEnvVariable(key: string, defaultValue?: string): string {
  const retKey = process.env[key];
  if (retKey) {
    return retKey;
  }
  if (!defaultValue) {
    throw new Error(`${key} is not defined and no default value was provided`);
  }
  return defaultValue;
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
  return ethers.getDefaultProvider(getEnvVariable("NETWORK", "rinkeby"), {
    alchemy: getEnvVariable("ALCHEMY_KEY"),
  });
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
  return new ethers.Wallet(
    getEnvVariable("ACCOUNT_PRIVATE_KEY"),
    getProvider()
  );
}

function getContract(contractName: string, hre: HardhatRuntimeEnvironment) {
  const account = getAccount();
  return getContractAt(
    hre,
    contractName,
    getEnvVariable("NFT_CONTRACT_ADDRESS"),
    account
  );
}

export { getEnvVariable, getProvider, getAccount, getContract };
