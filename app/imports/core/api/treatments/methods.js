import SimpleSchema from "simpl-schema";
import { Treatments } from "./treatments";

export const createTreatment = new ValidatedMethod({
  name: "Treatments.methods.create",

  validate: Treatments.schema
    // .omit("createdAt", "updatedAt")
    .omit("conditionIds", "createdAt", "updatedAt")
    // NOTE(np): Overriding the conditionIds schema as I can't ge the
    // conditionIds custom validation work as part of the method validation,
    // falling back on it happening on the insert, which is the same, not sure
    // why it's having a fit.
    .extend(
      new SimpleSchema({
        conditionIds: {
          type: Array,
          label: "Conditions"
        },
        "conditionIds.$": {
          type: String
        }
      })
    )
    .validator(),

  run(treatment) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    Treatments.insert(treatment);
  }
});
