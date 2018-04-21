import { SyncedCron } from "meteor/percolate:synced-cron";
import moment from "moment";

import { Games } from "../games.js";
import { Stages } from "../../stages/stages.js";
import { endOfStage } from "../../stages/finish.js";
import Fiber from "fibers";

SyncedCron.add({
  name: "Check end of stage timer",
  schedule: function(parser) {
    // Run about once a second
    return parser.text("every 1 second");
  },
  job: function() {
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
  }
});
