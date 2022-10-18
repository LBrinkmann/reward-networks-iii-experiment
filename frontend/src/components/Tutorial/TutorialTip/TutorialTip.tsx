import {Divider, Typography, Tooltip, Button, Box} from "@mui/material";
import React, {FC, useEffect, useState} from "react";

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
    {
        id: "social_learning_selection_player",
        title: "Player selection",
        text: `Select a player to see the solution of this player`,
        tip: "Select a player",
    },
];

interface TutorialTipInterface {
    /** children of the tutorial component */
    children: any;
    /** index of the tutorial tip to show */
    tutorialId: string;
    isTutorial?: boolean;
    isShowTip?: boolean;
    /** placement of the tip
     * See more info here: https://mui.com/material-ui/api/tooltip/ */
    placement?: any;
    /** If true, adds an arrow to the tooltip
     * See more info here: https://mui.com/material-ui/api/tooltip/ */
    arrow?: boolean;
    /** Callback to update parent tutorial index */
    onTutorialClose?: () => void;
}

const TutorialTip: FC<TutorialTipInterface> = (props) => {
    const {children, isTutorial = false, isShowTip=true, placement = 'bottom', arrow = true} = props;

    const [open, setOpen] = useState(isTutorial);

    useEffect(() => {
        setOpen(isTutorial);
    }, [isTutorial]);

    // const {title, text, tip} = tutorialTip[0];
    const {title, text, tip} = tutorialTip.filter((tip) => tip.id === props.tutorialId)[0];

    const onClose = () => {
        setOpen(false);
        props.onTutorialClose();
    }

    const setTitleAndContent = (name: string, content: string) => (
        <Box sx={{textAlign: "center"}}>
            <Typography color="inherit" variant="h6" sx={{m: 1}}>
                {name}
            </Typography>
            <Divider/>
            <Typography color="inherit" sx={{m: 1}}>
                {content}
            </Typography>
            <Divider/>
            <Button sx={{m: 1}} variant="contained" color="secondary" onClick={onClose}>
                Ok
            </Button>
        </Box>
    )

    const renderTip = () => {
        if (!(text && title && tip)) return children;
        if (isTutorial) {
            return (
                <Tooltip
                    title={setTitleAndContent(title, text)}
                    placement={placement}
                    arrow={arrow}
                    open={open}
                >
                    {children}
                </Tooltip>
            );
        } else if (isShowTip) {
            return (
                <Tooltip title={tip} placement={placement} arrow={arrow}>
                    {children}
                </Tooltip>
            );
        } else {
            return children;
        }
    }

    return renderTip();
};

export default TutorialTip;
