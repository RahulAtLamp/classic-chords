import React from "react";
import { useEffect, useRef, useState } from "react";
import { Client } from "@livepeer/webrtmp-sdk";
import Livepeer from "livepeer-nodejs";
import { create, CID } from "ipfs-http-client";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import user from "../../contract/artifacts/userStream.json"
import { ethers } from "ethers";
import Communication from "./message/Communication";
import "./stream.scss";
const user_address = "0xb14bd4448Db2fe9b4DBb1D7b8097D28cA57A8DE9";

function Streaming({ account }) {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const videoEl = useRef(null);
  const stream = useRef(null);
  const mounted = useRef(false);
  const [session, setSession] = useState("");
  const [url, setUrl] = useState("");
  const [showChat, setShowChat] = useState(false);
  const livepeerObject = new Livepeer("fbf20223-008c-4d6f-8bdb-5d6caec8eb29");
  
  // const getStreams = async () => {
  //   const streams = await livepeerObject.Stream.getAll({ isActive: false });
  //   console.log(streams);
  // };
  
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  // const [add, setAdd] = useState("");
  const [record, setRecord] = useState("");
  const [premium, setPremium] = useState("");

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected]);

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
          const contract = new ethers.Contract(process.env.REACT_USER_ADDRESS, user, signer);
          return contract
        } else {
          alert("Please connect to the bitTorent Network!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const StartStream = async () => {

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
    console.log(stream_.streamKey);
    const contract = await getContract();
    console.log(premium,
      title,
      des);
    const tx = await contract.createStream(
      stream_.id,
      premium,
      title,
      des
    );
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

    session.on("open", () => {
      console.log("Stream started.");
      alert("Stream started; visit Livepeer Dashboard.");
      setShowChat(true);
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
  };

  const closeStream = async () => {
    session.close();
    window.location.reload();
  };

  useEffect(() => {
    if (!mounted) {
      closeStream();
    }
  }, [mounted])

  return (
    <>
      <section className="cs-main">
        <h1 className="stream-header">Go Live</h1>
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
                <label className="premium-label">Do you want to make strem premium?</label>
              </div>
              <label>
                <input
                  className="cs-input-radio"
                  type="radio"
                  name="streamSelector"
                  onChange={(event) => setPremium(event.target.value)}
                  value="true"
                  checked
                ></input>
                Yes
              </label>
              <label>
                <input
                  className="cs-input-radio"
                  type="radio"
                  name="streamSelector"
                  onChange={(event) => setPremium(event.target.value)}
                  value="false"
                ></input>
                No
              </label>
              <div>
                <label className="premium-label">Do you want to save this Stream?</label>
              </div>
              <label>
                <input
                  className="cs-input-radio"
                  type="radio"
                  name="radiobutton"
                  value="true"
                  onChange={(event) => setRecord(event.target.value)}
                  checked
                ></input>
                Yes
              </label>
              <label>
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
          </div>
        </div>
        <button onClick={() => { console.log(ethers.Wallet.createRandom()); }}>dummy Address</button>
        {
          showChat
            ?
            <div className="communication">
              <Communication />
            </div>
            :
            null
        }
      </section>
    </>
  );
}

export default Streaming;
