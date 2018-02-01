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
      <div className="player-id">
        <form onSubmit={this.handleForm}>
          <h1>Identification</h1>
          <DevNote>
            Maybe here we have a couple of options in the batch to configure
            this form.
          </DevNote>
          <p>
            <label htmlFor="id">
              Please enter your player identification (email, provided ID, etc.)
            </label>
            <input
              type="text"
              name="id"
              id="id"
              value={id}
              onChange={this.handleIdUpdate}
              required
            />
          </p>
          <p>
            <input type="submit" value="Submit" />
          </p>
        </form>
      </div>
    );
  }
}
