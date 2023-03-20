import React from "react";
import { useEffect, useRef, useState } from "react";
import { Client } from "@livepeer/webrtmp-sdk";
import Livepeer from "livepeer-nodejs";
import { create, CID } from "ipfs-http-client";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import * as PushAPI from "@pushprotocol/restapi";
import user from "../../contract/artifacts/userStream.json";
import { ethers } from "ethers";
import CryptoJS from "crypto-js";
import Communication from "./message/Communication";
import "./stream.scss";
import Loading3 from "../../loading3";
const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";

function Streaming({ account }) {
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();

  const videoEl = useRef(null);
  const stream = useRef(null);
  const mounted = useRef(false);
  const [session, setSession] = useState("");
  const [url, setUrl] = useState("");
  const [streamId, setStreamId] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  // const livepeerObject = new Livepeer("fbf20223-008c-4d6f-8bdb-5d6caec8eb29");
  const livepeerObject = new Livepeer(process.env.REACT_APP_LIVEPEER_TOKEN);

  // const getStreams = async () => {
  //   const streams = await livepeerObject.Stream.getAll({ isActive: false });
  //   console.log(streams);
  // };

  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  // const [add, setAdd] = useState("");
  const [record, setRecord] = useState("");
  const [premium, setPremium] = useState("");
  const [loading, setLoading] = useState(false);

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
          alert("Please connect to the MUMBAI matic Network!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const StartStream = async () => {
    // setLoading(true);
    if (!title) {
      alert("Please provide a title for the stream...");
      // setLoading(false);
      return;
    }

    if (!des) {
      alert("Please provide a description for the stream...");
      // setLoading(false);
      return;
    }

    if (!premium) {
      alert("Please select if you want the video to be premium...");
      // setLoading(false);
      return;
    }

    if (!record) {
      alert("Please select if you want to record the video...");
      // setLoading(false);
      return;
    }

    (async () => {
      videoEl.current.volume = 0;

      stream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoEl.current.srcObject = stream.current;
      videoEl.current.play();
    })();

    const stream_ = await livepeerObject.Stream.create({
      name: "test_stream",
      profiles: [
        {
          name: "720p",
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720,
        },
        {
          name: "480p",
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480,
        },
        {
          name: "360p",
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360,
        },
      ],
    });
    console.log(stream_);
    const withoutDash = stream_.id.replace(/-/g, "");
    setStreamId(withoutDash);
    // console.log(stream_.streamKey);
    const contract = await getContract();
    console.log(contract);

    // const encData = testEncrypt(stream_.id);
    const StreamId = stream_.id;
    const encData = StreamId.replace(/-/g, "");
    console.log(premium, title, des, encData);
    const tx = await contract.createStream(encData, premium, title, des);
    tx.wait();
    stream_.setRecord(true);
    const current_stream = await livepeerObject.Stream.get(stream_.id);
    console.log("video id" + stream_.id);
    const result = await current_stream.setRecord(true);
    console.log(result);
    const url =
      "https://livepeercdn.com/hls/" + stream_.playbackId + "index.m3u8";
    setUrl(url);
    const streamKey = stream_.streamKey;

    if (!stream.current) {
      alert("Video stream was not started.");
    }

    if (!streamKey) {
      alert("Invalid streamKey.");
      return;
    }

    const client = new Client();

    const session = client.cast(stream.current, streamKey);

    session.on("open", async () => {
      // setLoading(true);
      console.log("Stream started.");
      alert("Stream started; visit Livepeer Dashboard.");
      const RPC_ENDPOINT = "https://rpc-mumbai.maticvigil.com/";
      const RPC_provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
      const contract = new ethers.Contract(
        process.env.REACT_APP_USER_ADDRESS,
        user,
        RPC_provider
      );
      const tx = await contract.userMapping(address);

      const allArtists = await contract.getAllArtists();
      const allUsers = [];
      for (let i = 0; i < allArtists.length; i++) {
        const formatting = `eip155:5:${allArtists[i].userAddress}`;
        allUsers.push(formatting);
      }
      // console.log(allUsers);

      try {
        const PK =
          "aafda643b6b90977cde35f1cb28d880b5fdded8ae621490a0d3f56af41d59c65";
        const Pkey = `0x${PK}`;
        const signer = new ethers.Wallet(Pkey);
        const apiResponse = await PushAPI.payloads.sendNotification({
          signer: signer,
          type: 3, // target
          identityType: 2, // direct payload
          notification: {
            title: `${tx.name} is live`,
            body: `${tx.name} is live`,
          },
          payload: {
            title: `${tx.name} is live`,
            body: `${tx.name} is live`,
            cta: "",
            img: "",
          },
          recipients: allUsers, // recipient address
          channel: "eip155:5:0x4466B37DF22A4fb3c8e79c0272652508C6Ba3c11", // your channel address
          env: "staging",
        });

        // apiResponse?.status === 204, if sent successfully!
        console.log("API repsonse: ", apiResponse);
      } catch (err) {
        console.error("Error: ", err);
      }
      setShowChat(true);
      setShowInfo(false);
      // setLoading(false);
    });

    session.on("close", () => {
      console.log("Stream stopped.");
    });

    session.on("error", (err) => {
      console.log("Stream error.", err.message);
    });

    // console.log(title);
    // console.log(des);
    // console.log(add);
    // console.log(record);
    // setLoading(false);
  };

  const closeStream = async () => {
    window.location.reload();
    // session.close();
  };

  const testEncrypt = (stream_id) => {
    // const key = "35873FDFD99E4FA33F15B59924ACC";
    // const text = "9a935bb4-6ff3-4704-9c07-10de5750ffc1"

    const data = CryptoJS.AES.encrypt(
      JSON.stringify(stream_id),
      process.env.REACT_APP_CRYPT_KEY
    ).toString();

    return data;
  };

  const testDecrypt = () => {
    const data =
      "U2FsdGVkX1/svP3xEHYKUiOUlXWBm6Lr0TFKw8lgIUYajpAVLrvgB1KbRWdKllnL3yg1/9hDJrNJ+Lb0+9a5wA==";
    // const key = "35873FDFD99E4FA33F15B59924ACC";

    const bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_CRYPT_KEY);
    const dec = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(dec);
  };

  useEffect(() => {
    if (!mounted) {
      closeStream();
    }
  }, [mounted]);

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected]);

  return (
    <>
      <section className="cs-main">
        <h1 className="stream-header">Go Live</h1>
        {loading ? (
          <div className="loading-main-style">
            <Loading3 />
          </div>
        ) : (
          <div className="cs">
            <div className="cs-left-container">
              <video className="cs-video" ref={videoEl} controls />
              <div className="cs-btns">
                <button className="cs-button" onClick={() => StartStream()}>
                  Start
                </button>
                <button className="cs-button" onClick={closeStream}>
                  Stop
                </button>
              </div>
            </div>

            <div className="cs-right-container">
              {showInfo ? (
                <form>
                  <input
                    className="cs-input"
                    type="text"
                    placeholder="Stream Title"
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />
                  <textarea
                    className="cs-textarea"
                    type="text"
                    placeholder="Stream Description"
                    rows="6"
                    cols="50"
                    onChange={(event) => setDes(event.target.value)}
                  />
                  <div>
                    <label className="premium-label">
                      Do you want to make strem premium?
                    </label>
                  </div>
                  <label className="premium-radio">
                    <input
                      className="cs-input-radio"
                      type="radio"
                      name="streamSelector"
                      value="true"
                      onChange={(event) => setPremium(event.target.value)}
                    ></input>
                    Yes
                  </label>
                  <label className="premium-radio">
                    <input
                      className="cs-input-radio"
                      type="radio"
                      name="streamSelector"
                      value="false"
                      onChange={(event) => setPremium(event.target.value)}
                    ></input>
                    No
                  </label>
                  <div>
                    <label className="premium-label">
                      Do you want to save this Stream?
                    </label>
                  </div>
                  <label className="premium-radio">
                    <input
                      className="cs-input-radio"
                      type="radio"
                      name="radiobutton"
                      value="true"
                      onChange={(event) => setRecord(event.target.value)}
                    ></input>
                    Yes
                  </label>
                  <label className="premium-radio">
                    <input
                      className="cs-input-radio"
                      type="radio"
                      name="radiobutton"
                      value="false"
                      onChange={(event) => setRecord(event.target.value)}
                    ></input>
                    No
                  </label>
                </form>
              ) : null}
              {showChat ? (
                <div className="communication">
                  <Communication streamId={streamId} />
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* <button onClick={() => { testEncrypt() }}>Encrypt Data</button>
        <button onClick={() => { testDecrypt() }}>Decrypt Data</button> */}
        {/* {showChat ? (
          <div className="communication">
            <Communication streamId={streamId} />
          </div>
        ) : null} */}
      </section>
    </>
  );
}

export default Streaming;
