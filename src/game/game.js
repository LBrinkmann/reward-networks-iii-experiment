import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import Solution from "./solution";
import Network from "./animated-network";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const solutionInfo = [
  {
    label: "First solution of previous player",
    previous: true,
  },
  {
    label: "Second solution of previous player",
    previous: true,
  },
  {
    label: "You first solution",
  },
  {
    label: "You second solution",
  },
  {
    label: "You third solution",
  },
  {
    label: "You fourth solution",
    transmitted: true,
  },
  {
    label: "You fifth solution",
    transmitted: true,
  },
];

export default ({ solutions, environment, onRoundFinish }) => {
  const classes = useStyles();
  console.log(solutions);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper className={classes.paper}>
            {environment ? (
              <Network
                environment={environment}
                onRoundFinish={onRoundFinish}
              />
            ) : null}
          </Paper>
        </Grid>
        <Grid container item xs={4} spacing={1}>
          {solutionInfo.map((si, idx) => (
            <Grid key={"solution-grid-" + idx} item xs={12}>
              <Solution
                {...{ ...si }}
                actions={solutions ? solutions[idx] : null}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};
