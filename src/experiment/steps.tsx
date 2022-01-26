import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import { Step as _Step, StepPreview } from "../apiTypes";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

interface StepperInterface {
  steps: StepPreview[];
  step: _Step;
}

interface StepInterface extends StepPreview {
  // current: boolean
}

const StepperComponent = ({ steps, step }: StepperInterface) => {
  return step ? (
    <Stepper activeStep={step.stepIdx} alternativeLabel>
      {steps.map((s, idx) => (
        <Step key={"step-" + idx}>
          <StepLabel>{`${s.phase} ${s.phaseStep}`}</StepLabel>
        </Step>
      ))}
    </Stepper>
  ) : null;
};

export default StepperComponent;
