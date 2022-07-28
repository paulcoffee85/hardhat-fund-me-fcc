// const { task } = require("hardhat/config")

require("@nomiclabs/hardhat-waffle")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("./tasks/block-number")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
/** import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL =
    process.env.RINKEBY_RPC_URL ||
    "https://eth-rinkeby.alchemyapi.io/v2/UPvGXgCFBS5OgUex_Y6PPWd8o5xwM-oP"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY || "0x96ceC5D10Cd3AeDe2ED8bc2036BFA9FE1B440A16"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
module.exports = {
    //solidity 0.8.8

    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmations: 6,
            gas: 6000000,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",

            chainId: 31337,
        },
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 0,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        // coinmarketcap: COINMARKETCAP_API_KEY,
        token: "ETH",
    },
}
