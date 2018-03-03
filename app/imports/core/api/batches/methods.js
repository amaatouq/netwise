import { Batches } from "./batches";
import { IdSchema } from "../default-schemas";

export const createBatch = new ValidatedMethod({
  name: "Batches.methods.create",

  validate: Batches.schema
    .omit("status", "createdAt", "updatedAt", "debugMode")
    .validator(),

  run(batch) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    Batches.insert(batch);
  }
});

export const duplicateBatch = new ValidatedMethod({
  name: "Batches.methods.duplicate",

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);
    batch.duplicate();
  }
});

export const updateBatchStatus = new ValidatedMethod({
  name: "Batches.methods.updateStatus",

  validate: Batches.schema
    .pick("status")
    .extend(IdSchema)
    .validator(),

  run({ _id, status }) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);
    if (!batch) {
      throw new Error("not found");
    }

    if (status === "init") {
      throw new Error("invalid");
    }

    Batches.update(_id, { $set: { status } });
  }
});
