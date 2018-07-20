var HDWalletProvider = require("truffle-hdwallet-provider");
var ropsten_mnemonic = process.env.ROPSTEN_MNEMONIC;
var mainnet_mnemonic = process.env.MAINNET_MNEMONIC;
var accessToken = process.env.INFURA_ACCESS_TOKEN;
console.log(ropsten_mnemonic);
console.log(accessToken);

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: 5777 // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          ropsten_mnemonic,
          "https://ropsten.infura.io/" + accessToken
        );
      },
      network_id: 3,
      gas: 4700000
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(
          mainnet_mnemonic,
          "https://mainnet.infura.io/" + accessToken
        );
      },
      network_id: 1,
    }
  },
}
