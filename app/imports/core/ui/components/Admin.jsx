import { NavLink, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

import AdminBatchesContainer from "../containers/admin/AdminBatchesContainer";
import AdminConditionsContainer from "../containers/admin/AdminConditionsContainer.jsx";
import AdminGames from "./admin/AdminGames.jsx";
import AdminPlayers from "./admin/AdminPlayers.jsx";
import AdminTreatmentsContainer from "../containers/admin/AdminTreatmentsContainer";

export default class Admin extends React.Component {
  componentDidMount() {
    this.redirectLoggedOut(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectLoggedOut(nextProps);
  }

  handleLogout = () => {
    Meteor.logout();
  };

  handleReset = () => {
    const confirmed = confirm(
      "You are about to delete all data in the DB, are you sure you want to do that?"
    );
    if (!confirmed) {
      return;
    }
    const confirmed2 = confirm("Are you really sure?");
    if (!confirmed2) {
      return;
    }
    if (Meteor.isProduction) {
      return;
    }
    Meteor.call("adminResetDB");
  };

  redirectLoggedOut(props) {
    const { user, loggingIn } = props;
    const { router } = this.context;

    if (!loggingIn && !user) {
      router.history.push(`/login`);
    }
  }

  render() {
    const { user, loggingIn, match } = this.props;

    if (loggingIn || !user) {
      return null;
    }

    return (
      <div className="admin">
        <nav className="pt-navbar header">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">Netwise Admin</div>
            <NavLink
              exact
              to="/admin"
              activeClassName="pt-active"
              className="pt-button pt-minimal"
            >
              Batches
            </NavLink>
            <NavLink
              exact
              to="/admin/games"
              activeClassName="pt-active"
              className="pt-button pt-minimal"
            >
              Games
            </NavLink>
            <NavLink
              exact
              to="/admin/players"
              activeClassName="pt-active"
              className="pt-button pt-minimal"
            >
              Players
            </NavLink>
            <NavLink
              exact
              to="/admin/treatments"
              activeClassName="pt-active"
              className="pt-button pt-minimal"
            >
              Treatments
            </NavLink>
            <NavLink
              exact
              to="/admin/conditions"
              activeClassName="pt-active"
              className="pt-button pt-minimal"
            >
              Conditions
            </NavLink>
          </div>

          <div className="pt-navbar-group pt-align-right">
            <button
              className="pt-button pt-minimal pt-icon-log-out"
              onClick={this.handleLogout}
            >
              Logout
            </button>
          </div>

          {Meteor.isDevelopment ? (
            <div className="pt-navbar-group pt-align-right">
              <button
                className="pt-button pt-minimal pt-icon-repeat"
                onClick={this.handleReset}
              >
                Reset app
              </button>
              <span className="pt-navbar-divider" />
            </div>
          ) : (
            ""
          )}
        </nav>

        <main>
          <Switch>
            <Route path="/admin" exact component={AdminBatchesContainer} />
            <Route path="/admin/games" component={AdminGames} />
            <Route path="/admin/players" component={AdminPlayers} />
            <Route
              path="/admin/treatments"
              component={AdminTreatmentsContainer}
            />
            <Route
              path="/admin/conditions"
              component={AdminConditionsContainer}
            />
          </Switch>
        </main>
      </div>
    );
  }
}

Admin.propTypes = {
  user: PropTypes.object, // Current meteor user
  loggingIn: PropTypes.bool, // Current meteor user logging in
  loading: PropTypes.bool // Subscription status
};

Admin.contextTypes = {
  router: PropTypes.object
};
