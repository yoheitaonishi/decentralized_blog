var ConvertLib = artifacts.require("./ConvertLib.sol");
var DALog = artifacts.require("./DALog.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, DALog);
  deployer.deploy(DALog);
};
