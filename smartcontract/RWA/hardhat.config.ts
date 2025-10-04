import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    etherscan: {
      apiKey: {
        BscTestnet: "",
      },
    customChains: [
    {
      network: "BscTestnet",
      chainId: 97,
      urls: {
        apiURL: "https://api.etherscan.io/v2/api?chainid=97",
        browserURL: "https://testnet.bscscan.com/"
      }
    },]
    },
    networks: {
      BscTestnet: {
        url: "https://data-seed-prebsc-2-s1.binance.org:8545/",
        accounts: ['']
      },
    },
    solidity: {
      compilers: [
        {
          version: "0.8.29",
          settings: {
            optimizer: {
                      enabled: true,
                      runs: 200
          }
          }
        },
        {
          version: "0.8.9",
          settings: {
            optimizer: {
                      enabled: true,
                      runs: 200
          }
          }
        }
      ],
    },
  };
  
export default config;