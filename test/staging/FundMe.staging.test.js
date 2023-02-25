//  Last step Before mainnet
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")
// STAGING TESTS ONLY RUN ON TESTNETS
developmentChains.includes(network.name)
  ? describe.skip
  : //  This will only run if we're not on a developmentChain.
    describe("FundMe", function () {
      let fundMe
      let deployer
      const sendValue = ethers.utils.parseEther("1")

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        //   connect fundMe to our deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })
      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw()
        const endingBalance = await fundMe.provider.getBalance(fundMe.address)
        assert.equal(endingBalance.toString(), "0")
      })
    })
