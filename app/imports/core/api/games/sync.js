import moment from "moment";

import { Games } from "./games";
import { Stages } from "../stages/stages";
import { endOfStage } from "../stages/finish.js";

// TODO Improve this, it's super hacky
// At least dedup running this.
Meteor.startup(() => {
  setInterval(
    Meteor.bindEnvironment(() => {
      const query = {
        status: "running",
        estFinishedTime: { $gte: new Date() }
      };
      Games.find(query).forEach(game => {
        const stage = Stages.findOne(game.currentStageId);

        const now = moment();
        const startTimeAt = moment(stage.startTimeAt);
        const endTimeAt = startTimeAt.add(stage.durationInSeconds, "seconds");
        const ended = now.isSameOrAfter(endTimeAt);
        if (ended) {
          endOfStage(stage._id);
        }
      });
    }),
    1000
  );
});
