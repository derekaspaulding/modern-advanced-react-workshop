/*
- Make the Play button work
- Make the Pause button work
- Disable the play button if it's playing
- Disable the pause button if it's not playing
- Make the PlayPause button work
- Make the JumpForward button work
- Make the JumpBack button work
- Make the progress bar work
  - change the width of the inner element to the percentage of the played track
  - add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
let rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import React from "react";
import podcast from "./lib/podcast.mp4";
import mario from "./lib/mariobros.mp3";
import FaPause from "react-icons/lib/fa/pause";
import FaPlay from "react-icons/lib/fa/play";
import FaRepeat from "react-icons/lib/fa/repeat";
import FaRotateLeft from "react-icons/lib/fa/rotate-left";

const {
  Provider: AudioProvider,
  Consumer: AudioConsumer
} = React.createContext();

class AudioPlayer extends React.Component {
  state = {
    isPlaying: false,
    currentTime: 0,
    duration: Number.MAX_SAFE_INTEGER,
    play: () => this.setState({ isPlaying: true }),
    pause: () => this.setState({ isPlaying: false }),
    jump: delta => {
      let newTime = this.state.currentTime + delta;
      if (newTime < 0) {
        newTime = 0;
      } else if (newTime > this.state.duration) {
        newTime = this.state.duration;
      }
      this.setState({ currentTime: newTime });
      this.audio.currentTime = newTime;
    }
  };

  componentDidUpdate(_, prevState) {
    if (prevState.isPlaying !== this.state.isPlaying) {
      if (this.state.isPlaying) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }
  }

  render() {
    return (
      <AudioProvider value={this.state}>
        <div className="audio-player">
          <audio
            src={this.props.source}
            onTimeUpdate={() => {
              this.setState({
                currentTime: this.audio.currentTime,
                duration: this.audio.duration
              });
            }}
            onLoadedData={() =>
              this.setState({ duration: this.audio.duration })
            }
            onEnded={() => {
              this.setState({
                isPlaying: false,
                currentTime: 0
              });
            }}
            ref={n => (this.audio = n)}
          />
          {this.props.children}
        </div>
      </AudioProvider>
    );
  }
}

class Play extends React.Component {
  render() {
    return (
      <AudioConsumer>
        {audioState => (
          <button
            className="icon-button"
            onClick={audioState.play}
            disabled={audioState.isPlaying}
            title="play"
          >
            <FaPlay />
          </button>
        )}
      </AudioConsumer>
    );
  }
}

class Pause extends React.Component {
  render() {
    return (
      <AudioConsumer>
        {audioState => (
          <button
            className="icon-button"
            onClick={audioState.pause}
            disabled={!audioState.isPlaying}
            title="pause"
          >
            <FaPause />
          </button>
        )}
      </AudioConsumer>
    );
  }
}

class PlayPause extends React.Component {
  render() {
    return (
      <AudioConsumer>
        {audioState => (audioState.isPlaying ? <Pause /> : <Play />)}
      </AudioConsumer>
    );
  }
}

class JumpForward extends React.Component {
  render() {
    return (
      <AudioConsumer>
        {audioState => (
          <button
            className="icon-button"
            onClick={() => audioState.jump(10)}
            disabled={null}
            title="Forward 10 Seconds"
          >
            <FaRepeat />
          </button>
        )}
      </AudioConsumer>
    );
  }
}

class JumpBack extends React.Component {
  render() {
    return (
      <AudioConsumer>
        {audioState => (
          <button
            className="icon-button"
            onClick={() => audioState.jump(-10)}
            disabled={null}
            title="Back 10 Seconds"
          >
            <FaRotateLeft />
          </button>
        )}
      </AudioConsumer>
    );
  }
}

class Progress extends React.Component {
  render() {
    return (
      <AudioConsumer>
        {audioState => (
          <div className="progress" onClick={null}>
            <div
              className="progress-bar"
              style={{
                width: `${audioState.currentTime / audioState.duration * 100}%`
              }}
            />
          </div>
        )}
      </AudioConsumer>
    );
  }
}

let Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play /> <Pause /> <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward />{" "}
      <span className="player-text">Workshop.me Podcast Episode 02</span>
      <Progress />
    </AudioPlayer>
  </div>
);

export default Exercise;
