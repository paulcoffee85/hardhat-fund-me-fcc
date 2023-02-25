const { deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

// UNIT TESTS ONLY RUN ON DEVELOPMENT CHAINS ( hence the !devel....)
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      // We want to deploy our FUNDME contract before testing
      let fundMe
      let deployer
      let mockV3Aggregator
      const sendValue = ethers.utils.parseEther("1")
      beforeEach(async function () {
        // Use hardhat deploy to deploy FUNDME contract
        // deployments object has a function called "Fixture()" which deploys all contracts in the deploy folder with just this one line

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer) // when we call a function with fundMe, automatically be from that deployer
        // account   && another way to get deployer accounts is with ethers.getSigners()
        const accounts = await ethers.getSigners()
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })
      describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
          const response = await fundMe.getPriceFeed()
          assert.equal(response, mockV3Aggregator.address)
          console.log(mockV3Aggregator.address)
          console.log(await fundMe.getPriceFeed())
        })
      })
      describe("fund", async function () {
        it("Fails if you don't send enough ETH!", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          )
        })
        it("updated the amount funded data structure", async function () {
          await fundMe.fund({ value: sendValue })
          const response = await fundMe.getAddressToAmountFunded(deployer)

          assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of getFunder", async function () {
          await fundMe.fund({ value: sendValue })
          console.log(deployer)
          const funder = await fundMe.getFunder(0)
          assert.equal(funder, deployer)
        })
      })
      describe("withdraw", async function () {
        beforeEach(async function () {
          // Fund the contract 1 Eth
          await fundMe.fund({ value: sendValue })
        })

        //************************************************************************************************************************* */
        it("withdraw ETH from a single funder", async function () {
          // arrange
          // Start with the Balance of the FundMe contract
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          // Get starting Balance of the Deployer
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(deployer)
          // console.log(fundMe.address)

          // act
          // Withdraw
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(endingDeployerBalance)
          // console.log(endingFundMeBalance)

          // assert

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance.toString()),
            endingDeployerBalance.add(gasCost).toString()
          )
        })
        //************************************************************************************************************************* */
        it("withdraw ETH from a single funder", async function () {
          // arrange
          // Start with the Balance of the FundMe contract
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          // Get starting Balance of the Deployer
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(deployer)
          // console.log(fundMe.address)

          // act
          // Withdraw
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(endingDeployerBalance)
          // console.log(endingFundMeBalance)

          // assert

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance.toString()),
            endingDeployerBalance.add(gasCost).toString()
          )
        })
        // ****************************************************************************************************************************
        // it("cheaperWithdraw testing....", async function () {
        //   // arrange
        //   const accounts = await ethers.getSigners()
        //   for (i = 1; i < 6; i++) {
        //     const fundMeConnectedContract = await fundMe.connect(accounts[i])
        //     await fundMeConnectedContract.fund({ value: sendValue })
        //   }
        //   // Start with the Balance of the FundMe contract
        //   const startingFundMeBalance = await fundMe.provider.getBalance(
        //     fundMe.address
        //   )
        //   // Get starting Balance of the Deployer
        //   const startingDeployerBalance = await fundMe.provider.getBalance(deployer)
        //   // console.log(deployer)
        //   // console.log(fundMe.address)

        //   // act
        //   // Withdraw
        //   const transactionResponse = await fundMe.cheaperWithdraw()
        //   const transactionReceipt = await transactionResponse.wait(1)
        //   const { gasUsed, effectiveGasPrice } = transactionReceipt
        //   const gasCost = gasUsed.mul(effectiveGasPrice)

        //   const endingFundMeBalance = await fundMe.provider.getBalance(
        //     fundMe.address
        //   )

        //   const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
        //   // console.log(endingDeployerBalance)
        //   // console.log(endingFundMeBalance)

        //   // assert

        //   assert.equal(endingFundMeBalance, 0)
        //   assert.equal(
        //     startingFundMeBalance.add(startingDeployerBalance.toString()),
        //     endingDeployerBalance.add(gasCost).toString()
        //   )

        //   await expect(fundMe.getFunder(0)).to.be.reverted
        //   for (i = 1; i < 6; i++) {
        //     assert.equal(
        //       await fundMe.getAddressToAmountFunded(accounts[i].address),
        //       0
        //     )
        //   }
        // })
        //***************************************************************************************************************************** */
        it("cheaperWithdraw testing....", async function () {
          // arrange
          const accounts = await ethers.getSigners()
          for (i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendValue })
          }
          // Start with the Balance of the FundMe contract
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          // Get starting Balance of the Deployer
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(deployer)
          // console.log(fundMe.address)

          // act
          // Withdraw
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(endingDeployerBalance)
          // console.log(endingFundMeBalance)

          // assert

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance.toString()),
            endingDeployerBalance.add(gasCost).toString()
          )

          await expect(fundMe.getFunder(0)).to.be.reverted
          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            )
          }
        })
        // **************************************************************************************************************

        it("Allows us to withdraw with multiple funders", async function () {
          // arrange
          const accounts = await ethers.getSigners()
          for (i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendValue })
          }
          // Start with the Balance of the FundMe contract
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          // Get starting Balance of the Deployer
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(deployer)
          // console.log(fundMe.address)

          // act
          // Withdraw
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // console.log(endingDeployerBalance)
          // console.log(endingFundMeBalance)

          // assert

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance.toString()),
            endingDeployerBalance.add(gasCost).toString()
          )

          await expect(fundMe.getFunder(0)).to.be.reverted
          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            )
          }
        })

        //********************************************************************************************************************************** */
        it("Only allows owner to withdraw", async function () {
          const accounts = await ethers.getSigners()
          const attacker = accounts[1]
          //  We're connecting the attacker, not just the addres ' connect(attacker.address)
          const attackerConnectedContract = await fundMe.connect(attacker)
          await expect(
            attackerConnectedContract.withdraw()
          ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
        })
      })
    })
