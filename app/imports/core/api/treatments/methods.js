import { Treatments } from "./treatments";

export const createTreatment = new ValidatedMethod({
  name: "Treatments.methods.create",

  validate: Treatments.schema.omit("createdAt", "updatedAt").validator(),

  run(treatment) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    console.log(treatment);

    Treatments.insert(treatment);
  }
});
