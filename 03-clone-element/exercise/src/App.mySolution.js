import React, { Component } from "react";
import FaPlay from "react-icons/lib/fa/play";
import FaPause from "react-icons/lib/fa/pause";
import FaForward from "react-icons/lib/fa/forward";
import FaBackward from "react-icons/lib/fa/backward";

class RadioGroup extends Component {
  state = {
    activeValue: this.props.defaultActiveValue
  };

  setActiveValue = value => {
    this.setState({ activeValue: value });
  };

  render() {
    const clones = React.Children.map(this.props.children, (child, index) => {
      const isActive = child.props.value === this.state.activeValue;
      return React.cloneElement(child, {
        isActive,
        setActiveValue: this.setActiveValue
      });
    });
    return (
      <fieldset className="radio-group">
        <legend>{this.props.legend}</legend>
        {clones}
      </fieldset>
    );
  }
}

class RadioButton extends Component {
  render() {
    const { isActive, setActiveValue } = this.props; // <-- should come from somewhere
    const className = "radio-button " + (isActive ? "active" : "");
    return (
      <button
        className={className}
        onClick={() => this.props.setActiveValue(this.props.value)}
      >
        {this.props.children}
      </button>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <RadioGroup legend="Radio Group" defaultActiveValue={"pause"}>
          <RadioButton value="back">
            <FaBackward />
          </RadioButton>
          <RadioButton value="play">
            <FaPlay />
          </RadioButton>
          <RadioButton value="pause">
            <FaPause />
          </RadioButton>
          <RadioButton value="forward">
            <FaForward />
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

export default App;
