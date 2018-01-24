import { withTracker } from "meteor/react-meteor-data";

import Public from "../components/Public";

const BatchAvailable = new Mongo.Collection("batchAvailable");

export default withTracker(props => {
  const loading = !Meteor.subscribe("public").ready();

  const ba = BatchAvailable.findOne("batchAvailable");
  return {
    batchAvailable: Boolean(ba) && ba.batchAvailable,
    loading
  };
})(Public);
