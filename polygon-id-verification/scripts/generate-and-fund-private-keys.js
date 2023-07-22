require("dotenv").config();
/**
 * Loop over the 100 accounts and generate a private key for each one and send 0.1 matic to it, from the parent account
 */
const ethers = require("ethers");
const JsonRpcProvider = require("@ethersproject/providers").JsonRpcProvider;

const parentAccount = new ethers.Wallet(process.env.MUMBAI_PRIVATE_KEY);

const generatePrivateKeys = async () => {
  const signer = new ethers.Wallet(parentAccount.privateKey).connect(
    new JsonRpcProvider("https://polygon-mumbai.blockpi.network/v1/rpc/public")
  );
  const privateKeys = [];

  console.log(
    `Parent account: ${
      parentAccount.address
    } balance: ${await signer.getBalance()}`
  );

  for (let i = 0; i < 100; i++) {
    const wallet = ethers.Wallet.createRandom();
    const tx = await signer.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("0.1"),
    });
    console.log(wallet.privateKey);
    privateKeys.push(wallet.privateKey);
  }
};

generatePrivateKeys();
