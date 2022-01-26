import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import Network from "./animated-network";
import ExplanationComponent from "./explanation";

import { Environment, Action, Explanation } from "../../apiTypes";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {},
}));

interface GameInterface {
  environment: Environment;
  explanations?: Explanation[];
  onStepFinish: (actions: Action[]) => void;
}

const Game = ({ environment, explanations, onStepFinish }: GameInterface) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            {environment ? (
              <Network
                environment={environment}
                onStepFinish={onStepFinish}
                disabled={false}
              />
            ) : null}
          </Paper>
        </Grid>
        <Grid container item xs={4} spacing={1}>
          {explanations
            ? explanations.map((explanation, idx) => (
                <Grid key={"solution-grid-" + idx} item xs={12}>
                  <ExplanationComponent {...explanation} />
                </Grid>
              ))
            : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default Game;
