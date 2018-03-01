import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    console.log("payout", this.props.payout);
    return (
      <div className="task-stimulus">
        <table className="pt-table task-table">
            <tbody>
                <tr>
                    <td></td>
                    <td className="cooperate">Cooperate (Partner)</td>
                    <td className="compete">Compete (Partner)</td>
                </tr>
                <tr>
                    <td className="cooperate">Cooperate (You)</td>
                    <td>{ this.props.payout["compComp"] }</td>
                    <td>1.7</td>
                </tr>
                <tr>
                    <td className="compete">Compete (You)</td>
                    <td>7.1</td>
                    <td>3.3</td>
                </tr>
            </tbody>
        </table>
      </div>
    );
  }
}

TaskStimulus.propTypes = {
  payout: PropTypes.object
};
