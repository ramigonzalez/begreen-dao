require("dotenv").config();
import hre from "hardhat";

async function main() {
  //Deploy BeGreen
  const BeGreen = await hre.ethers.getContractFactory("BeGreen");
  const beGreen = await BeGreen.deploy();
  //Deploy Greenwards
  const Greenwards = await hre.ethers.getContractFactory("Greenwards");
  const greenwards = await Greenwards.deploy();

  //Logs BeGreen
  console.log("Deploying beGreen...");
  let txReceiptBeGreen = await (await beGreen.deployed()).deployTransaction.wait(1);
  console.log("--------txReceiptBeGreen", txReceiptBeGreen);
  console.log(
    `beGreen deployed to ${beGreen.address}`
  );

  //Logs Greenwards
  console.log("Deploying greenwards...");
  let txReceiptGreenwards = await (await greenwards.deployed()).deployTransaction.wait(1);
  console.log("--------txReceiptGreenwards", txReceiptGreenwards);
  console.log(
    `greenwards deployed to ${greenwards.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
