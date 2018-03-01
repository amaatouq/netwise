// This should contain admin top level type operations like resetting the DB
// or performing other grand operations. Use with extreme caution.

import { bootstrap } from "../../startup/server/bootstrap.js";

const keep = ["meteor_accounts_loginServiceConfiguration", "users"];

if (Meteor.isDevelopment) {
  Meteor.methods({
    adminResetDB() {
      if (!this.userId) {
        throw new Error("unauthorized");
      }

      if (Meteor.isClient) {
        return;
      }

      const driver = MongoInternals.defaultRemoteCollectionDriver();
      const db = driver.mongo.db;

      db.listCollections().toArray(
        Meteor.bindEnvironment((err, colls) => {
          if (err) {
            console.error(err);
            return;
          }
          colls.forEach(collection => {
            if (!keep.includes(collection.name)) {
              const coll = driver.open(collection.name);
              coll.rawCollection().drop();
            }
          });

          db.listCollections().toArray(
            Meteor.bindEnvironment((err, colls) => {
              if (err) {
                console.error(err);
                return;
              }
              colls.forEach(collection => {
                if (!keep.includes(collection.name)) {
                  console.error("collection still present: " + collection.name);
                }
              });

              console.info("Cleared DB");
              bootstrap();
              console.info("Bootstrapped");
            })
          );
        })
      );
    }
  });
}

Meteor.startup(() => {});
