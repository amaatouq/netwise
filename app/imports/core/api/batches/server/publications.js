import { Batches } from "../batches";

Meteor.publish("admin-batches", function() {
  if (!this.userId) {
    return null;
  }

  return [Batches.find()];
});

Meteor.publish("public", function() {
  const cursor = Batches.find({ status: "running" });
  const ba = () => cursor.count() > 0;
  let initializing = true;
  let batchAvailable = ba();

  const handle = cursor.observeChanges({
    added: id => {
      if (!initializing) {
        const baNew = ba();
        if (baNew !== batchAvailable) {
          batchAvailable = baNew;
          this.changed("batchAvailable", "batchAvailable", { batchAvailable });
        }
      }
    },

    removed: id => {
      if (!initializing) {
        const baNew = ba();
        if (baNew !== batchAvailable) {
          batchAvailable = baNew;
          this.changed("batchAvailable", "batchAvailable", { batchAvailable });
        }
      }
    },

    changed: () => {
      if (!initializing) {
        const baNew = ba();
        if (baNew !== batchAvailable) {
          batchAvailable = baNew;
          this.changed("batchAvailable", "batchAvailable", { batchAvailable });
        }
      }
    }
  });

  initializing = false;
  this.added("batchAvailable", "batchAvailable", { batchAvailable });
  this.ready();
});
