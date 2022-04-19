import { BaseProvider } from "@ethersproject/providers";
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
function getProvider(hre: HardhatRuntimeEnvironment) {
  const network = hre.ethers.providers.getNetwork(hre.network.name);
  let provider: BaseProvider;
  if (network._defaultProvider) {
    provider = hre.ethers.providers.getDefaultProvider(hre.network.name, {
      alchemy: getEnvVariable("ALCHEMY_KEY"),
    });
  } else {
    switch (hre.network.name) {
      case "maticmum":
        provider = new hre.ethers.providers.AlchemyProvider(
          hre.network.name,
          getEnvVariable("ALCHEMY_MUMBAI_KEY")
        );
        break;
      default:
        throw Error("Unsupported network: " + hre.network.name);
    }
  }
  return provider;
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount(hre: HardhatRuntimeEnvironment) {
  return new hre.ethers.Wallet(
    getEnvVariable("ACCOUNT_PRIVATE_KEY"),
    getProvider(hre)
  );
}

function getContract(contractName: string, hre: HardhatRuntimeEnvironment) {
  const account = getAccount(hre);
  return getContractAt(
    hre,
    contractName,
    getEnvVariable("NFT_CONTRACT_ADDRESS"),
    account
  );
}

export { getEnvVariable, getProvider, getAccount, getContract };
