import { withTracker } from "meteor/react-meteor-data";

import { removePlayerId } from "./IdentifiedRoute";
import Public from "../components/Public";

const BatchAvailable = new Mongo.Collection("batchAvailable");

export default withTracker(({ playerId, ...rest }) => {
  const sub = Meteor.subscribe("public", { playerId });
  const loading = !sub.ready();

  const ba = BatchAvailable.findOne("batchAvailable");
  return {
    batchAvailable: Boolean(ba) && ba.batchAvailable,
    loading,
    playerId,
    ...rest
  };
})(Public);
