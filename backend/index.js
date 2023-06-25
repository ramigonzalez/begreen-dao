require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const app = express();
app.use(formidableMiddleware());
const { ethers } = require("ethers");
const beGreenABI = require("./BeGreen.json");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.gateway.tenderly.co")

app.post("/mintNFT", async (req, res) => {
  let {
    address
  } = req.fields;

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const beGreen = new ethers.Contract(process.env.BEGREEN_CONTRACT_ADDRESS, beGreenABI, wallet);
  let txReceipt;
  try {
      txReceipt = await beGreen.safeMint(address,"https://silver-sound-gamefowl-947.mypinata.cloud/ipfs/QmS1xfi6s5c5xLM2PqX7xqScmtT41QKfEXty6ygR9kLhNj");
  } catch (error) {
      console.log(error);
  }

  if (txReceipt) {
    res.status(200).json({ txReceipt });
  } else {
    res.status(400).json({ message: "Some error happened" });
  }
});

app.all("*", function (req, res) {
  res.json({ message: "Not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server on port ${process.env.PORT}`);
});

module.exports = app;
