import React, { useEffect } from "react";
import { useState } from "react";
import "./home.css";
import { ParallaxHover } from "react-parallax-hover";
import { useNavigate } from "react-router-dom";
import HomeImg from "../../images/homeimg.png";
import Zora from "../../images/zora.svg";
import Polygon from "../../images/polygon1.svg";
import NftStorage from "../../images/nftstorage1.svg";
import LivePeer from "../../images/livepeer1.svg";
import Navbar from "../navbar/navbar";
// import Lit from "../../images/lit.svg";

const Home = () => {
  // useEffect (() =>{
  //   try{
  //     document.getElementById("gui").outerHTML = "";
  //   }catch(error){
  //     console.log(error);
  //   }
  // })

  const navigate = new useNavigate();
  const takeToPlayer = () => {
    navigate("/player");
  };
  return (
    <>
      {/* <Navbar /> */}
      <div className="home">
        <div className="outerbg">
          <div className="innerbg">
            <div className="home-left">
              <div className="home-left-inner">
                <div className="home-logo">Classic Chords</div>

                <div className="home-content">
                  Unleash The Artist In You, & Make Your Own Web3 Music
                </div>
                <div className="home-button-div">
                  <button
                    onClick={() => {
                      takeToPlayer();
                    }}
                    className="home-button"
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </div>
            <div className="home-right">
              <div className="muzieknootjes">
                <div className="noot-1">&#9835; &#9833;</div>
                <div className="noot-2">&#9833;</div>
                <div className="noot-3">&#9839; &#9834;</div>
                <div className="noot-4">&#9834;</div>
              </div>
              <img className="home-img" src={HomeImg} alt="" />
            </div>
          </div>
          <div className="inst-header">Instruction</div>
          <div className="inst-main">
            {/* <ParallaxHover borderRadius={50} scale={5} width={400} height={600}> */}
            <div className="inst-bg">
              <div className="inst-content">
                <ul className="inst-list">
                  <li>
                    As soon as you enter the homepage, you can find the PLAY
                    NOW.
                  </li>
                  <br />
                  <li> You'll be redirected to your instruments page.</li>
                  <br />
                  <li>Play your music → Generate art.</li>
                  <br />
                  <li> You can choose either to mint your art or not.</li>
                  <br />
                  <li>
                    Note to Artists <br /> Only those with the NTF can access
                    the premium streams that you'll host.
                  </li>
                  <br />
                  <li>
                    The NFTs by default will be available to browse by the user.
                  </li>
                </ul>
              </div>
            </div>
            {/* </ParallaxHover> */}

            {/* <ParallaxHover borderRadius={50} scale={5} width={400} height={600}> */}
            <div className="inst-bg">
              <div className="inst-content">
                <ul className="inst-list">
                  <li>Go to the STREAM option from the homepage.</li>
                  <br />
                  <li>
                    Choose either Create a Stream or General Stream options.
                  </li>
                  <br />
                  <li>
                    On the General Stream page, can browse for live streams
                    happening at present across the globe.
                  </li>
                  <br />
                  <li>
                    Artists can Create a Stream right before you go live. Choose
                    to either record one or not.
                  </li>
                  <br />
                  <li>
                    All live recordings can be downloaded and shared by the
                    artist.
                  </li>
                  <br />
                  <li>A premium stream will be available soon.</li>
                </ul>
              </div>
            </div>
            {/* </ParallaxHover> */}

            {/* <ParallaxHover borderRadius={50} scale={5} width={400} height={600}> */}
            <div className="inst-bg">
              <div className="inst-content">
                <ul className="inst-list">
                  <li>
                    Only when you start playing your music, your Generate Art
                    button will be available.
                  </li>
                  <br />
                  <li>
                    You can choose to generate art by clicking on the Generate
                    Art button.
                  </li>
                  <br />
                  <li>Once done, a pop-up will ask if you want to mint it.</li>
                  <br />
                  <li>Press MINT NFT and avail the art.</li>
                  <br />
                  <li>
                    You can choose to mint and pay the Gas fee through your
                    MetaMask account.
                  </li>
                </ul>
              </div>
            </div>
            {/* </ParallaxHover> */}
          </div>
          <section className="footer">
            <section className="footer-header">
              <div>Powered By</div>
            </section>
            <div className="imgseperator-top">
              <div className="footer-img-bg">
                <div className="footer-img-i">
                  <img
                    className="poweredby-img"
                    src={Polygon}
                    alt="polygon"
                    onClick={() => window.open("https://polygon.technology/")}
                  />
                  <p className="poweredby-info">
                    Polygon is a Layer 2 scaling solution for Ethereum, aimed at
                    increasing transaction throughput and reducing gas fees by
                    offloading transactions from the main Ethereum blockchain to
                    a sidechain.
                  </p>
                </div>
              </div>
              <div className="footer-img-bg">
                <div className="footer-img-i">
                  <img
                    className="poweredby-img"
                    src={LivePeer}
                    alt="livepeer"
                    onClick={() => window.open("https://livepeer.org/")}
                  />
                  <p className="poweredby-info">
                    Livepeer is a decentralized video streaming network built on
                    the Ethereum blockchain that provides cheaper, more
                    scalable, and more secure video transcoding and streaming
                    services.
                  </p>
                </div>
              </div>
              <div className="footer-img-bg">
                <div className="footer-img-i">
                  <img
                    className="poweredby-img"
                    src={NftStorage}
                    alt="nft.storage"
                    onClick={() => window.open("https://nft.storage/")}
                  />
                  <p className="poweredby-info">
                    NFT.storage is a decentralized file storage and hosting
                    service built on the InterPlanetary File System (IPFS) and
                    Filecoin networks, aimed at providing a permanent and
                    censorship-resistant way to store and manage NFT-related
                    content.
                  </p>
                </div>
              </div>

              <div className="footer-img-bg">
                <div className="footer-img-i">
                  <img
                    className="poweredby-img"
                    src="/images/XMTP1.svg"
                    alt="XMTP"
                    onClick={() => window.open("https://xmtp.org/")}
                  />
                  <p className="poweredby-info">
                    XMTP (Extensible Message Transport Protocol) is an open
                    protocol, network, and standards for secure, private web3
                    messaging.
                  </p>
                </div>
              </div>

              <div className="footer-img-bg">
                <div className="footer-img-i">
                  <img
                    className="poweredby-img"
                    src="/images/btt1.svg"
                    alt="BTTC"
                    onClick={() => window.open("https://bttc.bittorrent.com/")}
                  />
                  <p className="poweredby-info">
                    As a world-leading blockchain scaling solution, BTTC
                    provides cross-chain service between heterogeneous
                    blockchains, providing a quicker, more cost-efficient, and
                    more scalable platform for Web3 developers
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="imgseperator-top1">
              <div className="footer-img-bg1">
                <div className="footer-img-i">
                  <img
                    className="poweredby-img"
                    src="/images/XMTP1.svg"
                    alt="XMTP"
                  />
                  <p className="poweredby-info">
                    Polygon is a Layer 2 scaling solution for Ethereum, aimed at
                    increasing transaction throughput and reducing gas fees by
                    offloading transactions from the main Ethereum blockchain to
                    a sidechain.
                  </p>
                </div>
              </div>

              <div className="footer-img-bg1">
                <div className="footer-img-i">
                  <img
                    className="poweredby-img"
                    src="/images/btt1.svg"
                    alt="BTTC"
                  />
                  <p className="poweredby-info">
                    Polygon is a Layer 2 scaling solution for Ethereum, aimed at
                    increasing transaction throughput and reducing gas fees by
                    offloading transactions from the main Ethereum blockchain to
                    a sidechain.
                  </p>
                </div>
              </div>
            </div> */}
            {/* <div className="imgseperator-top">
              <section>
                <ParallaxHover
                  borderRadius={20}
                  scale={5}
                  width={300}
                  height={300}
                >
                  <div className="footer-img-bg">
                    <div className="footer-img-i">
                      <img className="zora-img" src="images/tron.png" />
                    </div>
                  </div>
                </ParallaxHover>
              </section>
              <section>
                <ParallaxHover
                  borderRadius={20}
                  scale={5}
                  width={300}
                  height={300}
                >
                  <div className="footer-img-bg">
                    <div className="footer-img-i">
                      <img className="polygon-img" src="/images/btt.svg" />
                    </div>
                  </div>
                </ParallaxHover>
              </section>
              <section>
                <ParallaxHover
                  borderRadius={20}
                  scale={5}
                  width={300}
                  height={300}
                >
                  <div className="footer-img-bg">
                    <div className="footer-img-i">
                      <img className="nfts-img" src={NftStorage} />
                    </div>
                  </div>
                </ParallaxHover>
              </section>
            </div>
            <div className="imgseperator-down">
              <section>
                <ParallaxHover
                  borderRadius={20}
                  scale={5}
                  width={300}
                  height={300}
                >
                  <div className="footer-img-bg">
                    <div className="footer-img-i">
                      <img className="live-img" src={LivePeer} />
                    </div>
                  </div>
                </ParallaxHover>
              </section>
            </div> */}

            {/* <div><p className="col-sm">
            &copy;{new Date().getFullYear()} Biscuit | All rights reserved |
            Terms Of Service | Privacy
          </p></div> */}
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
