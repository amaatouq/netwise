import { Route, Router } from "react-router";
import { createBrowserHistory } from "history";
import React from "react";

import GameTemp from "../../ui/games/task/GameTemp";

const browserHistory = createBrowserHistory();
export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div className="grid">
      <header>
        <h1>Netwise</h1>
      </header>

      <main>
        {/* <Route path="/" component={Home} /> */}
        <Route path="/" component={GameTemp} />
      </main>

      <footer>footer</footer>
    </div>
  </Router>
);
