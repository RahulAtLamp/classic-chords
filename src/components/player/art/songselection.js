import React from "react";
import { Icon, InlineIcon } from "@iconify/react";
import iosPause from "@iconify/icons-ion/ios-pause";
import iosPlay from "@iconify/icons-ion/ios-play";

export default class AudioUpload extends React.Component {
  state = {
    audioFile: null,
    audioName: null,
    source: null,
    playing: false
  };
  radio = async () => {
    try {
      let captureStream = null;
      const gdmOptions = {
        video: true,
        audio: true
      };
      try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(
          gdmOptions
        );
      } catch (err) {
        console.error("Error: " + err);
      }
      let ctx = this.props.audioContext;
      if (!ctx) {
        ctx = new AudioContext();
      }
      const gainNode = ctx.createGain();
      gainNode.gain.value = 2.0;
      gainNode.connect(ctx.destination);

      let trysource = ctx.createMediaStreamSource(captureStream);
      this.props.Visualizer.connectAudio(trysource);
    } catch (e) {
      console.log(e);
    }
  };
  playAudio = () => {
    //pause then play again
    console.log("play");
    if (this.state.audioFile !== null) {
      this.state.audioFile.pause();
      this.state.audioFile.play();
      this.setState({
        playing: true
      });
    } else {
      this.radio();
      this.setState({
        playing: true
      });
    }
  };
  stopAudio = () => {
    //pause
    console.log("pause");
    if (this.state.audioFile !== null) {
      this.state.audioFile.pause();
      this.setState({
        playing: false
      });
    }
  };

  render() {
    return (
      <>
        {this.state.playing ? (
          <div onClick={this.stopAudio}>
            <Icon className="iconify pause" icon={iosPause} />
          </div>
        ) : (
          <div onClick={this.playAudio}>
            <Icon className="iconify" icon={iosPlay} />
          </div>
        )}
      </>
    );
  }
}
