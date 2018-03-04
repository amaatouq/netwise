import Consent from "./intro/Consent.jsx";
import InstructionStepOne from "./intro/InstructionStepOne.jsx";
import InstructionStepTwo from "./intro/InstructionStepTwo.jsx";
import Round from "./components/Round";
import Quiz from "./intro/Quiz";

// config contains the client side configuration for this game. It is used by
// netwise core to initialize and run the game.
export const config = {
  RoundComponent: Round,
  ConsentComponent: Consent,
  InstructionSteps(treatment) {
    const steps = [InstructionStepOne];
    if (treatment.playerCount > 1) {
      steps.push(InstructionStepTwo);
    }
    steps.push(Quiz);
    return steps;
  }
};
