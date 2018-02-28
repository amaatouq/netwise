import React from "react";
import { Slider } from "@blueprintjs/core";

export default class TaskResponse extends React.Component {

  handleSubmit = action => {
    console.log("handleSubmit called with arg:", action)

    const { stage, round } = this.props;
    stage.set("action", action);
    round.set("action", action);
    stage.submit();
  };

  renderStageFinished() {
    return (
      <div className="task-response">
        <div className="pt-callout .modifier">
          <h5>Waiting on other players...</h5>
          Please wait until all players are ready
        </div>
      </div>
    );
  }

  renderResult(round) {
    return (
      <table className="pt-table  pt-html-table pt-html-table-bordered">
        <thead>
          <tr>
            <th>Your action</th>
            <th>Your partner's action</th>
            <th>Your payout</th>
            <th>Your partner's payout</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ round.get("action") }</td>
            <td>??</td>
            <td>??</td>
            <td>??</td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderActions() {
    return (
      <div className="task-actions">
        <button onClick={() => this.handleSubmit('cooperate')}>Cooperate</button>
        <button onClick={() => this.handleSubmit('compete')}>Compete</button>
      </div>
    );
  }

  render() {
    const { stage, round } = this.props;
    console.log("stage", stage.get("action"));
    console.log("round", round.get("action"));
    const isResult = stage.name === "outcome";

    { stage.finished ? this.renderStageFinished() : null }

    return (
      <div className="task-response">
        { isResult ? this.renderResult(round) : this.renderActions() }

{/*          <div className="pt-form-group">
            <button type="submit" className="pt-button pt-icon-tick pt-large">
              {isResult ? "Next" : "Submit"}
            </button>
          </div>*/}
      </div>
    );
  }
}
