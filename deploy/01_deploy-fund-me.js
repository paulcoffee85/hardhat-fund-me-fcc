// import
// main function
// calling of main function

// function deployFunc() {
//   console.log('hi')
// }
// module.exports.default = deployFunc
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()
// module.exports = async (hre) => {
// pull these variables out of HRE
// *****  const {getNamedAccounts, deployments} = hre  ****
// instead 2 lines of
// hre.getNamedAccounts
// hre.deployments

// Syntactical Sugar
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  //   const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress
  // if on development chain...
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address

    // if not on a development chain || if we didn't deploy mock
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    // console.log(await fundMe.priceFeed())
  }
  // console.log("I MADE IT TIL const Args")
  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,

    args: args, // put price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1, // waitConfirmations gives etherscan a chance to index our transaction
  })
  // Don't want to verify on local network
  // console.log("StILL MADE IT TO !Developments")
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // we want to go ahead and verify
    await verify(fundMe.address, args)
  }
  log(
    "--------------------------------------------------------------------------------------------"
  )
}
module.exports.tags = ["all", "fundme"]
// }
