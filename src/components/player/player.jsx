import { useEffect, useState, useRef } from "react";

import Counter from "../Counter";

import Visualizer from "./art/visualizer";
import "./player.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Piano from "./3dInstruments/Piano";
import Drums from "./3dInstruments/Drums";

const toastInfo = () =>
  toast.info("Select any tab and share the system audio to record piano.");

function Player() {
  const [recordingStatus, setRecordingStatus] = useState(null);
  const [timeControl, setTimeControl] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState();
  const [keyPopup, setKeyPopup] = useState(false);
  const [selectPlayer, setSelectPlayer] = useState({
    piano: true,
    drums: false,
  });

  const drumKeyMap = [
    { key: "q", name: "Bass Drum 1" },
    {
      key: "w",
      name: "Bass Drum 2",
    },
    {
      key: "e",
      name: "Bass Drum 2",
    },
    {
      key: "r",
      name: "Hi-Hat",
    },
    {
      key: "t",
      name: "Snare Drum",
    },
    {
      key: "y",
      name: "Snare Drum",
    },
    {
      key: "u",
      name: "Cymbal",
    },
    {
      key: "a",
      name: "Kick and Hi-Hat",
    },
    {
      key: "s",
      name: "Snare and Rimshot",
    },
    {
      key: "d",
      name: "Kick and Hi-Hat",
    },
    {
      key: "f",
      name: "Chord",
    },
    {
      key: "g",
      name: "Tom or Conga",
    },
    {
      key: "h",
      name: "Tom or Conga",
    },
  ];
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
      <div className="select-player-btn-grp">
        <button
          className={
            selectPlayer.piano
              ? "active select-player-btn"
              : "select-player-btn"
          }
          onClick={() => {
            setSelectPlayer({ piano: true, drums: false });
          }}
        >
          Piano
        </button>
        <button
          className={
            selectPlayer.drums
              ? "active select-player-btn"
              : "select-player-btn"
          }
          onClick={() => {
            setSelectPlayer({ piano: false, drums: true });
          }}
        >
          Drums
        </button>
      </div>
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
      <button className="key-instruction" onClick={() => setKeyPopup(true)}>
        Keys
      </button>
      <div id="gui"></div>
      <div id="pianoHolder">
        {selectPlayer.piano ? (
          <Piano
            onProgress={(loadingPercentage) =>
              setLoadingPercentage({ loadingPercentage })
            }
          />
        ) : selectPlayer.drums ? (
          <Drums
            onProgress={(loadingPercentage) =>
              setLoadingPercentage({ loadingPercentage })
            }
          />
        ) : (
          ""
        )}

        {keyPopup ? (
          <>
            <div className="overlay" onClick={() => setKeyPopup(false)}></div>
            <div id="modal">
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Instrument</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectPlayer.piano ? (
                      <></>
                    ) : selectPlayer.drums ? (
                      drumKeyMap.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>
                              <span className="key">{item.key}</span>
                            </td>
                            <td>{item.name}</td>
                          </tr>
                        );
                      })
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
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
