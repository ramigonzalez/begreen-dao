import { ethers } from "hardhat";

async function main() {
  const BeGreen = await ethers.getContractFactory("BeGreen");
  const beGreen = await BeGreen.deploy();

  let txReceiptBeGreen = await (await beGreen.deployed()).deployTransaction.wait(2);

  console.log(
    `beGreen deployed to ${beGreen.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
