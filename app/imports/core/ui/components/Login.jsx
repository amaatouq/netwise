import PropTypes from "prop-types";
import React from "react";

export default class Login extends React.Component {
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidMount() {
    const redirecting = this.redirectLoggedIn(this.props);
    if (redirecting) {
      return;
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      const field = document.querySelector("input");
      if (field) {
        field.focus();
      }
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectLoggedIn(nextProps);
  }

  redirectLoggedIn(props) {
    const { user, loggingIn } = props;
    const { router } = this.context;

    if (!loggingIn && user) {
      router.history.push(`/admin`);
      return true;
    }
  }

  handleForm = event => {
    event.preventDefault();
    const t = event.currentTarget;
    const username = t.querySelector("#username").value;
    const password = t.querySelector("#password").value;
    Meteor.loginWithPassword(username, password, err => {
      if (err) {
        alert(err);
      }
    });
  };

  render() {
    const { user, children, loggingIn } = this.props;

    if (loggingIn || user) {
      return null;
    }

    return (
      <div className="login">
        <form onSubmit={this.handleForm}>
          <h1>Log in</h1>
          <p>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
          </p>
          <p>
            <input type="submit" value="Log in" />
          </p>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  user: PropTypes.object, // Current meteor user
  loggingIn: PropTypes.bool, // Current meteor user logging in
  loading: PropTypes.bool // Subscription status
};

Login.contextTypes = {
  router: PropTypes.object
};
