import { Treatments } from "../treatments";
import { config } from "../../../../game/server";

Meteor.publish("admin-treatments", function() {
  if (!this.userId) {
    return null;
  }

  return [Treatments.find()];
});
