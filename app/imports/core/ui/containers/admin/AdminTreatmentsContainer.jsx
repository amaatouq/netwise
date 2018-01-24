import { withTracker } from "meteor/react-meteor-data";

import { Treatments } from "../../../api/treatments/treatments";
import AdminTreatments from "../../components/admin/AdminTreatments";

export const Conditions = new Mongo.Collection("conditions");

export default withTracker(props => {
  const treatmentsLoading = !Meteor.subscribe("admin-treatments").ready();
  const conditionsLoading = !Meteor.subscribe("admin-conditions").ready();

  return {
    loading: treatmentsLoading || conditionsLoading,
    treatments: Treatments.find().fetch(),
    conditions: Conditions.find().fetch()
  };
})(AdminTreatments);
