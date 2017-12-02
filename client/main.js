// Client entry point, imports all client code

import '/imports/startup/both';
import '/imports/startup/client';

import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('netwise-app'));
});
