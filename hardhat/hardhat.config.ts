import dotenv from 'dotenv'
dotenv.config()
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [PRIVATE_KEY!],
      chainId: 80001,
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
