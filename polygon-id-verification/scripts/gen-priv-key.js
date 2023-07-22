// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
require("dotenv").config();
/** generate and print a eth private to console using ethers
 *
 * @return {Promise<void>}
 */
async function main() {
  const wallet = hre.ethers.Wallet.createRandom();
  console.log("private key: ", wallet.privateKey);
  console.log("address: ", wallet.address);
}

main();
