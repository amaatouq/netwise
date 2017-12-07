// Client entry point, imports all client code

import "/imports/startup/both";
import "/imports/startup/client";

//todo: ask Nicolas why we are not importing main.html here? how come document.getEelementByID knows which file we are referring to?

import { render } from "react-dom";
import { renderRoutes } from "../imports/startup/client/routes";

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById("app"));
});
