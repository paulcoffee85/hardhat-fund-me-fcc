const { getNamedAccounts } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  const transactionResponse = await fundMe.withdraw()
  console.log("Withdrawing funds...")
  await transactionResponse.wait(1)
  console.log("Funds WithDrawn....")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
