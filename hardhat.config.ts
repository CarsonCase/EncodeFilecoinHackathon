import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
import 'hardhat-deploy';

dotenv.config({ path: __dirname+'/.env' });
const PRIVATE_KEY:string = process.env.PRIVATE_KEY!;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: { yul: false },
      },
    },
  },
  defaultNetwork: "calibrationnet",
    networks: {
      localnet: {
          chainId: 31415926,
          url: "http://127.0.0.1:1234/rpc/v1",
          accounts: [PRIVATE_KEY],
      },
      calibrationnet: {
          chainId: 314159,
          url: "https://api.calibration.node.glif.io/rpc/v1",
          accounts: [PRIVATE_KEY],
      },
      neelNet:{
        chainId: 31415926,
        url: "http://10.9.9.3:1234/rpc/v1",
        accounts: [PRIVATE_KEY]
      },
      filecoinmainnet: {
          chainId: 314,
          url: "https://api.node.glif.io",
          accounts: [PRIVATE_KEY],
      },
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
    },
},
};

export default config;