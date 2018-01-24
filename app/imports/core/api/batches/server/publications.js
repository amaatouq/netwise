import { Batches } from "../batches";

Meteor.publish("admin-batches", function() {
  if (!this.userId) {
    return null;
  }

  return [Batches.find()];
});

Meteor.publish("public", function() {
  const batchAvailable = Boolean(Batches.findOne());
  this.added("batchAvailable", "batchAvailable", { batchAvailable });
  this.ready();
});
