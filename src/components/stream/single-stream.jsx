import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from 'react-player';
import "./single-stream.scss";
import Communication from "./message/Communication";

const SingleStream = () => {
    const { isConnected } = useAccount();
    const playerRef = useRef(null);
    const navigate = useNavigate();
    const params = useParams();
    const [playbackId, setPlaybackId] = useState(null);
    const [playerSource, setPlayerSource] = useState(null);

    useEffect(() => {
        if (!isConnected) {
            navigate("/");
        } else {
            console.log(params.id);
            setPlaybackId(params.id);
            setPlayerSource(`https://livepeercdn.com/hls/${params.id}/index.m3u8`)
        }
    }, [])

    useEffect(() => {
        console.log(playerSource);
    }, [playerSource])

    return (
        <div className="stream-single-main">
            <div className="stream-single-heading">Streamer Name</div>
            <div className="stream-holder">
                {/* <video className="stream-player" ref={playerRef} controls>
                    <source src={playerSource} type="application/x-mpegURL" />
                </video> */}
                <ReactPlayer
                    url={playerSource}
                    controls={true}
                    style={{ width: "100%" }}
                />
            </div>
            <div className="chats">
                <Communication />
            </div>
        </div>
    )
}

export default SingleStream;