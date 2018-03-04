import React from "react";
import moment from "moment";

import { Dialog, Position, NumericInput } from "@blueprintjs/core";

import { AlertToaster } from "../AlertToaster.jsx";
import { assignmentTypes, maxGamesCount } from "../../../api/batches/batches";
import { createBatch, updateBatchStatus } from "../../../api/batches/methods";
import Loading from "../Loading";

export default class AdminNewBatch extends React.Component {
  state = {
    assignment: "simple",
    simpleTreatments: [],
    completeTreatments: [],
    simpleGamesCount: 0,
    gamesCount: 0
  };

  gamesCountCalc(assignment, completeTreatments, simpleGamesCount) {
    return assignment === "complete"
      ? _.inject(completeTreatments, (sum, t) => (t.count || 0) + sum, 0)
      : simpleGamesCount;
  }

  handleAssignmentChange = event => {
    const { completeTreatments, simpleGamesCount } = this.state;
    const assignment = event.currentTarget.value;
    this.setState({
      assignment,
      gamesCount: this.gamesCountCalc(
        assignment,
        completeTreatments,
        simpleGamesCount
      )
    });
  };

  handleGamesCountChange = simpleGamesCount => {
    this.setState({
      simpleGamesCount,
      gamesCount: simpleGamesCount
    });
  };

  handleAddTreatment = event => {
    event.preventDefault();

    const { assignment, simpleGamesCount } = this.state;
    const treatmentId = this.treatmentRef.value;
    const key = `${assignment}Treatments`;
    const params = {};

    if (treatmentId) {
      const existing = this.state[key].find(
        tt => tt.treatmentId === treatmentId
      );
      const treatment = existing || { treatmentId, count: 1 };

      if (!existing) {
        this.state[key].push(treatment);
      } else {
        existing.count++;
      }
      params[key] = this.state[key];
      if (assignment === "complete") {
        params.gamesCount = this.state.gamesCount + 1;
      }
    }

    this.setState(params);
  };

  handleTreatmentCountChange = (id, count) => {
    const { assignment, completeTreatments, simpleGamesCount } = this.state;

    const key = `${assignment}Treatments`;
    const t = this.state[key].find(tt => tt.treatmentId === id);
    t.count = count;

    const params = { [key]: this.state[key] };
    if (assignment === "complete") {
      params.gamesCount = this.gamesCountCalc(
        assignment,
        this.state[key],
        simpleGamesCount
      );
    }

    this.setState(params);
  };

  handleRemoveTreatment = event => {
    event.preventDefault();

    const { assignment, simpleGamesCount, gamesCount } = this.state;
    const key = `${assignment}Treatments`;

    const id = event.currentTarget.dataset.id;
    const treatment = this.state[key].find(t => t.treatmentId === id);
    const val = _.reject(this.state[key], t => t.treatmentId === id);
    const params = { [key]: val };

    if (assignment === "complete") {
      params.gamesCount = gamesCount - treatment.count;
    }

    this.setState(params);
  };

  handleNewBatch = event => {
    event.preventDefault();
    const {
      assignment,
      simpleGamesCount,
      simpleTreatments,
      completeTreatments
    } = this.state;
    const params = { assignment };

    switch (assignment) {
      case "simple":
        params.simpleConfig = {
          treatmentIds: [],
          count: simpleGamesCount
        };
        _.each(simpleTreatments, t => {
          params.simpleConfig.treatmentIds.push(t.treatmentId);
        });
        break;
      case "complete":
        params.completeConfig = {
          treatments: []
        };
        _.each(completeTreatments, t => {
          params.completeConfig.treatments.push(t);
        });
        break;
      default:
        AlertToaster.show({ message: "unknown assignement type?!" });
        return;
    }

    createBatch.call(params, err => {
      if (err) {
        console.error(JSON.stringify(err));
        AlertToaster.show({ message: String(err) });
        return;
      }

      this.setState({
        simpleTreatments: [],
        completeTreatments: [],
        simpleGamesCount: 0,
        gamesCount: 0
      });
      this.props.onClose();
    });
  };

  render() {
    const { treatments, conditions, isOpen, onClose } = this.props;
    const {
      gamesCount,
      assignment,
      simpleTreatments,
      completeTreatments
    } = this.state;

    const isComplete = assignment === "complete";
    const currentTreatments = isComplete
      ? completeTreatments
      : simpleTreatments;

    return (
      <Dialog
        iconName="layers"
        isOpen={isOpen}
        onClose={onClose}
        title="New Batch"
      >
        <form className="new-batch" onSubmit={this.handleNewBatch}>
          <div className="pt-dialog-body">
            <div className="pt-form-group">
              <label className="pt-label" htmlFor="assignment">
                Assignment Method
              </label>
              <div className="pt-form-content">
                <div className="pt-select">
                  <select
                    className="pt-input"
                    name="assignment"
                    id="assignment"
                    onChange={this.handleAssignmentChange}
                    value={assignment}
                  >
                    {_.map(assignmentTypes, (name, key) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-form-group">
              <label className="pt-label">Treatments</label>
              <div className="pt-form-content">
                <table className="pt-table pt-table-bordered pt-html-table pt-html-table-bordered">
                  <tbody>
                    {_.map(currentTreatments, t => {
                      const id = `gamesCount${t.treatmentId}`;
                      const treatment = treatments.find(
                        tt => tt._id === t.treatmentId
                      );
                      return (
                        <tr key={id}>
                          <td>{treatment.displayName()} </td>

                          <td>
                            {isComplete ? (
                              <NumericInput
                                name={id}
                                id={id}
                                min="1"
                                max={maxGamesCount}
                                stepSize="1"
                                onValueChange={this.handleTreatmentCountChange.bind(
                                  this,
                                  t.treatmentId
                                )}
                                value={t.count}
                              />
                            ) : (
                              ""
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="pt-button pt-intent-danger"
                              onClick={this.handleRemoveTreatment}
                              data-id={t.treatmentId}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {currentTreatments.length === 0 ? (
                  <p className="pt-text-muted">No treatments yet, add one:</p>
                ) : (
                  ""
                )}

                <div className="pt-select">
                  <select
                    name="treatment"
                    id="treatment"
                    ref={i => (this.treatmentRef = i)}
                    onChange={this.handleAddTreatment}
                    value={""}
                  >
                    <option value="">Add a new treatment...</option>
                    {_.map(treatments, t => (
                      <option key={t._id} value={t._id}>
                        {t.displayName()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-form-group">
              <label className="pt-label" htmlFor="gamesCount">
                Game Count
              </label>
              {assignment === "complete" ? (
                <div className="pt-form-content">{gamesCount}</div>
              ) : (
                <div className="pt-form-content">
                  <NumericInput
                    name="gamesCount"
                    id="gamesCount"
                    min="1"
                    max={maxGamesCount}
                    stepSize="1"
                    onValueChange={this.handleGamesCountChange}
                    value={gamesCount}
                  />

                  <div className="pt-form-helper-text">
                    The total number of games to run
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="pt-dialog-footer">
            <div className="pt-dialog-footer-actions">
              <button type="submit" className="pt-button pt-intent-primary">
                Create Batch
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}
