import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import user from "../../contract/artifacts/userStream.json";
import { ethers } from "ethers";
import axios from "axios";
import "./single-stream.scss";
import Loading3 from "../../loading3";
import Communication from "./message/Communication";

function SingleStream() {
  const { isConnected } = useAccount();
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  const [playbackId, setPlaybackId] = useState(null);
  // const [streamId, setStreamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamData, setStreamData] = useState(true);
  // const [showChat, setShowChat] = useState(false);
  // const [displayChat, setDisplayChat] = useState(false);
  const [showSuper, setShowSuper] = useState(false);
  useEffect(() => {
    console.log(showSuper);
  }, [showSuper]);
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
            process.env.REACT_APP_USER_ADDRESS,
            user,
            signer
          );
          return contract;
        } else {
          alert("Please connect to the Mumbai Testnet Network!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlaybackId = async () => {
    const headers = {
      authorization: `Bearer ${process.env.REACT_APP_LIVEPEER_TOKEN}`,
    };
    try {
      axios
        .get(`https://livepeer.studio/api/stream/${params.id}`, {
          headers: headers,
        })
        .then((res) => {
          console.log(res);
          // const playbackId = res.data.playbackId;
          if (res.data.isActive === false) {
            navigate("/stream-ended");
          }
          setPlaybackId(res.data.playbackId);

          // setStreamId(res.data.parentId);
        })
        .catch((err) => {
          console.log(err);
          navigate("/no-data");
        });
    } catch (e) {
      console.log("I am the error...");
    }
  };

  const fetchUserData = async () => {
    const contract = await getContract();
    const streamId = params.id.replace(/-/g, "");
    const streamData = await contract.streamCodeToStream(streamId);
    console.log(streamData);
    console.log(streamData.title);
    let userData = {};
    userData.title = streamData.title;
    userData.description = streamData.description;
    setStreamData(userData);
    setLoading(false);
  };

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    } else {
      setPlaybackId(params.id);
      fetchPlaybackId();
    }
  }, []);

  useEffect(() => {
    if (playbackId) {
      fetchUserData();
    }
  }, [playbackId]);

  if (loading) {
    return (
      <div className="stream-single-main">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="stream-single-main">
      <div className="stream-single-heading">{streamData.title}</div>
      <div className="stream-holder">
        {/* <video className="stream-player" ref={playerRef} controls>
                    <source src={playerSource} type="application/x-mpegURL" />
                </video> */}
        <div className="stream-vid">
          <ReactPlayer
            url={`https://livepeercdn.studio/hls/${playbackId}/index.m3u8`}
            controls={true}
            style={{ width: "100%" }}
          />
        </div>
        {/* <div className="chats"> <div>Thank you. Please enjoy the stream!</div>
          <Communication streamId={params.id.replace(/-/g, "")} />
        </div> */}
        {/* {!showChat && !displayChat ? (
          <div className="chats-pre">
            <div className="chats-pre-txt">
              This is a Premium Chat. Do you want to Proceed?
            </div>

            <div className="chats-pre-btns">
              <button
                className="chats-btn"
                onClick={() => setShowChat(!showChat)}
              >
                Yes
              </button>
              <button
                className="chats-btn"
                onClick={() => setDisplayChat(!displayChat)}
              >
                No
              </button>
            </div>
          </div>
        ) : null} */}
        {/* {showChat ? ( */}
        <div className="chats">
          <Communication setShowSuper={setShowSuper} />
          {showSuper ? (
            <div className="chats-super-main">
              <div className="chats-super-headermain">
                <input type={"checkbox"} className="chats-super-check" />
                <div className="chats-super-header">Superchat</div>
              </div>
              {/* <div className="chats-super-confirm">
                Please Specify the amount
              </div> */}
              <div className="chats-super-lowermain">
                <input
                  type={"number"}
                  className="chats-super-lowernum"
                  placeholder=" Please Specify the amount"
                />
                <button className="chats-super-lowerbtn">Send</button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        {/* ) : displayChat ? (
         <div className="chats-no">
          <div className="chats-no-txt">
               Thank you. Please enjoy the stream!
             </div>
           </div>
         ) : null} */}
      </div>
    </div>
  );
}

export default SingleStream;
