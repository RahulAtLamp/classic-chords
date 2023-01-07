import React, { useEffect } from 'react';
import "./MintNft.scss";
import ConfettiExplosion from 'react-confetti-explosion';
import classicChords from "../../contract/artifacts/classicChords.json"
import { ethers } from "ethers";
// import { Web3Storage } from 'web3.storage';
import { NFTStorage, File } from 'nft.storage'


function MintNft(props) {
    // const classicChords_address = "0xA85cFB46795e47bB6D6C727964f668A0AE38935f";
    // const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";
    // const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
    // const market_address = "0x086E4fDFb8CEb2c21bD1491a6B86Ce8eB4C01970"

    const [isExploding, setIsExploding] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [onMint, setOnMint] = React.useState(false);
    const mintBox = React.useRef();
    const inputRef = React.useRef();


    const getTokeUri = async () => {
        // const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng" })
        const nft_client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDczMzU1RDY0Njc1YTlEODA0MzA2ODIyMzkzRjRGQzkyRmNBQjg5QzkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODQxOTEyODc3MSwibmFtZSI6Ik11c2ljIE5GVHMifQ.G2tcD1_VJCUF0eiSQSDIn05ei9NY5EN1klNqJJrjoh4" })

        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const video = new File([props.file], name + '.webm', {
            type: props.file.type,
        });
        // const video_file_url = await client.put([video],'classic_chords_nft.webm')
        // console.log("vide---"+video_file_url);

        const metadata = {
            "description": description,
            "image": video,
            "name": name,
        }
        // const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
        const metadata_cid = await nft_client.store(metadata, 'metadata.json')
        console.log(metadata_cid);
        return metadata_cid.url
    }

    useEffect(() => {
    }, [])

    useEffect(() => {
        // console.log(open);
        // console.log(props.opened);
        setOpen(props.opened);
        if (props.opened) {
            // inputRef.current.focus();
            console.log(inputRef);
        }
    }, [props.opened])

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (mintBox.current && !mintBox.current.contains(event.target)) {
                setOpen(false);
                props.changeOpen();
                window.location.reload();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mintBox]);

    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (props.current && !props.current.contains(event.target)) {
    //             setOpen(true);
    //         }
    //     }
    //     // Bind the event listener
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         // Unbind the event listener on clean up
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [props])


    const mint = async () => {
        setOnMint(true);
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
                    const numToken = document.getElementById("num_token").value;
                    const contract = new ethers.Contract(process.env.REACT_APP_CLASSIC_CHORDS, classicChords, signer);
                    const uri = await getTokeUri();
                    const tx = await contract.mint(numToken, uri);
                    tx.wait();
                    setOnMint(false);
                    setIsExploding(true);
                    setTimeout(() => {
                        setOpen(false);
                        window.location.reload();
                    }, 3000);
                } else {
                    alert("Please connect to the bitTorent Network!");
                }
            }
        } catch (error) {
            setOnMint(false);
            console.log(error);
        }
    }

    return (
        <div className="mint">

            <div className='mint-nft-main'>
                <div className="mint-nft-container" ref={mintBox}>
                    <div className="mint-nft-header">
                        <h2 className="mint-nft-h2">Mint the ART</h2>
                    </div>
                    <div className="mint-nft-data">
                        <div className="mint-nft-video">
                            <video 
                                className='mint-nft-v'  
                                controls
                            >
                                <source src={props.file_url} type="video/webm" />
                            </video>

                        </div>
                        <div className="mint-nft-name">
                            <input 
                                type="text" 
                                ref={inputRef} 
                                placeholder='Name' 
                                className='mint-nft-n' 
                                id="name" 
                            />
                        </div>
                        <div className="mint-nft-description">
                            <textarea 
                                className='mint-nft-d' 
                                placeholder='Description' 
                                id="description" 
                            ></textarea>
                        </div>
                        <div className="mint-nft-qty">
                            <input 
                                type="number" 
                                placeholder='No. of NFTs' 
                                className='mint-nft-num' 
                                id="num_token" 
                            />
                        </div>
                        {/* <div className="mint-nft-price">
                        <input type="number" placeholder='Price in TRX' className='mint-nft-p' />
                    </div> */}
                        <div className="mint-nft-btn">
                            {
                                onMint
                                    ?
                                    <button
                                        className="mint-nft-b disabled"
                                        disabled="disabled"
                                        onClick={() => { mint(); }}
                                    >
                                        <span>Minting</span>
                                        <span className="dot1">.</span>
                                        <span className="dot2">.</span>
                                        <span className="dot3">.</span>
                                    </button>
                                    :
                                    <button
                                        className="mint-nft-b"
                                        onClick={() => { mint(); }}
                                    >
                                        Mint
                                        {
                                            isExploding
                                                ?
                                                <ConfettiExplosion particleCount={300} height={1080} width={1080} />
                                                :
                                                null
                                        }
                                    </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.forwardRef(MintNft);