import PropTypes from "prop-types";
import React from "react";

import { Random } from "meteor/random";

import { stages } from "./game";
import Round from "./Round";

export default class GameTemp extends React.Component {
  render() {
    return (
      <div className="game game-temp">
        <Round
          stage={Random.choice(stages)}
          round={_.random(0, 9)}
          score={_.random(0, 123)}
          currentPlayer={{ id: Random.id() }}
        />
      </div>
    );
  }
}

GameTemp.propTypes = {
  // This is not how we're doing it yet. For now, we just do thing statically,
  // but later the Round gets built dynamically by Netwise and is passed into
  // the root game Component (GameTemp here) for the oppertunity to set
  // overall game UI (progress, CSS namespacing, etc.)
  round: PropTypes.element
};
