import React, { useEffect, useState, useRef } from 'react';
import "./sell-collection-single.scss";
// import classicChords from "../../contract/artifacts/classicChords.json"
// import market from "../../contract/artifacts/market.json"
import { Collections } from '../collection_dummy';
import { ethers } from "ethers";
import axios from "axios";
// import $ from "jquery";
import { useAccount } from "wagmi";
import { useParams } from 'react-router-dom';
import classicChords from "../../../contract/artifacts/classicChords.json"
import market from "../../../contract/artifacts/market.json"
import Loading3 from '../../../loading3';

const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"

function SellCollectionSingle() {
    const { isConnected, address } = useAccount();
    const params = useParams()

    // const collection = Collections[3];
    const [sellData, setSellData] = useState({ qty: null, price: null, option: null, rent_duration: null, royalty: null });
    const [collection, setCollections] = useState({})
    const [loading, setIsLoading] = useState(false)
    const [showLoading, setShowLoading] = useState(false);

    const qtyRef = useRef(null);
    const priceRef = useRef(null);
    const optionRef = useRef(null);
    const royaltyRef = useRef(null);


    const getData = async () => {
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
                    const tokenContract = new ethers.Contract(process.env.REACT_APP_CLASSIC_CHORDS, classicChords, signer);
                    let result = {
                    }

                    try {
                        const uri = await tokenContract.tokenUriMapping(params.id);
                        await axios.get("https://ipfs.io/ipfs/" + uri.split("//")[1]).then((response) => {
                            let data = response.data
                            data.image = "https://ipfs.io/ipfs/" + data.image.split("//")[1]
                            console.log(response.data);
                            result = response.data;
                        });
                        const balance = await tokenContract.balanceOf(address, params.id)
                        result.total_minted = balance.toNumber()
                        setCollections(result)
                    } catch (error) {
                        console.log(error);
                    }
                }
                console.log();
                setIsLoading(true)
            } else {
                alert("Please connect to the bitTorent Network!");
                // setChainStatus(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const sell = async () => {
        setShowLoading(true);
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const marketContract = new ethers.Contract(process.env.REACT_APP_MARKET_ADDRESS, market, signer);
            let isAvailableForSell = null;
            let isAvailableForRent = null;


            if (sellData.option === "Sell") {
                isAvailableForSell = true;
                isAvailableForRent = false;
                sellData.rent_duration = 0;
            }
            if (sellData.option === "rent") {
                isAvailableForSell = false;
                isAvailableForRent = true;
            }

            console.log(params.id, sellData.qty, sellData.price, isAvailableForRent, isAvailableForSell, sellData.rent_duration, sellData.royalty);
            const tx = await marketContract.createMarketItem(params.id, sellData.qty, sellData.price, isAvailableForRent, isAvailableForSell, sellData.rent_duration, sellData.royalty)
            tx.wait()
            qtyRef.current.value = "";
            priceRef.current.value = "";
            optionRef.current.value = "";
            royaltyRef.current.value = "";

            setShowLoading(false);

        } catch (error) {
            console.log(error);
            setShowLoading(false)
        }
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        console.log(sellData);
    }, [sellData])

    return (
        <>
            {loading ? (
                <div className='collection-main'>
                    <h2 className="collection-name">{collection.name}</h2>
                    <div className="collection-detail-holder">
                        <div className="collection-image-holder">
                            <video className='collection-image' src={collection.image} alt={collection.name} controls />
                        </div>
                        <div className="collection-sub">
                            <p className="collection-description">
                                {collection.description}
                            </p>
                            <p className="total-minted">
                                Balance
                            </p>

                            <p className="total-minted">
                                {collection.total_minted}
                            </p>

                            <input className='total-qty' type="number" ref={qtyRef} placeholder='Quantity to sell' onChange={(e) => { setSellData({ ...sellData, qty: e.target.value }) }} />

                            <input className='total-price' type="number" ref={priceRef} placeholder='Price' onChange={(e) => { setSellData({ ...sellData, price: e.target.value }) }} />

                            <select className='sell-options' defaultValue={""} ref={optionRef} onChange={(e) => { setSellData({ ...sellData, option: e.target.value }) }}>
                                <option value="">--select--</option>
                                <option value="rent">Rent</option>
                                <option valu="sell">Sell</option>
                            </select>

                            {
                                sellData.option === "rent"
                                    ?
                                    <div>
                                        {/* <DatePicker className="sell-date-picker" minDate={new Date()} /> */}
                                        <span className='date-picker-title'>Rent till:</span> <input type="date" onChange={(e) => { setSellData({ ...sellData, rent_duration: new Date(e.target.value).getTime() / 1000 }); }} className="sell-date-picker" />
                                    </div>
                                    :
                                    null
                            }
                            <input className='total-price' type="number" placeholder='Royalty' ref={royaltyRef} onChange={(e) => { setSellData({ ...sellData, royalty: e.target.value }) }} />

                            <button className="sell-buy-button" onClick={() => { sell() }}>
                                proceed
                            </button>
                        </div>
                        {
                            showLoading
                                ?
                                <div className='loading-main'><Loading3 message={"Processing"} /></div>
                                :
                                null
                        }
                    </div>
                </div>) : <div className='loading-main'><Loading3 /></div>}
        </>
    )
}

export default SellCollectionSingle