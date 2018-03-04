import React from "react";

import { config } from "../../../game/client";

export default class Instructions extends React.Component {
  state = { current: 0 };
  componentWillMount() {
    const { treatment, onDone } = this.props;
    const stepsFunc = config.InstructionSteps;
    if (!stepsFunc) {
      onDone();
      return;
    }

    const steps = stepsFunc(treatment.conditionsObject());

    this.setState({ steps });
  }

  onNext = () => {
    let { onDone } = this.props;
    let { steps, current } = this.state;
    current = current + 1;
    console.log(current, steps.length);
    if (current >= steps.length) {
      console.log("done!");
      onDone();
      return;
    }
    this.setState({ current });
  };

  onPrev = () => {
    this.setState({ current: this.state.current - 1 });
  };

  render() {
    const { steps, current } = this.state;
    const Step = steps[current];
    const hasNext = steps.length - 1 > current;
    const hasPrev = current > 0;
    return (
      <Step
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={this.onPrev}
        onNext={this.onNext}
      />
    );
  }
}
