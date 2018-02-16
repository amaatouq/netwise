import { NavLink, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

import AdminBatchesContainer from "../containers/admin/AdminBatchesContainer";
import AdminTreatmentsContainer from "../containers/admin/AdminTreatmentsContainer";

export default class Admin extends React.Component {
  componentDidMount() {
    this.redirectLoggedOut(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectLoggedOut(nextProps);
  }

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
          </div>
          <div className="pt-navbar-group pt-align-right">
            <button className="pt-button pt-minimal pt-icon-log-out">
              Logout
            </button>
          </div>
        </nav>

        <main>
          <Switch>
            <Route path="/admin" exact component={AdminBatchesContainer} />
            <Route path="/admin/games" render={() => "Not implemented"} />
            <Route path="/admin/players" render={() => "Not implemented"} />
            <Route
              path="/admin/treatments"
              component={AdminTreatmentsContainer}
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
