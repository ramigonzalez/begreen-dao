import Web3 from "web3";
import RPC from "./web3RPCAdapter";
import BeGreenJson from "../utils/BeGreen.json";

const WASTE = {
  DEPOSITED: 0,
  ACCUMULATED: 1,
};

const sortUsersByWasteDesc = (users, wasteType) => {
  return Object.entries(users)
    .sort(([, a], [, b]) => b[wasteType] - a[wasteType])
    .map(([user]) => user)
    .slice(0, 3);
};

export default class WavePortalAdapter extends RPC {
  constructor(provider) {
    super(provider);
    this.contractAddress = "0xeaD66c505cfC53F1bfC783753C6e75f5A75E54FE";
    this.contractAbi = BeGreenJson;
    this.eventsNames = {
      accountCreated: "AccountCreated",
      updatedNFT: "UpdateNFT",
    };
  }

  async getUserNFTBalance(address) {
    try {
      const web3 = new Web3(this.provider);
      const contract = new web3.eth.Contract(
        this.contractAbi,
        this.contractAddress
      );
      return contract.methods.balanceOf(address).call();
    } catch (error) {
      console.error("getUserNFTBalance", error);
      return error;
    }
  }

  async getNFTDetails(address) {
    try {
      const web3 = new Web3(this.provider);
      const contract = new web3.eth.Contract(
        this.contractAbi,
        this.contractAddress
      );

      const tokenId = await contract.methods
        .tokenOfOwnerByIndex(address, 0)
        .call();

      debugger;
      const tokenURI = await contract.methods.tokenURI(tokenId).call();
      if (!tokenURI) throw Error("Empty token URI");
      const detailsResponse = await fetch(tokenURI);
      const details = await detailsResponse.json();
      console.log("Retreiving nft details ...", details);
      return details;
    } catch (error) {
      console.error("getNFTDetails", error);
      const detailsResponse = await fetch("https://silver-sound-gamefowl-947.mypinata.cloud/ipfs/QmS1xfi6s5c5xLM2PqX7xqScmtT41QKfEXty6ygR9kLhNj");
      const details = await detailsResponse.json();
      return details;
    }
  }

  async getWasteDetailsByAddress(address) {
    try {
      const web3 = new Web3(this.provider);
      const contract = new web3.eth.Contract(
        this.contractAbi,
        this.contractAddress
      );

      const promises = [
        contract.methods.accumulatedWaste(address, WASTE.DEPOSITED).call(),
        contract.methods.accumulatedWaste(address, WASTE.ACCUMULATED).call(),
      ];
      const [deposited, accumulated] = await Promise.all(promises);

      console.log(
        `Retreiving owner details ... \nDeposited ${deposited} \nAccumulated ${accumulated} `
      );

      return { deposited, accumulated };
    } catch (error) {
      return error;
    }
  }

  async getTopRecyclers() {
    try {
      const web3 = new Web3(this.provider);
      const contract = new web3.eth.Contract(
        this.contractAbi,
        this.contractAddress
      );

      debugger;
      const users = await contract.methods.accumulatedWaste().call();

      const top3AccumulatedUsers = sortUsersByWasteDesc(
        users,
        WASTE.ACCUMULATED
      );
      const top3DepositedUsers = sortUsersByWasteDesc(users, WASTE.DEPOSITED);

      return { top3AccumulatedUsers, top3DepositedUsers };
    } catch (error) {
      return error;
    }
  }

  // async clearSubscription() {
  //   const web3 = new Web3(this.provider);
  //   await web3.eth.clearSubscriptions();
  // }

  // async listenToMintedNFT(address) {
  //   try {
  //     const web3 = new Web3(this.provider);
  //     const contract = new web3.eth.Contract(
  //       this.contractAbi,
  //       this.contractAddress
  //     );

  //     // let options = {
  //     //   fromBlock: 0,
  //     //   address: [address],
  //     //   topics: [],
  //     // };

  //     // const subscription = await web3.eth.subscribe(
  //     //   this.eventsNames.accountCreated,
  //     //   options,
  //     //   (err, event) => {
  //     //     if (!err) console.log("subscription", event);
  //     //   }
  //     // );

  //     // // note that in version 4.x the way you get notified for `data` and `error` has changed
  //     // subscription.on("data", async (blockhead) => {
  //     //   debugger;
  //     //   console.log("New block header: ", blockhead);
  //     // });
  //     // subscription.on("error", (error) =>
  //     //   console.log("Error when subscribing to New block header: ", error)
  //     // );

  //     contract.events
  //       .AccountCreated(() => {})
  //       .on("connected", function (subscriptionId) {
  //         console.log("SubID: ", subscriptionId);
  //       })
  //       .on("data", function (event) {
  //         console.log("Event:", event);
  //         console.log("Owner Wallet Address: ", event.returnValues.owner);
  //         //Write send email process here!
  //       })
  //       .on("changed", function (event) {
  //         //Do something when it is removed from the database.
  //       })
  //       .on("error", function (error, receipt) {
  //         console.log("Error:", error, receipt);
  //       });
  //   } catch (error) {
  //     return error;
  //   }
  // }
}
