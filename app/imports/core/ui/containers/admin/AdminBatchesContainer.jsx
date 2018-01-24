import { withTracker } from "meteor/react-meteor-data";

import { Batches } from "../../../api/batches/batches";
import { Conditions } from "./AdminTreatmentsContainer";
import { Treatments } from "../../../api/treatments/treatments";
import AdminBatches from "../../components/admin/AdminBatches";

export default withTracker(props => {
  const batchesLoading = !Meteor.subscribe("admin-batches").ready();
  const treatmentsLoading = !Meteor.subscribe("admin-treatments").ready();
  const conditionsLoading = !Meteor.subscribe("admin-conditions").ready();

  return {
    loading: batchesLoading || treatmentsLoading || conditionsLoading,
    batches: Batches.find().fetch(),
    treatments: Treatments.find().fetch(),
    conditions: Conditions.find().fetch()
  };
})(AdminBatches);
