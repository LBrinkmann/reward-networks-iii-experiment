import React from "react";
import { makeStyles } from "@mui/material/styles";
// import Card from "@material-ui/core/Card";

import { Card, CardContent, Typography, Skeleton } from "@mui/material";

// import CardContent from "@material-ui/core/CardContent";
// import Typography from "@material-ui/core/Typography";
// import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
  },
  cardPrevious: {
    backgroundColor: theme.palette.secondary.shaded,
  },
  cardTransmitted: {
    backgroundColor: theme.palette.primary.shaded,
  },
  content: {
    padding: "12px",
    paddingBottom: "8px",
    "&:last-child": { paddingBottom: "12px" },
  },

  title: {
    fontSize: 14,
  },
  info: {
    fontSize: 12,
  },
  solution: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

const ActionsSequence = ({ actions }) => (
  <Typography>{actions.map(({ sourceId }) => sourceId)}</Typography>
);

export default ({ actions, label, previous, transmitted }) => {
  const classes = useStyles();

  return (
    <Card
      className={`${classes.card} ${previous ? classes.cardPrevious : ""} ${
        transmitted ? classes.cardTransmitted : ""
      }`}
    >
      <CardContent className={classes.content}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {label}
        </Typography>
        <div className={classes.solution}>
          {actions ? (
            <ActionsSequence actions={actions} />
          ) : (
            <Skeleton width={350} height={40} />
          )}
        </div>
        {transmitted ? (
          <Typography
            className={classes.info}
            color="textSecondary"
            gutterBottom
          >
            This solution will be transmitted to the next player. You will gain
            3x the points.
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
};
