import Web3 from "web3";
import RPC from "./web3RPCAdapter";
import WavePortalJson from "./utils/WavePortal.json";

export default class WavePortalAdapter extends RPC {
  constructor(provider) {
    super(provider);
    this.contractAddress = "0x768Ea872179723d5378A13A4ff68368bA2bA07De";
    this.contractAbi = WavePortalJson.abi;
  }

  async getTotalWaves() {
    try {
      const web3 = new Web3(this.provider);
      const wavePortalContract = new web3.eth.Contract(
        this.contractAbi,
        this.contractAddress
      );
      const totalWaves = await wavePortalContract.methods.totalWaves().call();
      console.log("Retreiving total waves count...", totalWaves);
      return totalWaves;
    } catch (error) {
      return error;
    }
  }
}
