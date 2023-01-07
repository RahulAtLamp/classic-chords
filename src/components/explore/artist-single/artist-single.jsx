import React, { useEffect, useState } from 'react';
import "./artist-single.scss";
import { Link } from 'react-router-dom';
import { Artists } from '../artist-dummy';
import { Collections } from './collection_dummy';
import { getRoles } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { ethers } from "ethers";
import market from "../../../contract/artifacts/market.json"
import user from "../../../contract/artifacts/userStream.json"
import { useAccount } from "wagmi";
import classicChords from "../../../contract/artifacts/classicChords.json"
import axios from "axios";
import Loading3 from '../../../loading3';

// const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";
// const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
// const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"
const RPC_ENDPOINT = "https://rpc-mumbai.maticvigil.com/";

function ArtistSingle() {
  // const singleArtist = Artists[5];
  // console.log(singleArtist);
  const [isLoading, setIsLoading] = useState(false);
  const [singleArtist, setSingleArtist] = useState({})
  const [nfts, setNfts] = useState([]);
  const params = useParams()

  const getProfile = async () => {
    try {
      // const provider = new ethers.providers.Web3Provider(ethereum);
      const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const contract = new ethers.Contract(process.env.REACT_APP_USER_ADDRESS, user, provider);
      const marketContract = new ethers.Contract(process.env.REACT_APP_MARKET_ADDRESS, market, provider);
      const tokenContract = new ethers.Contract(process.env.REACT_APP_CLASSIC_CHORDS, classicChords, provider);
      const tx = await contract.userMapping(params.id);
      const listed_data = await marketContract.getUserListedNfts(params.id);
      console.log(listed_data);
      // const ids = await marketContract.mintedNfts(params.id);
      // console.log(ids.length);
      let nfts = []
      for (let i = 0; i < listed_data.length; i++) {
        const uri = await tokenContract.tokenUriMapping(listed_data[i].tokenId.toNumber());
        console.log(uri);
        try {
          await axios.get("https://ipfs.io/ipfs/" + uri.split("//")[1]).then((response) => {
            let data = response.data
            data.image = "https://ipfs.io/ipfs/" + data.image.split("//")[1]
            response.data.id = listed_data[i].tokenId.toNumber();
            response.data.price = listed_data[i].price.toNumber()
            nfts.push(response.data)
            console.log(response.data);
          });
        } catch (error) {
          console.log(error);
        }
      }
      console.log(nfts);
      // setMintedNfts(nfts)
      // console.log(profilePic);
      console.log(tx);
      console.log(tx.description);
      setNfts(nfts)
      setSingleArtist(tx)
      setIsLoading(true)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProfile();
  }, [])

  return (
    isLoading ? (
      <div className='artist-main'>
        <div className='artist-card-holder'>
          <div className='artist-card'>
            {/* <div className='artist-color-holder'>
            <div className='artist-color-circle'></div>
          </div> */}
            <div className="artist-detail">
              <h1 className="artist-name">{singleArtist.name}</h1>
              <p className="artist-description">{singleArtist.description}</p>
              {/* <p className="artist-instrument">{singleArtist.instrument.toLocaleUpperCase()}</p> */}
            </div>
            <div className="artist-image-container">
              <img className='artist-image' alt="artist image" src={"https://ipfs.io/ipfs/" + singleArtist.profileImage} />
            </div>
          </div>
        </div>
        <div className="artist-creations">
          <h2 className="artist-creations-header">
            Creations
          </h2>
          <div className="artist-creations-list-container">
            <div className="artist-creations-list">
              {
                nfts.length > 0
                  ?
                  nfts.map((collection, i) => (
                    <Link key={i} to={"/collection/" + collection.id}>
                      <div className="artist-collection-pa">
                        <div className="exp-bg">
                          <div className="exp-img">
                            <video className="exp-nft" src={collection.image} controls />
                          </div>
                          <div className="exp-name" title={collection.name}>{collection.name}</div>
                          <p className="exp-description">{collection.description}</p>
                          {/* <div className="buy-button-holder">
                          <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> <span className='buy-button-tag'>BUY</span> &nbsp; <span>{collection.price}</span></button>
                        </div> */}
                        </div>
                      </div>
                    </Link>
                  ))
                  :
                  <h4>No Creations of this artist</h4>
              }
            </div>
          </div>
        </div>
        {/* <div className="buy-nft-container">
        <div className="buy-nft">

        </div>
      </div> */}
      </div>) : <div className='loading-main'><Loading3 /></div>
  )
}

export default ArtistSingle