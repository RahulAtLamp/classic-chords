import React, { useEffect } from "react";
import "./MintNft.scss";
import ConfettiExplosion from "react-confetti-explosion";
import Loading3 from "../../loading3";
import { NFTStorage, File } from "nft.storage";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";
import { getClassicChordsContract } from "../Contract";

function MintNft(props) {

  const connectMeta = async () => {
    if (address) {
      mint();
    } else {
      openConnectModal();
    }
  };
  const { address } = useAccount();
  const [isExploding, setIsExploding] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [onMint, setOnMint] = React.useState(false);
  const [onLoading, setOnLoading] = React.useState(false);
  const mintBox = React.useRef();
  const inputRef = React.useRef();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigate();

  const getTokeUri = async () => {
    // const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllOTgwOTYxRDc1M0QwNUEzODlDZUU1RThCRjA5NjI3QzkwYzQ2RTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjgxOTEzODY1MzksIm5hbWUiOiJjbGFzc2ljX2Nob3JkcyJ9.TKUEsNlcVJQvImOVlnZqCYEQPsjZb3RmXgSAR5D9vng" })
    const nft_client = new NFTStorage({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDczMzU1RDY0Njc1YTlEODA0MzA2ODIyMzkzRjRGQzkyRmNBQjg5QzkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODQxOTEyODc3MSwibmFtZSI6Ik11c2ljIE5GVHMifQ.G2tcD1_VJCUF0eiSQSDIn05ei9NY5EN1klNqJJrjoh4",
    });

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const video = new File([props.file], name + ".webm", {
      type: props.file.type,
    });
    // const video_file_url = await client.put([video],'classic_chords_nft.webm')
    // console.log("vide---"+video_file_url);

    const metadata = {
      description: description,
      image: video,
      name: name,
    };
    // const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    const metadata_cid = await nft_client.store(metadata, "metadata.json");
    console.log(metadata_cid);
    return metadata_cid.url;
  };
  useEffect(() => {
    // console.log(open);
    // console.log(props.opened);
    setOpen(props.opened);
    if (props.opened) {
      // inputRef.current.focus();
      console.log(inputRef);
    }
  }, [props.opened]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (mintBox.current && !mintBox.current.contains(event.target)) {
        setOpen(false);
        props.changeOpen();
        // window.location.reload();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mintBox]);

  const mint = async () => {
    setOnMint(true);
    setOnLoading(true);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const contract = await getClassicChordsContract();
        const numToken = document.getElementById("num_token").value;
        const uri = await getTokeUri();
        console.log(uri);
        const tx = await contract.mint(numToken, uri);
        tx.wait();
        setOnMint(false);
        setOnLoading(false);
        setIsExploding(true);
        setTimeout(() => {
          setOpen(false);
          navigate("/profile");
        }, 5000);
      }
    } catch (error) {
      setOnMint(false);
      setOnLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="mint">
        <div className="mint-nft-main">
          <div className="mint-nft-container" ref={mintBox}>
            <div className="mint-nft-header">
              <h2 className="mint-nft-h2">Mint the ART</h2>
            </div>
            {/* {onLoading ? (
            <Loading3 />
          ) : ( */}
            <div className="mint-nft-data">
              <div className="mint-nft-video">
                <video className="mint-nft-v" controls>
                  <source src={props.file_url} type="video/webm" />
                </video>
              </div>
              <div className="mint-nft-name">
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="Name"
                  className="mint-nft-n"
                  id="name"
                />
              </div>
              <div className="mint-nft-description">
                <textarea
                  className="mint-nft-d"
                  placeholder="Description"
                  id="description"
                ></textarea>
              </div>
              <div className="mint-nft-qty">
                <input
                  type="number"
                  placeholder="No. of NFTs"
                  className="mint-nft-num"
                  id="num_token"
                />
              </div>
              {/* <div className="mint-nft-price">
                        <input type="number" placeholder='Price in TRX' className='mint-nft-p' />
                    </div> */}
              <div className="mint-nft-btn">
                {onMint ? (
                  <button
                    className="mint-nft-b disabled"
                    disabled="disabled"
                    onClick={() => {
                      connectMeta();
                    }}
                  >
                    <span className="mint-loader">
                      <Loading3 message={"Minting"} />
                    </span>
                    {/* <span>Minting</span>
                  <span className="dot1">.</span>
                  <span className="dot2">.</span>
                  <span className="dot3">.</span> */}

                    {/* <Loading3/> */}
                  </button>
                ) : (
                  <button
                    className="mint-nft-b"
                    onClick={() => {
                      connectMeta();
                    }}
                  >
                    Mint
                    {isExploding ? (
                      <ConfettiExplosion
                        particleCount={300}
                        height={1080}
                        width={1080}
                      />
                    ) : null}
                  </button>
                )}
              </div>
            </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.forwardRef(MintNft);
