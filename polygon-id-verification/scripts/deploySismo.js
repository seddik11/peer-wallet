const hre = require("hardhat");

async function main() {
  const verifierContract = "MintGovernanceToken";

  const sismoMinter = await hre.ethers.getContractFactory(verifierContract);

  console.log("network", hre.network);

  const erc20Verifier = await sismoMinter.deploy(
    "0x69015912AA33720b842dCD6aC059Ed623F28d9f7", // trusted forwarder
    "0xEa412a48E2EDFB3771aa61aFc14E203828D1e237" // ERC20 contract
  );

  const result = await erc20Verifier.deployed();
  console.log(`Sismo minter ${result.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
