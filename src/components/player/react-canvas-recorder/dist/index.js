var CanvasRecorder = function CanvasRecorder() {
  var start = startRecording;
  var stop = stopRecording;
  var save = download;
  var stream;
  var mic_track;
  var recordedBlobs = [];
  var supportedType = null;
  var mediaRecorder = null;

  var createStream = function createStream(canvas) {
    stream = canvas.captureStream(150);
  };

  const canvas_track = stream.getVideoTracks()[0];


  mic_track = navigator.mediaDevices.getUserMedia({audio: true, video: false})
.then((mediaStream) => {
  document.querySelector('video').srcObject = mediaStream;
    const tracks = mediaStream.getAudioTracks()
    return tracks[0]
})


  function startRecording() {
    var types = ['video/webm', 'video/webm,codecs=vp9', 'video/vp8', 'video/webm;codecs=vp8', 'video/webm;codecs=daala', 'video/webm;codecs=h264', 'video/mpeg'];

    console.log("in");
    for (var i in types) {
      if (MediaRecorder.isTypeSupported(types[i])) {
        supportedType = types[i];
        break;
      }
    }

    if (supportedType == null) {
      console.log('No supported type found for MediaRecorder');
    }

    var options = {
      mimeType: supportedType,
      videoBitsPerSecond: 25000000000
    };
    recordedBlobs = [];

    try {
      mediaRecorder = new MediaRecorder([ canvas_track, mic_track ], options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      alert('MediaRecorder is not supported by this browser.');
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
    var superBuffer = new Blob(recordedBlobs, {
      type: supportedType
    });
  }

  function stopRecording() {
    mediaRecorder.stop();
  }

  function download(file_name) {
    return new Blob(recordedBlobs, {
      type: supportedType
    });
  }

  return {
    start: start,
    stop: stop,
    save: save,
    createStream: createStream
  };
};

var index = CanvasRecorder();

module.exports = index;
//# sourceMappingURL=index.js.map
