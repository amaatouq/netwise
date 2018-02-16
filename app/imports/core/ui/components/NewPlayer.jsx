import React from "react";

import { DevNote } from "./Helpers";
import { createPlayer } from "../../api/players/methods";
import { setPlayerId } from "../containers/IdentifiedRoute";

export default class NewPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.timeout = null;
      const field = document.querySelector("input");
      if (field) {
        field.focus();
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  handleIdUpdate = event => {
    this.setState({ id: event.currentTarget.value });
  };

  handleForm = event => {
    event.preventDefault();
    const { id } = this.state;

    createPlayer.call({ id }, (err, _id) => {
      if (err) {
        console.error(err);
        alert(err);
        return;
      }

      setPlayerId(_id);
    });
  };

  render() {
    const { id } = this.state;

    return (
      <div className="new-player">
        <form onSubmit={this.handleForm}>
          <h1>Identification</h1>

          <div className="pt-form-group">
            <label className="pt-label" htmlFor="id">
              Player ID
            </label>
            <div className="pt-form-content">
              <input
                className="pt-input"
                type="text"
                name="id"
                id="id"
                value={id}
                onChange={this.handleIdUpdate}
                placeholder="e.g. john@example.com"
                required
              />

              <div className="pt-form-helper-text">
                Enter your player identification{" "}
                <span className="pt-text-muted">
                  (email, provided ID, etc.)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-form-group">
            <button className="pt-button pt-icon-key-enter" type="submit">
              Submit
            </button>
          </div>
        </form>

        <DevNote>
          Maybe here we have a couple of options in the batch to configure this
          form.
        </DevNote>
      </div>
    );
  }
}
