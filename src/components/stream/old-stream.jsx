import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useParams, useNavigate } from "react-router-dom";
// import { ethers } from "ethers";
import axios from "axios";
import ReactPlayer from "react-player";
import Loading3 from "../../loading3";
// import user from "../../contract/artifacts/userStream.json";
// import userBTTC from "../../contract/artifacts/userStreamBTTC.json";
import "./single-stream.scss";
import { getUserStreamContract } from "../Contract";

const OldStream = () => {
  const { isConnected } = useAccount();
  // const playerRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  const [playbackId, setPlaybackId] = useState(null);
  const [streamData, setStreamData] = useState(true);
  const [parentId, setParentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // const getContract = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       if (!provider) {
  //         console.log("Metamask is not installed, please install!");
  //       }
  //       const { chainId } = await provider.getNetwork();
  //       console.log("switch case for this case is: " + chainId);
  //       if (chainId === 80001) {
  //         const contract = new ethers.Contract(
  //           process.env.REACT_APP_USER_ADDRESS_POLYGON_TESTNET,
  //           user,
  //           signer
  //         );
  //         return contract;
  //       } else if (chainId === 1029) {
  //         const contract = new ethers.Contract(
  //           process.env.REACT_APP_USER_ADDRESS_BTTC_TESTNET,
  //           userBTTC,
  //           signer
  //         );
  //         return contract;
  //       }else if (chainId === 199) {
  //         console.log("inside the BTTC");
  //         const contract = new ethers.Contract(
  //           process.env.REACT_APP_USER_ADDRESS_BTTC_MAINNET,
  //           userBTTC,
  //           provider
  //         );
  //         return contract
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
          setPlaybackId(res.data.playbackId);
          setParentId(res.data.parentId);
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
    // const contract = await getContract();
    const contract = await getUserStreamContract();
    const streamId = parentId.replace(/-/g, "");
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
      fetchPlaybackId();
    }
  }, []);

  useEffect(() => {
    if (parentId) {
      console.log("I am ready to fetch contract data...");
      fetchUserData();
    }
  }, [parentId]);

  if (loading) {
    return (
      <div className="loading-main">
        <Loading3 />
      </div>
    );
  }

  return (
    <div className="old-stream-main">
      <div className="old-stream-heading">{streamData.title}</div>
      <div className="old-stream-holder">
        {/* <video className="stream-player" ref={playerRef} controls>
                    <source src={playerSource} type="application/x-mpegURL" />
                </video> */}
        <ReactPlayer
          url={`https://livepeercdn.studio/recordings/${params.id}/index.m3u8`}
          controls={true}
          style={{ width: "fit-content" }}
        />
      </div>
      {/* <div className="chats">
            </div> */}
    </div>
  );
};

export default OldStream;
