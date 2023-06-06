import { useEffect, useState, useRef } from "react";

import Counter from "../Counter";
import Loading3 from "../../loading3";

import Visualizer from "./art/visualizer";
import "./player.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Piano from "./3dInstruments/Piano";
import Drums from "./3dInstruments/Drums";
import {
  drumKeyMap,
  pianoKeyMap1,
  pianoKeyMap2,
  pianoKeyMap3,
  pianoKeyMap4,
} from "./playerKeys";
import RecordingTime from "./RecordingTime";

const toastInfo = () =>
  toast.info("Kindly Give mic access if not given !");

function Player() {
  const [recordingStatus, setRecordingStatus] = useState(null);
  const [timeControl, setTimeControl] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState();
  const [keyPopup, setKeyPopup] = useState(false);
  const [instrumentLoading, setInstrumentLoading] = useState(true)
  const [selectPlayer, setSelectPlayer] = useState({
    piano: true,
    drums: false,
  });
  const [showTimer, setShowTimer] = useState(false);

  const handleStartRecordingTimer = () => {
    setShowTimer(true);
  };
  const StartRecording = () => {
    setRecordingStatus(true);
    setTimeControl(true);
    toastInfo();
    setTimeout(() => {
      setTimeControl(false);
      document.getElementById("startR").click();
      handleStartRecordingTimer();
    }, 6000);
  };

  const StopRecording = () => {
    document.getElementById("stopR").click();
    setShowTimer(false);
    setRecordingStatus(null);
  };

  useEffect(() =>{
    setTimeout(() => {
  setInstrumentLoading(false)
    }, 5000);
  },[instrumentLoading])

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
            setInstrumentLoading(true)
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
            setInstrumentLoading(true)

          }}
        >
          Drums
        </button>
        <button className="key-instruction" onClick={() => setKeyPopup(true)}>
          Keys
        </button>
      </div>
      <div className="key-list-btn"></div>
      {timeControl ? (
        <div className="player-counter">
          <Counter />
        </div>
      ) : null}

      <div id="gui"></div>
      <div id="pianoHolder">
        {selectPlayer.piano ? (
          <>
          <Piano
            onProgress={(loadingPercentage) =>
              setLoadingPercentage({ loadingPercentage })
            }
          />
            { instrumentLoading ? <>
            
            <div className="loading-instruments-div">
              Loading Instrument.......
            </div>
            </>: ""}
            </>
        ) : selectPlayer.drums ? (
          <>
          <Drums
            onProgress={(loadingPercentage) =>
              setLoadingPercentage({ loadingPercentage })
            }
          />
           { instrumentLoading ? <>
            
            <div className="loading-instruments-div">
              Loading Instrument.......
            </div>
            </>: ""}
          </>
        ) : (
          ""
        )}

        {keyPopup ? (
          <>
            <div className="overlay" onClick={() => setKeyPopup(false)}></div>
            <div id="modal">
              <div className="table">
                {selectPlayer.drums ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Instrument</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drumKeyMap.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>
                              <span className="key">{item.key}</span>
                            </td>
                            <td>{item.name}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : selectPlayer.piano ? (
                  <>
                    <table id="wrapTable">
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Instrument</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pianoKeyMap1.map((item, key) => {
                          return (
                            <tr key={key}>
                              <td>
                                <span className="key">{item.key}</span>
                              </td>
                              <td>{item.name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <table id="wrapTable">
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Instrument</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pianoKeyMap2.map((item, key) => {
                          return (
                            <tr key={key}>
                              <td>
                                <span className="key">{item.key}</span>
                              </td>
                              <td>{item.name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <table id="wrapTable">
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Instrument</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pianoKeyMap3.map((item, key) => {
                          return (
                            <tr key={key}>
                              <td>
                                <span className="key">{item.key}</span>
                              </td>
                              <td>{item.name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <table id="wrapTable">
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Instrument</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pianoKeyMap4.map((item, key) => {
                          return (
                            <tr key={key}>
                              <td>
                                <span className="key">{item.key}</span>
                              </td>
                              <td>{item.name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        
        <Visualizer />
      </div>
      <div className="control-holder">
        {recordingStatus ? (
          ""
        ) : (
          <button
            className={recordingStatus === true ? "start active" : "start"}
            onClick={() => {
              StartRecording();
            }}
            disabled={recordingStatus === true ? true : false}
          >
            Start Recording
          </button>
        )}

        {showTimer && <RecordingTime />}

        {recordingStatus ? (
          <button
            className={recordingStatus === null ? "stop active" : "stop"}
            onClick={() => {
              StopRecording();
            }}
            disabled={recordingStatus === null ? true : false}
          >
            Stop Recording
          </button>
        ) : (
          ""
        )}
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
