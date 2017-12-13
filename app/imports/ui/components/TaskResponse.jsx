import React from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

//TODO: this is not a good component as is for the following reasons
//    It should have a 'null' default value while this can't be done with the default HTML <input> .. having a default value would lead to anchoring bias for the participant
//    once a player chose a value, it should be sticky (i.e., saved and retrieved in the next stages)
//    we might want to store to seperate values (last value as an answer and also intermediate values)
export default class TaskResponse extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: null
    };
  }

  handleChangeStart = () => {
    console.log("Change event started");
  };

  handleChange = value => {
    this.setState({ value: value });
  };

  handleChangeComplete = () => {
    console.log("Change event completed");
    //here log the data to the database
  };

  render() {
    const style = { width: 400, margin: 50 };
    const marks = {
      0: <strong>0</strong>,
      0.25: "0.25",
      0.5: "0.5",
      0.75: "0.75",
      1: {
        style: {
          color: "red"
        },
        label: <strong>1</strong>
      }
    };
    return (
      <div style={style}>
        <p>Your current guess of the correlation is: {this.state.value}</p>
        <Slider
          min={0}
          max={1}
          marks={marks}
          step={0.01}
          onChange={this.handleChange}
          defaultValue={null}
        />
      </div>
    );
  }
}
