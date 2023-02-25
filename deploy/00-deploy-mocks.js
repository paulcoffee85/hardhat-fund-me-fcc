const { network } = require("hardhat")
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config")

//  includes() function checks to see if variable chaineId is inside some array 'developmentChains

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  // log from deployments, like using console.log
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true, // =  deploying "MockV3Aggregator" (tx: 0x48bdfdd64644a5dd70bcefa793bec388fd55ccc9e6c6b6e4988db8d5cafde888)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
      args: [DECIMALS, INITIAL_ANSWER],
    })

    log("Mocks Deployed!")
    log(
      "---------------------------------------------------------------------------------------"
    )
  }
}
// is there a way to run only deploy-mocks script
module.exports.tags = ["all", "mocks"]
 