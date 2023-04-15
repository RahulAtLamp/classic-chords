import { useEffect, useState, useRef } from "react";

import Counter from "../Counter";

import Visualizer from "./art/visualizer";
import "./player.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Piano from "./3dInstruments/Piano"
import Drums from "./3dInstruments/Drums"

const toastInfo = () =>
  toast.info("Select any tab and share the system audio to record piano.");

function Player() {
  
  const [recordingStatus, setRecordingStatus] = useState(null);
  const [timeControl, setTimeControl] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState();
  const [selectPlayer , setSelectPlayer] = useState({piano: false, drums: false})

  const StartRecording = () => {
    setRecordingStatus(true);
    // setTimeControl(true);
    // setTimeout(() => {
    document.getElementById("startR").click();
    // setTimeControl(false);
    toastInfo();
    // }, 5000);
  };

  const StopRecording = () => {
    document.getElementById("stopR").click();
    setRecordingStatus(null);
  };


  return (
    <div className="player-main">
      {timeControl ? (
        <div className="player-counter">
          <Counter />
        </div>
      ) : null}
      <div className="control-holder">
        <button
          className={recordingStatus === true ? "start active" : "start"}
          onClick={() => {
            StartRecording();
          }}
          disabled={recordingStatus === true ? true : false}
        >
          Start Recording
        </button>
        <button
          className={recordingStatus === null ? "stop active" : "stop"}
          onClick={() => {
            StopRecording();
          }}
          disabled={recordingStatus === null ? true : false}
        >
          Stop Recording
        </button>
      </div>
      
      <div id="gui"></div>
      <div id="pianoHolder">
        {selectPlayer.piano ? <Piano onProgress={loadingPercentage => setLoadingPercentage({ loadingPercentage })} />
        :
        <Drums onProgress={loadingPercentage => setLoadingPercentage({ loadingPercentage })} />}

        {/* <canvas id="pianoCanvas"></canvas>
        <div style={{ display: "none" }}>
          {counter ? (
            <MIDISounds
              ref={midiSounds}
              appElementName="root"
              instruments={[selectedInstrument]}
            />
          ) : null}
        </div> */}
        <Visualizer />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Player;
