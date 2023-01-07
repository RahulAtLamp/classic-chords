import React, { useEffect } from "react";
// import { ParallaxHover } from "react-parallax-hover";
import "./explore.scss";
// import NFT1 from "../../images/nft1.png";
// import NFT2 from "../../images/nft2.png";
// import NFT3 from "../../images/nft3.png";
// import NFT4 from "../../images/nft4.png";
// import NFT5 from "../../images/nft5.png";
// import NFT6 from "../../images/nft6.png";
// import NFT7 from "../../images/nft7.png";
// import NFT8 from "../../images/nft8.png";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import market from "../../contract/artifacts/userStream.json";
import Loading3 from "../../loading3";

// const user_address = "0x036E73d74e86cC50930d78f26cf97d603c40088f";
// const classicChords_address = "0x01daa94030dBd0a666066483D89E7927BE0904Ed";
// const market_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9"
const RPC_ENDPOINT = "https://rpc-mumbai.maticvigil.com/"

const Explore = ({ temp }) => {

  const [loading, setLoading] = React.useState(false)
  const [Artists, setArtist] = React.useState([])

  // const gui = new GUI();
  // gui.destroy()
  // console.log(process.env.REACT_APP_MARKET_ADDRESS)

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
      const contract = new ethers.Contract(process.env.REACT_APP_USER_ADDRESS, market, provider);
      return contract
    } catch (error) {
      console.log(error);
    }
  }

  const getArtists = async () => {
    const contract = await getContract()
    const artists = await contract.getAllArtists()
    setArtist(artists);
    setLoading(true)
    console.log(artists);
  }

  useEffect(() => {
    try {
      document.getElementById('gui').style.display = "none";
    } catch (error) {
      console.log(error);
    }

    getArtists()
  }, [])


return (
    <>
      <div className="exp">
        <div className="exp-header">All Artists</div>

        {loading ? (
          <div className="">
            <div className="exp-main">
              {
                Artists.map((artist, i) => (
                  <Link key={artist.userId} to={"/artist/" + artist.userAddress}>
                    <div className="exp-pa">
                      <div className="exp-bg">
                        <div className="exp-img">
                          <img className="exp-nft" src={"https://ipfs.io/ipfs/" + artist.profileImage} />
                        </div>
                        <div className="exp-name" title={artist.name}>{artist.name}</div>
                        <p className="exp-description">{artist.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
            <br />
          </div>
        ) : <Loading3 />}
      </div>
    </>
  );
};

export default Explore;
