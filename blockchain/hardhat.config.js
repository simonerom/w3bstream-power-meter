/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    testnet: {
      // IoTeX Testnet
      url: "https://babel-api.testnet.iotex.io",
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      // IoTeX Mainnet
      url: "https://babel-api.mainnet.iotex.io",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
