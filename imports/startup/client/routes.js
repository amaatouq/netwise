import { Route, Router } from 'react-router';
import { createBrowserHistory } from 'history';
import React from 'react';

import Home from '../../ui/pages/Home';

const browserHistory = createBrowserHistory();
export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Home} />
  </Router>
);
