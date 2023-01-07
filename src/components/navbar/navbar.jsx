import React, { useState, useEffect, useRef } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import MenuIcon from "./MenuIcon";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'


const Navbar = () => {
  // const [error, setError] = useState();
  let navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector()
  });

  const { disconnect } = useDisconnect();
  const walletOptions = useRef();
  const menuRef = useRef();
  const exploreMenuRef = useRef();



  // const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [connected, setConnection] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [account, setAccount] = useState(null);
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [chain, setChainStatus] = useState(false);

  const connectMeta = () => {
    connect();
    checkChain();
    setAccount(address);
    setShowOptions(false);
  };

  const connectTron = async () => {
    if (window.tronWeb) {
      const address = await window.tronWeb.request({ method: 'tron_requestAccounts' });
      console.log(address);
      if (address.code === 200) {
        console.log(window.tronWeb.defaultAddress.base58);
        setShowOptions(false);
        setConnection(true);
        setAccount(window.tronWeb.defaultAddress.base58);
      } else {
        // alert("Something went wrong");
      }
    } else {
      alert("please install a tronlink wallet to proceed.")
    }
  };

  const disconnectTron = () => {
    disconnect();
    if (window.tronWeb) {
      // window.tronWeb.disconnect();
      setConnection(false);
    }
  }

  const addChain = () => {
    if (window.ethereum) {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x13881",
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          chainName: "Mumbai Testnet",
          // nativeCurrency: {
          //     name: "BitTorrent",
          //     symbol: "BTT",
          //     decimals: 18
          // },
          blockExplorerUrls: ["https://polygonscan.com/"]
        }]
      })
      setChainStatus(false);
    } else {
      alert("Please Install a wallet to proceed.")
    }
  }

  const checkChain = async () => {
    if (window.ethereum) {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId !== 80001) {
        // setChainStatus(true);
        addChain();
        return true;
      } else {
        // setChainStatus(false);
        return false;
      }

    } else {
      alert("Please install a wallet.")
    }
  }

  useEffect(() => {
    console.log(isConnected);
    if (isConnected) {
      setConnection(true);
    } else {
      setConnection(false);
    }
  }, [isConnected])

  useEffect(() => {
    if (isConnected) {
      checkChain();
      setConnection(true);
    } else {
      setConnection(false);
    }
    if (window.tronWeb) {
      if (window.tronWeb.defaultAddress.base58) {
        setConnection(true);
        setAccount();
      } else {
        setConnection(false);
      }
    }
  }, []);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (walletOptions.current && !walletOptions.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [walletOptions]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target)) {
        setShowExploreMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exploreMenuRef])

  // useEffect(() => {
  //   if (!window.tronWeb.defaultAddress) {
  //     disconnectTron();
  //   }
  // }, [window.tronWeb, window.tronWeb.defaultAddress])

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <img style={{ width: "250px", height: "80px" }} src={logo} />
        </Link>
        {/* <div onClick={handleClick} className="nav-icon">
        {open ? <FiX /> : <FiMenu />}
      </div> */}
        {/* <ul className={open ? "nav-links" : "nav-links active"}> */}
        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <div className="navtextstyle">Home</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/player" className="nav-link">
              <div className="navtextstyle">Player</div>
            </Link>
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={() => { setShowExploreMenu(!showMenu) }}>
              <div className="navtextstyle">Explore</div>
            </span>
            {/* <span>
              <Link className="navtextstyle" to="/all-artists">Explore</Link>
            </span> */}
            {
              showExploreMenu
                ?
                <div className="nav-sub-menu" ref={exploreMenuRef}>
                  <ul className="nav-sub-menu">
                    <li>
                      <Link to="/all-nfts" onClick={() => { setShowExploreMenu(false) }} className="nav-sub-menu-link">All NFTs</Link>
                    </li>
                    <li>
                      <Link to="/all-artists" onClick={() => { setShowExploreMenu(false) }} className="nav-sub-menu-link">All Artists</Link>
                    </li>
                  </ul>
                </div>
                :
                null
            }

          </li>
          {/* <li className="nav-item">
            <Link to="/explore" className="nav-link">
              <div className="navtextstyle">Explore</div>
            </Link>
          </li> */}
          {
            connected || isConnected
              ?
              <>
                <li className="nav-item">
                  <span className="nav-link" onClick={() => { setShowMenu(!showMenu) }}>
                    <div className="navtextstyle">Stream</div>
                  </span>
                  {
                    showMenu
                      ?
                      <div className="nav-sub-menu" ref={menuRef}>
                        <ul className="nav-sub-menu">
                          <li>
                            <Link to="/streaming" onClick={() => { setShowMenu(false) }} className="nav-sub-menu-link">Go Live</Link>
                          </li>
                          <li>
                            <Link to="/all-stream" onClick={() => { setShowMenu(false) }} className="nav-sub-menu-link">All Streams</Link>
                          </li>
                          {/* <li>
                            <Link to="/all-live-stream" onClick={() => { setShowMenu(false) }} className="nav-sub-menu-link">Live Streams</Link>
                          </li> */}
                        </ul>
                      </div>
                      :
                      null
                  }

                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                    <div className="navtextstyle">Profile</div>
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-disconnect" onClick={() => { disconnect(); disconnectTron() }}>disconnect</button>
                </li>
                {/* {
                  chain
                    ?
                    <div className="main">
                      <div className="add-chain-main">
                        <div className="add-chain-box">
                          <p className="add-chain-message">
                            Currently our application only supports bittorrent testnet. Please add the BTT chain. If you have already added please switch to BTT.
                          </p>
                          <button className="add-chain-btn" onClick={() => { addChain() }}>add chain</button>
                        </div>
                      </div>
                    </div>
                    :
                    null
                } */}
              </>
              :
              <li className="nav-item">
                <button className="nav-button" onClick={() => { setShowOptions(true) }}>Connect</button>
              </li>
          }
        </ul>
        <div className="nav-ham-menu" onClick={() => { setMenu(!menu) }}>
          <MenuIcon />
        </div>
        {
          menu
            ?
            <div className="mobile-menu">
              <ul>
                <li>
                  <span onClick={() => { navigate("/") }}>Home</span>
                </li>
                <li>
                  <span onClick={() => { navigate("/player") }}>Player</span>
                </li>
                <li>
                  <span onClick={() => { navigate("/all-artists") }}>Explore</span>
                </li>
                {
                  connected
                    ?
                    <>
                      <li>
                        <span onClick={() => { navigate("/streaming") }}>Stream</span>
                      </li>
                      <li>
                        <span onClick={() => { navigate("/profile") }}>Profile</span>
                      </li>
                      <button className="nav-button" onClick={() => { disconnectTron(); }}>Disconnect</button>
                    </>
                    :
                    <button className="nav-button" onClick={() => { setShowOptions(true) }}>Connect</button>
                }
              </ul>
            </div>
            :
            null
        }
      </nav>
      {
        showOptions
          ?
          <div className="connection-options-container">
            <div className="connection-options">
              <div className="options-holder" ref={walletOptions}>
                <div className="options-heading">
                  <h2>Please connect with wallets provided</h2>
                </div>
                <div className="options-container">
                  <span className="wallets">
                    <img className="wallet-image" onClick={() => { connectMeta() }} src="images/mm.png" alt="Connect to Metamask" />
                  </span>
                  <span className="wallets">
                    <img className="wallet-image" onClick={() => { connectTron() }} src="images/tl.svg" alt="Connect to TronLink" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          :
          null
      }
    </>
  );
};

export default Navbar;
