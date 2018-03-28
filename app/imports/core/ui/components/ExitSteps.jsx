import React from "react";

import { config } from "../../../game/client";

export default class ExitSteps extends React.Component {
  constructor(props) {
    super(props);
    const { game, player } = props;
    const stepsFunc = config.ExitSteps;

    const done = player.exitStepsDone || [];

    const steps = stepsFunc(game, player).filter(
      s => !done.includes(s.displayName || s.name)
    );

    this.state = { current: 0, steps };
  }

  onSubmit = data => {
    let { onSubmit } = this.props;
    let { steps, current } = this.state;
    const Step = steps[current];
    onSubmit(Step.name || Step.displayName, data);
    current = current + 1;
    this.setState({ current });
  };

  render() {
    const { steps, current } = this.state;
    const Step = steps[current];

    return <Step {...this.props} onSubmit={this.onSubmit} />;
  }
}
