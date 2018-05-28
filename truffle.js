var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.ROPSTEN_MNEMONIC;
var accessToken = process.env.INFURA_ACCESS_TOKEN;
console.log(mnemonic);
console.log(accessToken);

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: 5777 // Match any network id
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "01e305547756a4ceed5c47e6aaa3f4ee907605af", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },
    ropsten:  {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/" + accessToken
        );
      },
      network_id: 3,
      gas: 6612388, // Gas limit used for deploys
      gasPrice: 20000000000, // 20 gwei
    },
    networks: {
      "live": {
        network_id: 1,
        host: "127.0.0.1",
        port: 8546   // Different than the default below
      }
    },
    rpc: {
      host: "127.0.0.1",
      port: 8545
    }
  }
}
