import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "./web3RPCAdapter";

import "./App.css";
import UserProfile from "./components/UserProfile";
import Rewards from "./components/Rewards";
import WavePortalAdapter from "./WavePortalAdapter";

const CLIENT_ID =
  "BMBHgtOOhgkl_9EiRrLrPTioP7NcFkIhjHfRfdAr92GAkeCFuzspi6XGFGVrvgjoYDeMMGWjA6fJbeHHlLQrl4k";

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [userData, setUserData] = useState({});

  const [totalWaves, setTotalWaves] = useState(0);

  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: CLIENT_ID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            // chainId: "0x13881",
            // rpcTarget: "https://rpc-mumbai.maticvigil.com/",
            chainId: "0xaa36a7",
            rpcTarget: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
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
    getTotalWaves();
  }, [userData]);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();

    const address = await getAccounts();
    // POST to backend/mint
    // body { adderss }

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

  const getTotalWaves = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const wavePortalContract = new WavePortalAdapter(provider);
    debugger;
    const response = await wavePortalContract.getTotalWaves();
    setTotalWaves(response);
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
          Deposited waste: {address}
          <br />
          <br />
          {/* index 1 */}
          Accumulated deposited waste: {balance}
          <br />
          <br />
          Reward balance: {tokenBalance} GWD
        </div>
      </div>
      <hr />
      <Rewards totalWaves={totalWaves} />
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
