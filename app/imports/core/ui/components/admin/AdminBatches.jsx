import React from "react";
import moment from "moment";

import {
  Dialog,
  Popover,
  NumericInput,
  PopoverInteractionKind
} from "@blueprintjs/core";

import { assignmentTypes, maxGamesCount } from "../../../api/batches/batches";
import { createBatch, updateBatchStatus } from "../../../api/batches/methods";
import Loading from "../Loading";

export default class AdminBatches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignment: "simple",
      simpleTreatments: [],
      completeTreatments: [],
      simpleGamesCount: 0,
      gamesCount: 0,
      popoverIsOpen: false,
      dialogIsOpen: false
    };
  }

  toggleDialog = () =>
    this.setState({ dialogIsOpen: !this.state.dialogIsOpen });
  togglePopover = () =>
    this.setState({ popoverIsOpen: !this.state.popoverIsOpen });

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
        alert("unknown assignement type?!");
        return;
    }

    createBatch.call(params, err => {
      if (err) {
        console.error(err);
        alert(err);
        return;
      }

      this.setState({
        simpleTreatments: [],
        completeTreatments: [],
        simpleGamesCount: 0,
        gamesCount: 0,
        dialogIsOpen: false
      });
    });
  };

  handleStatusChange = (_id, status, event) => {
    event.preventDefault();
    updateBatchStatus.call({ _id, status });
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
    const params = { popoverIsOpen: false };

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

    // const count = parseInt(event.currentTarget.value, 10);
    // const id = event.currentTarget.dataset.id;

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

  render() {
    const { loading, batches, treatments, conditions } = this.props;
    const {
      gamesCount,
      assignment,
      simpleTreatments,
      completeTreatments
    } = this.state;

    if (loading) {
      return <Loading />;
    }

    const content = JSON.stringify(batches);

    const isComplete = assignment === "complete";
    const currentTreatments = isComplete
      ? completeTreatments
      : simpleTreatments;

    return (
      <div className="batches">
        <h2>Batches</h2>

        {batches.length === 0 ? (
          <p>No batches yet, create one bellow.</p>
        ) : (
          <table className="pt-table pt-html-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Game Count</th>
                <th>Created</th>
                <th>Assignment</th>
                <th>Configuration</th>
                <th>{/* Actions */}</th>
              </tr>
            </thead>

            <tbody>
              {batches.map(batch => {
                const actions = [];

                if (batch.status === "init" || batch.status === "stopped") {
                  actions.push(
                    <button
                      type="button"
                      className="pt-button  pt-intent-success pt-icon-play"
                      key="start"
                      onClick={this.handleStatusChange.bind(
                        this,
                        batch._id,
                        "running"
                      )}
                    >
                      {batch.status === "stopped" ? "Restart" : "Start"}
                    </button>
                  );
                }

                if (batch.status === "init" || batch.status === "running") {
                  actions.push(
                    <button
                      type="button"
                      className="pt-button pt-icon-stop"
                      key="stop"
                      onClick={this.handleStatusChange.bind(
                        this,
                        batch._id,
                        "stopped"
                      )}
                    >
                      {batch.status === "init" ? "Cancel" : "Stop"}
                    </button>
                  );
                }

                let config;
                switch (batch.assignment) {
                  case "simple":
                    config = batch.simpleConfig.treatmentIds.map(_id => {
                      const t = treatments.find(t => t._id === _id);
                      return (
                        <div key={_id}>
                          {t ? t.displayName() : "Unknown treatment"}
                        </div>
                      );
                    });
                    break;
                  case "complete":
                    config = batch.completeConfig.treatments.map(tt => {
                      const t = treatments.find(t => t._id === tt.treatmentId);
                      return (
                        <div key={tt.treatmentId}>
                          {t ? t.displayName() : "Unknown treatment"}
                          {" x "}
                          {tt.count}
                        </div>
                      );
                    });
                    break;
                  default:
                    console.error("unknown assignment");
                    break;
                }

                return (
                  <tr key={batch._id}>
                    <td>{batch.status}</td>
                    <td>{batch.gameCount()}</td>
                    <td title={moment(batch.createdAt).format()}>
                      {moment(batch.createdAt).fromNow()}
                    </td>
                    <td>{assignmentTypes[batch.assignment]}</td>
                    <td>{config}</td>
                    <td>
                      <div className="pt-button-group">{actions}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <button type="button" className="pt-button" onClick={this.toggleDialog}>
          New Batch
        </button>

        <Dialog
          iconName="inbox"
          isOpen={this.state.dialogIsOpen}
          onClose={this.toggleDialog}
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
                      {/* <option value="complete">Complete</option> */}
                      {/* <option value="custom" disabled>
                        Custom
                      </option> */}
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
                                // <input
                                //   type="number"
                                //   name={id}
                                //   id={id}
                                //   min="1"
                                //   max={maxGamesCount}
                                //   step="1"
                                //   value={t.count}
                                //   onChange={this.handleTreatmentCountChange}
                                //   data-id={t.treatmentId}
                                // />
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
                    <span className="pt-text-muted">
                      No treatments yet, add some:{" "}
                    </span>
                  ) : (
                    ""
                  )}

                  <Popover
                    autoFocus={false}
                    // isOpen={this.state.popoverIsOpen}
                    interactionKind={PopoverInteractionKind.HOVER}
                    // isModal
                  >
                    <button
                      type="button"
                      className="pt-button pt-small"
                      // onClick={this.togglePopover}
                    >
                      Add treatment
                    </button>

                    <div className="add-treatment-popover">
                      <div className="pt-select">
                        <select
                          name="treatment"
                          id="treatment"
                          ref={i => (this.treatmentRef = i)}
                          onChange={this.handleAddTreatment}
                          value={""}
                        >
                          <option value="">Choose an treatment...</option>
                          {_.map(treatments, t => (
                            <option key={t._id} value={t._id}>
                              {t.displayName()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Popover>

                  {/* <div>
                    <div className="add-treatment">
                      <div className="pt-select">
                        {" "}
                        <select
                          name="treatment"
                          id="treatment"
                          ref={i => (this.treatmentRef = i)}
                        >
                          {_.map(treatments, t => (
                            <option key={t._id} value={t._id}>
                              {t.displayName()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
              </div> */}
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
      </div>
    );
  }
}
