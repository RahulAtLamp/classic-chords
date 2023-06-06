var CanvasRecorder = function CanvasRecorder() {
  var start = startRecording;
  var stop = stopRecording;
  var save = download;
  var stream;
  var recordedBlobs = [];
  var supportedType = null;
  var mediaRecorder = null;
  var audio_track;
  var canvas_track;
  var isRecording=false;
  const keyMapping = {
    Q: "C2",
    W: "D2",
    E: "E2",
    R: "F2",
    T: "G2",
    Y: "A2",
    U: "B2",
    I: "C3",
    Z: "C3",
    X: "D3",
    C: "E3",
    V: "F3",
    B: "G3",
    N: "A3",
    M: "B3",
    "<": "C4",
    q: "C4",
    w: "D4",
    e: "E4",
    r: "F4",
    t: "G4",
    y: "A4",
    u: "B4",
    i: "C5",
    z: "C5",
    x: "D5",
    c: "E5",
    v: "F5",
    b: "G5",
    n: "A5",
    m: "B5",
    ",": "C6",
    "@": "Db2",
    "#": "Eb2",
    "%": "Gb2",
    "^": "Ab2",
    "&": "Bb2",
    S: "Db3",
    D: "Eb3",
    G: "Gb3",
    H: "Ab3",
    J: "Bb3",
    2: "Db4",
    3: "Eb4",
    5: "Gb4",
    6: "Ab4",
    7: "Bb4",
    s: "Db5",
    d: "Eb5",
    g: "Gb5",
    h: "Ab5",
    j: "Bb5",
  };
  const audioContext = new AudioContext({ sampleRate: 24100 });
  // Create audio context and destination
  const audioDestination = audioContext.createMediaStreamDestination();

  function importAll(requireContext) {
    const files = {};
    requireContext.keys().forEach((key) => {
      const midiNumber = key.replace("./", "").replace(".mp3", "");
      files[midiNumber] = requireContext(key);
    });
    return files;
  }

  const audioFiles = importAll(
    require.context("./acoustic_grand_piano_mp3", false, /\.mp3$/)
  );

  var createStream = function createStream(canvas) {
    stream = canvas.captureStream(150);
    canvas_track = stream.getVideoTracks()[0];
  };

  function convertMIDIToAudio(audioContext, midiNumber) {
    const audioNode = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();

    // Load the piano audio sample + midiNumber +'.mp3'
    const audioFile = "./acoustic_grand_piano_mp3/G3.mp3"; // Replace with the actual file path
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      const audioData = e.target.result;

      audioContext.decodeAudioData(
        audioData,
        function (decodedBuffer) {
          audioNode.buffer = decodedBuffer;
          audioNode.connect(gainNode);
          gainNode.connect(audioContext.destination);

          const currentTime = audioContext.currentTime;
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(1, currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.2);

          audioNode.start();
          audioNode.stop(currentTime + 0.35);
        },
        function (error) {
          console.error("Error decoding audio data:", error);
        }
      );
    };

    fileReader.onerror = function (e) {
      console.error("Error reading audio file:", e);
    };

    // Read the audio file as an ArrayBuffer
    fetch(audioFiles[midiNumber])
      .then((response) => response.blob())
      .then((blob) => fileReader.readAsArrayBuffer(blob))
      .catch((error) => {
        console.error("Error loading audio file:", error);
      });

    return audioNode;
  }

function addEventListener(){
    // Modify the keypress event listener to play the sound without recording
    document.addEventListener("keypress", handleKeyPress);
}

function deleteEventListener(){
  document.removeEventListener("keypress", handleKeyPress);
}
  // Event handler for the keypress event
function handleKeyPress(event) {
  const key = event.key;
  const midiNumber = keyMapping[key];

  if (midiNumber !== undefined) {
      handleMIDINumberReceived(midiNumber)
    }
  }


    // Example event handler for receiving MIDI numbers
    function handleMIDINumberReceived(midiNumber) {
      // Call the convertMIDIToAudio function to generate audio
      const audioNode = convertMIDIToAudio(audioContext, midiNumber);

      if (isRecording) {
      // Connect the audio node to the audio destination
      audioNode.connect(audioDestination);

      // Disconnect the audio node after a certain duration (e.g., 1 second)
      setTimeout(() => {
        audioNode.disconnect();
      }, 2000);

    }
  }

  
  async function startRecording() {
    isRecording = true
    var types = [
      "video/webm",
      "video/webm,codecs=vp9",
      "video/vp8",
      "video/webm;codecs=vp8",
      "video/webm;codecs=daala",
      "video/webm;codecs=h264",
      "video/mpeg",
    ];

    console.log("in modern!");

    var mic_track = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((mediaStream) => {
        document.querySelector("video").srcObject = mediaStream;
        const tracks = mediaStream.getAudioTracks();
        return tracks[0];
      });

    for (var i in types) {
      if (MediaRecorder.isTypeSupported(types[i])) {
        supportedType = types[i];
        break;
      }
    }

    if (supportedType == null) {
      console.log("No supported type found for MediaRecorder");
    }

    var options = {
      mimeType: supportedType,
      videoBitsPerSecond: 25000000000,
      audioBitsPerSecond: 128000,
    };
    recordedBlobs = [];

    try {


      // Create a new audio track from the audio destination stream
      audio_track = audioDestination.stream.getAudioTracks()[0];

      // Create a new merged stream with both video and audio tracks
      const merged_stream = new MediaStream([canvas_track, audio_track]);
      mediaRecorder = new MediaRecorder(merged_stream, options);
    } catch (e) {
      console.error("Exception while creating MediaRecorder:", e);
      alert("MediaRecorder is not supported by this browser.");
      return;
    }

    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(100);
  }

  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  function handleStop(event) {
    isRecording = false
    var superBuffer = new Blob(recordedBlobs, {
      type: supportedType,
    });
  }

  async function stopRecording() {
    mediaRecorder.stop();
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }

  function download(file_name) {
    return new Blob(recordedBlobs, {
      type: supportedType,
    });
  }

  return {
    start: start,
    stop: stop,
    save: save,
    createStream: createStream,
    addEventListener:addEventListener,
    deleteEventListener:deleteEventListener,
  };
};

var index = CanvasRecorder();

export default index;
