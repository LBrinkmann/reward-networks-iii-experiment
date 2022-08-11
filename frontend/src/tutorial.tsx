import * as React from "react";
import { Divider, Typography, Tooltip, Button, Box } from "@mui/material";

const tutorial = [
  {
    id: "headerTitle",
    title: "Welcome",
    text: "Welcome to the experiment of the MPIB.",
    tip: "Name of the experiment",
  },
  {
    id: "experimentPoints",
    title: "Point system",
    text: `You can earn points in this experiment. 
 The total number of points you have been
    earned so far will be shown here.`,
    tip: "Your total number of points accross the full experiment.",
  },
  {
    id: "task",
    title: "Task",
    text: `The task is to find a sequence of 8 moves, that is 
    maximising the cumulative reward as indicated on top of the arrows.
    You will be helped by an algorithm. The move recommended by the algorithm 
    is going to be visulized by a animated dashed line.`,
    tip: "Maximise the cumulative reward",
  },
  {
    id: "explanation",
    title: "Explanation",
    text: `In later stages of the experiment you will get here an explanation
    from the algorithm.`,
    tip: "Explanation",
  },
];

interface TutorialTipProps {
  children: any;
  idx: number;
  tutorialIdx: number;
  placement?: any;
  arrow?: boolean;
  onTutorialClose: (tutorialIdx: number) => void;
}

const TutorialTip = ({
  children,
  tutorialIdx,
  idx,
  placement,
  arrow = true,
  onTutorialClose,
}: TutorialTipProps) => {
  const isTutorial = tutorialIdx == idx;

  const onClose = () => {
    if (tutorial.length > idx + 1) {
      onTutorialClose(idx + 1);
    } else {
      onTutorialClose(null);
    }
  };

  const { title, text, tip } = tutorial[idx];

  return (
    <Tooltip
      placement={placement}
      arrow={arrow}
      disableHoverListener={isTutorial}
      open={isTutorial ? true : false}
      title={
        isTutorial ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography color="inherit" variant="h6" sx={{ m: 1 }}>
              {title}
            </Typography>
            <Divider />
            <Typography color="inherit" sx={{ m: 1 }}>
              {text}
            </Typography>
            <Divider />
            <Button
              sx={{ m: 1 }}
              variant="contained"
              color="secondary"
              onClick={onClose}
            >
              Ok
            </Button>
          </Box>
        ) : (
          tip
        )
      }
    >
      {children}
    </Tooltip>
  );
};

export default TutorialTip;
