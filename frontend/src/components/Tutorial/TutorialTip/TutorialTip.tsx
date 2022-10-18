import {Divider, Typography, Tooltip, Button, Box} from "@mui/material";
import React from "react";

const tutorialTip = [
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
    /** children of the tutorial component */
    children: any;
    /** index of the tutorial tip to render */
    idx: number;
    /** index of the tutorial tip to show */
    tutorialIdx: number;
    /** placement of the tip
     * See more info here: https://mui.com/material-ui/api/tooltip/ */
    placement?: any;
    /** If true, adds an arrow to the tooltip
     * See more info here: https://mui.com/material-ui/api/tooltip/ */
    arrow?: boolean;
    /** Callback to update parent tutorial index */
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
    const isTutorial = tutorialIdx === idx;

    const onClose = () => {
        if (tutorialTip.length > idx + 1) {
            onTutorialClose(idx + 1);
        } else {
            onTutorialClose(null);
        }
    };

    const {title, text, tip} = tutorialTip[idx];

    return (
        <Tooltip
            placement={placement}
            arrow={arrow}
            disableHoverListener={isTutorial}
            open={isTutorial}
            title={
                isTutorial ? (
                    <Box sx={{textAlign: "center"}}>
                        <Typography color="inherit" variant="h6" sx={{m: 1}}>
                            {title}
                        </Typography>
                        <Divider/>
                        <Typography color="inherit" sx={{m: 1}}>
                            {text}
                        </Typography>
                        <Divider/>
                        <Button
                            sx={{m: 1}}
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
