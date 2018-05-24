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
    }
  }
}
