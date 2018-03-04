import { Route } from "react-router-dom";
import React from "react";

import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

class IdentifiedRouteInner extends React.Component {
  render() {
    const { path, component: Component, ...rest } = this.props;
    return <Route path={path} render={props => <Component {...rest} />} />;
  }
}

const playerIdKey = "d4900a09cf1f41a494d4fc32a626dfef";
const playerIdDep = new Tracker.Dependency();

export const getPlayerId = () => {
  playerIdDep.depend();
  return localStorage.getItem(playerIdKey);
};

export const setPlayerId = playerId => {
  if (!playerId) {
    // Avoid storing falsey value
    return;
  }
  const existing = localStorage.getItem(playerIdKey);
  if (existing === playerId) {
    return;
  }
  localStorage.setItem(playerIdKey, playerId);
  playerIdDep.changed();
};

export const removePlayerId = () => {
  localStorage.removeItem(playerIdKey);
  playerIdDep.changed();
};

export default withTracker(rest => {
  const playerId = getPlayerId();
  Meteor.subscribe("playerInfo", { playerId });

  return {
    ...rest,
    playerId,
    connected: Meteor.status().connected
  };
})(IdentifiedRouteInner);
