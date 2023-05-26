import { useEffect, useRef, useState } from "react";
import { useAccount, useEnsName, useEnsAvatar, useNetwork } from "wagmi";
import { useNavigate } from "react-router-dom";
import "./profile.scss";
// import { Collections } from "../explore/artist-single/collection_dummy";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import classicChords from "../../contract/artifacts/classicChords.json";
import classicChordsBTTC from "../../contract/artifacts/classicChordsBTTC.json";
import market from "../../contract/artifacts/market.json";
import marketBTTC from "../../contract/artifacts/marketBTTC.json";
import user from "../../contract/artifacts/userStream.json";
import userBTTC from "../../contract/artifacts/userStreamBTTC.json";
import { Web3Storage } from "web3.storage";
import { ENS } from "@ensdomains/ensjs";
import axios from "axios";
import Loading3 from "../../loading3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isCompositeComponentWithType } from "react-dom/test-utils";
// import Loading from "../../loading";

const client = new Web3Storage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng",
});

const Profile = () => {
  const fileInputRef = useRef();
  const { isConnected, address } = useAccount();
  const [profileWindow, showProfileWindow] = useState(false);
  const [showMintedNFTs, setMintedNFTs] = useState(true);
  const [showOwnedNFTs, setOwnedNFTs] = useState(false);
  const [requests, setRequests] = useState(false);
  const [allRequests, setAllRequests] = useState(true);
  const [requested, setRequested] = useState(false);
  const [myRequests, setMyRequests] = useState(false);
  const [requestIdSubmitWork, setRequestIdSubmitWork] = useState();
  const [btnLoading, setbtnLoading] = useState(false);

  const fileRef = useRef(null);
  const editUserPopup = useRef(null);
  const navigate = useNavigate();
  // const ensInstance = new ENS();
  const [cid, setCid] = useState();
  const { chain } = useNetwork();
  const [userDefault, setUserDefault] = useState({
    name: null,
    bio: null,
    profile_pic: null,
    userId: null,
  });
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    profile_pic: null,
  });
  const [chains, setChainStatus] = useState(false);
  const [ProfileImage, setprofileImage] = useState(null);
  const [mintedNfts, setMintedNfts] = useState([]);
  const [userNfts, setUserNfts] = useState([]);
  const [isCompLoading, setIsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [artistSelected, setArtistSelected] = useState(false);
  const [showChargesOfUser, setChargesOfUser] = useState();
  const [submitWorkPopup, setSubmitWorkPopup] = useState(false);

  const [ENSName, setENSName] = useState("");
  const [ENSAvatar, setENSAvatar] = useState(null);

  const toastInfo = () =>
    toast.info("Wait...IPFS is prepareing your profile image");
  const toastSuccess = (e) => toast.success(e);
  const toastError = (e) => toast.error(e);
  const streamMessage = () => toast.info("Sign with XMTP for Live Chat");

  const RPC_ENDPOINT = "https://rpc-mumbai.maticvigil.com/";

  // const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";
  // const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
  // const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"

  // const firstFive = Collections.slice(0, 5);
  // const lastFive = Collections.slice(-5);

  const getProfile = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        // const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const { chainId } = await provider.getNetwork();
        console.log("switch case for this case is: " + chainId);

        let contract;
        let tokenContract;
        let marketContract;

        if (chainId === 80001) {
          contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS_POLYGON_TESTNET,
            user,
            provider
          );
          tokenContract = new ethers.Contract(
            process.env.REACT_APP_CLASSIC_CHORDS_POLYGON_TESTNET,
            classicChords,
            provider
          );
          marketContract = new ethers.Contract(
            process.env.REACT_APP_MARKET_ADDRESS_POLYGON_TESTNET,
            market,
            provider
          );
        } else if (chainId === 1029) {
          console.log("inside the BTTC");
          contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS_BTTC_TESTNET,
            userBTTC,
            provider
          );
          tokenContract = new ethers.Contract(
            process.env.REACT_APP_CLASSIC_CHORDS_BTTC_TESTNET,
            classicChordsBTTC,
            provider
          );
          marketContract = new ethers.Contract(
            process.env.REACT_APP_MARKET_ADDRESS_BTTC_TESTNET,
            marketBTTC,
            provider
          );
        }else if (chainId === 199) {
          console.log("inside the BTTC");
          contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS_BTTC_MAINNET,
            userBTTC,
            provider
          );
          tokenContract = new ethers.Contract(
            process.env.REACT_APP_CLASSIC_CHORDS_BTTC_MAINNET,
            classicChordsBTTC,
            provider
          );
          marketContract = new ethers.Contract(
            process.env.REACT_APP_MARKET_ADDRESS_BTTC_MAINNET,
            marketBTTC,
            provider
          );
        }
        const Id = await contract.userAddressToIdMapping(address);
        console.log(Id);
        const tx = await contract.userIdToUser(Id)
        const client = new Web3Storage({
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng",
        });
        const profilePic = await client.get(tx.profileImage);
        // console.log(await marketContract.getUserNfts(address));
        // console.log(await tokenContract.mintedNfts(address));
        const ids = await tokenContract.mintedNfts(address);
        const ids2 = await marketContract.getUserNfts(address);
        const allRequests = await contract.getAllGlobalRequest();
        console.log(allRequests);
        setRequests(allRequests);
        // console.log(ids.length);
        let nfts = [];
        for (let i = 0; i < ids.length; i++) {
          const uri = await tokenContract.tokenUriMapping(ids[i].toNumber());
          // console.log(uri);
          try {
            await axios
              .get("https://ipfs.io/ipfs/" + uri.split("//")[1])
              .then((response) => {
                let data = response.data;
                data.image =
                  "https://ipfs.io/ipfs/" + data.image.split("//")[1];
                response.data.id = ids[i].toNumber();
                nfts.push(response.data);
                // console.log(response.data);
              });
          } catch (error) {
            console.log(error);
          }
        }

        let nfts2 = [];
        for (let i = 0; i < ids2.length; i++) {
          const uri = await tokenContract.tokenUriMapping(
            ids2[i].tokenId.toNumber()
          );
          // console.log(uri);
          try {
            await axios
              .get("https://ipfs.io/ipfs/" + uri.split("//")[1])
              .then((response) => {
                let data = response.data;
                data.image =
                  "https://ipfs.io/ipfs/" + data.image.split("//")[1];
                response.data.id = ids2[i].tokenId.toNumber();
                nfts2.push(response.data);
                // console.log(response.data);
              });
          } catch (error) {
            console.log(error);
          }
        }

        // console.log(nfts);
        setMintedNfts(nfts);
        // console.log(nfts2);
        setUserNfts(nfts2);
        // console.log(profilePic);

        // console.log(tx);
        setUserDefault({
          name: tx.name,
          bio: tx.description,
          profile_pic: tx.profileImage,
          userId: tx.userId,
        });
        setUserData({
          name: tx.name,
          bio: tx.description,
          profile_pic: tx.profileImage,
        });
        setIsLoading(true);
        setProfileLoading(false);
        // } else {
        //     // alert("Please connect to the Mumbai Testnet Network!");
        //     setChainStatus(true);
        //     setProfileLoading(false);
        // }
      }
    } catch (error) {
      console.log(error);
      setProfileLoading(false);
    }
  };

  // const addChain = () => {
  //   if (window.ethereum) {
  //     window.ethereum.request({
  //       method: "wallet_addEthereumChain",
  //       params: [
  //         {
  //           chainId: "0x13881",
  //           rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  //           chainName: "Mumbai Testnet",
  //           // nativeCurrency: {
  //           //     name: "BitTorrent",
  //           //     symbol: "BTT",
  //           //     decimals: 18
  //           // },
  //           blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  //         },
  //       ],
  //     });
  //     setChainStatus(false);
  //   } else {
  //     alert("Please Install a wallet to proceed.");
  //   }
  // };

  const getContract = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const { chainId } = await provider.getNetwork();
        console.log("switch case for this case is: " + chainId);
        if (chainId === 80001) {
          const contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS_POLYGON_TESTNET,
            user,
            signer
          );
          return contract;
        } else if (chainId === 1029) {
          const contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS_BTTC_TESTNET,
            userBTTC,
            signer
          );
          return contract;
        }else if (chainId === 199) {
          console.log("inside the BTTC");
          const contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS_BTTC_MAINNET,
            userBTTC,
            signer
          );
          return contract
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addUserData = async () => {
    try {
      setbtnLoading(true);
      let profilecid;
      const client = new Web3Storage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng",
      });
      // const upload = await client.put([ProfileImage], {
      //   name: ProfileImage.name,
      //   maxRetries: 3,
      // });

      if (ProfileImage) {
        toastInfo();
        const upload = document.querySelector('input[type="file"]');
        const rootCid = await client.put(upload.files, {
          name: ProfileImage.name,
          maxRetries: 3,
        });
        const res = await client.get(rootCid); // Web3Response
        const files = await res.files(ProfileImage); // Web3File[]
        console.log(files);
        setCid(files[0].cid);
        profilecid = files[0].cid;
        // for (const file of files) {
        //   console.log(`${file.cid}`);
        //   setCid((prev) => (prev = file.cid));
        // }
        if (profilecid) {
          toastSuccess("Your image successfully uploaded on the IPFS");
        }
        console.log(profilecid);
        console.log(upload);
        console.log(userDefault);
      }
      const contract = await getContract();
      if (!userDefault.name) {
        console.log("inside register");
        console.log(userData, cid, artistSelected, showChargesOfUser);
        const getData = await contract.registerUser(
          userData.name,
          userData.bio,
          // upload + "/" + ProfileImage.name
          profilecid,
          artistSelected,
          showChargesOfUser
        );

        // toastSuccess();
        if (getData) {
          toastSuccess("You have successfully signed up");
        }
        console.log(getData);
        getProfile();
        showProfileWindow(false);
      } else {
        console.log("i am here...");
        // console.log(upload + "/" + ProfileImage.name);
        console.log(userDefault);
        const getData = await contract.updateUser(
          userDefault.userId,
          userData.name,
          userData.bio,
          // upload + "/" + ProfileImage.name
          profilecid ? profilecid : userDefault.profile_pic
        );
        await getData.wait();
        // toastInfo();
        // console.log("inni");
        if (getData) {
          showProfileWindow(false);
          toastSuccess("You have successfully updated your profile");
          console.log(getData);
          setbtnLoading(false);
          getProfile();
        }
      }
    } catch (error) {
      toastError("Error");
      console.log(error);
      setbtnLoading(false);
    }
  };

  const songReqResponse = async (id, ans) => {
    console.log(id, ans);
    try {
      const contract = await getContract();
      console.log(contract);
      const tx = await contract.songRequestResponse(id, ans);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const submitWork = async (request_id) => {
    const fileInput = document.getElementById("submitwork");
    const cid = await client.put(fileInput.files);
    const fileCidWithName = cid + "/" + fileInput.files[0].name;
    console.log(request_id, fileCidWithName);
    try {
      const contract = await getContract();
      console.log(contract);
      const tx = await contract.sumbitWork(request_id, fileCidWithName);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }

    // checkChain();
    setProfileLoading(true);
    getProfile();
  }, []);

  // useEffect(() => {
  //   if (ENSName) {
  //     console.log(ENSName);
  //   }
  // }, [ENSName]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        editUserPopup.current &&
        !editUserPopup.current.contains(event.target)
      ) {
        showProfileWindow(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editUserPopup]);

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected]);

  useEffect(() => {
    // console.log(ProfileImage);
    if (ProfileImage) {
      const image = URL.createObjectURL(ProfileImage);
      // console.log(image);
      setUserData({ ...userData, profile_pic: image });
    }
  }, [ProfileImage]);

  if (!address) {
    return (
      <>
        <Loading3 />
        {/* {chain ? (
          <div className="profile-main">
            <div className="add-chain-main">
              <div className="add-chain-box">
                <p className="add-chain-message">
                  Currently our application only supports polygon MUMBAI
                  testnet. Please add the MUMBAI testnet. If you have already
                  added please switch to MUMBAI testnet.
                </p>
                <button
                  className="add-chain-btn"
                  onClick={() => {
                    addChain();
                  }}
                >
                  add chain
                </button>
              </div>
            </div>
          </div>
        ) : null} */}
      </>
    );
  } else {
    return (
      <>
        <div className="profile-main">
          {profileLoading ? (
            <div className="loading-main-style">
              <Loading3 />
            </div>
          ) : (
            <>
              <div className="profile-images">
                <div className="profile-background-holder">
                  <img
                    className="profile-background"
                    src="images/default-background.jpg"
                    alt=""
                  />
                </div>
                <div className="profile-pic-move-up">
                  <div className="profile-pic-holder">
                    <img
                      className="profile-pic"
                      src={
                        userDefault.profile_pic
                          ? `https://` +
                            userDefault.profile_pic +
                            `.ipfs.w3s.link`
                          : "images/profile.svg"
                      }
                      alt="profileimage"
                    />
                  </div>
                </div>
              </div>
              <div className="edit-profile">
                <img
                  className="edit-profile-button"
                  src="images/edit-btn.svg"
                  alt=""
                  onClick={() => {
                    showProfileWindow(true);
                  }}
                />
              </div>
              <div className="profile-user-details">
                <div className="profile-details-holder">
                  <h2 className="profile-username">
                    {userDefault.name ? userDefault.name : "Unknown"}
                  </h2>
                  <h3 className="profile-address">
                    {address
                      ? address.slice(0, 4) + "...." + address.slice(-5)
                      : null}{" "}
                  </h3>
                  <div className="profile-bio-holder">
                    <p className="profile-bio">
                      {userDefault.bio
                        ? userDefault.bio
                        : "No Bio added... Please add it using the edit button provided beside."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="nfts-minted-holder">
                <h2 className="nfts-minted-header">NFTs Minted</h2>
                <div className="nfts-minted-container">
                  <div className="nfts-creations-list">
                    {isCompLoading ? (
                      mintedNfts.length > 0 ? (
                        mintedNfts.map((collection, i) => (
                          <Link key={i} to={"/sell-nft/" + collection.id}>
                            <div className="nfts-collection-pa">
                              <div className="nfts-bg">
                                <div className="nfts-img">
                                  <video
                                    className="nfts-nft"
                                    src={collection.image}
                                    controls
                                  />
                                </div>
                                <div
                                  className="nfts-name"
                                  title={collection.name}
                                >
                                  {collection.name}
                                </div>
                                <p className="nfts-description">
                                  {collection.description}
                                </p>
                                {/* <div className="buy-button-holder">
                                                                        <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>Put on sale </span>
                                                                            &nbsp; <img src="/images/tl.svg" width="15px" height="15px" /><span>{collection.price}</span>
                                                                        </button>
                                                                    </div> */}
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <h4 className="profile-title">No Nfts Found...</h4>
                      )
                    ) : (
                      <h4 className="profile-title">Loading</h4>
                    )}
                  </div>
                </div>
              </div>

              <div className="nfts-minted-holder">
                <h2 className="nfts-minted-header">NFTs Owned</h2>
                <div className="nfts-minted-container">
                  <div className="nfts-creations-list">
                    {isCompLoading ? (
                      userNfts.length > 0 ? (
                        userNfts.map((collection, i) => (
                          <Link key={i} to={"/sell-nft/" + collection.id}>
                            <div className="nfts-collection-pa">
                              <div className="nfts-bg">
                                <div className="nfts-img">
                                  <video
                                    className="nfts-nft"
                                    src={collection.image}
                                    controls
                                  />
                                </div>
                                <div
                                  className="nfts-name"
                                  title={collection.name}
                                >
                                  {collection.name}
                                </div>
                                <p className="nfts-description">
                                  {collection.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <>
                          <h4 className="profile-title">No Nfts Found...</h4>
                        </>
                      )
                    ) : (
                      <h4 className="profile-title">Loading</h4>
                    )}
                  </div>
                </div>
              </div>

              <div className="nfts-minted-holder">
                <h2 className="nfts-minted-header">Requests</h2>
                <div className="requests-main-buttons">
                  <button
                    className={allRequests ? "active" : ""}
                    onClick={() => {
                      setAllRequests(true);
                      setRequested(false);
                      setMyRequests(false);
                    }}
                  >
                    All Requests
                  </button>
                  <button
                    className={myRequests ? "active" : ""}
                    onClick={() => {
                      setAllRequests(false);
                      setRequested(false);
                      setMyRequests(true);
                    }}
                  >
                    My Requests
                  </button>
                  <button
                    className={requested ? "active" : ""}
                    onClick={() => {
                      setAllRequests(false);
                      setRequested(true);
                      setMyRequests(false);
                    }}
                  >
                    Requested
                  </button>
                </div>
                {requests.length > 0 && allRequests
                  ? requests.map((item, key) => {
                      if (
                        item.requestTo === address ||
                        item.requestBy === address
                      ) {
                        return (
                          <div className="requests-main" key={key}>
                            <div className="request-details">
                              <h3 className="request-title">{item[1]}</h3>
                              <p className="request-story">{item[2]}</p>
                              <h3 className="request-budget">
                                Budget : {parseFloat(item[4])}{" "}
                                {chain.id === 1029 || 199 ? "BTT" : "MATIC"}
                              </h3>
                              <span>
                                {item[6] !== address
                                  ? `Request by : ${item[6]}`
                                  : "Request by You"}
                              </span>
                            </div>
                            <div className="request-response">
                              <div className="request-res-buttons">
                                {item[6] !== address ? (
                                  !item.isAccept &&
                                  !item.isDecline &&
                                  item.requestTo === address ? (
                                    // Accepted the requests
                                    <>
                                      {" "}
                                      <button
                                        className={"accept-request"}
                                        onClick={() =>
                                          songReqResponse(
                                            parseInt(item[0]),
                                            true
                                          )
                                        }
                                      >
                                        Accept
                                      </button>
                                      <button
                                        className={
                                          item.isDecline
                                            ? "disable rejest-request"
                                            : "rejest-request"
                                        }
                                        onClick={() =>
                                          songReqResponse(
                                            parseInt(item[0]),
                                            false
                                          )
                                        }
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : item.isAccept &&
                                    !item.isDecline &&
                                    item.requestTo === address &&
                                    item.cid.length === 0 ? (
                                    <button
                                      className="submit-work"
                                      onClick={() => {
                                        setRequestIdSubmitWork(
                                          parseInt(item[0])
                                        );
                                        setSubmitWorkPopup(!submitWorkPopup);
                                      }}
                                    >
                                      Submit Work
                                    </button>
                                  ) : item.isAccept &&
                                    item.requestTo === address &&
                                    item.cid.length > 0 ? (
                                    <button
                                      className={"disable accept-request"}
                                    >
                                      Waiting For Approval
                                    </button>
                                  ) : item.isAccept &&
                                    item.requestTo === address &&
                                    item.cid.length > 0 &&
                                    item.isApproved ? (
                                    <button className={"disable paid-request"}>
                                      Paid
                                    </button>
                                  ) : (
                                    ""
                                  )
                                ) : !item.isAccept && !item.isDecline ? (
                                  <button className="disable accept-request">
                                    Pending
                                  </button>
                                ) : item.isAccept &&
                                  !item.isDecline &&
                                  item.cid.length === 0 ? (
                                  <button className="disable accpept-work">
                                    Work Awaited
                                  </button>
                                ) : item.isDecline ? (
                                  <button className={"disable rejest-request"}>
                                    Declined
                                  </button>
                                ) : item.isAccept && item.cid.length > 0 ? (
                                  <button className={"paid-request"}>
                                    View Work
                                  </button>
                                ) : (
                                  ""
                                )}

                                {/* <button
                                  className={
                                    item.isAccept
                                      ? "disable accept-request"
                                      : "accept-request"
                                  }
                                  onClick={() =>
                                    songReqResponse(parseInt(item[0]), true)
                                  }
                                >
                                  {item.isAccept ? (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        width="24px"
                                        fill="#000000"
                                      >
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M17.3 6.3c-.39-.39-1.02-.39-1.41 0l-5.64 5.64 1.41 1.41L17.3 7.7c.38-.38.38-1.02 0-1.4zm4.24-.01l-9.88 9.88-3.48-3.47c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L22.95 7.71c.39-.39.39-1.02 0-1.41h-.01c-.38-.4-1.01-.4-1.4-.01zM1.12 14.12L5.3 18.3c.39.39 1.02.39 1.41 0l.7-.7-4.88-4.9c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.03 0 1.42z" />
                                      </svg>
                                      Accepted
                                    </>
                                  ) : (
                                    "Accept"
                                  )}
                                </button>
                                {item.isAccept ? (
                                  ""
                                ) : (
                                  <button
                                    className={
                                      item.isDecline
                                        ? "disable rejest-request"
                                        : "rejest-request"
                                    }
                                    onClick={() =>
                                      songReqResponse(parseInt(item[0]), false)
                                    }
                                  >
                                    Reject
                                  </button>
                                )} */}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return "";
                      }
                    })
                  : ""}
                {requests.length > 0 && myRequests
                  ? requests.map((item, key) => {
                      if (item.requestBy === address) {
                        return (
                          <div className="requests-main" key={key}>
                            <div className="request-details">
                              <h3 className="request-title">{item[1]}</h3>
                              <p className="request-story">{item[2]}</p>
                              <h3 className="request-budget">
                                Budget : {parseFloat(item[4])}{" "}
                                {chain.id === 1029 || 199 ? "BTT" : "MATIC"}
                              </h3>
                            </div>
                            <div className="request-response">
                              <div className="request-res-buttons">
                                {!item.isAccept && !item.isDecline ? (
                                  <button className="disable accept-request">
                                    Pending
                                  </button>
                                ) : item.isAccept &&
                                  !item.isDecline &&
                                  item.cid.length === 0 ? (
                                  <button className="disable accpept-work">
                                    Work Awaited
                                  </button>
                                ) : item.isDecline ? (
                                  <button className={"disable rejest-request"}>
                                    Declined
                                  </button>
                                ) : item.isAccept && item.cid.length > 0 ? (
                                  <button className={"paid-request"}>
                                    View Work
                                  </button>
                                ) : (
                                  ""
                                )}
                                {/* <button
                                  className={
                                    item.isAccept
                                      ? "disable accept-request"
                                      : "accept-request"
                                  }
                                  onClick={() =>
                                    songReqResponse(parseInt(item[0]), true)
                                  }
                                >
                                  {item.isAccept ? (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        width="24px"
                                        fill="#000000"
                                      >
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M17.3 6.3c-.39-.39-1.02-.39-1.41 0l-5.64 5.64 1.41 1.41L17.3 7.7c.38-.38.38-1.02 0-1.4zm4.24-.01l-9.88 9.88-3.48-3.47c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L22.95 7.71c.39-.39.39-1.02 0-1.41h-.01c-.38-.4-1.01-.4-1.4-.01zM1.12 14.12L5.3 18.3c.39.39 1.02.39 1.41 0l.7-.7-4.88-4.9c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.03 0 1.42z" />
                                      </svg>
                                      Accepted
                                    </>
                                  ) : (
                                    "Accept"
                                  )}
                                </button>
                                {item.isAccept && item.requestBy !== address ? (
                                  <button
                                    className="submit-work"
                                    onClick={() => {
                                      setRequestIdSubmitWork(parseInt(item[0]));
                                      setSubmitWorkPopup(!submitWorkPopup);
                                    }}
                                  >
                                    Submit Work
                                  </button>
                                ) : (
                                  ""
                                )} */}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return "";
                      }
                    })
                  : ""}
                {requests.length > 0 && requested
                  ? requests.map((item, key) => {
                      if (item.requestTo === address) {
                        return (
                          <div className="requests-main" key={key}>
                            <div className="request-details">
                              <h3 className="request-title">{item[1]}</h3>
                              <p className="request-story">{item[2]}</p>
                              <h3 className="request-budget">
                                Budget : {parseFloat(item[4])}{" "}
                                {chain.id === 1029 || 199 ? "BTT" : "MATIC"}
                              </h3>
                            </div>
                            <div className="request-response">
                              <div className="request-res-buttons">
                                {item[6] !== address ? (
                                  !item.isAccept &&
                                  !item.isDecline &&
                                  item.requestTo === address ? (
                                    // Accepted the requests
                                    <>
                                      {" "}
                                      <button
                                        className={"accept-request"}
                                        onClick={() =>
                                          songReqResponse(
                                            parseInt(item[0]),
                                            true
                                          )
                                        }
                                      >
                                        Accept
                                      </button>
                                      <button
                                        className={
                                          item.isDecline
                                            ? "disable rejest-request"
                                            : "rejest-request"
                                        }
                                        onClick={() =>
                                          songReqResponse(
                                            parseInt(item[0]),
                                            false
                                          )
                                        }
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : item.isAccept &&
                                    !item.isDecline &&
                                    item.requestTo === address &&
                                    item.cid.length === 0 ? (
                                    <button
                                      className="submit-work"
                                      onClick={() => {
                                        setRequestIdSubmitWork(
                                          parseInt(item[0])
                                        );
                                        setSubmitWorkPopup(!submitWorkPopup);
                                      }}
                                    >
                                      Submit Work
                                    </button>
                                  ) : item.isAccept &&
                                    item.requestTo === address &&
                                    item.cid.length > 0 ? (
                                    <button
                                      className={"disable accept-request"}
                                    >
                                      Waiting For Approval
                                    </button>
                                  ) : item.isAccept &&
                                    item.requestTo === address &&
                                    item.cid.length > 0 &&
                                    item.isApproved ? (
                                    <button className={"disable paid-request"}>
                                      Paid
                                    </button>
                                  ) : (
                                    ""
                                  )
                                ) : item.requestTo === address &&
                                  item.isDecline ? (
                                  <button className={"disable rejest-request"}>
                                    Declined
                                  </button>
                                ) : (
                                  ""
                                )}
                                {/* <button
                                  className={
                                    item.isAccept
                                      ? "disable accept-request"
                                      : "accept-request"
                                  }
                                  onClick={() =>
                                    songReqResponse(parseInt(item[0]), true)
                                  }
                                >
                                  {item.isAccept ? (
                                    <>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        width="24px"
                                        fill="#000000"
                                      >
                                        <path d="M0 0h24v24H0V0z" fill="none" />
                                        <path d="M17.3 6.3c-.39-.39-1.02-.39-1.41 0l-5.64 5.64 1.41 1.41L17.3 7.7c.38-.38.38-1.02 0-1.4zm4.24-.01l-9.88 9.88-3.48-3.47c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L22.95 7.71c.39-.39.39-1.02 0-1.41h-.01c-.38-.4-1.01-.4-1.4-.01zM1.12 14.12L5.3 18.3c.39.39 1.02.39 1.41 0l.7-.7-4.88-4.9c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.03 0 1.42z" />
                                      </svg>
                                      Accepted
                                    </>
                                  ) : (
                                    "Accept"
                                  )}
                                </button> */}
                                {/* {item.isAccept ? (
                                  <button
                                    className="submit-work"
                                    onClick={() => {
                                      setRequestIdSubmitWork(parseInt(item[0]));
                                      setSubmitWorkPopup(!submitWorkPopup);
                                    }}
                                  >
                                    Submit Work
                                  </button>
                                ) : (
                                  ""
                                )} */}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return "";
                      }
                    })
                  : ""}
              </div>
              {requests.length > 0 ? (
                ""
              ) : (
                <div className="not-found">No Requets Found</div>
              )}

              {profileWindow ? (
                <div className="edit-user-popup-main">
                  <div className="edit-user-popup" ref={editUserPopup}>
                    <div className="edit-user-p-header">Edit Profile</div>
                    <div className="profile-information">
                      <input
                        type="file"
                        ref={fileRef}
                        onChange={(e) => {
                          setprofileImage(e.target.files[0]);
                        }}
                        hidden
                      />
                      <div
                        className="update-profile-pic"
                        onClick={() => {
                          fileRef.current.click();
                        }}
                      >
                        <img
                          src={
                            userDefault.profile_pic
                              ? `https://ipfs.io/ipfs/` +
                                userDefault.profile_pic
                              : "images/man.png"
                          }
                          alt="profile pic preview"
                          className="profile-pic-preview"
                        />
                      </div>
                      <input
                        className="profile-username"
                        type="text"
                        defaultValue={
                          userDefault.name ? userDefault.name : null
                        }
                        placeholder="Username"
                        onChange={(e) => {
                          setUserData({ ...userData, name: e.target.value });
                        }}
                      />
                      <textarea
                        className="profile-bio"
                        placeholder="Add your bio here..."
                        defaultValue={userDefault.bio ? userDefault.bio : null}
                        onChange={(e) => {
                          setUserData({ ...userData, bio: e.target.value });
                        }}
                      />
                      <div className="artist-selector-main">
                        <div className="artist-selector-label">
                          <input
                            type="checkbox"
                            id="artist"
                            name="artist"
                            value="1"
                            onChange={(e) =>
                              setArtistSelected(e.target.checked)
                            }
                          />
                          <label htmlFor="artist">Are you an Artist?</label>
                        </div>

                        {/* <label>
                          <input
                            type="radio"
                            value="yes"
                            checked={artistSelected}
                            onChange={() => setArtistSelected(true)}
                          />
                          Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="no"
                            checked={!artistSelected}
                            onChange={() => setArtistSelected(false)}
                          />
                          No
                        </label> */}
                        {artistSelected ? (
                          <div>
                            <input
                              className="artist-selector-fees"
                              type="text"
                              placeholder="Charges for 3 Mins Song"
                              onChange={(e) => setChargesOfUser(e.target.value)}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <button
                        className="user-update-btn"
                        onClick={() => {
                          addUserData();
                          // testing();
                        }}
                      >
                        {btnLoading ? (
                          <svg
                            className="animate-spin button-spin-svg-pic"
                            version="1.1"
                            id="L9"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            viewBox="0 0 100 100"
                          >
                            <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"></path>
                          </svg>
                        ) : (
                          "Update Details"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {submitWorkPopup ? (
                <>
                  <div
                    className="overlay"
                    onClick={() => setSubmitWorkPopup(false)}
                  ></div>
                  <div id="modal">
                    <div className="submit-work-popup">
                      <h2 className="heading">Submit Work</h2>
                      <div
                        className="input-outer"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          enableBackground="new 0 0 24 24"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#ffffff"
                        >
                          <g>
                            <rect fill="none" height="24" width="24" />
                          </g>
                          <g>
                            <path d="M19.41,7.41l-4.83-4.83C14.21,2.21,13.7,2,13.17,2H6C4.9,2,4.01,2.9,4.01,4L4,20c0,1.1,0.89,2,1.99,2H18c1.1,0,2-0.9,2-2 V8.83C20,8.3,19.79,7.79,19.41,7.41z M14.8,15H13v3c0,0.55-0.45,1-1,1s-1-0.45-1-1v-3H9.21c-0.45,0-0.67-0.54-0.35-0.85l2.8-2.79 c0.2-0.19,0.51-0.19,0.71,0l2.79,2.79C15.46,14.46,15.24,15,14.8,15z M14,9c-0.55,0-1-0.45-1-1V3.5L18.5,9H14z" />
                          </g>
                        </svg>
                        <p>Upload Your Work</p>
                      </div>
                      <input
                        type="file"
                        id="submitwork"
                        hidden
                        ref={fileInputRef}
                      />
                      <button
                        className="submit-work-upload"
                        onClick={() => submitWork(requestIdSubmitWork)}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>

        {/* till here new code  */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </>
    );
  }
};

export default Profile;
