import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
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
                    <td>5.5</td>
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
  task: PropTypes.object
};
