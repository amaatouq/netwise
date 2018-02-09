import React from "react";
import "rc-slider/assets/index.css";
import Slider from "rc-slider";

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

//TODO: this is not a good component as is for the following reasons
//    It should have a 'null' default value while this can't be done with the default HTML <input> .. having a default value would lead to anchoring bias for the participant
//    once a player chose a value, it should be sticky (i.e., saved and retrieved in the next stages)
//    we might want to store to seperate values (last value as an answer and also intermediate values)
// NP: Setting to 0 for now otherwise it will break things to have a submittable
// null. Eventually we can create our own slider that can handle nil and report
// and error if someone submits null.
export default class TaskResponse extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 0
    };
  }

  handleChange = value => {
    this.setState({ value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { stage } = this.props;

    stage.set("value", this.state.value);
    stage.submit();
  };

  render() {
    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          <p>Your current guess of the correlation is: {this.state.value}</p>
          <Slider
            min={0}
            max={1}
            marks={marks}
            step={0.01}
            onChange={this.handleChange}
            defaultValue={0}
          />
          <p>
            <input type="submit" />
          </p>
        </form>
      </div>
    );
  }
}
