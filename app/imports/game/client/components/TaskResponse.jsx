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
  handleChange = value => {
    const { stage, round } = this.props;
    if (stage.name !== "network") {
      round.set("guess", value);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.stage.submit();
  };

  render() {
    const { stage, round } = this.props;
    const isResult = stage.name === "network";
    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          {isResult ? (
            ""
          ) : (
            <p>
              Your current guess of the correlation is: {round.get("guess")}
            </p>
          )}

          <Slider
            min={0}
            max={1}
            marks={marks}
            step={0.01}
            onChange={this.handleChange}
            value={round.get("guess")}
            disabled={isResult}
          />

          {isResult ? (
            <dl>
              <dt>Your guess:</dt>
              <dd>{round.get("guess")}</dd>
              <dt>Actual correlation:</dt>
              <dd>{round.data.task.correctAnswer}</dd>
              <dt>Score increment:</dt>
              <dd>{round.get("score")}</dd>
            </dl>
          ) : (
            ""
          )}

          <p>
            <input type="submit" />
          </p>
        </form>
      </div>
    );
  }
}
