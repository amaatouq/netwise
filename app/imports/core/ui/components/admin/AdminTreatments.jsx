import React from "react";

import { createTreatment } from "../../../api/treatments/methods";
import Loading from "../Loading";

export default class AdminTreatments extends React.Component {
  handleNewTreatment = event => {
    event.preventDefault();
    const t = event.currentTarget;

    const name = t.querySelector("#name").value;

    let keys = _.unique(_.pluck(this.props.conditions, "key"));
    const conditions = [];
    _.each(this.props.conditions, cond => {
      if (t.querySelector(`#${cond._id}`).checked) {
        keys = _.without(keys, cond.key);
        conditions.push(_.omit(cond, "_id"));
      }
    });

    if (keys.length > 0) {
      const missing = keys.join(", ");
      const msg = `A value for each condition must be selected. (missing: ${missing})`;
      alert(msg);
      return;
    }

    createTreatment.call({ name, conditions }, err => {
      if (err) {
        alert(err);
        return;
      }
      t.querySelector("#name").value = "";
      _.each(this.props.conditions, cond => {
        t.querySelector(`#${cond._id}`).checked = false;
      });
    });
  };

  render() {
    const { loading, treatments, conditions } = this.props;

    if (loading) {
      return <Loading />;
    }

    const conds = _.map(
      _.groupBy(conditions, cond => cond.key),
      (conds, key) => (
        <div key={key}>
          <h5>{key}</h5>
          {_.map(conds, cond => (
            <label key={cond.value}>
              <input type="radio" name={key} value={cond.value} id={cond._id} />
              {cond.name} ({cond.value.toString()})
              <br />
            </label>
          ))}
        </div>
      )
    );

    return (
      <div className="treatments">
        <h3>Treatments</h3>
        {treatments.length === 0 ? (
          <p>No treatments yet, create some bellow.</p>
        ) : (
          ""
        )}
        {_.map(treatments, treatment => (
          <p key={treatment._id}>
            <strong>{treatment.displayName()}</strong>
            {" ["}
            <br />
            {_.map(treatment.conditions, cond => (
              <React.Fragment key={`${cond.key}-${cond.name}`}>
                &nbsp;&nbsp;{cond.key}: {cond.name}({cond.value}),<br />
              </React.Fragment>
            ))}
            {"]"}
          </p>
        ))}

        <form onSubmit={this.handleNewTreatment}>
          <h3>Create New Treatment</h3>
          <p>
            <label htmlFor="name">Name (optional)</label>
            <input type="text" name="name" id="name" />
          </p>
          {conds}
          <p>
            <input type="submit" value="Create Treatment" />
          </p>
        </form>
      </div>
    );
  }
}
