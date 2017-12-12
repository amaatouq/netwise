import { Route, Router } from "react-router";
import { createBrowserHistory } from "history";
import React from "react";

import Round from "../../ui/pages/Round";

const browserHistory = createBrowserHistory();
export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div className="grid">
      <header>
        <h1>Netwise</h1>
      </header>

      <main>
        {/* <Route path="/" component={Home} /> */}
        <Route path="/" component={Round} />
      </main>

      <footer>footer</footer>
    </div>
  </Router>
);
