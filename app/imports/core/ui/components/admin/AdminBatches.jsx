import React from "react";

import Loading from "../Loading";

export default class AdminBatches extends React.Component {
  render() {
    const { loading, batches, treatments, conditions } = this.props;

    if (loading) {
      return <Loading />;
    }

    const content = JSON.stringify(batches) + JSON.stringify(treatments);

    return (
      <div className="batches">
        Work in progress
        <table>
          <thead>
            <tr>
              <th />
            </tr>
          </thead>
        </table>
        <form onSubmit={this.handleNewBatch}>
          <h3>New Batch</h3>

          <label htmlFor="assignment">Assignment Method</label>
          <select name="assignment" id="assignment">
            <option value="simple">Simple</option>
            <option value="complete">Complete</option>
          </select>

          <br />
          <br />

          <fieldset>
            <legend>Treatments</legend>

            <p>
              <label htmlFor="treatment">Treatment</label>
              <select name="treatment" id="treatment">
                {_.map(treatments, t => (
                  <option key={t._id} value={t._id}>
                    {t.displayName()}
                  </option>
                ))}
              </select>
            </p>

            <p>
              <label htmlFor="count">Count</label>
              <input type="number" name="count" name="id" />
            </p>

            <button>Add treatment</button>
          </fieldset>

          <p>
            <input type="submit" value="Create Batch" />
          </p>
        </form>
      </div>
    );
  }
}
