import SimpleSchema from "simpl-schema";

export const TimestampSchema = new SimpleSchema({
  createdAt: {
    type: Date,
    label: "Created at",
    denyUpdate: true,
    autoValue() {
      return this.isInsert ? new Date() : undefined;
    }
  },
  updatedAt: {
    type: Date,
    label: "Last updated at",
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    }
  }
});
