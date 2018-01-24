import { Treatments } from "../treatments";
import { config } from "../../../../game/server";

Meteor.publish("admin-treatments", function() {
  if (!this.userId) {
    return null;
  }

  return [Treatments.find()];
});

Meteor.publish("admin-conditions", function() {
  if (!this.userId) {
    return null;
  }

  _.each(config.conditions, (conditions, key) => {
    _.each(conditions, (value, name) => {
      this.added("conditions", `${key}-${name}`, { key, name, value });
    });
  });

  this.ready();
});
