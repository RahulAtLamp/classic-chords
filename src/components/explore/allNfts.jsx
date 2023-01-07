import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import axios from "axios";
import { Link } from 'react-router-dom';

import market from "../../contract/artifacts/market.json";
import classicChords from "../../contract/artifacts/classicChords.json"
// import user from "../../contract/artifacts/userStream.json";
import Loading3 from "../../loading3";

import "./allnfts.scss";

// const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";
// const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
// const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"
const RPC_ENDPOINT = "https://rpc-mumbai.maticvigil.com/";

function AllNfts() {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNfts();
    }, [])

    const getContract = async () => {
        try {
            // const { ethereum } = window;
            // if (ethereum) {
            //   const provider = new ethers.providers.Web3Provider(ethereum);
            //   const signer = provider.getSigner();
            //   if (!provider) {
            //     console.log("Metamask is not installed, please install!");
            //   }
            //   const { chainId } = await provider.getNetwork();
            //   console.log("switch case for this case is: " + chainId);
            //   if (chainId === 80001) {
            //     const contract = new ethers.Contract(market_address, market, signer);
            //     return contract
            //   } else {
            //     alert("Please connect to the bitTorent Network!");
            //   }
            // }

            const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
            const contract = new ethers.Contract(process.env.REACT_APP_MARKET_ADDRESS, market, provider);
            return contract
        } catch (error) {
            console.log(error);
        }
    }

    const getNfts = async () => {
        setLoading(true);
        const contract = await getContract()
        // console.log(contract);
        const artists = await contract.getListedNfts();
        console.log(artists);
        const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
        const tokenContract = new ethers.Contract(process.env.REACT_APP_CLASSIC_CHORDS, classicChords, provider);
        const tempNFT = []
        for (let i = 0; i < artists.length; i++) {
            const tokenId = artists[i].tokenId.toNumber();
            const uri = await tokenContract.tokenUriMapping(tokenId);
            console.log(uri);
            try {
                await axios.get("https://ipfs.io/ipfs/" + uri.split("//")[1]).then((response) => {
                    let data = response.data
                    data.image = "https://ipfs.io/ipfs/" + data.image.split("//")[1]
                    response.data.id = tokenId;
                    tempNFT.push(response.data);
                    // console.log(response.data);
                });
            } catch (error) {
                console.log(error);
            }
        }
        setNfts(tempNFT);
        setLoading(false);
    }


    return (
        <div className='nfts-main'>
            <div className="nfts-header">All NFTs</div>
            {
                loading
                    ?
                    <Loading3 />
                    :
                    <>
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
                                                        {/* 
                                                            <div className="buy-button-holder">
                                                                <button className="buy-button" onClick={(e) => { e.preventDefault(); }}> 
                                                                    <span className='buy-button-tag'>BUY</span> &nbsp; <span>{collection.price}</span>
                                                                </button>
                                                            </div> 
                                                        */}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                        :
                                        <h4>No Nfts</h4>
                                }
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default AllNfts