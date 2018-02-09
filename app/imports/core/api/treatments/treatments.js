import SimpleSchema from "simpl-schema";

import { TimestampSchema } from "../default-schemas";

export const Treatments = new Mongo.Collection("treatments");

// requiredConditions hold a list of conditions keys that are required by
// netwise core to be able to run a game.
// Required conditions are:
// -`playerCount` determines how many players participate in a game and is
//   therefore critical to run a game.
// NOTE(np) I am still not sure this is the right way to decide how many players
// should be in a game. The other potential required condition is botsCount.
// Both of these are fundamental to any game. The information about the number
// of players, whether it's human or computer players, determines many aspects
// of the game. The fact they will influence the game run similarly to other
// conditions and are decided while deciding of a batch does not mean they
// cannot be seperatly configured. I think there might be more flexibility and
// clarity if we move these 2 conditions into the UI as configuration values for
// game runs, independently of the treatment. More thought needed here.
const requiredConditions = ["playerCount"];

Treatments.helpers({
  displayName() {
    return this.name || _.pluck(this.conditions, "name").join(" - ");
  },

  condition(key) {
    return this.conditions.find(c => c.key === key);
  },

  conditionsObject() {
    const obj = {};
    _.each(this.conditions, cond => {
      obj[cond.key] = cond.value;
    });
    return obj;
  }
});

Treatments.schema = new SimpleSchema({
  // Optional experimenter given name for the treatment
  name: {
    type: String,
    max: 256,
    optional: true
  },

  // Array of conditions
  conditions: {
    type: Array,
    min: requiredConditions.length,

    // Custom validation verifies required conditions are present and that
    // there are no duplicate conditions with the same key. We cannot easily
    // verify one of each conditions is present.
    custom() {
      const errors = [];

      const conditions = this.value;
      // Ignore null/empty, caught by min: 1
      if (!conditions || conditions.length === 0) {
        return;
      }

      // Verifying required conditions are present
      for (let i = 0; i < requiredConditions.length; i++) {
        const key = requiredConditions[i];
        const found = conditions.find(cond => cond.key === key);
        if (!found) {
          errors.push({
            name: this.genericKey,
            type: SimpleSchema.ErrorTypes.REQUIRED,
            value: key
          });
        }
      }

      // Verifying all keys are unique
      const keys = {};
      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i];
        if (keys[cond.key]) {
          errors.push({
            name: this.genericKey,
            type: "notUnique",
            value: cond.key
          });
        } else {
          keys[cond.key] = true;
        }
      }

      if (errors.length > 0) {
        this.addValidationErrors(errors);
        return false;
      }
    }
  },

  "conditions.$": {
    type: Object
  },

  // The key of the condition is the condition type.
  // e.g. altersCount, rewiring...
  "conditions.$.key": {
    type: String,
    max: 64,
    // no spaces, chars only
    regEx: /^[a-zA-Z_\-]+$/
  },

  // The selected name for condition.
  // e.g. could be hight, medium or low.
  // The name is only here as an easier human readable value of the condition.
  "conditions.$.name": {
    type: String,
    max: 64,
    // no spaces, chars only
    regEx: /^[a-zA-Z_\-]+$/
  },

  // The actual value of the condition.
  // e.g For an altersCount condition could 0, 4 or 6. For an rewiring condition
  // could be true or false. The value is not relevant to Netwise (except for
  // the required conditions) and can be whatever the String, Number or Boolean
  // value.
  "conditions.$.value": {
    // Not sure there are other types that might be valid, these seem
    // like enough for now.
    type: SimpleSchema.oneOf(String, Number, Boolean)
  }
});

Treatments.schema.addDocValidator(({ conditions }) => {
  if (Boolean(Treatments.findOne({ conditions }))) {
    return [
      {
        name: "conditions",
        type: "notUnique"
      }
    ];
  }
  return [];
});
Treatments.schema.extend(TimestampSchema);
Treatments.attachSchema(Treatments.schema);
