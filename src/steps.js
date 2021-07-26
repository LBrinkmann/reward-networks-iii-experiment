import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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

export default ({ activeStep }) => {
  return (
    <Stepper activeStep={activeStep}>
      <Step key="learn">
        <StepLabel>Tutorial</StepLabel>
      </Step>
      <Step key="watch">
        <StepLabel>Watch a previous player</StepLabel>
      </Step>
      <Step key="play">
        <StepLabel>Find the best solution</StepLabel>
      </Step>
      <Step key="questions">
        <StepLabel>Answer a few questions</StepLabel>
      </Step>
    </Stepper>
  );
};
