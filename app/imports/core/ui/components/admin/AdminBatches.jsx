import React from "react";
import moment from "moment";

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
      gamesCount: 0
    };
  }

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
        gamesCount: 0
      });
    });
  };

  handleStatusChange = (_id, status, event) => {
    event.preventDefault();
    console.log(_id, status, event);
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

  handleGamesCountChange = event => {
    const simpleGamesCount = parseInt(event.currentTarget.value, 10);
    if (_.isNaN(simpleGamesCount)) {
      simpleGamesCount = "";
    }
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

    const existing = this.state[key].find(tt => tt.treatmentId === treatmentId);
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

    this.setState(params);
  };

  handleTreatmentCountChange = event => {
    const { assignment, completeTreatments, simpleGamesCount } = this.state;

    const count = parseInt(event.currentTarget.value, 10);
    const id = event.currentTarget.dataset.id;

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

    const { assignment, simpleGamesCount } = this.state;
    const key = `${assignment}Treatments`;

    const id = event.currentTarget.dataset.id;
    const treatment = this.state[key].find(t => t.treatmentId === id);
    const val = _.reject(this.state[key], t => t.treatmentId === id);
    const params = { [key]: val };

    if (assignment === "complete") {
      params.gamesCount = this.gamesCountCalc(
        assignment,
        this.state[key],
        simpleGamesCount
      );
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
        <h3>Batches</h3>

        {batches.length === 0 ? (
          <p>No batches yet, create one bellow.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Game Count</th>
                <th>Created</th>
                <th>{/* Actions */}</th>
              </tr>
            </thead>

            <tbody>
              {batches.map(batch => {
                const actions = [];

                if (batch.status === "init" || batch.status === "stopped") {
                  actions.push(
                    <button
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

                return (
                  <tr key={batch._id}>
                    <td>{assignmentTypes[batch.assignment]}</td>
                    <td>{batch.gameCount()}</td>
                    <td title={moment(batch.createdAt).format()}>
                      {moment(batch.createdAt).fromNow()}
                    </td>
                    <td>{actions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <form onSubmit={this.handleNewBatch}>
          <h3>New Batch</h3>

          <label htmlFor="assignment">Assignment Method</label>
          <select
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

          <br />
          <br />

          <h4>Treatments</h4>

          <div className="add-treatment">
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
            <button onClick={this.handleAddTreatment}>Add treatment</button>
          </div>

          {currentTreatments.length === 0 ? (
            <p>No treatments configured, add some above.</p>
          ) : (
            ""
          )}
          <br />
          <table>
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
                        <input
                          type="number"
                          name={id}
                          id={id}
                          min="1"
                          max={maxGamesCount}
                          step="1"
                          value={t.count}
                          onChange={this.handleTreatmentCountChange}
                          data-id={t.treatmentId}
                        />
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      <button
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

          <p>
            <label htmlFor="gamesCount" disabled={assignment === "complete"}>
              {assignment === "complete" ? "Total " : ""}
              Game Count
            </label>
            {assignment === "complete" ? (
              gamesCount
            ) : (
              <input
                type="number"
                name="gamesCount"
                id="gamesCount"
                min="1"
                max={maxGamesCount}
                step="1"
                value={gamesCount}
                onChange={this.handleGamesCountChange}
              />
            )}
          </p>

          <p>
            <input type="submit" value="Create Batch" />
          </p>
        </form>
      </div>
    );
  }
}
