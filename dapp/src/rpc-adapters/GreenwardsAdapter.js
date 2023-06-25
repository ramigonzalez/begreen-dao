import Web3 from "web3";
import RPC from "./web3RPCAdapter";
import GreenwardsJson from "../utils/Greenwards.json";

export default class WavePortalAdapter extends RPC {
  constructor(provider) {
    super(provider);
    this.contractAddress = "0x960e9fFB2Bc1b484457d22E7eC28FD8e27C4CEE7";
    this.contractAbi = GreenwardsJson;
  }

  async getTokenBalance(address) {
    try {
      const web3 = new Web3(this.provider);
      const contract = new web3.eth.Contract(
        this.contractAbi,
        this.contractAddress
      );
      const tokenBalance = await contract.methods.balanceOf(address).call();
      console.log(`Address ${address} has ${tokenBalance} $GWD balance`);
      return tokenBalance;
    } catch (error) {
      return error;
    }
  }
}
