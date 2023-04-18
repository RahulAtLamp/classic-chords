import React, { useEffect, useState } from "react";
import "./artist-single.scss";
import { Link } from "react-router-dom";
import { Artists } from "../artist-dummy";
import { Collections } from "./collection_dummy";
import { getRoles } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import market from "../../../contract/artifacts/market.json";
import user from "../../../contract/artifacts/userStream.json";
import userBTTC from "../../../contract/artifacts/userStreamBTTC.json";
import marketBTTC from "../../../contract/artifacts/marketBTTC.json";
import { useAccount } from "wagmi";
import Popup from "./artist-single-popup";
import classicChords from "../../../contract/artifacts/classicChords.json";
import classicChordsBTTC from "../../../contract/artifacts/classicChordsBTTC.json";
import axios from "axios";
import Loading3 from "../../../loading3";

// const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";
// const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
// const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"
const RPC_ENDPOINT = "https://rpc-mumbai.maticvigil.com/";

function ArtistSingle() {
  // const singleArtist = Artists[5];
  // console.log(singleArtist);

  const [isLoading, setIsLoading] = useState(false);
  const [singleArtist, setSingleArtist] = useState({});
  const [nfts, setNfts] = useState([]);
  const [requestData, setRequestData] = useState({
    name: "",
    story: "",
    cid: "",
    requestTo: "",
    isGlobalRequest: "",
    songValue: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  const getProfile = async () => {
    try {
      const { ethereum } = window;
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
      }
      // const contract = new ethers.Contract(
      //   process.env.REACT_APP_USER_ADDRESS_POLYGON_TESTNET,
      //   user,
      //   provider
      // );
      // const marketContract = new ethers.Contract(
      //   process.env.REACT_APP_MARKET_ADDRESS_POLYGON_TESTNET,
      //   market,
      //   provider
      // );
      // const tokenContract = new ethers.Contract(
      //   process.env.REACT_APP_CLASSIC_CHORDS_POLYGON_TESTNET,
      //   classicChords,
      //   provider
      // );
      const tx = await contract.userMapping(params.id);
      const listed_data = await marketContract.getUserListedNfts(params.id);
      console.log(listed_data);
      // const ids = await marketContract.mintedNfts(params.id);
      // console.log(ids.length);
      let nfts = [];
      for (let i = 0; i < listed_data.length; i++) {
        const uri = await tokenContract.tokenUriMapping(
          listed_data[i].tokenId.toNumber()
        );
        console.log(uri);
        try {
          await axios
            .get("https://ipfs.io/ipfs/" + uri.split("//")[1])
            .then((response) => {
              let data = response.data;
              data.image = "https://ipfs.io/ipfs/" + data.image.split("//")[1];
              response.data.id = listed_data[i].itemId.toNumber();
              response.data.price = listed_data[i].price.toNumber();
              nfts.push(response.data);
              console.log(response.data);
            });
        } catch (error) {
          console.log(error);
        }
      }
      // console.log(nfts);
      // setMintedNfts(nfts)
      // console.log(profilePic);
      // console.log(tx);
      // console.log(tx.description);
      setNfts(nfts);
      setSingleArtist(tx);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const requestSong = async () => {
    try {
      console.log("in");
      // const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      if (!provider) {
        console.log("Metamask is not installed, please install!");
      }
      const { chainId } = await provider.getNetwork();
      console.log("switch case for this case is: " + chainId);
      let contract;
      if (chainId === 80001) {
        contract = new ethers.Contract(
          process.env.REACT_APP_USER_ADDRESS_POLYGON_TESTNET,
          user,
          signer
        );
      } else if (chainId === 1029) {
        contract = new ethers.Contract(
          process.env.REACT_APP_USER_ADDRESS_BTTC_TESTNET,
          userBTTC,
          signer
        );
      }
      console.log(contract);
      console.log(requestData);
      console.log(singleArtist.userAddress);
      const tx = await contract.requestSong(
        requestData.name,
        requestData.story,
        singleArtist.userAddress,
        requestData.isGlobalRequest,
        requestData.songValue
      );
      await tx.wait();
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return isLoading ? (
    <div className="artist-main">
      <div className="artist-card-holder">
        <div className="artist-card">
          {/* <div className='artist-color-holder'>
            <div className='artist-color-circle'></div>
          </div> */}
          <div className="artist-detail">
            <h1 className="artist-name">{singleArtist.name}</h1>
            <p className="artist-description">{singleArtist.description}</p>
            {/* <p className="artist-instrument">{singleArtist.instrument.toLocaleUpperCase()}</p> */}
            <button onClick={togglePopup} className="popup-main">
              Request A Song
            </button>
          </div>
          <div className="artist-image-container">
            <img
              className="artist-image"
              alt="artist"
              src={"https://ipfs.io/ipfs/" + singleArtist.profileImage}
            />
          </div>
        </div>
      </div>
      <div className="artist-creations">
        <h2 className="artist-creations-header">Creations</h2>
        <div className="artist-creations-list-container">
          <div className="artist-creations-list">
            {nfts.length > 0 ? (
              nfts.map((collection, i) => (
                <Link key={i} to={"/collection/" + collection.id}>
                  <div className="artist-collection-pa">
                    <div className="exp-bg">
                      <div className="exp-img">
                        <video
                          className="exp-nft"
                          src={collection.image}
                          controls
                        />
                      </div>
                      <div className="exp-name" title={collection.name}>
                        {collection.name}
                      </div>
                      <p className="exp-description">
                        {collection.description}
                      </p>
                      {/* <div className="buy-button-holder">
                          <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>BUY</span> &nbsp; <span>{collection.price}</span></button>
                        </div> */}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <h4>No Creations of this artist</h4>
            )}
          </div>
        </div>
      </div>
      {/* <div className="buy-nft-container">
        <div className="buy-nft">

        </div>
      </div> */}
      {isOpen && (
        <Popup
          content={
            <>
              <div className="popup-header"></div>
              <div className="popup-title-main">
                {/* <div className="popup-title">Title</div> */}
                <input
                  type="text"
                  className="popup-title-text"
                  placeholder="Title"
                  onChange={(e) => {
                    setRequestData({ ...requestData, name: e.target.value });
                  }}
                />
              </div>
              <div className="popup-desc-main">
                {/* <div className="popup-desc">Description</div> */}
                <textarea
                  className="popup-desc-text"
                  placeholder="Story"
                  rows={5}
                  onChange={(e) => {
                    setRequestData({ ...requestData, story: e.target.value });
                  }}
                />
              </div>
              <div className="popup-amount-main">
                {/* <div className="popup-amount">Amount</div> */}
                <input
                  type="number"
                  className="popup-amount-text"
                  placeholder="Budget"
                  onChange={(e) => {
                    setRequestData({
                      ...requestData,
                      songValue: e.target.value,
                    });
                  }}
                />
              </div>
              <label className="global-request">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setRequestData({
                      ...requestData,
                      isGlobalRequest: e.target.checked,
                    });
                    console.log(e.target.checked);
                  }}
                />
                Is this global request?
              </label>
              <p className="info-p">* All the fields are compulsory</p>
              <div className="popup-button-main">
                <button
                  className={
                    requestData.name === "" ||
                    requestData.story === "" ||
                    requestData.songValue === ""
                      ? "disable popup-button"
                      : "popup-button"
                  }
                  onClick={() => requestSong()}
                >
                  Send Request
                </button>
              </div>
            </>
          }
          handleClose={togglePopup}
        />
      )}
    </div>
  ) : (
    <div className="loading-main">
      <Loading3 />
    </div>
  );
}

export default ArtistSingle;
