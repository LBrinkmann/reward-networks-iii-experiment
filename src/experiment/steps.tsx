import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Divider,
  Stack,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { Step as StepType, StepPreview } from "../apiTypes";
import _ from "lodash";
import { color } from "@mui/system";

interface StepInterface extends StepPreview {
  // current: boolean
}

interface PhaseInterface {
  steps: StepPreview[];
  phase: string;
  activeStep: StepType;
}

const PhaseComponent = ({ phase, steps, activeStep }: PhaseInterface) => {
  const activeIdx = _.findIndex(steps, (s) => s.stepId == activeStep.stepId);
  return (
    <Box>
      <Box>
        <Stepper activeStep={activeIdx} alternativeLabel>
          {steps.map((s, idx) => (
            <Step key={"step-" + idx}>
              <StepLabel></StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box sx={{ textAlign: "center", m: 1 }}>
        <Typography sx={{ color: "text.secondary" }}>{phase}</Typography>
      </Box>
    </Box>
  );
};

interface StepsInterface {
  steps: StepPreview[];
  step: StepType;
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StepsComponent = ({ steps, step }: StepsInterface) => {
  const phases = _.groupBy(steps, (s) => s.phase);
  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-around"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        {_.map(phases, (steps, phase) => (
          <PhaseComponent
            key={"phase-" + phase}
            phase={phase}
            steps={steps}
            activeStep={step}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default StepsComponent;
