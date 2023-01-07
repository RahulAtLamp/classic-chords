import { useEffect } from 'react';

import { GUI } from 'dat.gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import Counter from '../Counter';

import SceneInit from './lib/SceneInit';
import Piano from './lib/Piano';
import MIDISounds from 'midi-sounds-react';
import { useState, useRef } from 'react';
import Visualizer from "./art/visualizer";
import './player.scss'

function Player() {
  const [selectedInstrument, setSelectedInstrument] = useState(31);
  const p = new Piano();
  const gui = new GUI();
  const [recordingStatus, setRecordingStatus] = useState(null);
  const [timeControl, setTimeControl] = useState(false);

  let items = null;
  const midiSounds = useRef(null);

  const StartRecording = () => {
    setRecordingStatus(true);
    setTimeControl(true);
    setTimeout(() => {
      document.getElementById('startR').click();
      setTimeControl(false)
    }, 5000);
  };

  const StopRecording = () => {
    document.getElementById('stopR').click();
    setRecordingStatus(null);
  };

  useEffect(() => {
    const test = new SceneInit('pianoHolder', 'pianoCanvas');
    test.initScene();
    test.animate();
    // midiSounds.cacheInstrument(selectedInstrument);
    gui.domElement.id = 'gui';

    test.scene.add(p.getPianoGroup());

    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/Helvetica-Bold.typeface.json', (font) => {
      p.renderText(font);
    });


    test.camera.position.z = 226;
    test.camera.position.x = -40;
    test.camera.position.y = 30;

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(test.camera.position, 'z', 100, 250);

    // NOTE: UI bug caused by importing tailwind css.
    const pianoFolder = gui.addFolder('Piano');
    pianoFolder.addColor(p, 'highlightColor').name('Highlight Color');
    pianoFolder
      .add(p, 'displayText')
      .name('Display Text')
      .onChange((value) => {
        if (value) {
          p.renderText();
        } else {
          p.hideText();
        }
      });

    // var obj = { Start_Recording: function () { document.getElementById('startR').click(); } };

    // pianoFolder.add(obj, 'Start_Recording').name("Start Recording");

    // var obj_2 = { Stop_Recording: function () { document.getElementById('stopR').click(); } };

    // pianoFolder.add(obj_2, 'Stop_Recording').name("Stop Recording");


    const createSelectItems = () => {
      if (midiSounds) {
        if (!(items)) {
          let items = {};
          for (let i = 0; i < midiSounds.current.player.loader.instrumentKeys().length; i++) {
            items[midiSounds.current.player.loader.instrumentInfo(i).title] = i;
          }
          return items;
        }
      }
    }

    // console.log(createSelectItems());


    var config = {
      'Select Instrument': selectedInstrument,
    };

    pianoFolder.add(config, 'Select Instrument', createSelectItems())
      .onChange((value) => {
        console.log(value);
        if (value) {
          setSelectedInstrument(value);
          midiSounds.current.cacheInstrument(value);
        }
      });

    pianoFolder.open();

    const onKeyDown = (event) => {
      if (event.key === 'h' || event.key === 'H') {
        gui.__proto__.constructor.toggleHide();
      }
      if (event.repeat) {
        return;
      }
      p.maybePlayNote(event.key, midiSounds.current, selectedInstrument);
    };

    const onKeyUp = (event) => {
      p.maybeStopPlayingNote(event.key);
    };

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
      // pianoFolder.destroy();
      gui.removeFolder(pianoFolder);
      gui.removeFolder(cameraFolder);
      gui.destroy();
    };


  }, []);

  useEffect(() => {
    // document.getElementById("gui").outerHTML = "";
    // console.log(first)
    const test = new SceneInit('pianoHolder', 'pianoCanvas');
    test.initScene();
    test.animate();
    // midiSounds.cacheInstrument(selectedInstrument);

    test.scene.add(p.getPianoGroup());

    const fontLoader = new FontLoader();
    fontLoader.load('./fonts/Helvetica-Bold.typeface.json', (font) => {
      console.log(font);
      p.renderText(font);
    });

    test.camera.position.z = 226;
    test.camera.position.x = -40;
    test.camera.position.y = 30;

    if (selectedInstrument) {
      midiSounds.current.selectedInstrument = selectedInstrument;
      midiSounds.current.cacheInstrument(selectedInstrument);
    }

  }, [selectedInstrument])

  return (
    <div className='player-main'>
      {
        timeControl
          ?
          <div className='player-counter'>
            <Counter />
          </div>
          :
          null
      }
      <div className='control-holder'>
        <button
          className={recordingStatus === true ? "start active" : "start"}
          onClick={() => { StartRecording() }}
          disabled={recordingStatus === true ? true : false}
        >
          Start Recording
        </button>
        <button
          className={recordingStatus === null ? "stop active" : "stop"}
          onClick={() => { StopRecording() }}
          disabled={recordingStatus === null ? true : false}
        >
          Stop Recording
        </button>
      </div>
      <div id="gui"></div>
      <div id="pianoHolder">
        <canvas id="pianoCanvas"></canvas>
        <div style={{ display: 'none' }}>
          <MIDISounds
            ref={midiSounds}
            appElementName="root"
            instruments={[selectedInstrument]}
          />
        </div>
        <Visualizer />
      </div>
    </div>
  );
}

export default Player