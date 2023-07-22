const hre = require("hardhat");

async function main() {
  const verifierContract = "PolygonIdMinter";

  const spongePoseidonLib = "0x12d8C87A61dAa6DD31d8196187cFa37d1C647153";
  const poseidon6Lib = "0xb588b8f07012Dc958aa90EFc7d3CF943057F17d7";

  const PolygonIdMinter = await hre.ethers.getContractFactory(
    verifierContract,
    {
      libraries: {
        SpongePoseidon: spongePoseidonLib,
        PoseidonUnit6L: poseidon6Lib,
      },
    }
  );

  console.log("network", hre.network);

  const erc20Verifier = await PolygonIdMinter.deploy(
    "0xEa412a48E2EDFB3771aa61aFc14E203828D1e237"
  );

  const result = await erc20Verifier.deployed();
  console.log(`Polygon ID minter ${result.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
