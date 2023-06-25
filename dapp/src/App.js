import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "./rpc-adapters/web3RPCAdapter";
import axios from "axios";

import "./App.css";
import UserProfile from "./components/UserProfile";
import NFTCard from "./components/NFTCard";

import GreenwardsAdapter from "./rpc-adapters/GreenwardsAdapter";
import BeGreenAdapter from "./rpc-adapters/BeGreenAdapter";

const CLIENT_ID =
  "BMBHgtOOhgkl_9EiRrLrPTioP7NcFkIhjHfRfdAr92GAkeCFuzspi6XGFGVrvgjoYDeMMGWjA6fJbeHHlLQrl4k";
const BACKEND_URL = "http://localhost:8000/mintNFT";

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [userData, setUserData] = useState({});
  const [nftLoading, setNftLoading] = useState(false);

  // GREENWARDS
  const [tokenBalance, setTokenBalance] = useState(0);

  //BEGREEN
  const [nftDetails, setNftDetails] = useState(null);
  const [depositedWaste, setDepositedWaste] = useState(0);
  const [accumulatedWaste, setAccumulatedWaste] = useState(0);
  // const [topGlobalAccumulator, setTopGlobalAccumulator] = useState([]);
  // const [topSeasonAccumulator, setTopSeasonAccumulator] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: CLIENT_ID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
            rpcTarget: "https://rpc-mumbai.maticvigil.com/",
            // chainId: "0xaa36a7",
            // rpcTarget: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
          },
        });

        setWeb3auth(web3auth);
        await web3auth.initModal();
        setProvider(web3auth.provider);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    getUserInfo();
  }, [provider]);

  useEffect(() => {
    getAccounts();
    getBalance();
    // getTopRecyclers();
  }, [userData]);

  useEffect(() => {
    getTokenBalance();
    getNFTDetails();
    getWasteDetailsByAddress();

    let beGreenContract;
    const listenToMintedNFT = async () => {
      if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
      if (!address) {
        console.log("user address is not present");
        return;
      }
      debugger
      beGreenContract = new BeGreenAdapter(provider);
      await beGreenContract.listenToMintedNFT(address);
    };

    listenToMintedNFT();

    checkOrCreateNFTCreation();
    return async () => {
      if (beGreenContract) {
        await beGreenContract.clearSubscriptions();
      }
    };
  }, [address]);

  const checkOrCreateNFTCreation = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    if (!address) {
      console.log("user address is not present");
      return;
    }
    const beGreenContract = new BeGreenAdapter(provider);
    const balance = await beGreenContract.getUserNFTBalance(address);

    debugger;

    if (balance == 0) {
      try {
        setNftLoading(true);
        const { data } = await axios.post(
          BACKEND_URL,
          { address },
          { crossDomain: true }
        );
        console.log("API response", data);
      } catch (error) {
        setNftLoading(false);
        console.error(error);
      }
    }
  };

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.logout();
    setProvider(web3authProvider);
    setBalance("");
    setAddress("");
    setUserData({});
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
    setUserData(user);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    setAddress(address);
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    setBalance(balance);
    console.log(balance);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
    alert(privateKey);
  };

  const getTokenBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    if (!address) {
      console.log("user address is not present");
      return;
    }
    const greenwardsContract = new GreenwardsAdapter(provider);
    const response = await greenwardsContract.getTokenBalance(address);
    setTokenBalance(response);
  };

  const getNFTDetails = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    if (!address) {
      console.log("user address is not present");
      return;
    }
    const beGreenContract = new BeGreenAdapter(provider);
    const response = await beGreenContract.getNFTDetails(address);
    setNftDetails(response);
  };

  const getWasteDetailsByAddress = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    if (!address) {
      console.log("user address is not present");
      return;
    }
    const beGreenContract = new BeGreenAdapter(provider);
    const { deposited, accumulated } =
      await beGreenContract.getWasteDetailsByAddress(address);

    setDepositedWaste(deposited);
    setAccumulatedWaste(accumulated);
  };

  const loggedInView = (
    <>
      <UserProfile
        userData={userData}
        onLogout={logout}
        onGetPrivateKey={getPrivateKey}
      />
      <hr />
      <div className="col-md-9">
        <div style={{ marginTop: 20, textAlign: "left" }}>
          {/* index 0 */}
          Deposited waste: {depositedWaste}
          <br />
          <br />
          {/* index 1 */}
          Accumulated deposited waste: {accumulatedWaste}
          <br />
          <br />
          Reward balance: {tokenBalance} GWD
          <br />
          <br />
        </div>
      </div>
      <hr />
      {nftDetails && <NFTCard nftDetails={nftDetails} />}
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card custom-btn">
      Login
    </button>
  );

  return (
    <div
      className="container"
      style={{
        textAlign: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: 30 }}>BeGreen DAO</h3>
      <div className="row">
        <div className="col-md-3">
          {" "}
          <div className="grid">{provider ? loggedInView : unloggedInView}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
