import Consent from "./instructions/Consent.jsx";
import ExitSurvey from "./exit/ExitSurvey.jsx";
import InstructionStepOne from "./instructions/InstructionStepOne.jsx";
import InstructionStepTwo from "./instructions/InstructionStepTwo.jsx";
import Quiz from "./instructions/Quiz.jsx";
import Round from "./components/Round";
import Score from "./exit/Score.jsx";
import Sorry from "./exit/Sorry.jsx";
import Thanks from "./exit/Thanks.jsx";

// config contains the client side configuration for this game. It is used by
// netwise core to initialize and run the game.
export const config = {
  RoundComponent: Round,
  ConsentComponent: Consent,

  // Introduction pages to show before they play the game.
  // At this point they have been assigned a treatment. You can return
  // different instruction steps depending on the assigned treatment.
  InstructionSteps(treatment) {
    const steps = [InstructionStepOne];
    if (treatment.playerCount > 1) {
      steps.push(InstructionStepTwo);
    }
    steps.push(Quiz);
    return steps;
  },

  // End of Game pages. These may vary depending on player or game information.
  // For example we can show the score of the user, or we can show them a
  // different message if they actually could not participate the game (timed
  // out), etc.
  // The last step will be the last page shown to user and will be shown to the
  // user if they come back to the website.
  // If you don't return anything, or do not define this function, a default
  // exit screen will be shown.
  // Returned steps components must be unique (must all be different components)
  // and must all have a name (automatically infered by the class usually) or a
  // displayName (if could not be infered, must be set manually, see:
  // https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
  // for details).
  ExitSteps(game, player) {
    if (player.exitStatus) {
      return [Sorry, Thanks];
    }
    return [Score, ExitSurvey, Thanks];
  }
};
