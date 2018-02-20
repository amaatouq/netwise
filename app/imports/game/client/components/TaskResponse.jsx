import React from "react";
import { Slider } from "@blueprintjs/core";

//TODO: this is not a good component as is for the following reasons
//    It should have a 'null' default value while this can't be done with the default HTML <input> .. having a default value would lead to anchoring bias for the participant
//    once a player chose a value, it should be sticky (i.e., saved and retrieved in the next stages)
//    we might want to store to seperate values (last value as an answer and also intermediate values)
// NP: Setting to 0 for now otherwise it will break things to have a submittable
// null. Eventually we can create our own slider that can handle nil and report
// and error if someone submits null.
export default class TaskResponse extends React.Component {
  handleChange = num => {
    const { stage, round } = this.props;
    if (stage.name !== "outcome") {
      const value = Math.round(num * 100) / 100;
      stage.set("guess", value);
      round.set("guess", value);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.stage.submit();
  };

  render() {
    const { stage, round } = this.props;

    if (stage.finished) {
      return (
        <div className="task-response">
          <div className="pt-callout .modifier">
            <h5>Waiting on other players...</h5>
            Please wait until all players are ready
          </div>
        </div>
      );
    }

    const isResult = stage.name === "outcome";
    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          <div className="pt-form-group">
            {isResult ? (
              ""
            ) : (
              <label className="pt-label">
                Your current guess of the correlation is: {round.get("guess")}
              </label>
            )}

            <div className="pt-form-content">
              <Slider
                min={0}
                max={1}
                stepSize={0.01}
                labelStepSize={0.25}
                onChange={this.handleChange}
                value={round.get("guess")}
                showTrackFill={false}
                disabled={isResult}
              />
            </div>
          </div>

          {isResult ? (
            <table className="pt-table  pt-html-table pt-html-table-bordered">
              <thead>
                <tr>
                  <th>Your guess</th>
                  <th>Actual correlation</th>
                  <th>Score increment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{round.get("guess") || "No guess given"}</td>
                  <td>{round.data.task.correctAnswer}</td>
                  <td>{round.get("score")}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            ""
          )}

          <div className="pt-form-group">
            <button type="submit" className="pt-button pt-icon-tick pt-large">
              {isResult ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
