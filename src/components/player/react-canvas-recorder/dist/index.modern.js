var CanvasRecorder = function CanvasRecorder() {
  var start = startRecording;
  var stop = stopRecording;
  var save = download;
  var stream;
  var recordedBlobs = [];
  var supportedType = null;
  var mediaRecorder = null;
  var mic_track;
  var canvas_track

  var createStream = function createStream(canvas) {
    stream = canvas.captureStream(150);
    canvas_track= stream.getVideoTracks()[0];
      };
  

  async function startRecording() {
    var types = ['video/webm', 'video/webm,codecs=vp9', 'video/vp8', 'video/webm;codecs=vp8', 'video/webm;codecs=daala', 'video/webm;codecs=h264', 'video/mpeg'];

    mic_track = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
    .then((mediaStream) => {
      document.querySelector('video').srcObject = mediaStream;
        const tracks = mediaStream.getAudioTracks()
        return tracks[0]
    })
  
    console.log(mic_track);
  
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
      videoBitsPerSecond: 25000000000,
      audioBitsPerSecond : 128000
    };
    recordedBlobs = [];

    try {
      const merged_stream = new MediaStream([ canvas_track, mic_track ]);
      mediaRecorder = new MediaRecorder(merged_stream, options);
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

  async function stopRecording() {
    mediaRecorder.stop();
    await navigator.mediaDevices.getUserMedia({audio: true, video: false});
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

export default index;
//# sourceMappingURL=index.modern.js.map
